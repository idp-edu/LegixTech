"""
Serviço que verifica políticos favoritados e gera notificações
quando um novo projeto é encontrado para o político.
Chamado manualmente via POST /politicos/notificacoes/verificar
ou pode ser agendado com APScheduler futuramente.
"""
import httpx
from sqlalchemy.orm import Session
from app.models.saved_politician import SavedPolitician
from app.models.politician import Politician
from app.models.notification import Notification

CAMARA_API = "https://dadosabertos.camara.leg.br/api/v2"


def verificar_novos_projetos(db: Session) -> dict:
    """
    Para cada político favoritado, busca os projetos mais recentes
    e gera notificação se ainda não existe para aquele usuário.
    """
    salvos = db.query(SavedPolitician).all()
    total_notificacoes = 0

    for salvo in salvos:
        politico = db.query(Politician).filter(Politician.id == salvo.politician_id).first()
        if not politico:
            continue

        # Busca os 5 projetos mais recentes do político na API da Câmara
        try:
            resp = httpx.get(
                f"{CAMARA_API}/proposicoes",
                params={"idDeputadoAutor": politico.external_id, "itens": 5, "pagina": 1},
                timeout=10,
            )
            if resp.status_code != 200:
                continue
            projetos = resp.json().get("dados", [])
        except Exception:
            continue

        for projeto in projetos:
            project_id = str(projeto.get("id", ""))
            if not project_id:
                continue

            # Verifica se notificação já existe para esse user + projeto
            ja_existe = (
                db.query(Notification)
                .filter(
                    Notification.user_id == str(salvo.user_id),
                    Notification.project_id == project_id,
                    Notification.politician_id == politico.external_id,
                )
                .first()
            )
            if ja_existe:
                continue

            # Cria a notificação
            ementa = projeto.get("ementa", "")[:120]
            msg = f"📋 {politico.name} apresentou: {projeto.get('siglaTipo')} {projeto.get('numero')}/{projeto.get('ano')} — {ementa}"
            notif = Notification(
                user_id=str(salvo.user_id),
                project_id=project_id,
                politician_id=politico.external_id,
                tipo="politico",
                message=msg,
                read=False,
            )
            db.add(notif)
            total_notificacoes += 1

    db.commit()
    return {"notificacoes_geradas": total_notificacoes, "politicos_verificados": len(salvos)}
