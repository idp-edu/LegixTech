from sqlalchemy.orm import Session
from app.models.tag import Tag
from typing import Optional, List
import re

class TagRepository:

    @staticmethod
    def gerar_slug(texto: str) -> str:
        slug = texto.lower().strip()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug)
        return slug[:100]

    @staticmethod
    def buscar_por_slug(db: Session, slug: str) -> Optional[Tag]:
        return db.query(Tag).filter(Tag.slug == slug).first()

    @staticmethod
    def listar(db: Session, tipo_tag: str = None) -> List[Tag]:
        query = db.query(Tag)
        if tipo_tag:
            query = query.filter(Tag.tipo_tag == tipo_tag)
        return query.all()

    @staticmethod
    def criar_tag_proposicao(db: Session, proposicao) -> Tag:
        slug = TagRepository.gerar_slug(
            f"proposicao-{proposicao.tipo}-{proposicao.ano}-{proposicao.external_id}"
        )
        tag_existente = TagRepository.buscar_por_slug(db, slug)
        if tag_existente:
            return tag_existente
        tag = Tag(
            tipo_tag="proposicao",
            label=f"{proposicao.tipo} {proposicao.ano}",
            slug=slug,
            descricao=proposicao.ementa[:200] if proposicao.ementa else None,
            referencia_id=str(proposicao.external_id),
            referencia_tipo="proposicao"
        )
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return tag