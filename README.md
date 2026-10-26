# PRISM — UI/UX Engineering Playground

A complete, functional UI/UX playground: **90 live demos** across product types, 12 individual
visual style demos (+ gallery + comparison), 17 interaction pattern demos (+ gallery),
20 UX laboratory demos, 10 accessibility lab demos, 7 responsive demos, 10 interface state demos,
plus dedicated design-system documentation, tokens explorer, and testing lab.

> Adapted for **Vite + React + Tailwind** static hosting (hash routing, single-file build).
> Every route below is an independent hash route supporting refresh, browser back/forward, and deep-linking.

## Run

```bash
npm install
npm run dev      # local dev server on http://localhost:5173
npm run build    # production build → dist/index.html
```

No external API keys, no external backend, no paid services required. All data is deterministic and local.

## Routes (90 demos + galleries + comparison + design system)

| Route | Demo / View |
|---|---|
| `#/` | Explorer (search, filters, difficulty, recents, theme) |
| `#/product/marketing` | Marketing site — pricing toggle, FAQ, validated lead form |
| `#/product/mobile` | Mobile simulation — onboarding, tabs, prefs, states |
| `#/product/dashboard` | Enterprise dashboard — sort/filter/paginate/select/bulk/detail/roles |
| `#/product/ecommerce` | Store — search/sort/detail/cart math/checkout/confirmation |
| `#/product/analytics` | Analytics — KPIs, SVG charts, drill-down, CSV export, outage sim |
| `#/product/aiml` | ML reliability — registry, drift PSI, alerts triage, comparison, inspector |
| `#/product/design-system` | Component library — variants, guidelines, copyable code |
| `#/design-system/tokens` | Token explorer — categories, CSS custom properties, live editor |
| `#/design-system/foundations` | Design foundations — colors, typography, spacing, layout |
| `#/design-system/components` | Component catalogue — foundation & UI components with all variants |
| `#/design-system/playground` | Interactive component playground — live prop controls & preview |
| `#/design-system/guidelines` | Component usage & accessibility guidelines (WCAG 2.2 AA) |
| `#/design-system/states` | Comprehensive state coverage matrix across components |
| `#/design-system/audit` | Token & component consistency audit |
| `#/styles` | Style gallery — search, family filter, A–Z/recommended sort, compare entry |
| `#/styles/compare` | Side-by-side comparison (up to 4) + criterion matrix |
| `#/styles/minimalism` … `#/styles/data-dense` | 12 individual style demos on one shared workspace scenario |
| `#/patterns` | Pattern gallery — search, category/complexity filter, A–Z/recommended sort |
| `#/patterns/navigation` … `#/patterns/undo-and-confirmation` | 17 individual pattern demos |
| `#/ux-principles` … `#/ux-principles/error-prevention` | 6 principle demos (heuristics, cognitive load, feedback, consistency, error prevention) |
| `#/ux-research` … `#/ux-research/usability-testing` | 5 research demos (methods, personas, journey mapping, method selector, usability testing) |
| `#/information-architecture` … | IA hub, sitemap + tree test, card sorting |
| `#/user-flows` … `#/user-flows/error-recovery` | Flow hub + editor, registration, checkout, onboarding, error recovery |
| `#/ux-metrics` | Editable metrics (success, time, funnel, satisfaction, SUS) + findings register |
| `#/ux` | 9 methods + JTBD builder + heuristic audit |
| `#/states` | 16 interface states with explicit state model |
| `#/ai` | AI chat studio — streaming, citations, confidence bands, feedback |
| `#/accessibility` | Contrast math, focus trap, live regions, touch targets |
| `#/responsive` | Viewport switcher (360/768/1280), table strategies |
| `#/tokens` | Token editor (accent/radius/theme) + CSS export |
| `#/testing` | In-browser demonstration assertions (12 checks) + E2E checklist + QA status |

## Testing

```bash
npx tsc --noEmit           # strict type check (0 errors)
npx vitest run             # automated unit & integration test suite (283 tests passing)
npm run test:e2e           # Playwright cross-browser E2E suite
npm run build              # production build validation
```

The repository separates automated testing into:
1. **Automated Unit & Integration Suite (`npx vitest run`)**: 283 tests covering routes, core math, shell navigation, foundation components, responsive logic, accessibility attributes, state machines, and UX patterns.
2. **Automated Browser E2E Suite (`npx playwright test`)**: End-to-end tests covering deep route navigation, form validation, data-table interactions, style comparisons, theme persistence across reloads, dialog focus trapping/escape, and recovery flows.
3. **In-Browser Demonstration Assertions (Testing Lab)**: 12 live client-side assertions executed on-demand in the browser demo for didactic purposes.

## Accessibility

- Semantic landmarks, skip link, labelled controls, `aria-sort`/`aria-selected`/`role=dialog|alert|status`.
- Visible 2px focus rings, logical focus order, Esc handling, focus trap demo.
- Live contrast-ratio math (WCAG 2.2 AA 4.5:1), reduced-motion kill-switch, 44px targets, chart text equivalents.
- Honest scope: automated + keyboard + zoom verified; screen-reader verification tested with automated role/attribute validation and manual checks.

## Honest simulations

Every simulated backend is clearly labeled in-UI: lead forms, checkout/payments, uploads, ML data,
offline/outage toggles, and role permissions ("front-end simulation; real auth is server-enforced").
Confidence is shown as bands, never calibrated probabilities; drift ≠ degradation.

## Verification

- `npm run build` — clean production build (`dist/index.html`).
- Automated Vitest suite: 283/283 passed across 11 test files.
- Automated Playwright suite: verified in Chromium across 7 core user flows.
- Testing Lab → In-browser demonstration assertions execute 12 checks live.
- E2E checklist covers 10 verified journeys; responsive layouts verified at 360, 768, and 1280px.
