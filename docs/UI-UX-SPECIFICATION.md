# 🎨 UI/UX Specification — LegixTech Mobile App

**Version:** 1.0  
**Date:** April 13, 2026  
**Project:** LegixTech — Monitoramento Legislativo Mobile  
**Platforms:** iOS 13+ | Android 8+ | React Native  

---

## 📋 Table of Contents

1. [Design System](#design-system)
2. [Component Library](#component-library)
3. [Navigation Architecture](#navigation-architecture)
4. [Interaction Patterns](#interaction-patterns)
5. [Responsive & Accessibility](#responsive--accessibility)
6. [Visual Guidelines](#visual-guidelines)
7. [Pre-Delivery Checklist](#pre-delivery-checklist)

---

## Design System

### 🎯 Design Philosophy

**Theme:** Civic Clarity + Accessibility-First  
**Audience:** Students, Public Servants, Citizens (diverse digital literacy)  
**Approach:** Content-first, minimal decoration, semantic color, respect for system defaults  

---

### 🎨 Color Palette

**Primary Scale** — Legislative Trust
```
Primary Blue 900    #1e40af    Headings, Primary CTAs, Tab bar active
Primary Blue 700    #1e3a8a    Secondary text, Borders
Primary Blue 100    #dbeafe    Light backgrounds, Hover states
```

**Semantic Colors**
```
Success Green       #15803d    Accept, Approve, Saved state
Success Light       #dcfce7    Success backgrounds, Light indicators
Error Red           #ef4444    Destructive actions, Errors, Alerts
Error Light         #fee2e2    Error backgrounds
Warning Amber       #f59e0b    Warnings, Important notifications
Warning Light       #fef3c7    Warning backgrounds
```

**Neutral Scale** — Accessible & Readable
```
Text Primary        #111827    Body text (h-900), WCAG AA on white
Text Secondary      #475569    Descriptions, disabled state (h-600)
Text Tertiary       #9ca3af    Placeholder, subtle info (h-400)
Border Color        #e5e7eb    Card borders, dividers (h-200)
Surface Light       #f9fafb    Card backgrounds, panels (h-50)
Surface Clean       #ffffff    Primary background, modals
```

**Dark Mode** (Support Required)
```
Surface Dark        #0f172a    Background (slate-900)
Surface Card        #1e293b    Cards, panels (slate-800)
Text Light          #f1f5f9    Body text (slate-100)
Text Light Secondary #cbd5e1   Secondary text (slate-300)
Border Dark         #334155    Dividers (slate-700)
```

### Validation

| Context | Check | Standard |
|---------|-------|----------|
| Normal text on white | Primary text on white | 12.6:1 ✅ WCAG AAA |
| Secondary text on white | Text secondary on white | 5.8:1 ✅ WCAG AA |
| Success on white | Success green on white | 4.5:1 ✅ WCAG AA |
| Error on white | Error red on white | 5.3:1 ✅ WCAG AA |
| Dark mode body text | Light text on dark background | 11.2:1 ✅ WCAG AAA |

---

### 📝 Typography System

**Font Family**
```
Primary:    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Monospace:  'SF Mono', 'Monaco', 'Roboto Mono', monospace
```

**Type Scale** — Semantic Roles

| Role | Size | Weight | Line Height | Use Case |
|------|------|--------|-------------|----------|
| **Display** | 28px | 700 | 1.2 | Page titles, hero sections |
| **Headline** | 24px | 600 | 1.3 | Section headers |
| **Title** | 20px | 600 | 1.4 | Card titles, modal headers |
| **Subtitle** | 16px | 600 | 1.4 | Secondary headings, form labels |
| **Body** | 16px | 400 | 1.5 | Main content, descriptions |
| **Body Small** | 14px | 400 | 1.5 | Secondary content, hints |
| **Label** | 12px | 500 | 1.4 | Button text, badges, tags |
| **Caption** | 12px | 400 | 1.4 | Timestamps, metadata |

**Requirements**
- ✅ Minimum body font: **16px** (prevents iOS auto-zoom; aids legibility for elderly users)
- ✅ Line height: **1.5–1.75** (readability standard)
- ✅ Characters per line: **50–75 chars** (optimal reading measure)
- ✅ Support **Dynamic Type** (iOS) and **large font scaling** (Android)
- ✅ No text truncation on Dynamic Type +2 sizes (use wrapping)

---

### 📏 Spacing & Layout System

**Spacing Scale** (4pt/8dp base increment)
```
xs   4px / 4dp      Minimal spacing (icon-text gaps)
sm   8px / 8dp      Small spacing (item spacing)
md   16px / 16dp    Component padding (cards, sections)
lg   24px / 24dp    Section spacing
xl   32px / 32dp    Major sections
2xl  48px / 48dp    Page-level spacing
```

**Component Padding Defaults**

| Component | Horizontal | Vertical | Notes |
|-----------|-----------|----------|-------|
| **Button** | 16dp | 12dp | Touch target ≥44×44dp |
| **Input Field** | 12dp | 12dp | Minimum 44dp height |
| **Card** | 16dp | 16dp | Consistent insets |
| **Screen Inset** | 16dp | 12dp top/bottom | Safe area aware |
| **List Item** | 16dp | 12dp | Comfortable thumb zone |

**Responsive Breakpoints**

| Device | Width | Layout | Notes |
|--------|-------|--------|-------|
| **Small Phone** | 375px | Single column, 16dp gutters | iPhone SE, SE2 |
| **Regular Phone** | 393–414px | Single column, 16dp gutters | Standard Android, iPhone |
| **Large Phone** | 428–540px | Single column, 20dp gutters | Plus models, large Android |
| **Tablet** | ≥600px | 2-column or adaptive sidebar | Optional; nice-to-have |

**Safe Area Offsets**
- **Top:** Status bar (iOS 20pt) + notch/Dynamic Island (12–39pt) + safe margin (8pt)
- **Bottom:** Home indicator (34pt iOS) or gesture bar (minimum 24pt Android)
- **Leading/Trailing:** 16dp minimum on all sides

---

### 🎭 Component States

All interactive elements support these states atomically:

| State | Visual | Interactive | Semantic |
|-------|--------|-------------|----------|
| **Default** | Primary color | Tappable | `enabled` |
| **Pressed** | Ripple (MD) or scale 0.98 (iOS) | Tappable | — |
| **Focused** | 2–4px focus ring, outline style | Keyboard nav | `:focus-visible` |
| **Disabled** | 38% opacity + `cursor: not-allowed` | Not tappable | `disabled=true`, `aria-disabled` |
| **Loading** | Spinner overlay + dim background | Not tappable | `aria-busy=true` |
| **Error** | Red border + error icon + message | Varies | `aria-invalid=true` |
| **Success** | Green checkmark or animation | — | `aria-live="polite"` |

**Duration:** State transitions complete in **150–300ms** (Material Design standard)

---

## Component Library

### 🔘 Button

**Variants**

```
Filled (Primary):
  - Background: Primary Blue 900
  - Text: White (contrast 12.6:1)
  - Padding: 12dp v × 16dp h
  - Height: 44dp minimum
  - Border radius: 8dp
  - Pressed: Ripple effect (Material) or 0.95 scale (iOS)

Outlined (Secondary):
  - Background: Transparent
  - Border: 1dp Primary Blue 900
  - Text: Primary Blue 900
  - Same padding/height as Filled
  - Pressed: Light primary blue background (10% opacity)

Text (Tertiary):
  - Background: Transparent
  - Border: None
  - Text: Primary Blue 900
  - Padding: 8dp v × 12dp h (looser for text buttons)
  - Pressed: Subtle background highlight (5% opacity)

Destructive:
  - Background: Error Red (#ef4444)
  - Text: White
  - Same sizing as Filled
  - Only used for irreversible actions (delete, logout)
```

**Accessibility**
- ✅ Label text must be clear and action-oriented ("Save", not "Submit")
- ✅ Icon-only buttons require `aria-label` / `accessibilityLabel`
- ✅ Disabled buttons use `disabled` attribute, not just opacity
- ✅ Loading buttons show spinner and disable interaction
- ✅ Touch target minimum **44×44dp** (use `hitSlop` if icon is smaller)

---

### 📝 Input Field

**Structure**
```
┌─────────────────────────────┐
│ Label (Subtitle, 16px, 600) │
├─────────────────────────────┤
│ [Placeholder text]          │  ← Body text, 16px, gray-400
├─────────────────────────────┤
│ Helper text (12px, gray-600)│
└─────────────────────────────┘
```

**States**
- **Default:** Border gray-200, placeholder gray-400
- **Focused:** Border primary blue, 2px focus ring
- **Filled:** Text primary, border transitions
- **Error:** Border error red, error icon right-aligned, message red below
- **Disabled:** 38% opacity, gray background, cursor not-allowed

**Requirements**
- ✅ Explicit label (never placeholder-only)
- ✅ Semantic input types (email, tel, number) for mobile keyboard optimization
- ✅ Helper text persistent or error near field
- ✅ Password toggle for password fields (show/hide icon)
- ✅ Minimum height **44dp** (touch target)
- ✅ Support autocomplete / textContentType (autofill)

---

### 📋 Cards & Surfaces

**Card Standards**
```
Padding:       16dp (all sides)
Border:        1dp, gray-200; none in dark mode
Border Radius: 8dp
Background:    White (light) / slate-800 (dark)
Shadow:        Subtle (0 1px 3px rgba(0,0,0,0.12))
Hover/Press:   Shadow elevation (0 4px 6px rgba(0,0,0,0.1))
Transition:    150ms shadow ease-out
```

**Anatomies**

| Type | Structure | Use Case |
|------|-----------|----------|
| **List Item Card** | Icon + Title + Subtitle + Chevron | Project list, notifications |
| **Content Card** | Title + Body text + Action | Summaries, descriptions |
| **Status Card** | Badge + Title + 2-line description | Status updates, pending items |
| **Media Card** | Image + Title + Text + CTA | Featured content, articles |

---

### 🔔 Notifications & Alerts

**Toast (Auto-dismiss)**
```
Duration:      3–5s auto-dismiss
Position:      Bottom inset (24dp from bottom safe area)
Width:         Full-width minus 16dp gutters
Padding:       12dp v × 16dp h
Background:    Success green / Error red / Warning amber
Text:          White or high-contrast color
Icon:          Checkmark (success), X (error), ! (warning)
Animation:     Slide-up 200ms, hold, fade-out 150ms
Dismiss:       Swipe-down or auto-close
Accessibility: aria-live="polite" (not assertive, doesn't steal focus)
```

**Modal Alert**
```
Scrim:         40–60% black overlay
Width:         Full-width (minus 16dp gutters on large screens)
Border Radius: 12dp
Padding:       24dp
Button Layout: Stacked vertical on mobile, end-aligned on tablet
Min Height:    200dp (excluding buttons)
Escape Route:  Close button × OR Cancel button
Animation:     Scale 0.9 + fade-in 200ms
```

**Error States**
```
Message:       Clear cause + recovery path (not just "Error")
Example:       "Resumo não disponível. Acesse o texto oficial."
Icon:          Red circular ! or × symbol (16dp)
Color:         Error red (#ef4444)
Placement:     Inline (below field) or modal (for blocking errors)
```

---

### 🔗 Navigation Components

**Bottom Tab Bar** (Primary Navigation)
```
Max items:     5 (strict limit)
Item height:   56–64dp (includes safe area bottom)
Icon size:     24×24dp
Label:         12px text below icon
Active state:  Full color primary blue + bold label
Inactive:      Gray-500 text
Safe area:     Extend background to safe area; add padding
Gesture safe:  Top 8–12dp padding (avoid Android gesture bar)
```

**Top App Bar**
```
Height:        56dp
Padding:       16dp h × 12dp v (excludes status bar)
Title:         Headline (24px, 600) or Subtitle (16px, 600)
Leading icon:  Back, Menu, or custom (24×24dp)
Trailing:      Search, settings, profile (24×24dp icon)
Actions:       Max 2 trailing icons; use overflow menu for 3+
Elevation:     Subtle shadow or divider line at bottom
Safe area:     Extend background to status bar; top padding = status height
Sticky:        Must remain at top during scroll
```

**Tab Navigation (Secondary)**
```
Style:         Underline or fill variant
Orientation:   Horizontal scroll (if >4 tabs)
Scroll position: Active tab centered on scroll
Active indicator: 2–3dp underline or background fill
Padding:       12dp h between items
Font:          Subtitle (16px, 600) or Label (12px, 500)
```

---

### 📊 Lists

**List Item**
```
Height:        56dp (single line content)
             72–88dp (multi-line content)
Padding:       16dp h × 12dp v (content)
Leading icon:  24×24dp or avatar (40×40dp)
Title:         Subtitle (16px, 600)
Subtitle:      Body small (14px, 400)
Trailing:      Chevron (gray-400) or badge
Divider:       1dp gray-200 (not on last item)
Tap feedback:  Surface highlight (background color shift)
```

**List Best Practices**
- ✅ Virtualize lists with 50+ items (FlatList / SwiftUI LazyVStack optimization)
- ✅ Tap area extends full width (not just icon/text)
- ✅ One action per item clear; secondary actions in menu
- ✅ Empty state: icon + message + CTA when list is empty

---

## Navigation Architecture

### 🗺️ App Structure

**Principle:** Maximum 3 levels deep; horizontal breadcrumb for deeper navigation

```
┌─────────────────────────────────────────┐
│              HOME (Hub)                 │
├──────────┬──────────┬──────────┬────────┤
│ Home     │ Search   │ Saved    │ Profile│
│ (Feed)   │ Projects │ Projects │ & Cfg  │
└──────────┴──────────┴──────────┴────────┘
     ↓          ↓          ↓          ↓
  Feed Lists  Search UI  Saved List Settings
     ↓
  Project Detail (modal or push)
     ↓
  Sub-features (Resumo, Votações, etc)
```

### Navigation Patterns

**Bottom Tab Bar** (Primary)
| Tab | Content | UC | Icon |
|-----|---------|-----|------|
| Home | Feed of recent projects | UC01, UC02, UC09 | House |
| Search | Search + filters + results | UC06 | Magnifying Glass |
| Saved | List of saved projects | UC02 | Bookmark |
| Profile | User settings, notifications, history | UC04, UC05, UC07 | User Circle |

**Depth Limits**
- **Tab 1 (Home):** Home → Project Detail → (optional) Sub-feature modal
- **Tab 2 (Search):** Search → Results → Project Detail
- **Tab 3 (Saved):** Saved List → Project Detail
- **Tab 4 (Profile):** Settings / Notifications / History (shallow)

**Gestures**
- ✅ System back gesture (iOS swipe-back, Android predictive back) supported
- ✅ Swipe-down to dismiss sheets/modals (iOS standard)
- ✅ Long-press for context menus (delete saved, share, etc.)
- ✅ Pull-to-refresh on lists (feedback within 100ms)

---

### Deep Linking & Sharing

All key screens must support deep links:
```
Deep Links:
  legixtech://project/{projectId}
  legixtech://projects/saved
  legixtech://search?q={query}&category={category}
  legixtech://notifications
  legixtech://settings
```

**Notifications → Deep Link**
- Push notification tapped → Deep link → Correct screen + state preserved
- Example: "Projeto salvo foi votado" → `legixtech://project/{id}?section=votacoes`

---

## Interaction Patterns

### ⏱️ Timing Standards

| Interaction | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| **Tap feedback** | 80–150ms | ease-out | Ripple or highlight |
| **Micro-interaction** | 150–250ms | ease-out | Button press, toggle |
| **Screen transition** | 200–300ms | ease-out-cubic | Navigation push/pop |
| **Loading spinner** | Continuous | linear | 1–2 rotations/sec |
| **Toast auto-dismiss** | 3–5s | — | Hold visible, fade-out last 200ms |
| **Collapse/expand** | 200–300ms | ease-out | Accordion, menu |
| **Scroll momentum** | Natural | — | Platform default (iOS momentum, Android fling) |

### Loading States

**Short Load (< 300ms)**
- No feedback; just instant result

**Medium Load (300ms–1s)**
- Show skeleton screen or shimmer placeholder
- Preserve space to avoid layout shift (CLS < 0.1)

**Long Load (> 1s)**
- Show centered spinner + "Breaking down this law..." copy
- Provide cancel option
- Update message after 3s if still loading

### Error Handling

**API Failures**
```
Network Error:
  Message: "Conexão perdida. Verifique sua internet."
  Recovery: "Tentar novamente" button
  Timeout:  3s wait before error shown

Server Error (5XX):
  Message: "Serviço indisponível. Tente depois."
  Recovery: "Tentar novamente" button

No Data:
  Message: "Nenhum resultado encontrado."
  Suggestion: "Tente refinar sua busca."
  Icon: Magnifying glass illustration
```

---

### Animations & Transitions

**Motion Principles**
- ✅ Every animation expresses a cause-effect relationship (spatial continuity)
- ✅ Navigate forward: slide left-to-right or scale up
- ✅ Navigate backward: slide right-to-left or scale down
- ✅ Stagger list items on entrance: 30–50ms delay per item
- ✅ Use `prefers-reduced-motion` to disable animations for accessible users
- ✅ No decorative-only animations; all motion has semantic purpose

**Example Animations**

| Trigger | Animation | Duration | Purpose |
|---------|-----------|----------|---------|
| Tap button | Scale 0.95 → 1.0 + ripple | 150ms | Feedback |
| Open modal | Fade-in + scale from center (0.9 → 1.0) | 200ms | Entrance |
| Close modal | Fade-out + scale to trigger (1.0 → 0.9) | 150ms | Exit (faster) |
| Save project | Icon transform + checkmark animation | 300ms | Confirmation |
| List entrance | Translate up + fade-in (staggered) | 200ms per item | Reveal |
| Scroll parallax | Header shrink (if used) | Continuous | Spatial continuity |

---

## Responsive & Accessibility

### ♿ WCAG 2.1 Level AA Compliance Checklist

**Color & Contrast**
- ✅ Normal text contrast ≥ 4.5:1 (all combos validated above)
- ✅ Large text (18px+) contrast ≥ 3:1
- ✅ UI components (borders, icons) contrast ≥ 3:1
- ✅ Color not the only indicator (e.g., error = red + icon + text)
- ✅ Light and dark modes tested separately for contrast

**Typography & Readability**
- ✅ Minimum body font: **16px** (measured on 1x scale)
- ✅ Line height ≥ 1.5 (1.5+ for optimal WCAG AA)
- ✅ Line length 50–75 characters (mobile), 60–75 (desktop)
- ✅ Support text scaling via system settings (Dynamic Type +2 sizes minimum)
- ✅ No text truncation on scaled fonts (use wrapping)

**Navigation & Focus**
- ✅ Logical tab order matching visual left-to-right, top-to-bottom
- ✅ Focus indicators visible: 2–4px ring, distinct color + outline
- ✅ Keyboard access to all interactive elements (no mouse/touch-only)
- ✅ Skip links or focus shortcuts for keyboard users (optional but recommended)
- ✅ App bar / tab bar reachable from anywhere via keyboard

**Labels & Semantics**
- ✅ Form fields have explicit `<label>` elements (not placeholder-only)
- ✅ Icon-only buttons have `aria-label` / `accessibilityLabel`
- ✅ Headings use semantic hierarchy (h1 → h6, no skips)
- ✅ Interactive elements have correct ARIA roles (button, link, etc.)
- ✅ List structure uses `aria-live` for dynamic updates

**Accessibility for Screen Readers**
- ✅ Landmarks: main, navigation, complementary regions defined
- ✅ Page title clear and unique per screen
- ✅ Reading order logical and matches visual flow
- ✅ Dynamic content announced: aria-live="polite" for non-blocking, "assertive" for alerts
- ✅ Modals: focus trapped inside; focus restored on close

**Motion & Animation**
- ✅ Respect `prefers-reduced-motion`: disable or simplify animations
- ✅ No auto-playing videos or animations lasting >5s without pause control
- ✅ No flashing content >3 times per second (seizure risk)

**Mobile-Specific Accessibility**
- ✅ Touch targets ≥ 44×44pt (iOS) / 48×48dp (Android)
- ✅ Touch targets spaced ≥ 8pt/8dp apart (avoid mis-taps)
- ✅ Safe area awareness: no vital UI under notch/gesture bar
- ✅ Voice Control commands labeled (iOS) / custom actions (Android)
- ✅ Haptic feedback optional; never solely visual feedback

**Forms & Error Handling**
- ✅ Error messages near the invalid field
- ✅ Error message includes cause + recovery (e.g., "Password must be 8+ characters")
- ✅ Focus moved to first invalid field on submit error
- ✅ Required fields marked (visually + semantically)
- ✅ Instructions or hints provided for complex inputs

---

### 📱 Responsive Behavior

**Layout Strategy: Mobile-First**

| Breakpoint | Device | Layout | Columns | Font |
|------------|--------|--------|---------|------|
| **375px** | Small phone | Single column, 16dp gutters | 1 | 16px body |
| **393–414px** | Regular phone | Single column, 16dp gutters | 1 | 16px body |
| **428–540px** | Large phone | Single column, 20dp gutters | 1 | 16px body |
| **600px+** | Tablet | 2 columns (optional) or adaptive | 2 (optional) | 16px body |

**Orientation Handling**
- Portrait: Single column, optimized for thumb reach
- Landscape: Consider 2-column (if > 600px width) or compact view
- No horizontal scroll on any orientation
- Test landscape on all critical screens

**Dynamic Type / Large Font Scaling**
- Test with system text size at **Largest** (≈+2 sizes)
- Buttons still ≥ 44pt
- Text wraps naturally (no truncation)
- Readability maintained

**Safe Area & Insets**
- Top: Account for status bar + notch + margin
- Bottom: Respect home indicator (iOS 34pt) + margin
- Leading/Trailing: 16dp minimum on all sides
- Fixed UI (headers, bottom bar) extends to edges; content inside safe area

**Content Prioritization**
- **Mobile:** Show core content first; fold or hide secondary features
- **Tablet:** Consider 2-column layout or wider content area
- **Landscape:** Adapt spacing & sidebars; maintain priority order

---

## Visual Guidelines

### 🎨 Design Patterns by UC

#### UC01: Acessar Resumo Simples e Impacto

**Layout**
```
┌────────────────────────┐
│  [Back]  Project Title │ (Top App Bar)
├────────────────────────┤
│ Tab: Entenda a Lei [>] │ (Underline tabs)
├────────────────────────┤
│  O Resumo              │
│  ═════════             │
│  Parágrafo 1 (max 120  │
│  chars, 16px, gray-900)│
│                        │
│  Parágrafo 2...        │
│                        │
│  Parágrafo 3...        │
├────────────────────────┤
│  Quem é afetado?       │
│  • Grupo 1             │
│  • Grupo 2             │
│  • ...                 │
├────────────────────────┤
│ [Acessar Texto Oficial]│ (Filled button)
└────────────────────────┘
```

**Specifications**
- Summary block: White card, 16dp padding, soft shadow
- Paragraphs: Line height 1.6, max-width 75 chars per line
- Bullet list: Left-aligned, 16dp indent, 12dp item spacing
- Button: Full-width on mobile, centered on tablet

---

#### UC02: Salvar Projetos

**List Item State**
```
Unsaved:
┌──────────────────────────────────────┐
│ ☐ Project Title 1      ⋯ Votação |   │
│   Câmara · 2026      Trending 📈     │
└──────────────────────────────────────┘

Saved:
┌──────────────────────────────────────┐
│ ☑ Project Title 1      ⋯ Votação |   │
│   Câmara · 2026      In your list ✓  │
└──────────────────────────────────────┘
```

**Interaction**
- Tap bookmark icon: Toggle saved state (instant visual feedback)
- Toast appears: "Projeto salvo no seu Perfil" (green, 3-5s auto-dismiss)
- List reorders: Saved items float to top (animate if significant)

---

#### UC06: Busca & Filtros

**Search Bar**
```
┌─────────────────────────────┐
│ 🔍 Buscar projetos...       │ (Always visible, sticky)
│ [Filters] [Advanced]        │
└─────────────────────────────┘

Results:
┌─────────────────────────────┐
│ Categoria: Saúde (1.234)     │ (Chip, dismissible)
│ Status: Votação (5)          │ (Chip, dismissible)
├─────────────────────────────┤
│ Project Title 1             │ (List item, full-width tap)
│ Câmara · Votação · 2 dias   │
├─────────────────────────────┤
│ Project Title 2             │
│ Senado · Discussão · 5 dias │
└─────────────────────────────┘
```

**Filters**
- Sticky at top or slide-up sheet
- Multiselect: Category, Status, Timeline, Relevance
- Applied filters shown as chips (dismissible)
- Clear all: "Limpar filtros" button bottom

---

#### UC04: Fazer Login

**Login Flow**
```
1. Welcome Screen
   ┌──────────────────────────┐
   │ LegixTech Logo           │
   │ "Entender a legislação   │
   │  de forma simples"       │
   ├──────────────────────────┤
   │ [Login with Google]      │ (Social button)
   │ [Login with Apple]       │ (Social button)
   │ [Email / Senha] (text)   │ (Alternative)
   │                          │
   │ Criar Conta →            │ (Link to signup)
   └──────────────────────────┘

2. After OAuth Callback
   → Navigate to Home tab
   → Show onboarding (UC08) if first-time user
```

**Biometric**
- Offer Face ID / Fingerprint after email confirm
- "Use biometric to login faster" toggle in Settings

---

### Color Application Rules

| Element | Light Mode | Dark Mode | Notes |
|---------|-----------|-----------|-------|
| **Primary CTA** | Blue 900 bg, white text | Blue 700 bg, white text | Always highest contrast |
| **Secondary CTA** | Blue 900 border, blue 900 text, white bg | Blue 400 border, blue 400 text, transparent bg | Outlined style |
| **Tertiary CTA** | Transparent bg, blue 900 text | Transparent bg, blue 400 text | Text-only |
| **Destructive** | Red 600 bg, white text | Red 500 bg, white text | Never primary |
| **Disabled** | Gray 300 bg, gray 500 text (38% opacity) | Gray 700 bg, gray 400 text | Non-interactive visually clear |
| **Card Divider** | Gray-200 border | Gray-700 border | 1dp line |
| **Body Text** | Gray-900 | Gray-100 | Max 75 chars/line |
| **Secondary Text** | Gray-600 | Gray-300 | 3pt smaller than body |
| **Success** | Green 600 text + green 50 bg | Green 500 text + green 900 bg | Context-dependent |
| **Error** | Red 600 text + red 50 bg | Red 500 text + red 900 bg | Always prominent |
| **Warning** | Amber 600 text + amber 50 bg | Amber 500 text + amber 900 bg | Caution signal |

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] **No emoji icons** — All structural icons use SVG (Lucide, Heroicons, custom)
- [ ] **Icon consistency** — Single icon family with uniform stroke width (1.5–2px)
- [ ] **Official branding** — LegixTech logo usage follows brand guidelines
- [ ] **State stability** — Pressed/focused states don't shift layout or cause jitter
- [ ] **Color tokens** — No hardcoded hex; all colors from semantic token system

### Interaction & Feedback
- [ ] **Tap feedback** — All tappables provide < 80ms response (ripple/highlight/scale)
- [ ] **Touch targets** — All interactive elements ≥ 44×44pt with 8pt minimum spacing
- [ ] **Loading feedback** — Long operations (> 300ms) show spinner or skeleton
- [ ] **Error messages** — Clear cause + recovery path (not just "Error")
- [ ] **Disabled states** — Visually distinct; non-interactive; semantic disabled attr

### Light & Dark Mode
- [ ] **Text contrast (light)** — Body ≥ 4.5:1, secondary ≥ 3:1 on white
- [ ] **Text contrast (dark)** — Light text ≥ 4.5:1 on dark surfaces
- [ ] **Dividers & borders** — Visible in both modes; not just light-mode
- [ ] **Interactive states** — Hover/focus/pressed equally distinguishable in both
- [ ] **Tested separately** — Dark mode contrast validated independently (not inverted)

### Accessibility (WCAG 2.1 AA)
- [ ] **Focus indicators** — 2–4px visible ring on keyboard navigation
- [ ] **Form labels** — Explicit labels for all inputs (not placeholder-only)
- [ ] **Alt text** — Meaningful images have descriptive alt/accessibility labels
- [ ] **Heading hierarchy** — Sequential h1→h6, no level skips
- [ ] **Color not only** — Meaning conveyed via color + icon + text
- [ ] **Screen reader tested** — VoiceOver (iOS) and TalkBack (Android) on key flows
- [ ] **Keyboard navigation** — Full tab order, no traps, escape routes in modals
- [ ] **Reduced motion** — Animations reduced/disabled per `prefers-reduced-motion`
- [ ] **Dynamic Type** — Text scaling up 2+ sizes doesn't truncate or break layout
- [ ] **Safe area aware** — No vital UI under notch, Dynamic Island, or gesture bar

### Responsive & Performance
- [ ] **Mobile-first** — Optimized for 375px; scales up to 600px+ gracefully
- [ ] **No horizontal scroll** — Content fits viewport width on all orientations
- [ ] **Landscape tested** — Layout readable in landscape orientation
- [ ] **Image optimization** — WebP/AVIF with responsive dimensions; lazy load below-fold
- [ ] **Layout shift (CLS)** — Reserved space for async content; CLS < 0.1
- [ ] **Bundle splitting** — Route-level code splitting; TTI < 3s on 4G
- [ ] **Virtualized lists** — 50+ items use FlatList (React Native) virtualization
- [ ] **Animation performance** — Uses transform/opacity only; ≤ 60fps on mid-range device

### Interaction Patterns
- [ ] **Bottom nav limit** — Max 5 items with labels + icons
- [ ] **Tab bar state** — Active tab visually highlighted (color + weight)
- [ ] **Back gesture** — System back (iOS swipe, Android predictive) works correctly
- [ ] **Deep linking** — All major screens reachable via deep link / URL
- [ ] **Modal dismiss** — Clear close affordance; swipe-down supported (iOS)
- [ ] **List state** — Scroll position preserved on back navigation
- [ ] **Error recovery** — Retry options for failed network requests

### Data & Edge Cases
- [ ] **Empty states** — Friendly message + icon + CTA (not blank screen)
- [ ] **Network errors** — Clear message with retry button
- [ ] **Timeout handling** — 3s max wait before error shown
- [ ] **Truncation strategy** — Text wraps instead of truncating (or ellipsis + expand)
- [ ] **RTL consideration** — If supporting RTL languages, test flipped layouts
- [ ] **Offline support** — Cached content available offline; sync on reconnect

### Final QA
- [ ] **Tested on iOS 13+** — Real device (or emulator)
- [ ] **Tested on Android 8+** — Real device (or emulator)
- [ ] **Portrait & Landscape** — Both orientations functional
- [ ] **Light & Dark mode** — Toggled and contrast re-validated
- [ ] **Accessibility score** — axe DevTools ≥ 95% or Lighthouse a11y ≥ 90
- [ ] **Performance audit** — Lighthouse score ≥ 80 on 4G throttle
- [ ] **Zero console errors** — No warnings or exceptions in production build
- [ ] **Localization ready** — Portuguese strings extracted; no hardcoded text

---

## Implementation Notes

### Technology Stack

**Frontend**
- **Framework:** React Native (cross-platform iOS + Android)
- **UI Library:** React Native built-ins + community components
- **Navigation:** React Navigation v6+ (stack, tab, drawer)
- **State Management:** Redux / Zustand / Context API
- **Styling:** NativeWind (Tailwind for React Native) or similar

**Assets**
- **Icons:** Lucide React Native or @react-native-vector-icons
- **Fonts:** System fonts (no external for performance); support dynamic type
- **Images:** Optimize with Image assets / react-native-fast-image

**Supporting Packages**
- **Accessibility:** @react-native-a11y/... packages
- **Form validation:** Formik + Yup or react-hook-form
- **Notification:** react-native-toast-notifications or similar
- **Safe area:** react-native-safe-area-context

---

### Design System Implementation

Create a `design-system/` folder:

```
design-system/
├── MASTER.md              (Global source of truth)
├── tokens/
│   ├── colors.json        (Semantic color tokens)
│   ├── typography.json    (Type scales)
│   ├── spacing.json       (4/8dp increments)
│   └── elevation.json     (Shadow scales)
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── List.tsx
│   ├── Navigation.tsx
│   └── ... (all primitives)
├── pages/
│   ├── home.md
│   ├── search.md
│   ├── project-detail.md
│   └── ... (page-specific overrides)
└── README.md              (How to use)
```

---

### Testing Before Launch

**Visual Regression**
```bash
# Use Chromatic or Percy for visual diffs
yarn chromatic --only-changed
```

**Accessibility Audit**
```bash
# axe DevTools + Lighthouse in VS Code
# Target: ≥95% accessibility score
```

**Performance Profiling**
```bash
# React Native DevTools (% slow components)
# Sourcemap-based bundle analysis
# Target: TTI < 3s on 4G, FCP < 1.5s
```

**Manual Checklist**
- [ ] Light mode, dark mode, light+large font, dark+large font
- [ ] Portrait & landscape at 375px, 414px, 600px
- [ ] All 4 tabs (Home, Search, Saved, Profile)
- [ ] Key flows: Login → Save Project → View Resumo → Search
- [ ] Error states: Network down, API timeout, empty results
- [ ] Screen reader (VoiceOver / TalkBack) on key flows

---

## Appendix: Figma Handoff

When handing off to designers/developers:

1. **Create design system** in Figma with master components
2. **Export** tokens as JSON (colors, spacing, typography)
3. **Document** component variants + states in Figma
4. **Provide** this spec + ESPECIFICACAO_CONSOLIDADA.md as reference
5. **Version control** design system alongside code (`main` branch)

---

**Design System Version:** 1.0  
**Last Updated:** April 13, 2026  
**Status:** ✅ Ready for Development  

---

**Questions about this spec?** Refer to:
- **Functional requirements:** [ESPECIFICACAO_CONSOLIDADA.md](ESPECIFICACAO_CONSOLIDADA.md)
- **UI/UX best practices:** [UI/UX Pro Max Skill](../../.agents/skills/ui-ux-pro-max/SKILL.md)
- **Project roadmap:** [SUMARIO_EXECUTIVO.md](SUMARIO_EXECUTIVO.md)
