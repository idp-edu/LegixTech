# 📊 Sumário Executivo — Especificação Consolidada LegixTech

## 🎯 Visão Geral

| Métrica | Valor |
|---------|-------|
| **Projeto** | LegixTech — Monitoramento Legislativo Mobile |
| **Escopo** | 10 Use Cases (UC01–UC10) |
| **Status** | ✅ Especificação Completa |
| **Público** | Estudantes, Servidores Públicos, Cidadãos |
| **Platform** | iOS 13+ / Android 8+ |
| **Data** | 13 de Abril, 2026 |

---

## 📈 Quantitativo de Requisitos

```
┌─────────────────────────────────────────┐
│ Total de Requisitos Especificados      │
├─────────────────────────────────────────┤
│ Requisitos Funcionais (RF)     ~70     │
│ Requisitos Não-Funcionais     ~45     │
│ Regras de Negócio (RN)         ~35     │
│ Critérios de Aceitação (CA)   ~100    │
│                                        │
│ TOTAL: ~250 requisitos rastreáveis   │
└─────────────────────────────────────────┘
```

---

## 🗂️ Distribuição por Use Case

| UC | Título | RF | RNF | RN | CA | Prioridade |
|----|--------|----|----|----|----|-----------|
| **UC01** | Acessar Resumo Simples | 8 | 6 | 5 | 11 | 🔴 Alta |
| **UC02** | Salvar Projetos | 7 | 5 | 4 | 9 | 🟡 Média |
| **UC03** | Navegação Intuitiva | 6 | 5 | 3 | 8 | 🔴 Alta |
| **UC04** | Fazer Login | 8 | 6 | 4 | 10 | 🔴 Alta |
| **UC05** | Notificações | 9 | 7 | 5 | 11 | 🟡 Média |
| **UC06** | Busca & Filtros | 8 | 6 | 4 | 10 | 🟡 Média |
| **UC07** | Histórico de Votações | 7 | 5 | 4 | 9 | 🟢 Baixa |
| **UC08** | Onboarding | 7 | 5 | 3 | 8 | 🟡 Média |
| **UC09** | Resumo Diário | 7 | 6 | 4 | 9 | 🟢 Baixa |
| **UC10** | Chatbot | 8 | 7 | 5 | 10 | 🟢 Baixa |
| **TOTAL** | | **70** | **45** | **35** | **100** | |

---

## 🎨 Design System — Pilares

### Cores (Paleta Unificada)

```
🟦 Primary Blue:        #1e40af  (Headings, CTAs)
🟩 Civic Green:         #15803d  (Acceptance, Success)
⬜ Clean White:         #ffffff  (Background)
⬜ Soft Gray:           #f9fafb  (Card Surfaces)
⬜ Text Primary:        #111827  (Content)
⬜ Text Secondary:      #475569  (Descriptions)
```

### Tipografia

```
Body Font:      Sistema padrão (San-serif)
Font Size:      14px-16px (mínimo acessível: 16px)
Line Height:    1.5 (readability)
Heading:        h1, h2, h3 (semantic hierarchy)
Contrast:       ≥ 4.5:1 (WCAG 2.1 AA)
```

### Espaçamento & Layout

```
Card Padding:       16px
Card Margin:        16px
Border Radius:      8px
Touch Targets:      ≥ 44×44px
Max Width Mobile:   600px
Max Width Tablet:   800px
```

---

## 🚀 Performance Targets

| Métrica | Target | Validação |
|---------|--------|-----------|
| **Page Load** | ≤ 800ms | Lighthouse, DevTools |
| **API Response** | ≤ 500ms (resumo) | Network monitoring |
| **Redirect** | ≤ 1.5s (portal oficial) | Manual testing |
| **Transition** | ≤ 300ms (animações) | Frame rate (60fps) |
| **Push Notification** | ≤ 2min (disparo) | Firebase/APNs logs |
| **Autocomplete** | ≤ 300ms (3+ chars) | Performance testing |
| **Offline List** | Immediate (cache) | Local DB verification |

---

## ♿ Acessibilidade (WCAG 2.1 AA Compliance)

### Checklist Obrigatório

- ✅ **Contraste:** 4.5:1 mínimo para texto; 3:1 para elementos gráficos
- ✅ **Tipografia:** Font ≥ 16px body; line-height ≥ 1.5
- ✅ **Navegação:** Keyboard accessible; Tab order lógico
- ✅ **Screen Reader:** aria-labels, aria-live regions, semantic HTML
- ✅ **Focus:** Focus ring visível; não ocultar via CSS
- ✅ **Color:** Cores + ícones (não color-only)
- ✅ **Motion:** Respeitar `prefers-reduced-motion`
- ✅ **Forms:** Labels explícitos; erro messages claras
- ✅ **Images:** Alt text; SVGs labeled
- ✅ **Responsivity:** Sem horizontal scroll; touch ≥ 44px

### Validação Automatizada

```bash
# Ferramentas Recomendadas
✓ axe DevTools (browser extension)
✓ Lighthouse (in DevTools)
✓ WAVE (web accessibility eval)
✓ Automated WCAG scanning (CI/CD)
```

---

## 🔀 Arquitetura de Navegação

```
┌─────────────────────────────────────────┐
│           HOME (Hub Central)            │
├──────────┬──────────┬──────────┬────────┤
│ Busca    │ Salvos   │ Perfil   │ Resumo │
│ Rápida   │ Projetos │ & Config │ Diário │
└──────────┴──────────┴──────────┴────────┘
     ↓          ↓          ↓          ↓
 Detalhes   Detalhes   Settings   Stories
  da Lei    da Lei    Notif.     (Swipe)
     ↓
  Chatbot
 (Overlay)
  Histórico
  Votações
```

**Máximo 3 níveis de profundidade** (Home → Seção → Detalhe)

---

## 📱 Responsividade — Devices

| Device | Screen | Tipografia | Layout |
|--------|--------|-----------|--------|
| **Small Phone** | 4.5" | 16px fixed | Single column |
| **Regular Phone** | 5.5" | 16px fixed | Single column |
| **Large Phone** | 6.7" | 16px fixed | Single column + margins |
| **Tablet** | 7"-10" | 16px fixed | 2-column (optional) |

**Mobile-First:** Todos os componentes otimizados para toque 44×44px

---

## 🔐 Autenticação & Segurança

### Métodos Suportados

1. **Google OAuth** (UX primária)
   - Sem digitar senha
   - Seleção de conta nativa do OS
   - Token armazenado em Keychain/Keystore

2. **Biometria** (Face ID / Fingerprint)
   - iOS 13+: Face ID
   - Android 8+: Fingerprint

3. **Visitante** (Limited Access)
   - Sem Salvar, Notificações, Comentários
   - Máximo 24h ou até logout

### Segurança

- ✅ Token OAuth renovação a cada 30 dias
- ✅ Local encryption (keychain)
- ✅ HTTPS only para APIs
- ✅ Sem armazenamento de passwords

---

## 📢 Notificações — Estratégia

### Tipos Suportados

| Tipo | Frequency | Trigger | Opt-in |
|------|-----------|---------|--------|
| Projeto Salvos | Real-time | Status mudou | Yes |
| Temas de Interesse | 1x/dia | Novo projeto || Tema | Yes |
| Resumo Diário | Agendado | 8h AM (customizável) | Yes |
| Push Geral | Ad-hoc | Evento importante | N/A |

### Throttle

- **Máximo 3 notificações/dia** por usuário
- **Quiet hours:** Customizável (ex: 22h-8h, sem notifs)
- **Histórico:** Último 30 dias acessível in-app

---

## 🤖 Chatbot IA — Specs

### Capabilities

- ✅ Responder perduntas sobre termos legislativos
- ✅ Explicar status de projetos
- ✅ Traduzir jargão jurídico em linguagem simples
- ✅ Fornecer sugestões baseadas em contexto

### Limitações

- ❌ Não recomenda voto
- ❌ Não faz consultoria jurídica
- ❌ Máximo 50 mensagens/sessão

### Performance

- **Resposta:** ≤ 5 segundos
- **Modelo:** Treinado com contexto BR legislativo
- **Acurácia:** Mínimo 85%

### Feedback Loop

- 👍 / 👎 em cada resposta
- Respostas negativas → Queue manual review

---

## 🧪 Testing Strategy

### Testes Automáticos

| Tipo | Cobertura | Tools |
|------|-----------|-------|
| Unit | 80%+ | Jest, Vitest |
| Integration | 70%+ | Cypress, Detox |
| Visual | Regression | Percy, Chromatic |
| Acessibilidade | 100% CAs | axe, Lighthouse |
| Performance | Device simulation | Lighthouse, DevTools |

### Testes Manuais

- **Functional Testing:** Todos CAs por UC
- **Usability:** 5 usuários por persona (estudante, servidor, idoso)
- **Mobile:** iOS + Android (real devices, emulators)
- **Offline:** Sync, fallbacks, error states
- **Security:** Auth flows, token handling

### QA Checklist por Release

```
☐ Todos 100 CAs validados
☐ WCAG AA score ≥ 95% (axe)
☐ Performance targets met (≤500ms upload)
☐ Zero critical bugs
☐ Offline flows functional
☐ Notificação delivery ≥ 98%
☐ Localization (pt-BR) completo
☐ Privacy policy aligned
```

---

## 📅 Roadmap Sugerido (Sprint-based)

### Phase 1: Auth & Navigation (Sprint 1-2)
- UC04 (Login)
- UC03 (Navegação)
- UC08 (Onboarding)

### Phase 2: Core Content (Sprint 3-4)
- UC01 (Resumo Simples)
- UC06 (Busca)
- UC02 (Salvar)

### Phase 3: Engagement (Sprint 5-6)
- UC05 (Notificações)
- UC09 (Resumo Diário)

### Phase 4: Advanced (Sprint 7-8)
- UC07 (Histórico Votações)
- UC10 (Chatbot)

---

## 📞 Stakeholders & Responsabilidades

| Role | Responsabilidade | Artefatos |
|------|------------------|-----------|
| **Product Manager** | Priortizar UCs; roadmap | Use Cases, docs |
| **UX/Design** | Design system; protótipos | Figma file, specs |
| **Frontend Dev** | Implementar UI/UX | React/React Native code |
| **Backend Dev** | APIs, BD, auth | OpenAPI, DB schema |
| **QA** | Validar CAs; bugs | Test cases, evidence |
| **Infra/DevOps** | Deploy, monitoring | CI/CD, metrics |

---

## 📋 Deliverables

### Documentation

- ✅ **ESPECIFICACAO_CONSOLIDADA.md** — Markdown completo (250+ requisitos)
- ✅ **ESPECIFICACAO_CONSOLIDADA.html** — Versão interativa visual
- ✅ **SUMARIO_EXECUTIVO.md** — Este documento (quick ref)

### Configuration (Exemplo)

```yaml
# product-spec.yaml
project:
  name: LegixTech
  version: 1.0
  status: ready_for_development

design_system:
  colors:
    primary_blue: "#1e40af"
    civic_green: "#15803d"
  typography:
    body_min: 16px
    line_height: 1.5
  accessibility:
    wcag_level: AA
    contrast_min: 4.5

ucs:
  - id: UC01
    title: Acessar Resumo Simples
    rfs: 8
    rnfs: 6
    rns: 5
    cas: 11
    priority: high
  # ... (9 mais)

metrics:
  total_rfs: 70
  total_cas: 100
  coverage_target: 100%
```

---

## ✅ Checklist Pré-Desenvolvimento

- [ ] Todos stakeholders têm acesso aos 3 documentos (MD, HTML, Sumário)
- [ ] Design system implementado em Figma/XD
- [ ] BD schema alinhado com RFs
- [ ] API contracts definidas (OpenAPI)
- [ ] Tool de tracking (Jira/Azure DevOps) configurada com CAs
- [ ] CI/CD pipelines com validação WCAG
- [ ] Testing environment setup (emulators, devices)
- [ ] Comunicação de roadmap aos usuários alpha

---

## 🎉 Próximos Passos

1. **Kickoff Meeting** — Apresentar especificação aos times
2. **Design Sprint** — Implementar design system
3. **Sprint Planning** — Quebrar UCs em features/tasks
4. **Start Development** — Phase 1 (Auth + Nav)
5. **Monitoring** — Rastrear progress vs. 100 CAs

---

## 📚 Referências

- **WCAG 2.1 AA:** https://www.w3.org/WAI/WCAG21/quickref/
- **Mobile UX Patterns:** https://mobbin.com
- **Design System:** material.io, tailwindcss.com
- **Performance Budgets:** web.dev/performance

---

**Última Atualização:** 13 de Abril, 2026  
**Versão:** 1.0  
**Status:** ✅ Aprovado para Desenvolvimento  

**Dúvidas?** Entre em contato com o time de Product.

---

## 📎 Apêndice — Matriz de Rastreabilidade (Resumida)

```
UC01 (Resumo Simples)
│
├─ RF01-RF08 (Renderização, Link, Erro)
├─ RNF01-RNF06 (Acessibilidade, Legibilidade, Performance)
├─ RN01-RN05 (3 parágrafos, URL dinâmica)
└─ CA01-CA11 (11 critérios de aceita­ção)

UC02 (Salvar Projetos)
│
├─ RF09-RF15 (Salvar, Sincronizar, Remover)
├─ RNF07-RNF11 (Performance, Offline, Armazenamento)
├─ RN06-RN09 (Empty state, Status update)
└─ CA07-CA10 (4 critérios principais)

[... (8 UCs adicionais com padrão similar)]

UC10 (Chatbot)
│
├─ RF68-RF75 (Float button, Chat UI, Respostas, Avaliação)
├─ RNF52-RNF58 (IA/ML, Performance, Privacy)
├─ RN37-RN41 (Auth-only, Limits, Feedback)
└─ CA47-CA53 (10 critérios de aceita­ção)
```

---

**🚀 Especificação Consolidada Pronta para Desenvolvimento — 13 Abr 2026**
