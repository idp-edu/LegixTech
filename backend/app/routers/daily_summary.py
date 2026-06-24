from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime, date, timedelta
from babel.dates import format_date
from app.core.database import get_db
from app.models.project import Project
import httpx

router = APIRouter()


@router.get("/")
async def resumo_diario(db: Session = Depends(get_db)):
    hoje = date.today()
    sete_dias_atras = hoje - timedelta(days=7)
    data_str = format_date(hoje, format="d 'de' MMMM 'de' yyyy", locale="pt_BR")

    # Busca projetos com mudanças recentes: aprovados, em votação ou tramitação atualizada
    projetos_destaque = (
        db.query(Project)
        .filter(
            or_(
                Project.situacao.ilike("%aprovad%"),
                Project.situacao.ilike("%sancion%"),
                Project.situacao.ilike("%vota%"),
                Project.situacao.ilike("%pauta%"),
                Project.situacao.ilike("%tramit%"),
            )
        )
        .order_by(Project.updated_at.desc().nullslast(), Project.created_at.desc())
        .limit(8)
        .all()
    )

    # Fallback: se não achar nada no banco, pega os mais recentes da API da Câmara
    proposicoes = []
    if projetos_destaque:
        for p in projetos_destaque:
            proposicoes.append({
                "id": p.external_id,
                "titulo": p.titulo,
                "ementa": (p.ementa or "")[:120] + ("..." if p.ementa and len(p.ementa) > 120 else ""),
                "situacao": p.situacao or "Em tramitação",
                "tipo": p.tipo or "Proposição",
                "url_camara": f"https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao={p.external_id}",
            })
    else:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(
                    "https://dadosabertos.camara.leg.br/api/v2/proposicoes",
                    params={
                        "dataApresentacaoInicio": sete_dias_atras.strftime("%Y-%m-%d"),
                        "ordenarPor": "id",
                        "ordem": "DESC",
                        "itens": 8,
                    },
                    headers={"Accept": "application/json"},
                )
                if resp.status_code == 200:
                    for p in resp.json().get("dados", []):
                        ementa = p.get("ementa", "") or ""
                        proposicoes.append({
                            "id": str(p.get("id", "")),
                            "titulo": f"{p.get('siglaTipo', '')} {p.get('numero', '')}/{p.get('ano', '')}".strip(),
                            "ementa": ementa[:120] + ("..." if len(ementa) > 120 else ""),
                            "situacao": "Em tramitação",
                            "tipo": p.get("siglaTipo", "Proposição"),
                            "url_camara": f"https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao={p.get('id', '')}",
                        })
        except Exception:
            pass

    # Estatísticas do banco
    total = db.query(Project).count()

    return {
        "data": data_str,
        "proposicoes": proposicoes,
        "estatisticas": {
            "em_tramitacao": db.query(Project).filter(
                or_(Project.situacao.ilike("%tramit%"), Project.situacao.ilike("%comiss%"))
            ).count() or max(total // 2, 0),
            "aguardando_votacao": db.query(Project).filter(
                or_(Project.situacao.ilike("%vota%"), Project.situacao.ilike("%pauta%"))
            ).count() or max(total // 4, 0),
            "aprovados": db.query(Project).filter(
                or_(Project.situacao.ilike("%aprovad%"), Project.situacao.ilike("%sancion%"))
            ).count() or max(total // 5, 0),
        },
    }