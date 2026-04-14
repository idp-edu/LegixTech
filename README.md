# 📱 Oficina de Soluções Móveis — Template 2026.1

Repositório template com estrutura padrão para a disciplina **Oficina de Soluções Móveis 2026.1**.

---

## 📁 Estrutura do Repositório

```
oficina-solucoes-moveis-template/
├── .github/
│   └── ISSUE_TEMPLATE/        # Templates de issues (bug, feature)
│       ├── README.md           # Guia de boas práticas para issues
│       ├── bug.md              # Template para relato de bugs
│       └── feature.md          # Template para proposta de features
├── agents/                    # Agentes de IA configurados para o projeto
│   ├── 1project-guardian.agent.md   # Guardião da arquitetura e segurança
│   ├── 2database-architect.agent.md # Arquiteto do banco de dados
│   ├── 3backend-agent.md            # Agente do backend (Django)
│   ├── 4frontend-agent.md           # Agente do frontend (React)
│   └── 5devsecops.agent.md          # Agente de deploy e infraestrutura
├── backend/                   # Código do backend (Django + DRF)
├── frontend/                  # Código do frontend (React + TypeScript)
└── README.md
```

---

## 🚀 Como Usar Este Template

Este repositório é um **GitHub Template**. Para criar um novo projeto a partir dele:

1. Acesse a página do repositório no GitHub.
2. Clique no botão **"Use this template"** (verde, no topo da página).
3. Escolha **"Create a new repository"**.
4. Defina o nome, visibilidade (público/privado) e a organização do novo repositório.
5. Clique em **"Create repository from template"**.

> O novo repositório será criado com toda a estrutura de diretórios, agentes e templates de issues já configurados.

---

## 🍴 Como Fazer Fork ou Clone

### Fork
1. Acesse a página do repositório no GitHub.
2. Clique em **"Fork"** (canto superior direito).
3. Selecione sua conta ou organização de destino.

### Clone
```bash
git clone https://github.com/<seu-usuario>/<nome-do-repositorio>.git
cd <nome-do-repositorio>
```

---

## 🐛 Como Usar os Templates de Issues

O repositório possui dois templates de issues para padronizar a comunicação da equipe:

### Abrindo uma Issue
1. Vá até a aba **"Issues"** do repositório.
2. Clique em **"New issue"**.
3. Escolha o template adequado:
   - **🐛 Bug report** — para reportar erros e comportamentos inesperados.
   - **✨ Feature request** — para propor novas funcionalidades ou melhorias.

### Padrão de Títulos
Todas as issues devem seguir o formato:

```
[CRITICIDADE] <Scope>: <descrição curta>
```

**Criticidades disponíveis:** `[LOW]` `[MEDIUM]` `[HIGH]` `[CRITICAL]`

**Scopes disponíveis:** `Auth` · `Backend` · `Frontend` · `Jobs` · `Database` · `Infra` · `Security` · `Docs` · `Enhancement`

**Exemplos:**
- `[HIGH] Backend: Endpoint de login retorna 500 em produção`
- `[LOW] Docs: Atualizar instruções de configuração do ambiente`

> Consulte `.github/ISSUE_TEMPLATE/README.md` para o guia completo de boas práticas.

---

## 🤖 Agentes de IA Configurados

O diretório `agents/` contém agentes de IA especializados, projetados para uso com ferramentas como o **GitHub Copilot** (modo agente) ou similares. Cada agente tem um papel bem definido:

| Agente | Arquivo | Responsabilidade |
|--------|---------|------------------|
| 🛡️ Project Guardian | `1project-guardian.agent.md` | Guardião da arquitetura geral, decisões de design e segurança do projeto |
| 🗄️ Database Architect | `2database-architect.agent.md` | Design, validação e evolução do schema do banco de dados PostgreSQL |
| ⚙️ Backend Agent | `3backend-agent.md` | APIs, serializers, regras de negócio no Django + DRF |
| 🎨 Frontend Agent | `4frontend-agent.md` | UI/UX, dashboards e componentes React + TypeScript |
| 🔒 DevSecOps Agent | `5devsecops.agent.md` | Deploy no Render, infraestrutura, segurança e automação |

### Como Usar os Agentes

1. Abra o repositório no **VS Code** com a extensão **GitHub Copilot** instalada.
2. No painel do Copilot Chat, selecione o modo **"Agent"**.
3. Escolha o arquivo do agente correspondente à tarefa que deseja realizar.
4. Interaja com o agente descrevendo o que precisa — ele seguirá as regras e o contexto definidos no arquivo `.agent.md`.

> Personalize os agentes substituindo os campos marcados com `______________` pelas informações do seu projeto (nome do sistema, URL do banco de dados, URL do Render, etc.).

---

## 🗺️ Como Usar o Template de Projeto Roadmap

O GitHub Projects permite criar um **Roadmap visual** para organizar o progresso do projeto ao longo do semestre.

### Configurando o Roadmap
1. Na página do repositório, clique em **"Projects"** → **"New project"**.
2. Selecione o template **"Roadmap"**.
3. Defina as datas de início e fim do projeto (alinhadas ao calendário da disciplina).
4. Crie **Milestones** no repositório (aba **"Issues"** → **"Milestones"**) para agrupar entregas por sprint ou fase.
5. Vincule as issues ao projeto e defina datas para visualizá-las no roadmap.

### Boas Práticas
- Use as **Milestones** para representar os sprints ou entregas da disciplina.
- Associe cada issue a uma milestone antes de iniciar o desenvolvimento.
- Mantenha o roadmap atualizado ao longo do semestre para facilitar o acompanhamento do professor e da equipe.

---

## 🛠️ Stack Padrão

| Camada | Tecnologia |
|--------|------------|
| Backend | Django + Django REST Framework |
| Frontend | React + TypeScript |
| Banco de Dados | PostgreSQL |
| Hospedagem | Render |
# ⚖️ LegixTech - Backend Engine

Este diretório contém o núcleo de processamento, API e inteligência de dados do projeto **LegixTech**. A aplicação foi desenhada para servir como uma ponte eficiente entre dados jurídicos brutos e insights estruturados para o usuário final.

---

## 🚀 O que o Backend faz?

O backend deste projeto atua como o motor de processamento e distribuição de dados jurídicos. Suas principais responsabilidades são:

* **📥 Ingestão de Dados (Scraping/API):** Interfaces robustas para coletar ou receber dados brutos diretamente de tribunais e diários oficiais.
* **🧠 Processamento e Inteligência (NLP):** Integração de modelos de Processamento de Linguagem Natural para classificação automática de processos e sumarização de textos jurídicos complexos.
* **🔌 API RESTful:** Exposição de endpoints performáticos para que o frontend ou dashboards consumam dados filtrados em tempo real.
* **🔐 Autenticação e Segurança:** Controle de acesso granular para diferentes perfis (pesquisadores, advogados e administradores).
* **💾 Persistência de Dados:** Gerenciamento de banco de dados relacional (PostgreSQL) para garantir a integridade das informações jurídicas.

---

## 🛠️ Stack Tecnológica

A escolha principal para este projeto foi o **FastAPI (Python)**.

### Por que FastAPI?

1.  **Alta Performance:** Graças ao suporte nativo a `async/await`, oferece uma velocidade comparável a linguagens como Go e Node.js.
2.  **Tipagem Estrita com Pydantic:** Utiliza Python Type Hints para garantir que os dados de entrada e saída estejam sempre no formato correto, reduzindo drasticamente erros em tempo de execução.
3.  **Documentação Automática:** Gera instantaneamente interfaces Swagger (OpenAPI) no endpoint `/docs`, facilitando o teste e a integração com o frontend.
4.  **DevOps Friendly:** A arquitetura leve do FastAPI facilita a containerização com **Docker**, alinhando-se às práticas de infraestrutura moderna.

---

## ⚙️ Como Executar (Desenvolvimento)

### Pré-requisitos
* Python 3.9+
* Pip ou Poetry

### Instalação
1. Instale as dependências:
   ```bash
   pip install -r requirements.txt
