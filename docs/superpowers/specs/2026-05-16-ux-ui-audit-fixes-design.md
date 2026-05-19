# Design Spec: UX/UI Audit Fixes — IJ Santos Website
**Date:** 2026-05-16  
**Approach:** Grouped by file (Approach A) — all changes in one session, each file edited once.

---

## Context

Full UI/UX audit identified 15 issues across accessibility, performance, visual hierarchy, and code quality. User approved implementing all of them. TrustBand will be redesigned as a dark horizontal strip to differentiate it from WhyUs. Hero image will be used as OG image stopgap until a proper 1200×630 photo is available.

---

## Changes by File

### 1. `src/styles.css`

**Fix #10 — Darken `muted-foreground` for safer contrast**

- Light mode: `oklch(0.45 0 0)` → `oklch(0.40 0 0)` (~5.8:1 on white, safe WCAG AA headroom)
- Dark mode: `oklch(0.7 0 0)` is already sufficient — no change needed

---

### 2. `src/routes/__root.tsx`

**Fix #2 — Add skip-to-content link**

- Add `<a href="#main-content">` as the first element inside `<body>`, styled `sr-only` with `focus:not-sr-only` to appear on keyboard focus
- Styled with brand red background, white text, fixed position top-left when focused
- Add `id="main-content"` to the `<main>` element in `RootComponent`

**Fix #11 — OG image: use hero image as stopgap**

- The hero image lives at `src/assets/hero-construction.jpg` (ES module import, not in `public/`). OG image URLs must be stable public paths, so we copy it to `public/og-image.jpg`.
- Change `OG_IMAGE` from `${SITE_URL}/logo.png` to `${SITE_URL}/og-image.jpg`.
- Twitter and OG meta tags both reference `OG_IMAGE`, so one change covers both.

**Fix #5 — Font preload hint**

- Add `{ rel: "preload", as: "style", href: "<google-fonts-url>" }` before the font stylesheet entry in the `links` array. This tells the browser to fetch the font CSS file earlier in the waterfall.
- The `display=swap` in the existing Google Fonts URL already prevents FOIT — the preload hint reduces the delay before font CSS is parsed, shrinking the FOUT window.
- Use the exact same URL already in the stylesheet link so the browser doesn't make a duplicate request.

---

### 3. `src/components/layout/Header.tsx`

**Fix #1 — Hamburger button `aria-expanded`**

- Add `aria-expanded={open}` to the hamburger `<button>`
- Add `aria-controls="mobile-nav"` to the button
- Add `id="mobile-nav"` to the mobile dropdown `<div>`

**Fix #3 — Focus rings on desktop nav links**

- Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm` to each `<Link>` in the desktop nav
- Same treatment for the `<a>` phone link in the desktop header

**Fix #3 — Focus rings on language switcher buttons**

- Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm` to the EN and PT `<button>` elements in `LanguageSwitcher`

**Fix #6 — Replace `max-width` animation with opacity+transform**

- Desktop urgency tag (line ~114): replace `style={{ maxWidth: ... }}` with `className` using `opacity-0 scale-95` → `opacity-100 scale-100` transition, keeping `overflow-hidden pointer-events-none` when hidden
- Mobile CTA span (line ~131): same treatment — opacity+transform instead of `maxWidth`
- Use `transition-all duration-300` with `will-change-transform` where needed

---

### 4. `src/components/sections/TrustBand.tsx`

**Fix #7 — Redesign as dark horizontal strip**

Full redesign. Replace the 4-card grid layout with a horizontal band:

- Background: `bg-primary text-primary-foreground` (same dark charcoal as footer/hero)
- Layout: `grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8` — no card borders, no card backgrounds
- Each item: `flex items-center gap-3` — icon inline with title only (drop the description text to keep it scannable)
- Icon: `h-5 w-5 text-brand` with no background container (lighter visual weight)
- No section title heading — the items speak for themselves
- Padding: `py-10 md:py-12` — shorter than the card version

This differentiates TrustBand from WhyUs (which keeps its full card layout with titles + descriptions).

---

### 5. `src/components/sections/ProcessSteps.tsx`

**Fix #8 — Remove the invisible step connector**

- Delete lines 45–47 (the `{i < steps.length - 1 && <div className="hidden md:block absolute..." />}` connector)
- The `01`/`02`/`03`/`04` step numbers already communicate sequence clearly

**Fix #14 — Remove unused `n` field**

- Remove `n: k.replace("step", "0")` from the `steps` map — the field is never referenced in the template
- Keep only `title` and `desc` in the mapped object

---

### 6. `src/components/sections/Testimonials.tsx`

**Fix #9 — Typographic curly quotes**

- Replace `"{te.quote}"` with `“{te.quote}”` (proper curly quotes `"..."`)
- Add `cite` attribute to `<blockquote>` if a source URL exists; omit if not

---

### 7. `src/components/sections/CTABand.tsx`

**Fix #12 — Deduplicate the serviceSlug branch**

- Replace the `serviceSlug ? <Link ...> : <Link ...>` ternary with a single `<Link>` that conditionally spreads `search`:
  ```tsx
  <Link
    to="/contacto"
    {...(serviceSlug ? { search: { servico: serviceSlug } } : {})}
    className="..."
  >
  ```

---

### 8. `src/routes/index.tsx`

**Fix #13 — Add `width`/`height` to about-section images**

- `aboutTeam` image: add `width={480} height={640}` (3:4 aspect, matching `aspect-[3/4]` class)
- `servicesHero` image: add `width={480} height={640}` (same)
- Both already have `loading="lazy"` and `aspect-[3/4]` — adding dimensions makes CLS prevention robust even before CSS loads

---

### 9. `src/components/sections/Hero.tsx`

**Fix #4 — Add `srcset` for responsive image loading**

- The hero image is an ES module import resolved to a hashed URL by Vite. Cloudflare Image Resizing (available via `@cloudflare/vite-plugin`) can resize images on-the-fly using URL query params (`?width=640&format=webp`).
- Add `srcSet` using the bundled `heroImage` URL with Cloudflare width params:
  - `${heroImage}?width=640&format=webp 640w`
  - `${heroImage}?width=1280&format=webp 1280w`
  - `${heroImage} 1920w` (original as fallback)
- Add `sizes="100vw"` since the hero is always full-width.
- Keep `fetchPriority="high"`, `width={1920}`, and `height={1280}` unchanged.

---

## What Is NOT Changing

- Font loading: Google Fonts stylesheet stays (self-hosting is a larger refactor). We add a preload link only.
- `destructive` color aliasing `brand` in CSS — this is a design choice, not a bug
- Admin routes — untouched
- i18n translations — untouched

---

## Success Criteria

- [ ] Hamburger announces open/closed state to screen readers (`aria-expanded`)
- [ ] Skip-to-content link visible on keyboard focus, invisible otherwise
- [ ] Desktop nav links show focus ring on tab navigation
- [ ] Language switcher buttons show focus ring on focus
- [ ] Header reveal animation no longer triggers layout reflow
- [ ] TrustBand reads as a distinct visual section vs WhyUs
- [ ] ProcessSteps connector removed; step numbers carry the sequence
- [ ] Testimonial quotes use typographic curly characters
- [ ] CTABand has no duplicated JSX branches
- [ ] About-section images have explicit `width`/`height`
- [ ] `muted-foreground` passes WCAG AA with headroom at all text sizes
- [ ] OG image references hero photo instead of logo
- [ ] Hero image has `srcset` for bandwidth savings
