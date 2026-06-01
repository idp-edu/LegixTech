from sqlalchemy.orm import Session
from app.models.tema import Tema
from typing import Optional, List

class TemaRepository:

    @staticmethod
    def buscar_por_cod(db: Session, cod_tema: int) -> Optional[Tema]:
        return db.query(Tema).filter(Tema.cod_tema == cod_tema).first()

    @staticmethod
    def listar(db: Session) -> List[Tema]:
        return db.query(Tema).order_by(Tema.nome).all()

    @staticmethod
    def criar_ou_atualizar(db: Session, cod_tema: int, nome: str) -> Tema:
        tema = TemaRepository.buscar_por_cod(db, cod_tema)
        if not tema:
            tema = Tema(cod_tema=cod_tema, nome=nome)
            db.add(tema)
            db.commit()
            db.refresh(tema)
        return tema