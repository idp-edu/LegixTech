# 📖 Guia de Uso — Documentos de Especificação Consolidada

## Bem-vindo! 👋

A especificação consolidada do **LegixTech** está dividida em **3 formatos** para diferentes necessidades:

---

## 📄 1. **ESPECIFICACAO_CONSOLIDADA.md** — Referência Completa

**Tipo:** Markdown detalhado  
**Público:** Desenvolvedores, QA, Product  
**Tamanho:** ~150KB (5.000+ linhas)

### Conteúdo
- ✅ Header + Overview com contexto do projeto
- ✅ Design System (cores, tipografia, espaçamento)
- ✅ **10 Use Cases** com seções estruturadas para cada:
  - Resumo executivo
  - Stats (# de RFs, RNFs, RNs, CAs)
  - **Requisitos Funcionais (RF)** — detalhados
  - **Requisitos Não-Funcionais (RNF)** — performance, acessibilidade, compatibilidade
  - **Regras de Negócio (RN)** — validações e constraints
  - **Critérios de Aceitação (CA)** — testáveis
  - Fluxos principais e alternativos
- ✅ Validações transversais
- ✅ Matriz de rastreabilidade
- ✅ Instruções para devs, QA, designers, product

### Como Usar
1. **Abra em editor Markdown** (VS Code, Obsidian, GitHub)
2. **Use Cmd+F para buscar** um RF específico (ex: "RF01", "RNF03")
3. **Acesse a TOC** para pular para UC específica
4. **Copie/passte RFs/CAs** em seus tickets de trabalho
5. **Consulte na reunião** quando discutindo implementação

### Dica
```
Para buscar rapidamente:
- "UC01" → Todas seções da UC01
- "RF15" → Requisito funcional 15
- "CA07" → Critério de aceitação 7
- "RNF03" → Req. não-funcional 3
```

---

## 🎨 2. **ESPECIFICACAO_CONSOLIDADA.html** — Versão Interativa Visual

**Tipo:** HTML autossuficiente (+ CSS + JavaScript)  
**Público:** Stakeholders, equipes visuais, apresentações  
**Tamanho:** ~200KB (pode ser aberto offline)

### Recursos
- ✅ **Design System Visual** — Paleta de cores renderizada
- ✅ **Cards Colapsáveis** — Clique em UC01-UC10 para expandir/recolher
- ✅ **Estatísticas Ao Vivo** — Badges de RF/RNF/RN/CA por UC
- ✅ **Navegação Suave** — TOC clicável com smooth scroll
- ✅ **Design Mobile-First** — Responsivo para 4.5"-6.7" screens
- ✅ **WCAG AA Compliant** — Contraste 4.5:1, tipografia acessível
- ✅ **Sem dependências externas** — CSS + JS inline

### Como Usar
1. **Abra no navegador** (chrome, firefox, safari)
2. **Clique nos títulos UC** para expandir detalhes
3. **Use a TOC** para pular diretamente a uma UC
4. **Visualize cores** do design system (paleta interativa)
5. **Exporte para PDF** (Print → Save as PDF)
6. **Compartilhe link** com stakeholders (é um `.html` único)

### Dica
```
Melhor para:
- Apresentação ao cliente
- Demonstração do design system
- Discussões visuais em reuniões
- Print para documentação física
- Offline access (salve o arquivo)
```

---

## 📊 3. **SUMARIO_EXECUTIVO.md** — Quick Reference

**Tipo:** Markdown executivo  
**Público:** Gerentes, PMs, stakeholders  
**Tamanho:** ~20KB (1.000 linhas)

### Seções
- ✅ Visão geral 1-pager
- ✅ **Quantitativo consolidado** (70 RFs, 100 CAs, etc.)
- ✅ **Tabela distribuição por UC** — esforço estimado
- ✅ **Design System resumido** — cores, tipografia, spacing
- ✅ **Performance targets** — mapa de milestones
- ✅ **Acessibilidade checklist** —WCAG AA obrigatórias
- ✅ **Arquitetura de navegação** — diagrama visual
- ✅ **Autenticação & Segurança** — estratégia
- ✅ **Notificações** — tipos e frequência
- ✅ **Chatbot IA** — capabilities e limitações
- ✅ **Testing strategy** — automação + manual
- ✅ **Roadmap sugerido** — 4 fases (8 sprints)
- ✅ **Stakeholders & responsabilidades**
- ✅ **Checklist pré-desenvolvimento**

### Como Usar
1. **Abra para apresentação ao board**
2. **Use para planejamento de sprints** — veja esforço por UC
3. **Compartilhe com stakeholders** para buy-in rápido
4. **Imprima como 1-pager** para reuniões
5. **Consulte para fazer estimativas** (RF/RNF/RN distribuição)

### Dica
```
Melhor para:
- Executive summary
- Sprint planning (priorização)
- Roadmap presentation
- Stakeholder alignment
- Resource estimation
```

---

## 🔄 Fluxo Recomendado por Perfil

### 👨‍💼 **Product Manager / Stakeholder**
```
1. Leia SUMARIO_EXECUTIVO.md (5 min)
   → Entenda o escopo global e roadmap
2. Visualize ESPECIFICACAO_CONSOLIDADA.html (10 min)
   → Veja design system e arquitetura
3. Consulte ESPECIFICACAO_CONSOLIDADA.md (as needed)
   → Aprofunde em detalhes específicos
```

### 👨‍💻 **Desenvolvedor Frontend**
```
1. Visualize ESPECIFICACAO_CONSOLIDADA.html
   → Design system, cores, tipografia, componentes
2. Abra ESPECIFICACAO_CONSOLIDADA.md
   → RF/RNF para sua UC
3. Copie CAs para seu ticket de trabalho
   → Use como critério de sucesso
```

### 👱 **Desenvolvedor Backend**
```
1. Leia SUMARIO_EXECUTIVO.md
   → Entenda escopo e RNFs de performance
2. Abra ESPECIFICACAO_CONSOLIDADA.md
   → RFs que exigem APIs (ex: RF06, RF30, RF39)
3. Extraia validações (RNs)
   → Business rules para implementar
```

### 🧪 **QA / Tester**
```
1. Abra ESPECIFICACAO_CONSOLIDADA.md
   → Copie todos os CAs da sua UC
2. Crie test cases (1 test por CA)
3. Use SUMARIO_EXECUTIVO.md
   → Performance targets, WCAG checklist
4. Valide contra HTML visual
   → Verifique design system compliance
```

### 🎨 **Designer / UX**
```
1. Visualize ESPECIFICACAO_CONSOLIDADA.html
   → Design system cores, tipografia, spacing
2. Leia SUMARIO_EXECUTIVO.md
   → Acessibilidade (WCAG AA), responsividade
3. Consulte ESPECIFICACAO_CONSOLIDADA.md
   → RNFs relacionadas a UI (RNF01, RNF02, RNF12, etc.)
```

---

## 🔍 Como Localizar Informações

### Buscando um Requisito Específico?

| Se você procura... | Documento | Busque por |
|------------------|-----------|-----------|
| RF01 | MD ou HTML | "RF01" |
| CA15 | MD | "CA15" ou "Given/When/Then" |
| Design system cores | HTML visual | Seção "Design System" |
| Performance targets | Sumário | "Performance Targets" |
| WCAG requirements | MD + Sumário | "Acessibilidade" |
| Estatísticas por UC | Sumário (tabela) | "Distribuição por UC" |
| Fluxo alternativo | MD | "Fluxo Alternativo" |
| Validações | MD | "5. Validações" |
| Roadmap | Sumário | "Roadmap Sugerido" |

---

## 💡 Dicas de Colaboração

### 1️⃣ **Compartilhar com Equipes**

```bash
# Markdown (para GitHub/Gitlab)
git push docs/ESPECIFICACAO_CONSOLIDADA.md

# HTML (para navegador)
# → Copie o arquivo .html para servidor web
# → Acesse em https://seu-dominio.com/especificação

# PDF (por via HTML)
# → Abra .html → Print → Save as PDF → Compartilhe
```

### 2️⃣ **Integrar com Jira/Azure DevOps**

```
Para cada UC:
1. Crie Feature/Epic com nome e descrição
2. Crie sub-task para cada RF
3. Link CAs como "Acceptance Criteria"
4. Copy RNFs para "Non-Functional Requirements"

Exemplo Jira:
Epic: UC01 — Acessar Resumo Simples
├─ Story RF01: "Renderizar aba 'Entenda a Lei'"
│  └─ Acceptance: CA01 + CA02 + validation V01
├─ Story RF02: "Exibir bloco 'O Resumo'"
│  └─ Acceptance: CA02 + CA03
└─ RNF01: "Acessibilidade WCAG 2.1 AA"
```

### 3️⃣ **Validação com Stakeholders**

```
Reunião de kickoff:
1. Apresente SUMARIO_EXECUTIVO.md (5 min)
2. Mostre ESPECIFICACAO_CONSOLIDADA.html (10 min)
3. Pergunte: "Está alinhado com o roadmap?"
4. Colete feedback
5. Atualize docs se necessário
```

### 4️⃣ **Controle de Versão**

```bash
# Versione os docs como código
git add docs/ESPECIFICACAO_CONSOLIDADA.*
git add docs/SUMARIO_EXECUTIVO.md
git commit -m "docs: Especificação v1.0 — 10 UCs consolidadas"
git tag -a v1.0-spec -m "Production-ready specification"

# Se houver mudanças
git commit -m "docs: UC01 RF05 refinement — link validation"
git tag v1.0-patch1-spec
```

---

## ⚡ Quick Start Checklist

Você tem tudo o que precisa para começar o desenvolvimento:

- ✅ **Arquivo 1:** `ESPECIFICACAO_CONSOLIDADA.md` — Guia técnico completo
- ✅ **Arquivo 2:** `ESPECIFICACAO_CONSOLIDADA.html` — Visualização interativa
- ✅ **Arquivo 3:** `SUMARIO_EXECUTIVO.md` — 1-pager executivo

### Próximos passos
- [ ] Abra os 3 documentos e familiarize-se
- [ ] Compartilhe HTML com stakeholders
- [ ] Importar CAs para sistem de tracking (Jira)
- [ ] Schedule kickoff meeting com design system
- [ ] Inicie Sprint 1 (UC04, UC03, UC08)

---

## 🆘 Dúvidas Frequentes

**P: Qual arquivo devo usar para apresentar ao board?**  
R: `ESPECIFICACAO_CONSOLIDADA.html` — abra no navegador e maximize. É visual, interativo e responsivo.

**P: Como fazer tracking de implementação?**  
R: Use `ESPECIFICACAO_CONSOLIDADA.md` para copiar RFs/CAs. Crie tickets em Jira/Azure DevOps com os CAs como "Acceptance Criteria".

**P: Posso editar os documentos?**  
R: Sim! São plain text (Markdown) + HTML. Atualize conforme modelo evolua. Considere versionamento (`v1.1`, `v1.2`).

**P: Como imprimir para documentação física?**  
R: Abra `.html` no navegador → Print (Ctrl+P) → Save as PDF. A CSS já está otimizada para print.

**P: Posso usar sem internet?**  
R: Sim! Baixe os 3 arquivos localmente. O `.html` é autossuficiente (sem CDNs externos).

**P: Como rastrear progresso vs. 100 CAs?**  
R: Crie uma planilha (Google Sheets/Excel) com lista de 100 CAs. Marque como ✅/❌ conforme são implementadas e testadas.

---

## 📞 Suporte

**Dúvidas sobre a especificação?**  
→ Entre em contato com o time de Product (product@legixtech.dev)

**Como reportar um erro/inconsistência?**  
→ Abra uma issue no repositório com tag `[spec]`

**Precisa de uma alteração/refinement?**  
→ Revise com o Product Manager; criaremos versão atualizada (`v1.1`, etc.)

---

**🎉 Você está pronto para começar!**

Escolha seu documento e comece agora:

1. **📄 [Abra ESPECIFICACAO_CONSOLIDADA.md](ESPECIFICACAO_CONSOLIDADA.md)** — Detalhes técnicos
2. **🎨 [Abra ESPECIFICACAO_CONSOLIDADA.html](ESPECIFICACAO_CONSOLIDADA.html)** — Visualização interativa
3. **📊 [Abra SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md)** — Resumo para stakeholders

---

**Última atualização:** 13 de Abril, 2026  
**Status:** ✅ Todos os documentos prontos para uso  

**Boa sorte com o desenvolvimento! 🚀**
