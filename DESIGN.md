# IJ Santos — Design Reference

This document is the single source of truth for visual and UX decisions on the IJ Santos website. Read it before designing or editing any UI component.

---

## Brand Identity

**Company:** Irmãos J. Santos, Lda. — a Portuguese construction and exterior cleaning company based in Nelas, Viseu.

**Personality:** Solid. Trustworthy. Local. Craft-focused. Not flashy — precise.

**Tone:** Professional and direct, never corporate. A skilled tradesman who takes pride in work. No buzzwords, no exaggeration.

---

## Color System

All colors use CSS design tokens. Never hardcode hex or rgb values — always use the token.

| Token | Value (light) | Usage |
|---|---|---|
| `bg-background` | white | Page background |
| `bg-surface` | near-white (#f5f5f5) | Alternating section backgrounds |
| `bg-primary` | deep charcoal `oklch(0.2 0 0)` | Hero, CTABand, Footer, dark sections |
| `text-primary-foreground` | near-white | Text on `bg-primary` sections |
| `text-foreground` | near-black | Body text on light backgrounds |
| `text-muted-foreground` | medium gray | Secondary/supporting text |
| `text-brand` / `bg-brand` | IJ Santos red `oklch(0.55 0.22 27)` | Accent color — labels, icons, CTAs, active states |
| `bg-brand-foreground` | near-white | Text on brand-red buttons |
| `border-border` | light gray | Card and section borders |

### Color rules
- **Brand red is accent-only.** Never use it as a background for full sections. It belongs on: buttons, icon backgrounds, category badges, label text, horizontal rules between dark sections.
- **Dark sections** (`bg-primary`) are: Hero, Stats band, CTABand, Footer. They read as one visual "dark zone" at the top and bottom of pages.
- **Light sections** alternate between `bg-background` (white) and `bg-surface` (near-white) to create visual rhythm.
- The `border-t-[3px] border-brand` pattern on the `<Footer>` acts as the architectural cap between CTABand and Footer — a red rule, like a steel beam. Do not remove it.

---

## Typography

| Role | Font | Weight | Size | Class |
|---|---|---|---|---|
| Display / Headings | Plus Jakarta Sans | 700–800 | 3xl–6xl | `font-display font-bold` |
| Section labels | Plus Jakarta Sans | 600 | xs, uppercase | `font-display font-semibold text-xs uppercase tracking-[0.2em] text-brand` |
| Body | Inter | 400–500 | base–lg | (default) |
| Meta / legal | Inter | 400 | xs | `text-xs text-muted-foreground` |

### Typography rules
- **Section labels** always follow this pattern: `text-xs font-semibold uppercase tracking-[0.2em] text-brand` — the wide letter-spacing makes them feel editorial.
- **H1/H2 headlines** use `text-balance` for multi-line wrapping and `tracking-tight` for tighter optical weight.
- Body paragraphs on dark backgrounds use `text-primary-foreground/75` or `/80` for reduced intensity — full white is too harsh.
- Legal/meta text uses `text-primary-foreground/50` or `text-muted-foreground`.

---

## Spacing

The site uses a consistent vertical rhythm of `py-20 md:py-28` for standard sections and `py-16 md:py-20` for tighter feature bands.

| Context | Class |
|---|---|
| Standard section | `py-20 md:py-28` |
| Compact band (Stats, TrustBand, CTABand) | `py-16 md:py-20` |
| Footer internal | `py-16` |
| Container max-width | `mx-auto max-w-7xl container-px` |

**Never** use `mt-*` on top-level layout components (Footer, CTABand) to create space — sections manage their own vertical padding internally.

---

## Section Rhythm

Pages should alternate background colors to create visual breathing room:

```
Hero          → bg-primary (dark)
Stats         → bg-primary (dark, flows from hero)
About / Body  → bg-background (white)
Services      → bg-surface (light gray)
Why Us        → bg-background
Process       → bg-surface
...
CTABand       → bg-primary (dark)
──────────── [3px brand-red border] ───────────
Footer        → bg-primary (dark)
```

Consecutive same-color sections must be **intentional** (hero+stats, CTA+footer). Random same-color collisions create visual mud.

---

## Component Patterns

### Buttons

**Primary CTA (on dark background):**
```tsx
className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition"
```

**Secondary CTA (on dark background):**
```tsx
className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold hover:bg-primary-foreground/10 transition"
```

**Text link (brand color):**
```tsx
className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all"
```
Always include an `<ArrowRight className="h-4 w-4" />` icon on directional links.

### Cards
```tsx
className="rounded-2xl border border-border bg-card overflow-hidden hover:border-brand/40 transition-all hover:-translate-y-1 hover:shadow-lg"
```
Cards lift on hover (`-translate-y-1`) and get a brand-tinted border.

### Section labels
Every content section opens with a colored label above the heading:
```tsx
<span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
  Label text
</span>
<h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
  Heading
</h2>
```

### Dark section text hierarchy
On `bg-primary` sections:
- Heading: `text-primary-foreground` (full intensity)
- Body: `text-primary-foreground/80` or `/75`
- Meta/icons: `text-primary-foreground/50`
- Brand accent: `text-brand` (for labels, icons)

---

## CTABand → Footer Transition

The `<CTABand>` and `<Footer>` both use `bg-primary`. They form a unified dark zone at the bottom of every page. They are separated by a **3px brand-red top border** on the footer (`border-t-[3px] border-brand`) — an architectural element, not an afterthought.

```
╔══════════════════════════════════╗
║  CTABand  (bg-primary)           ║  ← call to action
╠══[3px brand red]═════════════════╣  ← border-t-[3px] border-brand on <footer>
║  Footer  (bg-primary)            ║  ← information + links
╚══════════════════════════════════╝
```

Do not replace this with a thin `/10` opacity line — it reads as a mistake, not a design decision.

---

## Animations

All scroll-triggered animations use the `useInView` hook with `fadeIn` or `fadeUp` helpers from `@/hooks/useInView`. Stagger sibling items with `style={{ transitionDelay: \`${i * 100}ms\` }}`.

Page transitions use the `.page-transition` CSS class (opacity + translateY fade-in at 0.28s).

---

## Accessibility

- All interactive elements must have visible focus states (Tailwind defaults handle this via `ring`).
- Images must have descriptive `alt` text.
- `<time dateTime={iso}>` for all dates.
- Semantic HTML: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`.

---

## What to Avoid

- **No purple gradients, glass morphism, or generic SaaS aesthetics.** This is a trades company, not a tech startup.
- **No Inter as display font.** Plus Jakarta Sans is the display face; Inter is body-only.
- **No `mt-*` on Footer or CTABand** to create spacing. Use section-internal padding.
- **No inline color values.** Use design tokens exclusively.
- **No full-brand-red section backgrounds.** Brand red is an accent — keep it that way.
- **No light footers.** The footer is dark by brand decision — it anchors the page.
