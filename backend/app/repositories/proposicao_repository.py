from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.project import Project
from typing import Optional, List

class ProposicaoRepository:

    @staticmethod
    def buscar_por_external_id(db: Session, external_id: str) -> Optional[Project]:
        return db.query(Project).filter(Project.external_id == external_id).first()

    @staticmethod
    def buscar_por_id(db: Session, id: int) -> Optional[Project]:
        return db.query(Project).filter(Project.id == id).first()

    @staticmethod
    def listar(db: Session, skip: int = 0, limit: int = 20,
               tipo: str = None, ano: int = None, q: str = None) -> List[Project]:
        query = db.query(Project)
        if tipo:
            query = query.filter(Project.tipo == tipo)
        if ano:
            query = query.filter(Project.ano == ano)
        if q:
            query = query.filter(
                or_(
                    Project.titulo.ilike(f"%{q}%"),
                    Project.ementa.ilike(f"%{q}%")
                )
            )
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def salvar(db: Session, proposicao: Project) -> Project:
        db.add(proposicao)
        db.commit()
        db.refresh(proposicao)
        return proposicao

    @staticmethod
    def existe(db: Session, external_id: str) -> bool:
        return db.query(Project).filter(
            Project.external_id == external_id
        ).count() > 0