# 📌 Guia de Boas Práticas para Issues

Este documento define **como criar issues claras, organizadas e acionáveis** no projeto

O objetivo é:
- facilitar manutenção
- evitar retrabalho
- preservar histórico de decisões
- manter evolução consistente do projeto

> **Antes de abrir uma issue, leia este guia.**

---

## 1️⃣ Quando abrir uma issue

Abra uma issue quando:
- houver um **bug real** (especialmente em produção)
- for necessário implementar uma **feature clara**
- existir uma **dívida técnica relevante**
- for preciso documentar um problema técnico

❌ Não abra issue para:
- ideias vagas
- anotações pessoais
- dúvidas rápidas

---

## 2️⃣ Padrão de Títulos (OBRIGATÓRIO)

### 🎯 Formato padrão

[CRITICIDADE] [Scope]: <ação/problema> <contexto> [detalhe técnico]


### Criticidade (obrigatória)
Use **exatamente um** dos níveis abaixo:

- `[LOW]` — impacto pequeno, UX ou melhoria
- `[MEDIUM]` — impacto funcional limitado
- `[HIGH]` — impacto funcional relevante ou produção
- `[CRITICAL]` — segurança, vazamento de dados ou corrupção

---

### Scopes permitidos
Use **sempre um** dos prefixos abaixo:

- `Auth:` — autenticação, login, signup, tokens
- `Backend:` — Django, DRF, regras de negócio
- `Frontend:` — React, UI, formulários
- `Jobs:` — cron, GitHub Actions, automações
- `Database:` — schema, migrations, queries
- `Infra:` — deploy, Render, env vars
- `Security:` — isolamento, permissões, vazamentos
- `Docs:` — documentação
- `Enhancement:` — melhorias e novas features

---

### Exemplos corretos
- `[HIGH] Jobs: Monthly snapshot job fails in production due to NULL created_at`
- `[CRITICAL] Security: Users can access data from other accounts`
- `[MEDIUM] Frontend: Transaction modal closes without success feedback`
- `[LOW] Docs: Improve README setup instructions`

### ❌ Exemplos incorretos
- `Bug no job`
- `Erro estranho`
- `Jobs: não funciona`
- `[HIGH] Erro`

---

## 3️⃣ Milestones (OBRIGATÓRIO para issues relevantes)

Toda issue que:
- afeta produção
- afeta dados
- afeta segurança
- representa entrega funcional  

➡️ **PODE estar associada a uma milestone**.

❗ Regras:
- Uma issue pertence a **uma única milestone**
- Se não couber em uma → a issue está grande demais

---

## 4️⃣ Labels (OBRIGATÓRIO)

### Labels por escopo (sugeridas)
| Scope | Labels |
|----|------|
| `Auth:` | `auth`, `backend`, `security` |
| `Backend:` | `backend` |
| `Frontend:` | `frontend` |
| `Jobs:` | `jobs`, `deploy` |
| `Database:` | `database` |
| `Infra:` | `database`, `deploy` |
| `Security:` | `security` |
| `Docs:` | `docs` |
| `Enhancement:` | `enhancement` |

---

## 5️⃣ Checklist antes de abrir uma issue

```txt
[ ] Criticidade definida ([LOW|MEDIUM|HIGH|CRITICAL])
[ ] Scope definido no título
[ ] Verbo claro no título (fails, add, refactor, improve)
[ ] Milestone definida (opcional)
[ ] Labels adicionadas
[ ] Descrição clara do problema ou objetivo
