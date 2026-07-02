import logging
from sqlalchemy.orm import Session
from app.repositories.proposicao_repository import ProposicaoRepository
from app.repositories.tag_repository import TagRepository
from app.models.project import Project
from app.services import camara_client
from typing import Optional

logger = logging.getLogger(__name__)


class ProposicaoService:

    @staticmethod
    async def buscar_por_id(db: Session, external_id: str) -> Optional[dict]:
        # 1. Busca no banco local
        proposicao = ProposicaoRepository.buscar_por_external_id(db, external_id)
        if proposicao:
            logger.info(f"Cache HIT — proposicao {external_id}")
          
            if not proposicao.autor:
                try:
                    autores_raw = await camara_client.obter_autores(int(external_id))
                    autores = autores_raw.get("dados", [])
                    nome = ProposicaoService._extrair_autor(autores)
                    if nome:
                        proposicao.autor = nome
                        db.commit()
                except Exception as e:
                    logger.warning(f"Erro ao enriquecer autor de {external_id}: {e}")
            return {**ProposicaoService._enriquecer(proposicao), "fonte": "banco_local"}

        # 2. Fallback: API da Câmara
        logger.info(f"Cache MISS — buscando {external_id} na API da Câmara")
        try:
            raw = await camara_client.obter_proposicao(int(external_id))
        except Exception as e:
            logger.error(f"Erro ao buscar proposicao {external_id}: {e}")
            return None

        dados = raw.get("dados", {})
        if not dados:
            return None

        # 3. Busca autores no endpoint correto
        autor = ""
        try:
            autores_raw = await camara_client.obter_autores(int(external_id))
            autores = autores_raw.get("dados", [])
            autor = ProposicaoService._extrair_autor(autores)
        except Exception as e:
            logger.warning(f"Erro ao buscar autores de {external_id}: {e}")

        # 4. Persiste no banco
        proposicao = Project(
            external_id=str(dados.get("id", external_id)),
            titulo=f"{dados.get('siglaTipo', '')} {dados.get('numero', '')}",
            ementa=dados.get("ementa", ""),
            situacao=dados.get("statusProposicao", {}).get("descricaoSituacao", "")
                     if isinstance(dados.get("statusProposicao"), dict) else "",
            autor=autor,
            ano=dados.get("ano"),
            tipo=dados.get("siglaTipo", ""),
            url_texto_oficial=dados.get("urlInteiroTeor", ""),
            sincronizado="camara_api"
        )
        proposicao = ProposicaoRepository.salvar(db, proposicao)
        logger.info(f"Proposicao {external_id} salva no banco com autor='{autor}'")

        try:
            TagRepository.criar_tag_proposicao(db, proposicao)
        except Exception as e:
            logger.warning(f"Erro ao criar tag para {external_id}: {e}")

        return {**ProposicaoService._enriquecer(proposicao), "fonte": "camara_api"}

    @staticmethod
    def _extrair_autor(autores: list) -> str:
        
        if not autores:
            return ""
        nomes = [
            a.get("nome") or a.get("name") or ""
            for a in autores
            if a.get("nome") or a.get("name")
        ]
        return ", ".join(nomes) if nomes else ""

    @staticmethod
    def _enriquecer(proposicao: Project) -> dict:
        return {
            "id": proposicao.id,
            "external_id": proposicao.external_id,
            "titulo": proposicao.titulo,
            "ementa": proposicao.ementa,
            "situacao": proposicao.situacao,
            "autor": proposicao.autor or "Não informado",
            "ano": proposicao.ano,
            "tipo": proposicao.tipo,
            "url_texto_oficial": proposicao.url_texto_oficial,
            "sincronizado": proposicao.sincronizado,
        }

    @staticmethod
    def listar(db: Session, skip: int = 0, limit: int = 20,
               tipo: str = None, ano: int = None, q: str = None):
        proposicoes = ProposicaoRepository.listar(db, skip, limit, tipo, ano, q)
        return [ProposicaoService._enriquecer(p) for p in proposicoes]