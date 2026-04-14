# ⚖️ LegixTech - Backend Engine

Este diretório contém o núcleo de processamento, API e inteligência de dados do projeto **LegixTech**. A aplicação foi desenhada para servir como uma ponte eficiente entre dados jurídicos brutos e insights estruturados para o usuário final.

---

## 🚀 O que o Backend faz?

O backend deste projeto atua como o motor de processamento e distribuição de dados jurídicos. Suas principais responsabilidades são:

* **📥 Ingestão de Dados (Scraping/API):** Interfaces robustas para coletar ou receber dados brutos diretamente de tribunais e diários oficiais.
* **🧠 Processamento e Inteligência (NLP):** Integração de modelos de Processamento de Linguagem Natural para classificação automática de processos e sumarização de textos jurídicos complexos.
* **🔌 API RESTful:** Exposição de endpoints performáticos para que o frontend ou dashboards consumam dados filtrados em tempo real.
* **🔐 Autenticação e Segurança:** Controle de acesso granular para diferentes perfis (pesquisadores, advogados e administradores).
* **💾 Persistência de Dados:** Gerenciamento de banco de dados relacional (recomendado: PostgreSQL) para garantir a integridade das informações jurídicas.

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
