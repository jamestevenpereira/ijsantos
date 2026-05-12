# IJ Santos Figma Prototype Spec

Source of truth: current React/TanStack implementation in this repository.

Goal: client-ready high-fidelity clickable prototype based on the website as currently developed.

## Canvas Setup

- File/page name: `IJ Santos - Website Prototype`
- Desktop frame width: `1440px`
- Mobile frame width: `375px`
- Desktop naming: `D - <page name>`
- Mobile naming: `M - <page name>`
- Use the live implementation as the visual reference for spacing, typography, imagery, copy, navigation and UI states.
- Prototype start point: `D - Home` and `M - Home`

## Design Tokens

- Font sans: `Inter`
- Font display: `Plus Jakarta Sans`
- Brand red: `oklch(0.55 0.22 27)` / dark mode `oklch(0.62 0.22 27)`
- Primary surface: charcoal `oklch(0.2 0 0)`
- Background: white `oklch(1 0 0)`
- Surface: light neutral `oklch(0.965 0 0)`
- Border: `oklch(0.9 0 0)`
- Radius base: `12px`
- Header height: desktop `96px`, mobile `80px`

## Required Frames

Create one desktop and one mobile frame for each route:

| Page | Route | Desktop frame | Mobile frame |
| --- | --- | --- | --- |
| Home | `/` | `D - Home` | `M - Home` |
| Servicos | `/servicos` | `D - Servicos` | `M - Servicos` |
| Servico - Construcao Civil | `/servicos/construcao-civil` | `D - Servico - Construcao Civil` | `M - Servico - Construcao Civil` |
| Servico - Remodelacoes | `/servicos/remodelacoes-reabilitacao` | `D - Servico - Remodelacoes` | `M - Servico - Remodelacoes` |
| Servico - Pinturas | `/servicos/pinturas-interiores-exteriores` | `D - Servico - Pinturas` | `M - Servico - Pinturas` |
| Servico - Limpeza Fachadas | `/servicos/limpeza-fachadas` | `D - Servico - Limpeza Fachadas` | `M - Servico - Limpeza Fachadas` |
| Servico - Limpeza Telhados | `/servicos/limpeza-telhados` | `D - Servico - Limpeza Telhados` | `M - Servico - Limpeza Telhados` |
| Servico - Limpeza Pavimentos | `/servicos/limpeza-pavimentos-exteriores` | `D - Servico - Limpeza Pavimentos` | `M - Servico - Limpeza Pavimentos` |
| Portefolio | `/portefolio` | `D - Portefolio` | `M - Portefolio` |
| Sobre | `/sobre` | `D - Sobre` | `M - Sobre` |
| Contacto | `/contacto` | `D - Contacto` | `M - Contacto` |
| Area - Nelas | `/areas/nelas` | `D - Area - Nelas` | `M - Area - Nelas` |
| Area - Viseu | `/areas/viseu` | `D - Area - Viseu` | `M - Area - Viseu` |
| Area - Mangualde | `/areas/mangualde` | `D - Area - Mangualde` | `M - Area - Mangualde` |
| Area - Tondela | `/areas/tondela` | `D - Area - Tondela` | `M - Area - Tondela` |
| Area - Carregal do Sal | `/areas/carregal-do-sal` | `D - Area - Carregal do Sal` | `M - Area - Carregal do Sal` |
| Area - Seia | `/areas/seia` | `D - Area - Seia` | `M - Area - Seia` |
| Area - Gouveia | `/areas/gouveia` | `D - Area - Gouveia` | `M - Area - Gouveia` |
| Area - Coimbra | `/areas/coimbra` | `D - Area - Coimbra` | `M - Area - Coimbra` |
| Privacidade | `/privacidade` | `D - Privacidade` | `M - Privacidade` |
| Resolucao de Litigios | `/resolucao-litigios` | `D - Resolucao de Litigios` | `M - Resolucao de Litigios` |
| 404 | unmatched route | `D - 404` | `M - 404` |

Total: 22 pages x 2 breakpoints = 44 primary frames.

## Prototype Links

Global navigation:

- Logo -> Home
- Home -> `/`
- Servicos -> `/servicos`
- Portefolio -> `/portefolio`
- Sobre -> `/sobre`
- Contacto -> `/contacto`
- CTA "Pedir orcamento" -> `/contacto`
- Phone links can be represented as external/tap states.
- WhatsApp FAB can be represented as an external/tap state.

Service cards:

- Each service card -> matching service detail frame.
- Service detail CTA -> Contacto with selected service state.
- "Other services" cards -> corresponding service detail frames.

Area chips:

- Local area chips -> matching area frame.
- Area CTA -> Contacto.

Footer:

- Legal links -> Privacidade and Resolucao de Litigios.
- Main nav links -> matching page frames.

Portfolio:

- Category filters should use interactive component variants.
- Gallery item tap/click -> lightbox overlay state.
- Lightbox close -> Portefolio frame.
- Prev/next arrows -> alternate lightbox image states.
- Pagination buttons -> page variant state.

Contact form:

- Step 1 service selection -> Step 2 form state.
- Step 2 valid name/phone -> Step 3 summary state.
- Back buttons -> previous step states.
- Submit loading -> loading button state.
- Success/error toast -> toast overlay states.
- WhatsApp alternative -> external/tap state.

Cookie consent:

- Initial banner state.
- Preferences modal state.
- Accepted/declined hidden state.

Header:

- Desktop default state.
- Desktop scrolled state with border/shadow.
- Desktop post-hero urgency chip state.
- Mobile closed state.
- Mobile menu open state.
- Mobile post-hero compact CTA state.
- Theme toggle light/dark states.
- Language switch PT/EN states.

FAQ:

- Default first item open.
- Collapsed item state.
- Open item state.

## Components To Create In Figma

- Header / desktop
- Header / mobile
- Footer
- Primary CTA button
- Secondary/outline button
- Service card
- Portfolio thumbnail
- Portfolio filter chip
- Stat item
- Trust badge
- FAQ row
- Quote form progress step
- Quote form field
- Contact info card
- CTA band
- Cookie banner/modal
- WhatsApp floating action button
- Mobile bottom CTA

## Presentation Flow

Recommended client walkthrough:

1. Home
2. Servicos
3. One service detail page
4. Portefolio with filter and lightbox
5. Sobre
6. Contacto form steps
7. One area page
8. Mobile menu and mobile contact flow
9. Cookie preferences and legal pages only if needed

## Verification Notes

Validated locally:

- Production build passes with `npm.cmd run build`.
- Local dev server runs at `http://127.0.0.1:3000/`.
- All canonical routes above respond with HTTP 200.

Current limitation:

- This Codex session can inspect/read Figma context and create Code Connect mappings, but it does not expose a Figma frame-creation tool. The frames above therefore need to be created manually in Figma, or via a Figma plugin/API workflow outside this session.
