# IJ Santos — Modern Website Redesign Prototype

A complete, premium frontend redesign for IJ Santos (construção civil + limpezas exteriores). Multi-page TanStack Start site, European Portuguese copy, polished and conversion-focused.

## Brand & Visual Direction

- **Palette**: white background, charcoal `#111827` text, deep slate `#1E293B` for surfaces, single muted accent (amber/ochre `#C2853B` evoking construction + warmth), soft neutrals for cards.
- **Typography**: Inter for UI/body, a strong display sans (e.g. `Plus Jakarta Sans` or `Space Grotesk`) for headlines. Tight tracking, large H1s, generous line-height.
- **Aesthetic**: lots of whitespace, large editorial imagery, subtle borders, soft shadows, rounded-lg cards, restrained micro-interactions (hover lifts, fade-ins on scroll).
- **Imagery**: high-quality Unsplash placeholders (construction sites, façades, pressure washing, before/after pairs).

## Site Structure (TanStack routes)

```
src/routes/
  __root.tsx           Sticky header + footer shell
  index.tsx            Homepage
  servicos.tsx         Services overview
  servicos.$slug.tsx   Reusable service detail template
  sobre.tsx            About
  contacto.tsx         Contact
```

Each route gets its own SEO `head()` (title, description, og:*).

### Shared layout
- **Sticky header**: logo wordmark "IJ SANTOS", nav (Início, Serviços, Sobre, Contacto), phone number + primary CTA "Pedir Orçamento". Mobile: slide-in sheet menu.
- **Footer**: brand block, services links, contact info, area de atuação, ano + copyright, small "Pedir Orçamento" CTA.
- **Floating WhatsApp button** on all pages (bottom-right).

### 1. Homepage (`/`)
1. **Hero** — full-width image with dark overlay, H1 "Construímos e cuidamos do que é seu.", subheadline, dual CTA (Pedir Orçamento / Ligar Agora), trust strip (anos experiência, projetos, avaliação).
2. **Intro** — 2-column: short company statement + key stats (15+ anos, 500+ obras, resposta <24h).
3. **Serviços principais** — 6 service cards in a clean grid with icon, title, 1-line desc, "Saber mais →".
4. **Porquê escolher-nos** — 4 trust pillars (Experiência, Qualidade, Pontualidade, Acompanhamento).
5. **Como trabalhamos** — 4-step process with numbered cards (Contacto → Visita técnica → Orçamento → Execução).
6. **Antes / Depois** — interactive before/after slider for façade washing, plus a small project highlights grid.
7. **Testemunhos** — 3-card carousel with name, role, quote, star rating.
8. **Área de atuação** — short block with map placeholder + cities served.
9. **CTA band** — dark slate full-width "Peça o seu orçamento gratuito" with form-launch buttons.
10. **Contacto preview** — phone, email, WhatsApp, hours.

### 2. Services page (`/servicos`)
- Page hero with title + subtitle
- Two grouped sections: **Construção & Remodelação** and **Limpezas Exteriores**, each with rich service cards linking to detail pages
- Mid-page CTA band

Service catalog (each with slug + detail page):
- `construcao-civil` — Construção Civil
- `remodelacoes` — Remodelações & Reabilitação
- `pinturas` — Pinturas Interiores e Exteriores
- `limpeza-fachadas` — Limpeza de Fachadas
- `limpeza-telhados` — Limpeza e Tratamento de Telhados
- `limpeza-pavimentos` — Limpeza de Pavimentos Exteriores

### 3. Service detail template (`/servicos/$slug`)
Reusable layout driven by a local `services` data file:
- Breadcrumb + hero (image, H1, short pitch, CTA)
- Visão geral (2-col text + image)
- Benefícios (icon grid, 4–6 items)
- O nosso processo (numbered steps)
- Casos de uso ideais (chips/list)
- Galeria (4–6 image grid, lightbox-light)
- FAQ acordeão (3–4 perguntas)
- CTA final

### 4. About (`/sobre`)
- Hero with company portrait/site image
- Quem somos (story)
- Missão, Visão, Valores (3 cards)
- Presença local + zonas servidas
- Equipa / compromisso
- Trust strip (números) + CTA

### 5. Contact (`/contacto`)
- Hero with title and short invitation
- 2-col layout: **Form** (Nome, Email, Telefone, Tipo de serviço select, Mensagem, submit "Pedir Orçamento") + **Info side** (telefone, WhatsApp, email, morada, horário, redes)
- Map placeholder (styled iframe-shaped block) below
- Final reassurance line ("Resposta em menos de 24h")

## Content (European Portuguese)
Polished, concise, trust-led copy throughout. Sample CTAs: "Pedir Orçamento", "Fale Connosco", "Solicitar Contacto", "Ligar Agora", "WhatsApp". Headings use action-oriented service language for SEO ("Limpeza de Fachadas em [região]", etc.).

## Component Architecture
```
src/components/
  layout/        Header, Footer, WhatsAppFAB, Container
  sections/      Hero, ServiceGrid, ProcessSteps, BeforeAfter,
                 Testimonials, TrustStrip, CTABand, StatsRow
  ui/            (existing shadcn primitives reused)
  service/       ServiceCard, ServiceDetailLayout, FAQ
  forms/         QuoteForm, ContactForm (client-side only, toast on submit)
src/data/
  services.ts    Service catalog (slug, title, hero, benefits, process, FAQ, gallery)
  testimonials.ts
  company.ts     Phone, email, WhatsApp, address, hours
```

## Technical Notes
- TanStack Start file routes; each route exports `head()` with route-specific SEO.
- Tailwind v4 tokens extended in `src/styles.css` for brand color + display font.
- Forms are prototype-only (no backend) — submit shows success toast via existing `sonner`.
- Before/After uses a lightweight custom slider component (no new heavy deps).
- All images via Unsplash URLs; lazy-loaded.
- Fully responsive, mobile-first, sticky header, accessible focus states, AA contrast.

## Out of Scope (prototype)
- Real form submission / email delivery
- CMS / blog
- Auth, database, payments
- Real map embed key (styled placeholder used)

After approval I will scaffold the routes, shared layout, data files, and all sections in one pass.