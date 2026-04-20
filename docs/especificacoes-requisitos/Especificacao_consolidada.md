# 📋 Especificação de Requisitos Consolidada — LegixTech
## Monitoramento Legislativo Mobile — 10 Funcionalidades | Completo e Detalhado

---

## 📊 Visão Geral do Projeto

### Context & Guiding Principles
- **Domínio:** Monitoramento legislativo mobile
- **Público:** Estudantes universitários, servidores públicos e cidadãos
- **Princípios Orientadores:**
  - ✅ Linguagem clara, sem jargão jurídico
  - ✅ Navegação intuitiva e responsiva
  - ✅ Acessibilidade em primeiro lugar (WCAG 2.1 AA mínimo)
  - ✅ Performance otimizada para iOS e Android

### 📈 Estatísticas Globais
| Métrica | Quantidade |
|---------|-----------|
| **Total de Use Cases** | 10 |
| **Total de Requisitos Funcionais (RF)** | ~70 |
| **Total de Requisitos Não-Funcionais (RNF)** | ~45 |
| **Total de Regras de Negócio (RN)** | ~35 |
| **Total de Critérios de Aceitação (CA)** | ~100 |

### 🎯 Tabela de Conteúdos — Pule para uma UC
| UC | Título | Status |
|----|----|--------|
| [UC01](#uc01) | Acessar Resumo Simples e Impacto | ✅ Especificado |
| [UC02](#uc02) | Salvar Projetos na Lista de Monitoramento | ✅ Especificado |
| [UC03](#uc03) | Navegação Básica Intuitiva | ✅ Especificado |
| [UC04](#uc04) | Fazer Login no Aplicativo | ✅ Especificado |
| [UC05](#uc05) | Configurar e Receber Notificações | ✅ Especificado |
| [UC06](#uc06) | Buscar Conteúdo Rápido e Filtrar | ✅ Especificado |
| [UC07](#uc07) | Visualizar Histórico de Votações de Políticos | ✅ Especificado |
| [UC08](#uc08) | Utilizar o Aplicativo Fácil / Onboarding | ✅ Especificado |
| [UC09](#uc09) | Acessar Resumo Diário | ✅ Especificado |
| [UC10](#uc10) | Consultar o Chatbot para Dúvidas | ✅ Especificado |

---

## 🎨 Design System

### Color Palette
```
Background Clean:        #ffffff (White)
Surface Primary:         #f9fafb (Soft Gray)
Primary Accent:          #1e40af (Legislative Blue)
Secondary Accent:        #15803d (Civic Green)
Text Primary:            #111827 (Near Black)
Text Secondary:          #475569 (Slate)
Text Tertiary:           #9ca3af (Gray)
```

### Typography & Spacing
- **Font Family:** Sans-serif (system font)
- **Body Font Size:** 14px–16px (minimum 16px accessible)
- **Line Height:** 1.5
- **Heading Hierarchy:** h1, h2, h3 semantic structure
- **Card Padding:** 16px
- **Card Margin:** 16px
- **Card Border Radius:** 8px
- **Contrast Ratio:** ≥ 4.5:1 (WCAG AA minimum)

### Touch Targets & Mobile
- **Minimum Touch Size:** 44×44px
- **Responsive Breakpoints:** 4.5" to 6.7" screens
- **Max Content Width:** 600px (mobile), 800px (tablet)
- **No Horizontal Scroll**

---

<div id="uc01"></div>

## UC01 — Acessar Resumo Simples e Impacto

**👤 Ator Principal:** Estudante Universitário (ex: Lucas Mendes)  
**🎯 Objetivo:** Compreender o impacto prático de uma lei em máximo 3 parágrafos, sem termos jurídicos complexos

---

### 📌 Resumo Executivo
Esta funcionalidade permite que usuários acessem de forma rápida e clara o conteúdo e impacto de projetos de lei. Reduz a barreira de entrada ao conhecimento legislativo, condensando documentos complexos em informação prática e acionável.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 8 |
| **Requisitos Não-Funcionais** | 6 |
| **Regras de Negócio** | 5 |
| **Critérios de Aceita­ção** | 11 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF01** | O sistema DEVE renderizar, por padrão na tela de detalhes de lei, a aba "Entenda a Lei" como ativa |
| **RF02** | O sistema DEVE exibir o bloco "O Resumo" contendo exatamente 3 parágrafos sequenciais |
| **RF03** | O sistema DEVE ocultar o texto integral da lei (renderizá-lo apenas quando usuário solicitar via menu colapsável) |
| **RF04** | O sistema DEVE exibir, imediatamente após "O Resumo", o bloco "Quem é afetado?" com lista de grupos/setores impactados em bullet points |
| **RF05** | O sistema DEVE disponibilizar link rotulado "Acessar Texto Oficial" ao final do conteúdo |
| **RF06** | Ao clicar em "Acessar Texto Oficial", o sistema DEVE redirecionar para portal oficial via browser nativo ou in-app webview |
| **RF07** | O sistema DEVE tratar falhas de API e exibir mensagem de erro amigável quando recurso ficar indisponível |
| **RF08** | O sistema DEVE manter scroll fluido entre blocos (lazy-load ou carregamento préemptivo) |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF01** | Acessibilidade | Textos DEVEM atender WCAG 2.1 AA mínimo; contraste ≥ 4.5:1; estrutura semântica clara para leitores de tela |
| **RNF02** | Legibilidade | Fonte ≥ 16px em resumo; line-height ≥ 1.5; palavras por linha ≤ 80; sem jargão jurídico |
| **RNF03** | Performance | Carregamento de resumo ≤ 500ms em conexão 4G; redirecionamento ≤ 1.5s |
| **RNF04** | Compatibilidade | Suporte iOS 13+ e Android 8+ (ou versões atuais do suporte) |
| **RNF05** | Responsividade | Layout otimizado para screens 4.5" a 6.7"; texto redimensionável via sistema operacional |
| **RNF06** | Confiabilidade | Tratamento de timeout de API (espera mínima 3s antes de mensagem de erro) |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN01** | Um resumo DEVE conter exatamente 3 parágrafos; nenhum DEVE exceder 120 caracteres |
| **RN02** | A lista "Quem é afetado?" DEVE conter entre 2 e 8 bullet points (sem subitens) |
| **RN03** | Nenhum parágrafo DEVE conter jargão jurídico sem explicação; usar glossário inline se necessário |
| **RN04** | O link "Acessar Texto Oficial" DEVE validar disponibilidade antes de redirecionar |
| **RN05** | Portal URL é dinâmico conforme tipo (Câmara/Senado); mapear corretamente por metadata |

---

### ✅ Critérios de Aceitação (Principais — Ver Todos +11)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA01** | Projeto com resumo disponível | Usuário abre tela de detalhes | Aba "Entenda a Lei" renderizada como ativa |
| **CA02** | Aba "Entenda a Lei" ativa | Página carrega | Bloco "O Resumo" exibe 3 parágrafos ≤ 120 chars |
| **CA03** | Bloco "O Resumo" renderizado | Usuário rola página | Bloco "Quem é afetado?" aparece com 2-8 bullet points |
| **CA05** | Link "Acessar Texto Oficial" disponível | Usuário toca no link | URL abre em ≤ 1.5s sem erros |
| **CA06** | API do governo indisponível | Usuário toca "Acessar Texto Oficial" | Mensagem de erro em ≤ 3-4s |

---

### 🔀 Fluxos Principais

**Happy Path:**
1. Usuário abre projeto de lei
2. Aba "Entenda a Lei" é exibida por padrão
3. Resumo com 3 parágrafos carrega
4. Usuário rola e vê "Quem é afetado?"
5. Clica em "Acessar Texto Oficial" → portal abre em browser/webview

**Fluxo Alternativo — API Indisponível:**
1. Usuário toca "Acessar Texto Oficial"
2. API falha (timeout ou erro 5XX)
3. Sistema exibe: "O documento original está indisponível. Tente novamente mais tarde."

---

<div id="uc02"></div>

## UC02 — Salvar Projetos na Lista de Monitoramento

**👤 Ator Principal:** Servidora Pública (ex: Carla Figueiredo)  
**🎯 Objetivo:** Salvar projetos específicos para não perdê-los de vista em meio à vasta produção legislativa

---

### 📌 Resumo Executivo
Permite que usuários salvem projetos para acompanhamento futuro, centralizando em um ambiente de fácil acesso projetos de alto valor. Essencial para cidadãos e profissionais de interesse em temas específicos.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 7 |
| **Requisitos Não-Funcionais** | 5 |
| **Regras de Negócio** | 4 |
| **Critérios de Aceitação** | 9 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF09** | O sistema DEVE exibir botão "Salvar para Acompanhar" na tela de detalhes de lei |
| **RF10** | Ao clicar no botão, o sistema DEVE salvar o projeto na lista pessoal do usuário |
| **RF11** | O sistema DEVE exibir notificação visual de confirmação: "Projeto salvo no seu Perfil" |
| **RF12** | O sistema DEVE fornecer acesso à seção "Projetos Salvos" via menu Perfil |
| **RF13** | O sistema DEVE exibir lista de projetos salvos com status mais recente de cada um |
| **RF14** | O sistema DEVE permitir remover projetos da lista de salvos (botão/swipe) |
| **RF15** | O sistema DEVE sincronizar projetos salvos entre múltiplos dispositivos (se user autenticado) |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF07** | Performance | Salvar projeto ≤ 1s; carregamento lista ≤ 800ms |
| **RNF08** | Offline Support | Listar projetos salvos offline; sincronizar quando online |
| **RNF09** | Armazenamento | Suporte mínimo 100 projetos salvos por usuário |
| **RNF10** | Interface | Botão "Salvar" ≥ 44px (touch target); mudança visual imediata (cor/ícone) |
| **RNF11** | Acessibilidade | Notificação anunciada para screen reader; aria-live region |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN06** | Um projeto PODE ser salvo/dessalvo múltiplas vezes sem limite |
| **RN07** | Seção "Projetos Salvos" vazia DEVE exibir empty state com ícone + mensagem sugestiva |
| **RN08** | Remover projeto não DEVE enviar notificação; apenas local DB update |
| **RN09** | Status do projeto DEVE atualizar dentro de 24h em "Projetos Salvos" |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA07** | Usuário na tela de detalhes de lei | Toca botão "Salvar para Acompanhar" | Botão muda cor; notificação "Projeto salvo" exibida |
| **CA08** | Projeto salvo anteriormente | Usuário abre "Projetos Salvos" | Projeto aparece na lista com status atual |
| **CA09** | Lista vazia de salvos | Usuário acessa "Projetos Salvos" | Empty state com mensagem: "Você ainda não salvou..." |
| **CA10** | Projeto na lista de salvos | Usuário remove (swipe/botão) | Projeto desaparece; ação confirmada |

---

### 🔀 Fluxos Principais

**Happy Path:**
1. Usuário está em tela de detalhes de lei
2. Toca "Salvar para Acompanhar"
3. Cor botão muda; notificação verde confirma
4. Acessa menu Perfil → "Projetos Salvos"
5. Projeto aparece na lista com status

**Fluxo Alternativo — Lista Vazia:**
1. Usuário sem projetos salvos acessa "Projetos Salvos"
2. Tela exibe ilustração + texto guia
3. Botão "Começar a Salvar" redireciona para busca

---

<div id="uc03"></div>

## UC03 — Navegação Básica Intuitiva

**👤 Ator Principal:** Aposentada (ex: Dona Maria Lúcia)  
**🎯 Objetivo:** Navegar pelo aplicativo acessando funcionalidades-chave com o mínimo de toques possíveis

---

### 📌 Resumo Executivo
Garante que a navegação seja intuitiva e acessível para usuários de todas as idades e habilidades técnicas. Arquitetura simples com ícones claros e ações de volta fluidas.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 6 |
| **Requisitos Não-Funcionais** | 5 |
| **Regras de Negócio** | 3 |
| **Critérios de Aceitação** | 8 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF16** | O sistema DEVE exibir bottom navigation (rodapé) com 4 ícones principais: Home, Busca, Salvos, Perfil |
| **RF17** | O sistema DEVE fornecer botão "Voltar" grande e evidente (seta) no canto superior esquerdo de cada tela secundária |
| **RF18** | O sistema DEVE manter posição de scroll ao voltar para a tela anterior |
| **RF19** | Botões de ação (CTA) DEVEM ser amplos: mínimo 44×44px com texto legível |
| **RF20** | O sistema DEVE evitar sobreposição de telas (stack); preferir transições laterais/verticais claras |
| **RF21** | O sistema DEVE animação de transição entre telas ≤ 300ms (não deve parecer travado) |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF12** | Usabilidade | Bottom nav sticky (sempre visível); ícones ≥ 24px |
| **RNF13** | Tipografia | Rótulos de ícones ≥ 12px; sem abreviações confusas |
| **RNF14** | Contraste | Ícone ativo vs inativo diferenciado por cor + símbolo (não só cor) |
| **RNF15** | Acessibilidade | Ícones com aria-label; navegação por Tab entre 4 ícones |
| **RNF16** | Transição | Animações suave; sem piscadas ou jumps; respeitar preferência aciona-se(prefers-reduced-motion) |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN10** | Navigation stack NÃO DEVE exceder 3 níveis de profundidade (Home → Categoria → Detalhe) |
| **RN11** | Ícone ativo DEVE ser destacado por cor (#1e40af) + símbolo visual diferente |
| **RN12** | Seta "Voltar" DEVE voltar à tela anterior, não sempre para Home |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA11** | Usuário na tela inicial (Home) | Visualiza interface | Bottom nav com 4 ícones em sticky position |
| **CA12** | Usuário clica em card de projeto | Navega para detalhes | Seta "Voltar" aparece no topo; animação suave |
| **CA13** | Usuário toca seta "Voltar" | Retorna à tela anterior | Scroll posição restaurada; sem reload |
| **CA14** | Telas secundárias abertas | Se toca ícone bottom nav | Transição clara; sem sobreposição de telas |

---

### 🔀 Fluxos Principais

**Happy Path:**
1. Usuário visualiza Home com 4 ícones (Home, Busca, Salvos, Perfil)
2. Toca ícone "Salvos" → navega para lista de projetos salvos
3. Toca projeto → abre detalhes com seta "Voltar" visível
4. Toca seta → volta à lista de salvos na posição anterior

**Fluxo Alternativo — Navegação por Bottom Nav:**
1. Usuário em Detalhes de Projeto
2. Toca ícone "Perfil" (bottom nav)
3. Sistema navega diretamente para Perfil (não sobreposição)

---

<div id="uc04"></div>

## UC04 — Fazer Login no Aplicativo

**👤 Ator Principal:** Aposentada (ex: Dona Maria Lúcia)  
**🎯 Objetivo:** Fazer login de forma simples e rápida, sem necessidade de senhas complexas

---

### 📌 Resumo Executivo
Oferece autenticação frictionless com opções de Google OAuth, biometria e acesso visitante. Reduz barreira de entrada para usuários não-técnicos.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 8 |
| **Requisitos Não-Funcionais** | 6 |
| **Regras de Negócio** | 4 |
| **Critérios de Aceitação** | 10 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF22** | O sistema DEVE exibir tela de welcome com 3 botões de entrada: "Entrar com Google", "Entrar com Biometria", "Entrar como Visitante" |
| **RF23** | Clique em "Entrar com Google" DEVE abrir diálogo nativo do OS para seleção de conta |
| **RF24** | O sistema DEVE processar OAuth do Google sem solicitar senha adicional |
| **RF25** | Após autenticação, o sistema DEVE redirecionar para Home do app |
| **RF26** | "Entrar como Visitante" DEVE liberar acesso ao conteúdo público, desabilitando Salvar e Notificações |
| **RF27** | O sistema DEVE exibir aviso claro: "Algumas funções desabilitadas em modo visitante" |
| **RF28** | O sistema DEVE suportar logout com botão em Perfil → "Sair da Conta" |
| **RF29** | O sistema DEVE persistir sessão: usuário não reautentica ao reabrir app (por 30 dias) |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF17** | Performance | Login ≤ 2s; redirecionamento para Home ≤ 3s |
| **RNF18** | Segurança | Armazenar token seguindo best practices (keychain iOS, Keystore Android) |
| **RNF19** | Acessibilidade | Ícones de boas-vindas descritos; botões ≥ 44×44px; contraste ≥ 4.5:1 |
| **RNF20** | Compatibilidade | Suportar Google OAuth; Face ID (iOS); Fingerprint (Android) |
| **RNF21** | UX | Ícones grandes e de alto contraste na tela de boas-vindas |
| **RNF22** | Dark Mode | Suportar preferência de tema do sistema; contraste mantido |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN13** | Usuário visitante NÃO PODE salvar, receber notificações ou fazer comentários |
| **RN14** | Sessão visitante PODE durar até 24h; após, usuário deve reentrar |
| **RN15** | Token OAuth deve ser renovado a cada 30 dias; avisar usuário 1 dia antes da expiração |
| **RN16** | Logout DEVE eliminar dados locais de sessão (não histórico de pesquisa) |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA15** | Aplicativo aberto primeira vez | Usuário visualiza tela de login | 3 botões exibidos com ícones grandes e texto claro |
| **CA16** | Usuário toca "Entrar com Google" | Dialog OAuth abre | Conta Google selecionada; redirecionado para Home |
| **CA17** | Usuário toca "Entrar como Visitante" | Aviso exibido | Acesso liberado com opções limitadas |
| **CA18** | Sessão ativa | Usuário fecha e reabre app | Login persiste sem reauthenticate |
| **CA19** | Usuário em Perfil | Toca "Sair da Conta" | Logout processado; tela de login exibida |

---

### 🔀 Fluxos Principais

**Happy Path — Google OAuth:**
1. Tela de boas-vindas exibida
2. Usuário toca "Entrar com Google"
3. Dialog nativo aparece (seleção de conta)
4. Usuário confirma conta
5. Redireciona para Home autenticado

**Fluxo Alternativo — Visitante:**
1. Usuário toca "Entrar como Visitante"
2. Aviso sobre limitações exibido
3. Acessa conteúdo público (Busca, Detalhes, mas não Salvar)

---

<div id="uc05"></div>

## UC05 — Configurar e Receber Notificações

**👤 Ator Principal:** Servidora Pública (ex: Carla Figueiredo)  
**🎯 Objetivo:** Receber alertas sobre o andamento de leis relevantes sem precisar abrir o app diariamente

---

### 📌 Resumo Executivo
Sistema de notificações push personalizável que mantém usuários informados sobre mudanças em projetos salvos e temas de interesse, com controle total sobre preferências.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 9 |
| **Requisitos Não-Funcionais** | 7 |
| **Regras de Negócio** | 5 |
| **Critérios de Aceitação** | 11 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF30** | O sistema DEVE exibir seção "Configurações de Notificação" em Perfil |
| **RF31** | O sistema DEVE oferecer toggles para: Projetos Salvos, Temas de Interesse, Resumo Diário |
| **RF32** | O sistema DEVE solicitar permissão do OS para enviar notificações (primeira vez) |
| **RF33** | Quando projeto salvo recebe atualização, o sistema DEVE disparar push com texto: "O PL XXX/YYYY [status recente]!" |
| **RF34** | Ao tocar notificação, o sistema DEVE abrir diretamente a tela do projeto correspondente |
| **RF35** | O sistema DEVE permitir desativar notificações de tema específico sem desativar outras |
| **RF36** | O sistema DEVE manter histórico de notificações por 30 dias acessível em app |
| **RF37** | O sistema DEVE permitir "Resumo Diário" agendável (ex: 8h da manhã) |
| **RF38** | Notificações DEVEM ser bloqueadas em horários customizáveis (ex: 22h-8h) |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF23** | Latência | Push recebido ≤ 2min após evento no backend |
| **RNF24** | Frequência | Máximo 3 notificações por dia por usuário (throttle) |
| **RNF25** | Privacy | Dados de notificação não persistidos sem consentimento explícito |
| **RNF26** | UX | Toggle acessível; rótulos claros; confirmação visual de ativação |
| **RNF27** | Compatibilidade | Suportar Firebase Cloud Messaging (FCM) e APNs |
| **RNF28** | Acessibilidade | Notificações anunciadas por screen reader; vibração + som customizável |
| **RNF29** | Battery | Push otimizado para não drenar bateria; batch se possível |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN17** | Notificações DEVEM ser opt-in; nunca enviadas sem permissão explícita |
| **RN18** | Tipo: "Projeto Salvo" prima; "Tema de Interesse" secundária prioritária |
| **RN19** | "Resumo Diário" DEVE conter máximo 5 notícias; desabilitável sem afetar outras |
| **RN20** | Histórico de notificações DEVE ser sincronizado entre dispositivos |
| **RN21** | Se usuário visitante, notificações DEVEM estar all disabled (cinza) |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA20** | Usuário em Perfil | Acessa "Configurações de Notificação" | Toggles exibidos para 3 opções |
| **CA21** | Toggle "Projetos Salvos" inativo | Usuário o ativa | Permissão do OS solicitada (primeira vez) |
| **CA22** | Projeto salvo sofre alteração | Sistema dispara push | Notificação recebida ≤ 2min com texto claro |
| **CA23** | Usuário toca notificação | App é aberto | Diretamente na tela do projeto referenciado |
| **CA24** | Usuário desativa toggle "Temas" | Outras notificações permanecem | Apenas notificações daquele tema bloqueadas |

---

### 🔀 Fluxos Principais

**Happy Path:**
1. Usuário acessa Perfil → "Configurações de Notificação"
2. Ativa toggle "Projetos Salvos"; OS pede permissão
3. Usuário confirma permissão
4. Quando projeto salvo tem atualização, push é disparado
5. Usuário toca notificação → app abre no projeto

**Fluxo Alternativo — Desativar Notificações:**
1. Usuário sobrecarregado desativa toggle de um tema
2. Notificações daquele tema param imediatamente
3. Outras continuam normalmente

---

<div id="uc06"></div>

## UC06 — Buscar Conteúdo Rápido e Filtrar

**👤 Ator Principal:** Aposentada (ex: Dona Maria Lúcia)  
**🎯 Objetivo:** Encontrar informações sobre temas do dia a dia sem se perder em menus complexos

---

### 📌 Resumo Executivo
Sistema de busca robusto com autocomplete, filtros temáticos rápidos e resultados simplificados. Reduz atrito na descoberta de conteúdo legislativo.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 8 |
| **Requisitos Não-Funcionais** | 6 |
| **Regras de Negócio** | 4 |
| **Critérios de Aceitação** | 10 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF39** | O sistema DEVE exibir barra de busca em destaque na Home com placeholder "O que você procura hoje?" |
| **RF40** | Ao tocar na barra, o sistema DEVE exibir "Filtros Rápidos": Saúde, Educação, Economia, Meio Ambiente, etc. |
| **RF41** | Clique em um Filtro Rápido DEVE carregar lista de projetos daquele tema em ≤ 800ms |
| **RF42** | Ao digitar 3+ caracteres, o sistema DEVE exibir autocomplete com sugestões e projetos populares |
| **RF43** | Resultados DEVEM ser simplificados: título, status, 1 linha resumo |
| **RF44** | O sistema DEVE suportar busca por texto livre + ordenação (Relevância, Data) |
| **RF45** | O sistema DEVE filtrar por tipo de projeto (PLC, PL, PLN, etc.) se desejado |
| **RF46** | Toque em um resultado DEVE navegar para detalhes do projeto |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF30** | Performance | Autocomplete ≤ 300ms; busca ≤ 1s; sem lag ao digitar |
| **RNF31** | UX | Barra destaque com ≥ 44px altura e sombra sutil |
| **RNF32** | Acessibilidade | Campo busca com aria-label; sugestões anunciad com live region |
| **RNF33** | Compatibilidade | Suportar diácritos e variações (aposentadoria = aposentação) |
| **RNF34** | Offline | Listar resultados previamente buscados se offline |
| **RNF35** | Mobile | Sem horizontal scroll em resultados; stacked vertical |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN22** | Filtros Rápidos limitados a ≤ 6 temas mais populares |
| **RN23** | Autocomplete prioriza projetos com status "Em Votação" ou "Aprovado" |
| **RN24** | Busca DEVE excluir projetos com confidencialidade fechada |
| **RN25** | Resultados ORDER BY: Relevância (match score) DESC; Data DESC |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA25** | Home exibida | Usuário visualiza interface | Barra de busca em destaque no topo |
| **CA26** | Barra de busca tocada | Usuário toca barra | Filtros Rápidos aparecem (≥ 6 categorias) |
| **CA27** | Usuário clica filter "Saúde" | Busca processa | Lista de projetos carrega em ≤ 800ms |
| **CA28** | Usuário digita "apos..." | 3+ caracteres | Autocomplete com sugestões exibido em ≤ 300ms |
| **CA29** | Resultado clicado | Usuário toca projeto | Navega para detalhes do projeto |

---

### 🔀 Fluxos Principais

**Happy Path — Filtro Rápido:**
1. Usuário na Home visualiza barra de busca
2. Toca barra de busca → Filtros Rápidos aparecem
3. Toca "Saúde" → lista de projetos carrega
4. Toca projeto → detalhes abrem

**Fluxo Alternativo — Busca com Autocomplete:**
1. Usuário toca barra de busca
2. Digita "aposentadoria"
3. Autocomplete exibe sugestões após 3 caracteres
4. Seleciona sugestão → resultados carregam

---

<div id="uc07"></div>

## UC07 — Visualizar Histórico de Votações de Políticos

**👤 Ator Principal:** Estudante Universitário (ex: Lucas Mendes)  
**🎯 Objetivo:** Consultar perfil de parlamentar e entender como votou em projetos anteriores

---

### 📌 Resumo Executivo
Permite que cidadãos examinem o histórico de votações de políticos, promovendo transparência e accountability. Visualizações claras (verde/vermelho) indicam votos a favor ou contra.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 7 |
| **Requisitos Não-Funcionais** | 5 |
| **Regras de Negócio** | 4 |
| **Critérios de Aceitação** | 9 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF47** | O sistema DEVE permitir pesquisa por parlamentar (nome, partido, estado) |
| **RF48** | O sistema DEVE exibir perfil com foto, partido, estado, e abas: Resumo, Projetos Apresentados, Histórico de Votações |
| **RF49** | O sistema DEVE renderizar "Histórico de Votações" como timeline com projetos votados recentemente |
| **RF50** | Cada item de voto DEVE exibir: título da lei, status, card colorido (verde=Favorável, vermelho=Contrário) |
| **RF51** | O sistema DEVE permitir filtro temático dentro do histórico (ex: "Meio Ambiente") |
| **RF52** | Clique em projeto na timeline DEVE abrir detalhes completos da lei |
| **RF53** | O sistema DEVE exibir motivo/comentário do voto se disponível (campo optional) |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF36** | Performance | Carregar histórico ≤ 1.5s; filtro ≤ 800ms |
| **RNF37** | Acessibilidade | Cores (verde/vermelho) + texto ("A Favor"/"Contra") em cards; ≥ 4.5:1 contraste |
| **RNF38** | Mobile | Timeline vertical sem horizontal scroll; cards empilhados |
| **RNF39** | Compatibilidade | Suporte histórico de votações dos últimos 4 anos |
| **RNF40** | Privacy | Nenhuma informação pessoal adicional do parlamentar exibida sem consentimento |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN26** | Histórico DEVE incluir apenas votações publicadas (não sigilosas) |
| **RN27** | "Abstenção" é terceiro estado (ícone neutro/cinza) além de Favorável/Contrário |
| **RN28** | Timeline ORDER BY: data DESC (mais recentes primeiro) |
| **RN29** | Se parlamentar novo/sem histórico, exibir: "Histórico não disponível ainda." |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA30** | Pesquisa por parlamentar realizada | Usuário acessa perfil | Foto, partido, estado, 3 abas exibidas |
| **CA31** | Aba "Histórico de Votações" aberta | Página carrega | Timeline com projetos votados (≤1.5s) |
| **CA32** | Voto Favorável | Usuário visualiza card | Card verde com texto "Votou a Favor"; ≥4.5:1 contraste |
| **CA33** | Voto Contra | Usuário visualiza card | Card vermelho com texto "Votou Contra" |
| **CA34** | Filtro temático aplicado | Usuário filtra "Meio Ambiente" | Apenas votos daquele tema exibidos (≤800ms) |

---

### 🔀 Fluxos Principais

**Happy Path:**
1. Usuário pesquisa parlamentar por nome
2. Acessa perfil → Histórico de Votações
3. Timeline carrega com votos recentes
4. Toca projeto → detalhes completos da lei abrem

**Fluxo Alternativo — Filtro Temático:**
1. Usuário no histórico aplica filtro "Meio Ambiente"
2. Timeline filtra para mostrar apenas votos daquele tema
3. Toca voto → detalhes da lei abrem

---

<div id="uc08"></div>

## UC08 — Utilizar o Aplicativo Fácil / Onboarding

**👤 Ator Principal:** Aposentada (ex: Dona Maria Lúcia)  
**🎯 Objetivo:** Aprender a usar as principais funções do aplicativo no primeiro acesso

---

### 📌 Resumo Executivo
Tutorial interativo guiado com destaque (spotlight) que ensina funcionalidades principais em 3 passos rápidos. Essencial para usuários não-técnicos.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 7 |
| **Requisitos Não-Funcionais** | 5 |
| **Regras de Negócio** | 3 |
| **Critérios de Aceitação** | 8 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF54** | O sistema DEVE exibir "Tutorial Interativo" automaticamente após primeiro login |
| **RF55** | Tutorial DEVE destacar 3 elementos principais com spotlight (overlay escuro + foco de luz) |
| **RF56** | Cada passo exibe balão explicativo com texto grande (≥16px) e botão "Entendi" |
| **RF57** | O sistema DEVE permitir "Pular Tutorial" em qualquer passo |
| **RF58** | Após completar tutorial, exibir mensagem: "Você está pronta! Tutorial disponível em Perfil." |
| **RF59** | Usuário DEVE poder acessar tutorial novamente via Perfil → "Ajuda & Tutorial" |
| **RF60** | O sistema NÃO DEVE forçar tutorial em logins subsequentes |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF41** | Animação | Transição spotlight suave (300ms); sem piscadas |
| **RNF42** | Acessibilidade | Balão com aria-live; skipatble com Tab; semanticamente claro |
| **RNF43** | UX | Botão "Entendi" + "Pular Tutorial" >44×44px; contraste ≥4.5:1 |
| **RNF44** | Performance | Tutorial carrega ≤ 1s; não bloqueia interação |
| **RNF45** | Responsive | Spotlight adapta para telas 4.5" a 6.7"; posicionamento inteligente |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN30** | Tutorial exibido apenas na PRIMEIRA autenticação |
| **RN31** | Passo 3 do tutorial DEVE ser sempre "Projetos Salvos" por importância |
| **RN32** | Preferência "Pular Tutorial" armazenada; não mostrar novamente se usuário skip |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA35** | Primeiro login finalizado | Sistema inicia automático | Tutorial com spotlight aparece no Step 1 |
| **CA36** | Tutorial exibido | Balão visível | Texto ≥16px, botão "Entendi" (44×44px) |
| **CA37** | Usuário clica "Entendi" | Step 1 completo | Spotlight move para Step 2; transição suave |
| **CA38** | Usuário clica "Pular Tutorial" | Qualquer passo | Tutorial encerra; mensagem de sucesso |
| **CA39** | Segundo login | Mesma semana | Tutorial NÃO é exibido automaticamente |
| **CA40** | Perfil → "Ajuda & Tutorial" | Usuário reclica | Tutorial reinicia desde Step 1 |

---

### 🔀 Fluxos Principais

**Happy Path:**
1. Primeiro login (pós-autenticação)
2. Sistema exibe Tutorial Step 1 com spotlight + balão
3. Usuário clica "Entendi" → Step 2
4. Usuário clica "Entendi" → Step 3 (Projetos Salvos)
5. Mensagem de sucesso exibida

**Fluxo Alternativo — Pular:**
1. Tutorial exibido
2. Usuário clica "Pular Tutorial"
3. Tutorial encerra; mensagem "Você está pronta!"
4. Tutorial não será mais forçado

---

<div id="uc09"></div>

## UC09 — Acessar Resumo Diário

**👤 Ator Principal:** Servidora Pública (ex: Carla Figueiredo)  
**🎯 Objetivo:** Consumir notícias legislativas importantes do dia de forma consolidada e rápida

---

### 📌 Resumo Executivo
Resumo curado de 3-5 notícias destaques do Congresso em formato Stories ou tópicos longos. Permite consumo em ≤2 minutos.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 7 |
| **Requisitos Não-Funcionais** | 6 |
| **Regras de Negócio** | 4 |
| **Critérios de Aceitação** | 9 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF61** | O sistema DEVE exibir card "Resumo do Dia" em destaque na Home |
| **RF62** | Card DEVE mostrar data e 3 assuntos mais quentes do Congresso |
| **RF63** | Clique em "Ler Resumo Completo" DEVE abrir tela estilo Stories (ou tópicos longos) |
| **RF64** | Cada "story" DEVE resumir uma aprovação importante em 2 frases simples |
| **RF65** | Usuário DEVE poder deslizar horizontalmente para próximo tópico |
| **RF66** | Ao final, sistema exibe botões: "Ver projetos em detalhes" ou "Fechar" |
| **RF67** | Se fim de semana/sem sessão, card adapta para "Radar da Semana" com previsões futuras |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF46** | Performance | Card carrega ≤ 800ms; Stories renderizam ≤ 1s |
| **RNF47** | UX | Stories full-screen com tipografia grande (≥18px) |
| **RNF48** | Acessibilidade | Stories navegáveis via Tab/setas; texto alt; ≥4.5:1 contraste |
| **RNF49** | Mobile | Swipe gesture suave; sem lag; por mínimo 3 stories |
| **RNF50** | Compatibilidade | Suporte iOS 13+, Android 8+ |
| **RNF51** | Curation | Algoritmo prioritiza: status "Aprovado" > "Em Votação"; relevância por tema |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN33** | Resumo atualizado uma vez ao dia (tipicamente 8h da manhã, UTC-3) |
| **RN34** | Incluir máximo 5 stories; mínimo 3 |
| **RN35** | Se dia sem sessão, "Radar da Semana" mostra previsões dos próximos 2-3 dias |
| **RN36** | Conteúdo deve ser pré-curado por time editorial (não automático 100%) |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA41** | Home exibida | Sessão em andamento no Congresso | Card "Resumo do Dia" aparece com 3 destaques |
| **CA42** | Card visualizado | Usuário clica "Ler Resumo Completo" | Tela Stories abre; Story 1 preenchido |
| **CA43** | Story 1 aberto | Texto exibido | Resumo em 2 frases; ≥18px fonte; ≥4.5:1 contraste |
| **CA44** | Usuário desliza para direita | Swipe gesture | Próximo story carrega suave; sem lag |
| **CA45** | Fim da sequência Stories | Último story | Botões "Ver em detalhes" + "Fechar" exibidos |
| **CA46** | Fim de semana sem sessão | Home exibida | Card adapta para "Radar da Semana" com previsões |

---

### 🔀 Fluxos Principais

**Happy Path — Com Sessão:**
1. Home exibida (dia com sessão no Congresso)
2. Card "Resumo do Dia" com 3 destaques visível
3. Usuário clica "Ler Resumo Completo"
4. Tela Stories abre; Story 1 exibido
5. Usuário desliza → Story 2 → Story 3
6. Fim da sequência → Botões "Ver detalhes" / "Fechar"

**Fluxo Alternativo — Sem Sessão:**
1. Home exibida (fim de semana/recesso)
2. Card adapta para "Radar da Semana"
3. Exibe previsões de votações próximas

---

<div id="uc10"></div>

## UC10 — Consultar o Chatbot para Dúvidas

**👤 Ator Principal:** Estudante Universitário (ex: Lucas Mendes)  
**🎯 Objetivo:** Tirar dúvidas sobre funcionamento de leis ou traduzir jargões técnicos em tempo real

---

### 📌 Resumo Executivo
Assistente de IA conversacional que responde perguntas sobre termos legislativos em linguagem acessível, evitando necessidade de sair do app para Google.

### 📊 Estatísticas da UC
| Métrica | Quantidade |
|---------|-----------|
| **Requisitos Funcionais** | 8 |
| **Requisitos Não-Funcionais** | 7 |
| **Regras de Negócio** | 5 |
| **Critérios de Aceitação** | 10 |

---

### 🔧 Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| **RF68** | O sistema DEVE exibir botão flutuante de Chatbot no canto inferior direito (sempre visível em detalhes de lei) |
| **RF69** | Clique no botão DEVE abrir interface de chat sobrepondo parcialmente a tela |
| **RF70** | Chat DEVE exibir mensagem de boas-vindas com botões rápidos (ex: "O que significa este status?") |
| **RF71** | Usuário DEVE poder digitar pergunta livre; sistema processa e responde em segundos |
| **RF72** | Respostas DEVEM usar linguagem informal e analógica (não jurídica) |
| **RF73** | O sistema DEVE permitir usuário avaliar resposta ("Útil" / "Não foi útil") |
| **RF74** | Se pergunta fora do escopo, sistema responde: "Desculpe, ainda estou aprendendo..." + sugestão |
| **RF75** | Usuário DEVE poder fechar chat sem perder posição na tela anterior |

---

### ⚙️ Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição |
|----|-----------|-----------|
| **RNF52** | Performance | Resposta ≤ 5s; botão float não bloqueia toques/scroll |
| **RNF53** | IA/ML | Modelo treinado com contexto legislativo BR; acurácia mín. 85% |
| **RNF54** | Acessibilidade | Chat aria-live; mensagens anunciadas; controle por teclado |
| **RNF55** | Mobile | Chat drawer adapta para telas 4.5"-6.7"; input ≥44px |
| **RNF56** | Privacy | Respostas não personalizadas; nenhum dado do usuário armazenado sem consentimento |
| **RNF57** | Compatibilidade | Suporte iOS 13+, Android 8+; funciona offline com respostas pré-buscadas |
| **RNF58** | Analytics | Rastrear perguntas frequentes para melhorar curação de conteúdo |

---

### 📋 Regras de Negócio (RN)

| ID | Regra |
|----|-------|
| **RN37** | Chatbot disponível apenas para usuários autenticados (não visitantes) |
| **RN38** | Máximo 50 mensagens por sessão; após, chat sugere "Explorar Glossário" ou fecha |
| **RN39** | Perguntas sobre política pessoal/recomendação de voto NÃO DEVEM ser respondidas |
| **RN40** | Se contexto do projeto detectado, chatbot prioriza resposta sobre Lei em questão |
| **RN41** | Feedback "Não foi útil" enviado a queue para manual review (time de conteúdo) |

---

### ✅ Critérios de Aceitação (Principais)

| ID | Given | When | Then |
|----|-------|------|------|
| **CA47** | Usuário em tela de detalhes de lei | Visualiza interface | Botão flutuante Chatbot visível (canto inferior direito) |
| **CA48** | Botão Chatbot clicado | Chat inicializa | Interface abre; mensagem "Olá!" + botões rápidos exibidos |
| **CA49** | Usuário digita pergunta: "O que é derrubada de veto?" | Submit | Resposta em linguagem simples dentro de ≤5s |
| **CA50** | Resposta bom recebida | Chat exibido | Usuário avalia "Útil" (joinha) ou "Não foi útil" |
| **CA51** | Pergunta fora escopo: "Qual time é melhor?" | Usuário digita | Chatbot responde: "Desculpe, ainda aprendendo..." + sugestão |
| **CA52** | Chat aberto, usuário minimiza | Clica X ou swipe down | Chat fecha; posição da tela anterior preservada |
| **CA53** | Limite 50 mensagens atingido | Usuário continua | Chat sugere "Explorar Glossário"; oferece opção de reboot |

---

### 🔀 Fluxos Principais

**Happy Path:**
1. Usuário em tela de detalhes de lei
2. Clica botão flutuante Chatbot
3. Chat abre com boas-vindas + botões rápidos
4. Usuário clica pergunta rápida OU digita própria pergunta
5. Sistema processa e responde em ≤5s
6. Usuário avalia resposta
7. Fecha chat

**Fluxo Alternativo — Pergunta Fora de Escopo:**
1. Usuário digita pergunta não-legislativa
2. Sistema detecta e responde: "Desculpe, ainda estou aprendendo..."
3. Oferece link para Glossário ou sugestões relacionadas
4. Usuário pode tentar nova pergunta ou fechar

---

## 📄 Escopo Consolidado

### ✅ Incluído em Todas as 10 UCs
- Especificações técnicas claras e imperativas (DEVE, NÃO DEVE)
- Requisitos funcionais, não-funcionais, regras de negócio
- Critérios de aceitação com rastreabilidade
- Fluxos principais e alternativos
- Design system unificado (cores, tipografia, espacamento)
- Validações de acessibilidade (WCAG 2.1 AA mínimo)
- Performance targets e compatibilidade mobile

### ❌ Fora de Escopo
- Implementação backend/banco de dados
- Detalhes de IA/ML do chatbot (apenas requirements de interface)
- Integração direta com APIs do Senado/Câmara (assume dados locais)
- Análises de negócio ou previsões de ROI
- Documentação de deploy/DevOps

---

## 🔄 Instruções para Uso

### Para Desenvolvedores
1. **Abra este documento** em Markdown viewer ou navegador
2. **Selecione a UC** clicando no link na Tabela de Conteúdos
3. **Expanda seções** (copie RF/RNF/RN em seus tickets)
4. **Use os CAs** como critério de aceitação no Jira/Azure DevOps
5. **Implemente design system** (cores, tipografia) nos componentes

### Para QA/Testers
1. **Mapeie cada CA** a um teste manual/automatizado
2. **Use Validações** (V01-V06) para casos de erro
3. **Verifique acessibilidade** (WCAG AA) com axe, Lighthouse
4. **Teste em dispositivos** 4.5" e 6.7" (mínimo)
5. **Documente desvios** de RNFs de performance

### Para Designers
1. **Implemente design system** em Figma/Adobe XD
2. **Crie componentes** reutilizáveis (Cards, Buttons, etc.)
3. **Verifique contraste** mínimo 4.5:1
4. **Teste tipografia** legibilidade (16px mínimo body, line-height 1.5)
5. **Protótipo interações** (swipes, gestos, transitions)

### Para Product/Stakeholders
1. **Review UCs por prioridade**—considerar dependências
2. **Estimar esforço** por RF (não por UC inteira)
3. **Alocar sprints** respeitando 3-5 RFs por sprint (mobile)
4. **Rastrear progresso** vs. 100+ CAs
5. **Comunicar roadmap** aos usuários

---

## 📞 Suporte & Dúvidas

**Dúvidas sobre Especificação?** Entre em contato com o time de Product.

**Issues Técnicas?** Documente a discrepância entre spec e implementação e abra issue no repositório.

**Feedback sobre Design System?** Compartilhe com o time de Design — ajustes são bem-vindos!

---

**Última Atualização:** 13 de Abril, 2026  
**Versão:** 1.0 — Completa (10 UCs)  
**Status:** ✅ Pronto para Desenvolvimento

---

## 📎 Apêndices

### A. Matriz de Rastreabilidade (Resumida)

| RF | RN | RNF | CA | UC |
|----|----|----|----|----|
| RF01-02 | RN01-02 | RNF01-02 | CA01-02 | UC01 |
| RF09-10 | RN06-07 | RNF07-08 | CA07-08 | UC02 |
| RF16-18 | RN10-12 | RNF12-16 | CA11-13 | UC03 |
| RF22-25 | RN13-16 | RNF17-22 | CA15-18 | UC04 |
| RF30-35 | RN17-21 | RNF23-29 | CA20-23 | UC05 |
| RF39-42 | RN22-25 | RNF30-35 | CA25-29 | UC06 |
| RF47-50 | RN26-29 | RNF36-40 | CA30-34 | UC07 |
| RF54-59 | RN30-32 | RNF41-45 | CA35-39 | UC08 |
| RF61-66 | RN33-36 | RNF46-51 | CA41-45 | UC09 |
| RF68-74 | RN37-41 | RNF52-58 | CA47-52 | UC10 |

### B. Validações Transversais (Todas as UCs)

| Validação | Gatilho | Ação |
|-----------|--------|------|
| **Acessibilidade WCAG AA** | Teste automatizado (axe, Lighthouse) | Bloquear publicação se score < 95% |
| **Performance ≤500ms** | Simulação 4G em DevTools | Otimizar assets/endpoints |
| **Compatibilidade iOS 13+ / Android 8+** | Teste em emuladores | Deprecate se suporte encerrado |
| **Responsividade 4.5"-6.7"** | Teste em múltiplas resoluções | Ajustar breakpoints |
| **Sem Jargão Jurídico** | QA review + sugestão semântica | Revisar conteúdo antes de publicação |

---

**🎉 Especificação Consolidada Completa — Pronto para Desenvolvimento!**
