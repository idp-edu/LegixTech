import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


def _build_url(raw_url: str) -> str:
    """Normaliza a DATABASE_URL para sempre funcionar com psycopg2 + SSL."""
    url = raw_url.strip()
    # Render às vezes entrega "postgres://" em vez de "postgresql://"
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    # Garante SSL obrigatório
    if "?" not in url:
        url += "?sslmode=require"
    elif "sslmode" not in url:
        url += "&sslmode=require"
    return url


if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(
        _build_url(settings.DATABASE_URL),
        pool_pre_ping=True,       # testa a conexão antes de usar do pool
        pool_recycle=300,         # recicla conexões a cada 5 min (evita drop)
        pool_size=5,
        max_overflow=10,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()