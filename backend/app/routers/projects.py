"""
Endpoints de proposições: proxy enriquecido da API da Câmara dos Deputados.
Estratégia:
  - Home (sem filtros): banco local primeiro; se < 20, complementa com API da Câmara
    e persiste os novos registros para enriquecer o banco progressivamente.
  - Busca/filtro (q, tipo, ano, ods): sempre vai à API da Câmara (dados completos),
    mesclando com o banco local para aproveitar headlines/resumos já salvos.
"""

import asyncio
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.project import Project
from app.repositories.proposicao_repository import ProposicaoRepository
from app.repositories.tag_repository import TagRepository
from app.repositories.tema_repository import TemaRepository
from app.services import camara_client as camara
from app.services import ods_classifier
from app.services.proposicao_service import ProposicaoService
from app.services.resumo_service import explicar_termo, gerar_resumo

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projetos", tags=["Projetos"])

ESTAGIO_MAP = {
    "Mesa": 1, "Apresentação": 1, "Distribuição": 1, "Recebimento": 1,
    "Comissão": 2, "Relator": 2, "Análise": 2, "Parecer": 2, "Instrução": 2, "Audiência": 2,
    "Plenário": 3, "Votação": 3, "Ordem do Dia": 3,
    "Promulgada": 4, "Sancionada": 4, "Arquivada": 4, "Retirada": 4, "Vetada": 4, "Encerrada": 4,
}

ESTAGIOS = [
    {"id": 1, "nome": "Apresentada"},
    {"id": 2, "nome": "Em Comissão"},
    {"id": 3, "nome": "Votação"},
    {"id": 4, "nome": "Concluída"},
]

# Mínimo de projetos na home antes de buscar da API da Câmara
_HOME_MIN = 20

# Máximo de itens que a API da Câmara aceita por página
_CAMARA_MAX_ITENS = 100

# Cap para busca por ODS (filtro feito localmente)
_ODS_BUSCA_CAP = 200


def _inferir_estagio(descricao: str) -> int:
    desc = (descricao or "").strip()
    for palavra, estagio in ESTAGIO_MAP.items():
        if palavra.lower() in desc.lower():
            return estagio
    return 1


def _projeto_para_item(p: Project) -> dict:
    """Converte um model Project do banco em dict de resposta."""
    temas = [t.nome for t in p.temas] if hasattr(p, "temas") else []
    ods_list = ods_classifier.classificar(p.ementa or "", temas)
    return {
        "id":                p.external_id,
        "external_id":       p.external_id,
        "titulo":            p.titulo,
        "ementa":            p.ementa,
        "headline":          p.headline,
        "situacao":          p.situacao,
        "autor":             p.autor,
        "ano":               p.ano,
        "tipo":              p.tipo,
        "data_apresentacao": str(p.data_apresentacao) if p.data_apresentacao else None,
        "urlInteiroTeor":    p.url_texto_oficial,
        "temas":             temas,
        "ods":               ods_list,
        "estagio_atual":     _inferir_estagio(p.situacao or ""),
        "estagios":          ESTAGIOS,
    }


def _camara_para_item(p: dict, temas: list) -> dict:
    """Converte um item bruto da API da Câmara em dict de resposta."""
    _status  = p.get("statusProposicao") or {}
    _autores = p.get("autores") or []
    _sigla   = p.get("siglaTipo", "")
    _numero  = p.get("numero", "")
    _ano     = p.get("ano", "")
    ods_list = ods_classifier.classificar(p.get("ementa", ""), temas)
    return {
        "id":                p.get("id"),
        "external_id":       str(p.get("id", "")),
        "ementa":            p.get("ementa"),
        "headline":          None,
        "urlInteiroTeor":    p.get("urlInteiroTeor"),
        "titulo":            f"{_sigla} {_numero} / {_ano}".strip(),
        "situacao":          _status.get("descricaoSituacao", ""),
        "autor":             ", ".join(a["nome"] for a in _autores if a.get("nome")) or "Não informado",
        "tipo":              _sigla,
        "ano":               _ano,
        "data_apresentacao": p.get("dataApresentacao"),
        "ods":               ods_list,
        "temas":             temas,
        "estagio_atual":     _inferir_estagio(_status.get("descricaoSituacao", "")),
        "estagios":          ESTAGIOS,
    }


async def _buscar_temas_camara(prop_id: int) -> tuple:
    try:
        temas_raw = await camara.obter_temas(prop_id)
        temas = [t.get("tema", "") for t in temas_raw.get("dados", [])]
        return prop_id, temas
    except Exception as e:
        logger.warning(f"Erro ao buscar temas da proposição {prop_id}: {e}")
        return prop_id, []


def _persistir_do_camara(db: Session, proposicoes: list, temas_por_id: dict) -> None:
    """Salva no banco local os projetos vindos da Câmara que ainda não existem."""
    for p in proposicoes:
        ext_id = str(p.get("id", ""))
        if not ext_id or ProposicaoRepository.existe(db, ext_id):
            continue
        _status  = p.get("statusProposicao") or {}
        _autores = p.get("autores") or []
        _sigla   = p.get("siglaTipo", "")
        _numero  = p.get("numero", "")
        _ano_val = p.get("ano")
        try:
            novo = Project(
                external_id=ext_id,
                titulo=f"{_sigla} {_numero} / {_ano_val}".strip(),
                ementa=p.get("ementa"),
                situacao=_status.get("descricaoSituacao", ""),
                autor=", ".join(a["nome"] for a in _autores if a.get("nome")) or "Não informado",
                ano=int(_ano_val) if _ano_val else None,
                tipo=_sigla,
                url_texto_oficial=p.get("urlInteiroTeor"),
            )
            db.add(novo)
        except Exception as e:
            logger.warning(f"Erro ao persistir projeto {ext_id}: {e}")
    try:
        db.commit()
    except Exception as e:
        logger.warning(f"Erro ao commitar projetos da Câmara: {e}")
        db.rollback()


# ─── ESTATÍSTICAS ─────────────────────────────────────────────────────────────

@router.get("/estatisticas")
def get_estatisticas(db: Session = Depends(get_db)):
    total = db.query(Project).count()
    por_situacao = (
        db.query(Project.situacao, func.count(Project.id))
        .group_by(Project.situacao)
        .all()
    )
    return {
        "total": total,
        "por_situacao": {
            situacao: contagem
            for situacao, contagem in por_situacao
            if situacao is not None
        },
    }


# ─── LISTAGEM ─────────────────────────────────────────────────────────────────

@router.get("/")
async def listar_projetos(
    q: Optional[str] = Query(None, description="Busca por palavra-chave"),
    tipo: Optional[str] = Query(None, description="Tipo: PL, PEC, MPV..."),
    ano: Optional[int] = Query(None, description="Ano do projeto"),
    ods: Optional[int] = Query(None, description="Filtrar por ODS (1-17)"),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    tem_filtro = bool(q or tipo or ano or ods)

    # ──────────────────────────────────────────────────────────────────────────
    # MODO BUSCA/FILTRO: sempre vai à API da Câmara para resultados completos.
    # O banco local serve apenas para enriquecer com headline quando disponível.
    # ──────────────────────────────────────────────────────────────────────────
    if tem_filtro:
        logger.info(f"Busca com filtros — direto na API da Câmara: q={q!r} tipo={tipo} ano={ano} ods={ods}")
        data_inicio = f"{ano}-01-01" if ano else None
        data_fim    = f"{ano}-12-31" if ano else None

        # Para ODS precisamos de um cap maior pois o filtro é feito localmente
        itens_camara = _ODS_BUSCA_CAP if ods else min(por_pagina * 3, _CAMARA_MAX_ITENS)

        try:
            raw = await camara.listar_proposicoes(
                siglaTipo=tipo,
                dataApresentacaoInicio=data_inicio,
                dataApresentacaoFim=data_fim,
                keywords=q,
                pagina=1,
                itens=itens_camara,
            )
        except Exception as e:
            logger.error(f"Erro ao consultar API da Câmara: {e}")
            raise HTTPException(status_code=503, detail=f"API da Câmara indisponível: {e}")

        proposicoes = raw.get("dados", [])

        # Busca temas em paralelo
        tasks = [_buscar_temas_camara(p.get("id")) for p in proposicoes if p.get("id")]
        temas_por_id = {}
        if tasks:
            resultados = await asyncio.gather(*tasks)
            temas_por_id = {pid: temas for pid, temas in resultados}

        # Monta itens e aplica filtro ODS
        resultado = []
        for p in proposicoes:
            temas = temas_por_id.get(p.get("id"), [])
            item = _camara_para_item(p, temas)

            # Enriquece com headline do banco local se existir
            local = ProposicaoRepository.buscar_por_external_id(db, str(p.get("id", "")))
            if local and local.headline:
                item["headline"] = local.headline

            if ods is None or any(o["numero"] == ods for o in item["ods"]):
                resultado.append(item)

        # Paginação para filtro ODS (feita localmente após filtrar)
        if ods is not None:
            inicio = (pagina - 1) * por_pagina
            fim = inicio + por_pagina
            pagina_resultado = resultado[inicio:fim]
            logger.info(f"ODS={ods}: {len(resultado)} encontrados, retornando [{inicio}:{fim}]")
            return {
                "dados": pagina_resultado,
                "total": len(resultado),
                "pagina": pagina,
                "por_pagina": por_pagina,
                "fonte": "camara_api",
            }

        # Paginação simples
        inicio = (pagina - 1) * por_pagina
        fim = inicio + por_pagina
        return {
            "dados": resultado[inicio:fim],
            "total": len(resultado),
            "pagina": pagina,
            "por_pagina": por_pagina,
            "fonte": "camara_api",
            "erro_upstream": raw.get("erro_upstream"),
        }

    # ──────────────────────────────────────────────────────────────────────────
    # MODO HOME (sem filtros): banco local primeiro.
    # Se tiver menos de _HOME_MIN projetos, complementa com API da Câmara
    # e persiste os novos para enriquecer o banco progressivamente.
    # ──────────────────────────────────────────────────────────────────────────
    total_banco = db.query(Project).count()
    skip_busca = (pagina - 1) * por_pagina
    local = ProposicaoRepository.listar(db, skip=skip_busca, limit=por_pagina)

    if total_banco >= _HOME_MIN and local:
        # Banco suficiente — retorna direto
        resultado = [_projeto_para_item(p) for p in local]
        return {
            "dados": resultado,
            "total": total_banco,
            "pagina": pagina,
            "por_pagina": por_pagina,
            "fonte": "banco_local",
        }

    # Banco insuficiente — busca mais da API da Câmara
    logger.info(f"Banco com {total_banco} projetos (< {_HOME_MIN}) — buscando da API da Câmara")
    try:
        raw = await camara.listar_proposicoes(
            pagina=1,
            itens=_CAMARA_MAX_ITENS,
        )
    except Exception as e:
        logger.warning(f"Falha na API da Câmara, usando banco parcial: {e}")
        resultado = [_projeto_para_item(p) for p in local]
        return {
            "dados": resultado,
            "total": total_banco,
            "pagina": pagina,
            "por_pagina": por_pagina,
            "fonte": "banco_local",
        }

    proposicoes_camara = raw.get("dados", [])

    if proposicoes_camara:
        # Persiste novos projetos no banco (auto-popula para próximas chamadas)
        _persistir_do_camara(db, proposicoes_camara, {})

    # Monta resposta: banco (com headline) + Câmara (sem duplicatas)
    ids_banco = {p.external_id for p in local}
    resultado = [_projeto_para_item(p) for p in local]

    for p in proposicoes_camara:
        ext_id = str(p.get("id", ""))
        if ext_id in ids_banco:
            continue
        item = _camara_para_item(p, [])
        resultado.append(item)
        ids_banco.add(ext_id)
        if len(resultado) >= por_pagina:
            break

    total_estimado = max(total_banco + len(proposicoes_camara), len(resultado))
    return {
        "dados": resultado,
        "total": total_estimado,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "fonte": "hibrido",
    }


# ─── ENDPOINTS FIXOS (antes do /{external_id}) ───────────────────────────────

@router.get("/temas/disponiveis")
def temas_disponiveis(db: Session = Depends(get_db)):
    temas_db = TemaRepository.listar(db)
    if temas_db:
        return {"temas": [t.nome for t in temas_db]}
    return {
        "temas": [
            "Saúde", "Educação", "Economia", "Meio Ambiente",
            "Segurança", "Direitos Humanos", "Trabalho", "Habitação",
            "Tecnologia", "Agricultura", "Energia", "Transporte"
        ]
    }


@router.get("/glossario/termo/{termo}")
def buscar_termo(termo: str):
    return explicar_termo(termo)


# ─── DETALHE (cache-aside com save automático) ───────────────────────────────

@router.get("/{external_id}")
async def detalhe_projeto(external_id: str, db: Session = Depends(get_db)):
    resultado = await ProposicaoService.buscar_por_id(db, external_id)

    if not resultado:
        logger.warning(f"Projeto {external_id} não encontrado")
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    if resultado.get("fonte") == "banco_local":
        temas = resultado.get("temas", [])
        ods_list = ods_classifier.classificar(resultado.get("ementa", ""), temas)
        return {
            **resultado,
            "ods": ods_list,
            "temas": temas,
            "estagios": ESTAGIOS,
        }

    try:
        autores_raw = await camara.obter_autores(int(external_id))
        temas_raw   = await camara.obter_temas(int(external_id))
        autores = autores_raw.get("dados", [])
        temas   = [t.get("tema", "") for t in temas_raw.get("dados", [])]
    except Exception as e:
        logger.warning(f"Erro ao buscar autores/temas do projeto {external_id}: {e}")
        autores, temas = [], []

    ods_list = ods_classifier.classificar(resultado.get("ementa", ""), temas)
    return {
        **resultado,
        "autores": autores,
        "temas": temas,
        "ods": ods_list,
        "estagios": ESTAGIOS,
    }


# ─── TRAMITAÇÃO ───────────────────────────────────────────────────────────────

@router.get("/{external_id}/tramitacao")
async def tramitacao_projeto(external_id: str):
    try:
        raw = await camara.obter_tramitacoes(int(external_id))
    except Exception as e:
        logger.error(f"Erro ao buscar tramitação do projeto {external_id}: {e}")
        raise HTTPException(status_code=503, detail=f"Erro ao buscar tramitação: {e}")

    if raw.get("erro_upstream"):
        return {"estagio_atual": 1, "estagios": ESTAGIOS, "historico": [], "indisponivel": True}

    tramitacoes = raw.get("dados", [])
    estagio_atual = 1
    for t in reversed(tramitacoes):
        desc = t.get("descricaoSituacao") or t.get("descricaoTramitacao", "")
        if desc:
            estagio_atual = _inferir_estagio(desc)
            break

    historico = [
        {
            "sequencia": t.get("sequencia"),
            "dataHora":  t.get("dataHora"),
            "orgao":     t.get("siglaOrgao"),
            "situacao":  t.get("descricaoSituacao") or t.get("descricaoTramitacao"),
            "despacho":  t.get("despacho"),
            "estagio":   _inferir_estagio(t.get("descricaoSituacao") or t.get("descricaoTramitacao") or ""),
        }
        for t in tramitacoes
    ]

    return {"estagio_atual": estagio_atual, "estagios": ESTAGIOS, "historico": historico}


# ─── RESUMO ACESSÍVEL ─────────────────────────────────────────────────────────

@router.get("/{external_id}/resumo-acessivel")
async def resumo_acessivel(external_id: str):
    try:
        raw = await camara.obter_proposicao(int(external_id))
    except Exception as e:
        logger.error(f"Erro ao buscar proposição {external_id} para resumo: {e}")
        raise HTTPException(status_code=404, detail=f"Projeto não encontrado: {e}")

    p = raw.get("dados", {})
    resultado = await gerar_resumo(
        ementa=p.get("ementa", ""),
        tipo=p.get("siglaTipo", ""),
        numero=p.get("numero", 0),
        ano=p.get("ano", 0),
    )
    return resultado