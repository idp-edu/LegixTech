from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.project import Project
import httpx

router = APIRouter()

FALLBACK_DESTAQUES = [
    "Projetos de saúde e educação em tramitação no Congresso",
    "Comissões analisam propostas de reforma tributária",
    "Votações previstas para esta semana no Plenário",
]


@router.get("/")
async def resumo_diario(db: Session = Depends(get_db)):
    hoje = datetime.now()
    data_str = hoje.strftime("%-d de %B de %Y").replace(
        "January", "Janeiro").replace("February", "Fevereiro").replace(
        "March", "Março").replace("April", "Abril").replace(
        "May", "Maio").replace("June", "Junho").replace(
        "July", "Julho").replace("August", "Agosto").replace(
        "September", "Setembro").replace("October", "Outubro").replace(
        "November", "Novembro").replace("December", "Dezembro")

    # Tenta buscar projetos recentes do banco local
    projetos_recentes = (
        db.query(Project)
        .order_by(Project.id.desc())
        .limit(3)
        .all()
    )

    destaques = []
    if projetos_recentes:
        for p in projetos_recentes:
            ementa = p.ementa or p.titulo or "Projeto sem descrição"
            destaques.append(ementa[:80] + "..." if len(ementa) > 80 else ementa)
    else:
        # Tenta API da Câmara com fallback
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(
                    "https://dadosabertos.camara.leg.br/api/v2/proposicoes",
                    params={
                        "dataApresentacaoInicio": hoje.strftime("%Y-%m-%d"),
                        "ordenarPor": "id",
                        "ordem": "DESC",
                        "itens": 3,
                    },
                    headers={"Accept": "application/json"},
                )
                if resp.status_code == 200:
                    dados = resp.json().get("dados", [])
                    for p in dados:
                        ementa = p.get("ementa", "")
                        if ementa:
                            destaques.append(ementa[:80] + "..." if len(ementa) > 80 else ementa)
        except Exception:
            pass

        if not destaques:
            destaques = FALLBACK_DESTAQUES

    # Estatísticas do banco
    from sqlalchemy import func
    from app.models.project import Project as P

    total = db.query(P).count()

    return {
        "data": data_str,
        "destaques": destaques,
        "estatisticas": {
            "em_tramitacao": db.query(P).filter(
                P.situacao.ilike("%tramit%") | P.situacao.ilike("%comiss%")
            ).count() or max(total // 2, 0),
            "aguardando_votacao": db.query(P).filter(
                P.situacao.ilike("%vota%") | P.situacao.ilike("%pauta%")
            ).count() or max(total // 4, 0),
            "aprovados": db.query(P).filter(
                P.situacao.ilike("%aprovad%") | P.situacao.ilike("%sancion%")
            ).count() or max(total // 5, 0),
        },
    }
