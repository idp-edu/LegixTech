from sqlalchemy import Column, Integer, ForeignKey, Table
from app.core.database import Base

# Proposição ↔ Tema
proposicao_tema = Table(
    "proposicao_tema",
    Base.metadata,
    Column("proposicao_id", Integer, ForeignKey("projects.id"), primary_key=True),
    Column("tema_cod", Integer, ForeignKey("temas.cod_tema"), primary_key=True),
)

# Tema ↔ ODS
tema_ods = Table(
    "tema_ods",
    Base.metadata,
    Column("tema_cod", Integer, ForeignKey("temas.cod_tema"), primary_key=True),
    Column("ods_numero", Integer, primary_key=True),
)