"""
Endpoints de proposições: proxy enriquecido da API da Câmara dos Deputados.
"""
import asyncio
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.services import camara_client as camara
from app.services import ods_classifier
from app.services.resumo_service import gerar_resumo, explicar_termo

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


@router.get("/")
async def listar_projetos(
    q: Optional[str] = Query(None, description="Busca por palavra-chave"),
    tipo: Optional[str] = Query(None, description="Tipo: PL, PEC, MPV..."),
    ano: Optional[int] = Query(None, description="Ano do projeto"),
    ods: Optional[int] = Query(None, description="Filtrar por ODS (1-17)"),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
):
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
                p.get("statusProposicao", {}).get("descricaoSituacao", "") if isinstance(p.get("statusProposicao"), dict) else ""
            ),
            "estagios": ESTAGIOS,
        }
        if ods is None or any(o["numero"] == ods for o in ods_list):
            resultado.append(item)

    return {
        "dados": resultado,
        "total": len(resultado),
        "pagina": pagina,
        "erro_upstream": raw.get("erro_upstream"),
    }


@router.get("/temas/disponiveis")
def temas_disponiveis():
    return {
        "temas": [
            "Saúde", "Educação", "Economia", "Meio Ambiente",
            "Segurança", "Direitos Humanos", "Trabalho", "Habitação",
            "Tecnologia", "Agricultura", "Energia", "Transporte"
        ]
    }


@router.get("/glossario/termo/{termo}")
def buscar_termo(termo: str):
    """Explica um termo jurídico em linguagem simples."""
    return explicar_termo(termo)


@router.get("/{external_id}")
async def detalhe_projeto(external_id: str):
    try:
        raw = await camara.obter_proposicao(int(external_id))
        autores_raw = await camara.obter_autores(int(external_id))
        temas_raw = await camara.obter_temas(int(external_id))
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Projeto não encontrado: {e}")

    projeto = raw.get("dados", {})
    autores = autores_raw.get("dados", [])
    temas = [t.get("tema", "") for t in temas_raw.get("dados", [])]
    ods_list = ods_classifier.classificar(projeto.get("ementa", ""), temas)

    return {
        **projeto,
        "autores": autores,
        "temas": temas,
        "ods": ods_list,
        "estagios": ESTAGIOS,
    }


@router.get("/{external_id}/tramitacao")
async def tramitacao_projeto(external_id: str):
    try:
        raw = await camara.obter_tramitacoes(int(external_id))
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Erro ao buscar tramitação: {e}")

    if raw.get("erro_upstream"):
        return {
            "estagio_atual": 1,
            "estagios": ESTAGIOS,
            "historico": [],
            "indisponivel": True,
        }

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


@router.get("/{external_id}/resumo-acessivel")
async def resumo_acessivel(external_id: str):
    """Retorna resumo do projeto em linguagem simples, sem juridiquês."""
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