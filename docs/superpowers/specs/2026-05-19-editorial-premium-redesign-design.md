# Editorial Premium Redesign — Design Spec

**Date:** 2026-05-19  
**Scope:** Homepage + all internal pages  
**Direction:** Editorial Premium — asymmetric layouts, bento grid, photography-forward, broken grid sections  
**Wireframe reference:** `.superpowers/brainstorm/20-1779192027/content/full-homepage-v2.html`

---

## Design Principles

1. **Photography leads.** Real construction photos are the credibility signal. Never bury them behind gradients or small containers.
2. **Asymmetry over grids.** Break the "label → h2 → 3-col grid" formula that makes AI sites look identical.
3. **Color rhythm.** Pages alternate: dark → light → surface → dark → light, never three light sections in a row.
4. **Red used sparingly.** Brand red on CTAs, key numbers, accent lines, and active states only — not decorative fill.
5. **Typography has moments.** Section numbers (`01 —`), large decorative digits (`20`), and serif display (`font-family: Georgia`) for hero/featured headings.
6. **Grain texture on dark sections.** The existing `.grain` utility gets applied to dark backgrounds for tactile depth.

---

## Design Tokens (unchanged)

All existing tokens in `src/styles.css` are preserved:

| Token | Light | Dark |
|---|---|---|
| `--brand` | `oklch(0.55 0.22 27)` | `oklch(0.62 0.22 27)` |
| `--primary` (dark surfaces) | `oklch(0.2 0 0)` | `oklch(0.22 0 0)` |
| `--background` | `oklch(1 0 0)` | `oklch(0.14 0 0)` |
| `--surface` | `oklch(0.965 0 0)` | `oklch(0.18 0 0)` |
| Font sans | Inter | — |
| Font display | Plus Jakarta Sans | — |
| Serif moments | Georgia (inline) | — |

---

## Homepage — Section-by-Section Spec

### 01 · Header
No structural change. Existing sticky/scroll behavior, aria attributes, and mobile menu preserved. Style update: active nav item uses a `::after` red underline (already implemented). No changes required.

### 02 · Hero — Full-bleed + Solid Block

**Layout:**
- Full-bleed construction photo covering 100% of the section.
- Horizontal scan line texture overlay (`repeating-linear-gradient`) at ~1% opacity for depth.
- Pill badge top-left: `Nelas · Viseu · Região Centro` with red dot, glass border, `backdrop-blur`.
- **Solid block** bottom-left, width ~50%, `bg-primary` (`oklch(0.2 0 0)`), `border-top: 3px solid brand`.
  - Inside block: overline with leading red line + uppercase text, serif `h1` (Georgia), subtext, two CTAs.
  - `h1` text: `"A sua obra. Feita bem. Desde o início."` (highlight word in brand red).
- **Stats column** floating right, vertically centered: 3 stat cards (`20+`, `500+`, `98%`) with glass borders (`rgba(white, 0.08)`), right-aligned numbers in white, brand-red `+`/`%` suffixes.

**Mobile:** Block takes full width, stats stack inside the block below the CTAs.

**Replaces:** current Hero. `Stats` section is removed as standalone; stats live here.

### 03 · Serviços — Bento Grid

**Layout:** CSS Grid, `grid-template-columns: 2fr 1fr 1fr`, `grid-template-rows: auto auto`.

| Card | Size | Background | Notes |
|---|---|---|---|
| Construção Civil | 2-col × 2-row (feature) | Dark photo + overlay | Large serif name, `font-size: 22px+` |
| Remodelações | 1-col × 1-row | Dark photo + overlay | Standard |
| Pinturas | 1-col × 1-row | Solid brand red | White text |
| Limpeza Fachadas | 1-col × 1-row | `--surface` (light) | Dark text, red tag |
| Limpeza Telhados | 1-col × 1-row | Dark photo + overlay | Standard |

Each card: service tag top (8px uppercase), service name bottom-left, arrow circle top-right. On hover: photo `scale(1.04)`, arrow circle brightens. Section background: `--surface`.

**Replaces:** current 3-col `ServiceCard` grid.

### 04 · Sobre — Asymmetric Split

**Layout:** `grid-template-columns: 1.1fr 0.9fr`, photos left, text right.

Photo grid (left): `grid-template-columns: 1.2fr 0.8fr`, `grid-template-rows: ~280px ~140px`.
- Tall photo spans both rows (col 1).
- Top-right: second construction photo.
- Bottom-right: solid brand-red card with "Desde 2004" label.

Text (right):
- Decorative large number `20` in `color: --surface` (near-invisible), creates depth behind heading.
- Section label, `h2`, body text, `→ Conhecer a nossa história` link.

**Replaces:** current 2-photo `mt-8` offset grid (no structural logic change, visual upgrade only).

### 05 · WhyUs — Dark Editorial Band

**Layout:** Dark section (`bg-primary`). Header row: h2 left, subtitle right. Below: 4-column list separated by `border-right: 1px solid rgba(white, 0.07)`.

Each item:
- `01 —` number in brand-red monospace (`font-family: monospace`).
- Title in white serif (`Georgia`).
- Description in `rgba(white, 0.38)`.

**Replaces:** current 4 icon cards in `bg-card`. No icons needed — the numbered list pattern is more editorial and distinctive.

### 06 · ProcessSteps — Horizontal Timeline

**Layout:** 4-column grid with a horizontal `::before` connector line (`height: 1px`, `bg: --border`) running between the node centers.

Each step:
- Red filled circle (`bg-brand`, `w-10 h-10`, white step number) with `box-shadow: 0 0 0 4px bg, 0 0 0 5px border` halo.
- Title below in `font-display font-semibold`.
- Description in `text-muted-foreground text-sm`.

The connector line is positioned at `top: 20px` (center of the dot), spanning `left: calc(12.5% + 4px)` to `right: calc(12.5% + 4px)` to connect dot centers.

**Replaces:** current 4 cards with large `text-brand/30` number. Connector line is new.

### 07 · Em Vídeo — Dark Section

**Layout:** Dark section (`bg-primary` / `#0d0d0d`). Section label + h2 in white. 2-column grid of video cards (`aspect-video`).

Each video card:
- Poster image or dark gradient background.
- Gradient overlay `from-primary/85` bottom-up.
- Centered red play button (circle, `bg-brand`, `w-16 h-16`) with `scale(1.1)` on hover.
- Video title bottom-left over overlay. No duration field — `videos` data model only has `title`, `src`, `poster`; no schema change needed.

Modal behavior (Escape to close, focus trap, body scroll lock) is unchanged from current implementation.

**Replaces:** current `VideosSection` with same logic, updated styles to use dark section background instead of `bg-surface`.

### 08 · Antes & Depois — Slider

**No logic changes.** The slider interaction (mouse/touch drag, keyboard arrows, aria attributes) is preserved exactly.

**Style updates only:**
- Section background: `--surface` (currently white `py-20`).
- Slider border-radius: `rounded-2xl` → kept.
- "Antes" label: white pill with border (currently `bg-background/90`).
- "Depois" label: `bg-brand` (already correct).
- Handle circle: `bg-brand` with `shadow-lg` (already correct).

### 09 · TrustBand

**No structural change.** Already redesigned as dark horizontal strip in recent commit `a35d323`. Only cosmetic: icon squares get `rounded-sm` treatment. Verified consistent with spec direction.

### 10 · Testimonials — Featured Quote + Mini Grid

**Layout:** Section background white. Header (label + h2). Then:

**Featured block** (`bg-primary`, `border-radius: rounded-xl`):
- Decorative `"` character, `font-size: ~120px`, `color: rgba(brand, 0.12)`, absolute positioned top-left.
- 5 stars in brand red.
- Quote in white serif (`Georgia`, `text-lg font-bold`, `leading-relaxed`), highlight key phrase in brand red.
- Author row: avatar circle (`bg-brand` gradient, initials), name (white), role (`rgba(white, 0.35)`).

**Mini grid** (`grid-cols-2`, below featured): 2 simpler cards (`bg-card`, `border`), stars, italic quote, author.

**Replaces:** current 3 identical `figure` cards. Featured block makes one testimonial the hero, two support.

### 11 · Blog & Artigos — Editorial Cards

**No structural change to data or routing.** Style updates:

- Section background: `--surface`.
- Cards: `rounded-xl` (from `rounded-2xl`), `border-border`, white background.
- Image: `aspect-[16/9]` kept, `group-hover:scale-105` kept.
- Category badge: `bg-brand` pill top-left (already exists).
- Meta: date + `·` + clock icon + read time (already exists).
- "Ler artigo" link in brand red with animated gap (already exists).

Minimal change — cards already have good structure, just need alignment with the new spacing/surface system.

### 12 · Localização & Área de Atuação

**No structural change.** Existing `CompanyMap` component left, text + area chips right.

**Style updates:**
- Section background: white (`bg-background`).
- Map container: `rounded-2xl`, `aspect-[4/3]`, `border border-border`.
- Area chips: `rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium` (already close to current).

**New detail:** chips get `hover:border-brand hover:text-brand transition-colors` for interactivity feel.

### 13 · CTABand

**Layout:** `bg-primary` full-width. Top red gradient line (`height: 3px`, `from-brand to-transparent`). Flex row: text left, decorative `"24h"` ghost number right (absolute, `rgba(white, 0.02)`, `font-size: ~140px`).

Text: label (red uppercase), h2 (white serif, max-w ~400px), two CTAs.

**Replaces:** current `CTABand`. Gradient top line and ghost number are new.

### 14 · Footer

**No structural change.** Red hairline `border-top` separator above footer already implemented in commit `9aa4256`. Existing 4-column grid kept.

---

## Internal Pages

### /servicos (Services listing)
- Hero: photo banner with dark overlay, page title, breadcrumb.
- Grid: same bento approach adapted to 6 services. On smaller viewports, collapses to 2-col then 1-col.

### /servicos/:slug (Service detail)
- Hero: full-width photo (service-specific), dark overlay block with title and CTA. Same pattern as homepage hero but shorter (`h-[340px]` vs `h-[440px]`).
- Content: 2-column editorial layout — body text left, sidebar (key facts, CTA card) right.
- "Outros serviços" strip at bottom: horizontal row of 3 other service cards.

### /portefolio (Portfolio)
- Hero: same short hero pattern.
- Filter chips: `rounded-full` category filters (already exist), styled with `bg-brand` active state.
- Gallery: masonry-style 3-col grid on desktop (`grid-cols-3`), items have varying `aspect-ratio`. Each card: photo fill, category chip, title overlay on hover.
- Lightbox: unchanged.

### /sobre (About)
- Hero: team photo full-bleed, dark block overlay (same hero pattern as other internal pages).
- Timeline section: company history as a vertical timeline with year markers in brand red. Uses existing copy from i18n; no new data fields required.
- Team section: if team data exists in `src/data/`, render editorial cards (photo + name + role). If not, this section is skipped — no new data model introduced.

### /contacto (Contact)
- Multi-step form: unchanged logic. Style update: step indicators use brand-red filled circles (same pattern as ProcessSteps).
- Layout: 2-col on desktop — form left, contact info + map right.

---

## Component Architecture

No new components are created where existing ones can be extended. The plan renames/refactors:

| Current | Change |
|---|---|
| `Hero.tsx` | Full rewrite |
| `Stats.tsx` | Deleted — content moved into Hero |
| `WhyUs.tsx` | Full rewrite |
| `ProcessSteps.tsx` | Rewrite (add connector line) |
| `Testimonials.tsx` | Full rewrite |
| `ServiceCard.tsx` | Kept for `/servicos` listing page. Homepage bento uses an inline grid in `index.tsx`, not ServiceCard. |
| `VideosSection.tsx` | Style-only update |
| `BeforeAfter.tsx` | Style-only update |
| `BlogPreview.tsx` | Style-only update |
| `CTABand.tsx` | Rewrite |
| `Footer.tsx` | No change |
| `Header.tsx` | No change |
| `TrustBand.tsx` | No change |
| `CompanyMap.tsx` | No change |

---

## What Does NOT Change

- All i18n keys and translation strings (no copy changes).
- TanStack Router structure and file-based routing.
- Supabase/data layer.
- Accessibility: aria attributes, focus rings, skip link, keyboard navigation, reduced-motion support.
- Dark mode: all new components use CSS custom properties, not hardcoded hex values.
- shadcn/ui components for interactive elements (Button, Dialog, etc.).
- Animation hooks (`useInView`, `fadeUp`, `CountUp`).
- SEO meta, structured data, sitemap.

---

## Out of Scope

- Blog article templates (`/blog/:slug`) — editorial style improvements deferred.
- Area pages (`/areas/:slug`) — template improvements deferred.
- Admin panel — no changes.
- New photography — uses existing assets. Client to provide additional photos if desired.
