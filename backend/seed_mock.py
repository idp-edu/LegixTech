"""
Script para popular o banco com dados mock realistas.
Execute: python seed_mock.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

# Importa todos os models para que o SQLAlchemy resolva os relacionamentos
from app.core.database import SessionLocal, engine, Base
from app.models import user as _u          # noqa
from app.models import project as _p       # noqa
from app.models import saved as _s         # noqa
from app.models.tema import Tema           # noqa
from app.models.classificacao import Classificacao  # noqa
from app.models.tag import Tag             # noqa
from app.models.ods import Ods             # noqa
from app.models import relationships       # noqa
from app.models.politician import Politician        # noqa
from app.models.politician_vote import PoliticianVote  # noqa
from app.models.saved_politician import SavedPolitician  # noqa
from app.models.followed_politician import FollowedPolitician  # noqa
from app.models.project import Project
from app.models.politician import Politician

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Limpa dados mock anteriores
db.query(Project).filter(Project.external_id.like("MOCK-%")).delete()
db.query(Politician).filter(Politician.external_id.like("MOCK-%")).delete()
db.commit()

projetos = [
    dict(
        external_id="MOCK-PL-1234-2026",
        titulo="PL 1234/2026",
        ementa="Dispõe sobre a acessibilidade em serviços de saúde pública e redução de custos para populações vulneráveis",
        situacao="Em Tramitação - Comissão de Saúde",
        autor="Sen. Maria Silva",
        ano=2026, tipo="PL",
    ),
    dict(
        external_id="MOCK-PL-5678-2026",
        titulo="PL 5678/2026",
        ementa="Institui o Programa Nacional de Investimento em Energia Limpa e criação de empregos verdes",
        situacao="Aguardando Votação - Plenário",
        autor="Dep. João Oliveira",
        ano=2026, tipo="PL",
    ),
    dict(
        external_id="MOCK-PEC-42-2026",
        titulo="PEC 42/2026",
        ementa="Proposta de Emenda à Constituição que amplia o acesso à educação digital nas escolas públicas",
        situacao="Em Tramitação - Comissão de Educação",
        autor="Dep. Ana Costa",
        ano=2026, tipo="PEC",
    ),
    dict(
        external_id="MOCK-PL-9012-2025",
        titulo="PL 9012/2025",
        ementa="Dispõe sobre modernização e financiamento da educação pública básica e superior",
        situacao="Aprovado - Sancionado",
        autor="Sen. Carlos Mendes",
        ano=2025, tipo="PL",
    ),
    dict(
        external_id="MOCK-PL-3456-2026",
        titulo="PL 3456/2026",
        ementa="Estabelece medidas de apoio e recuperação para microempresas e empresas de pequeno porte",
        situacao="Em Tramitação - Mesa Diretora",
        autor="Dep. Roberto Santos",
        ano=2026, tipo="PL",
    ),
    dict(
        external_id="MOCK-PL-7890-2026",
        titulo="PL 7890/2026",
        ementa="Regulamenta a proteção de dados pessoais no ambiente digital e estabelece penalidades aos infratores",
        situacao="Em Tramitação - Comissão de Ciência e Tecnologia",
        autor="Dep. Juliana Lima",
        ano=2026, tipo="PL",
    ),
]

for d in projetos:
    db.add(Project(**d))

politicos = [
    dict(
        external_id="MOCK-DEP-1001",
        name="Juliana Costa Lima", party="PDT", state="BA", house="Câmara",
        bio="Deputada federal dedicada à educação pública e tecnologia. Professora universitária e defensora da inovação no ensino.",
        email="juliana.costa@camara.leg.br",
    ),
    dict(
        external_id="MOCK-SEN-2001",
        name="Maria Silva", party="PT", state="SP", house="Senado",
        bio="Senadora com foco em saúde pública e direitos das mulheres. Médica de formação.",
        email="maria.silva@senado.leg.br",
    ),
    dict(
        external_id="MOCK-DEP-1002",
        name="Carlos Mendes", party="PSDB", state="MG", house="Câmara",
        bio="Deputado federal com mandato focado em economia e geração de empregos.",
        email="carlos.mendes@camara.leg.br",
    ),
    dict(
        external_id="MOCK-DEP-1003",
        name="Ana Costa", party="PSOL", state="RJ", house="Câmara",
        bio="Professora e deputada federal, atua na defesa da educação pública e cultura.",
        email="ana.costa@camara.leg.br",
    ),
]

for d in politicos:
    db.add(Politician(**d))

db.commit()
db.close()
print(f"✅ Banco populado: {len(projetos)} projetos, {len(politicos)} políticos")