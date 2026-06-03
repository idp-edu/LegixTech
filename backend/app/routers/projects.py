"""
Endpoints de proposições: proxy enriquecido da API da Câmara dos Deputados.
Cache-aside: busca no banco local primeiro, fallback para API da Câmara.
"""

import asyncio
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


def _inferir_estagio(descricao: str) -> int:
    desc = (descricao or "").strip()
    for palavra, estagio in ESTAGIO_MAP.items():
        if palavra.lower() in desc.lower():
            return estagio
    return 1


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
        }
    }


# ─── LISTAGEM ────────────────────────────────────────────────────────────────

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
    local = ProposicaoRepository.listar(db, skip=(pagina - 1) * por_pagina,
                                        limit=por_pagina, tipo=tipo, ano=ano, q=q)
    if local:
        resultado = []
        for p in local:
            temas = [t.nome for t in p.temas] if hasattr(p, "temas") else []
            ods_list = ods_classifier.classificar(p.ementa or "", temas)
            item = {
                "id": p.external_id,
                "titulo": p.titulo,
                "ementa": p.ementa,
                "situacao": p.situacao,
                "autor": p.autor,
                "ano": p.ano,
                "tipo": p.tipo,
                "temas": temas,
                "ods": ods_list,
                "estagio_atual": _inferir_estagio(p.situacao or ""),
                "estagios": ESTAGIOS,
            }
            if ods is None or any(o["numero"] == ods for o in ods_list):
                resultado.append(item)
        return {"dados": resultado, "total": len(resultado), "pagina": pagina, "fonte": "banco_local"}

    data_inicio = f"{ano}-01-01" if ano else None
    data_fim = f"{ano}-12-31" if ano else None
    try:
        raw = await camara.listar_proposicoes(
            siglaTipo=tipo,
            dataApresentacaoInicio=data_inicio,
            dataApresentacaoFim=data_fim,
            keywords=q,
            pagina=pagina,
            itens=por_pagina,
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"API da Câmara indisponível: {e}")

    proposicoes = raw.get("dados", [])

    async def _buscar_temas(prop_id: int) -> tuple[int, list[str]]:
        try:
            temas_raw = await camara.obter_temas(prop_id)
            temas = [t.get("tema", "") for t in temas_raw.get("dados", [])]
            return prop_id, temas
        except Exception:
            return prop_id, []

    tasks = [_buscar_temas(p.get("id")) for p in proposicoes if p.get("id")]
    temas_por_id = {}
    if tasks:
        resultados = await asyncio.gather(*tasks)
        temas_por_id = {pid: temas for pid, temas in resultados}

    resultado = []
    for p in proposicoes:
        temas = temas_por_id.get(p.get("id"), [])
        ods_list = ods_classifier.classificar(p.get("ementa", ""), temas)
        item = {
            **p,
            "ods": ods_list,
            "temas": temas,
            "estagio_atual": _inferir_estagio(
                p.get("statusProposicao", {}).get("descricaoSituacao", "")
                if isinstance(p.get("statusProposicao"), dict) else ""
            ),
            "estagios": ESTAGIOS,
        }
        if ods is None or any(o["numero"] == ods for o in ods_list):
            resultado.append(item)

    return {
        "dados": resultado,
        "total": len(resultado),
        "pagina": pagina,
        "fonte": "camara_api",
        "erro_upstream": raw.get("erro_upstream"),
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
        raise HTTPException(status_code=404, detail="Projeto não encontrado")

    if resultado.get("fonte") == "banco_local":
        temas = resultado.get("temas", [])
        ods_list = ods_classifier.classificar(resultado.get("ementa", ""), temas)
        return {**resultado, "ods": ods_list, "estagios": ESTAGIOS}

    try:
        autores_raw = await camara.obter_autores(int(external_id))
        temas_raw = await camara.obter_temas(int(external_id))
        autores = autores_raw.get("dados", [])
        temas = [t.get("tema", "") for t in temas_raw.get("dados", [])]
    except Exception:
        autores, temas = [], []

    ods_list = ods_classifier.classificar(resultado.get("ementa", ""), temas)
    return {**resultado, "autores": autores, "temas": temas, "ods": ods_list, "estagios": ESTAGIOS}


# ─── TRAMITAÇÃO ───────────────────────────────────────────────────────────────

@router.get("/{external_id}/tramitacao")
async def tramitacao_projeto(external_id: str):
    try:
        raw = await camara.obter_tramitacoes(int(external_id))
    except Exception as e:
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
            "dataHora": t.get("dataHora"),
            "orgao": t.get("siglaOrgao"),
            "situacao": t.get("descricaoSituacao") or t.get("descricaoTramitacao"),
            "despacho": t.get("despacho"),
            "estagio": _inferir_estagio(t.get("descricaoSituacao") or t.get("descricaoTramitacao") or ""),
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
        raise HTTPException(status_code=404, detail=f"Projeto não encontrado: {e}")

    p = raw.get("dados", {})
    resultado = await gerar_resumo(
        ementa=p.get("ementa", ""),
        tipo=p.get("siglaTipo", ""),
        numero=p.get("numero", 0),
        ano=p.get("ano", 0),
    )
    return resultado