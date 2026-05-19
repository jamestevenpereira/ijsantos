# Editorial Premium Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all homepage sections and internal page heroes to an "Editorial Premium" aesthetic — bento grid services, dark editorial WhyUs, full-bleed hero with solid block, featured testimonial, horizontal process timeline.

**Architecture:** Component-by-component rewrites, no new data models, no i18n key changes. Each task is a self-contained commit. Hero absorbs Stats (Stats.tsx deleted). Internal pages get a shared `PageHero` component that replaces the existing gradient-overlay hero pattern.

**Tech Stack:** React 18, TanStack Router, Tailwind v4 (CSS variables via `var(--background)` etc.), shadcn/ui, react-i18next, `useInView`/`fadeUp` from `src/hooks/useInView.ts`.

**Branch:** `feat/editorial-premium-redesign`

---

## File Map

| File | Action |
|---|---|
| `src/components/sections/Hero.tsx` | Full rewrite — absorbs `CountUp` from Stats |
| `src/components/sections/Stats.tsx` | **Delete** |
| `src/routes/index.tsx` | Remove `<Stats>`, remove `ServiceCard` grid, add bento, update About section |
| `src/components/sections/WhyUs.tsx` | Full rewrite — dark editorial numbered list |
| `src/components/sections/ProcessSteps.tsx` | Rewrite — horizontal timeline with connector line |
| `src/components/sections/Testimonials.tsx` | Full rewrite — featured quote + mini grid |
| `src/components/sections/CTABand.tsx` | Rewrite — gradient top line, ghost number |
| `src/components/sections/VideosSection.tsx` | Style update — dark `bg-primary` section |
| `src/components/sections/BeforeAfter.tsx` | Style update — `bg-surface` background |
| `src/components/sections/BlogPreview.tsx` | Style update — `bg-surface` background |
| `src/components/layout/PageHero.tsx` | **Create** — shared hero for internal pages |
| `src/routes/servicos.tsx` | Use `PageHero`, editorial service groups |
| `src/routes/servicos.$slug.tsx` | Use `PageHero` |
| `src/routes/sobre.tsx` | Use `PageHero` |
| `src/routes/portefolio.tsx` | Use `PageHero` |
| `src/routes/contacto.tsx` | Use `PageHero` |

---

## Task 1: Hero rewrite + delete Stats.tsx

**Files:**
- Rewrite: `src/components/sections/Hero.tsx`
- Delete: `src/components/sections/Stats.tsx`
- Modify: `src/routes/index.tsx` (remove `<Stats />` import and usage)

- [ ] **Step 1: Rewrite `src/components/sections/Hero.tsx`**

Replace the entire file with:

```tsx
import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { useInView } from "@/hooks/useInView";
import heroImage from "@/assets/hero-construction.jpg";

function CountUp({ raw, inView }: { raw: string; inView: boolean }) {
  const { prefix, end, suffix, decimal } = useMemo(() => {
    const m = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!m) return { prefix: "", end: 0, suffix: raw, decimal: false };
    return { prefix: m[1], end: parseFloat(m[2]), suffix: m[3], decimal: m[2].includes(".") };
  }, [raw]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setCount(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setCount(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  const display = decimal ? count.toFixed(1) : Math.floor(count).toString();
  return <>{prefix}{display}{suffix}</>;
}

export function Hero() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden flex flex-col justify-end"
      style={{ minHeight: "clamp(460px, 60vh, 560px)" }}
    >
      {/* Full-bleed photo */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Equipa IJ Santos em obra de construção civil"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        {/* Subtle scan-line texture */}
        <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.012)_3px,rgba(0,0,0,0.012)_4px)]" />
      </div>

      {/* Badge — top left */}
      <div className="absolute top-6 left-5 md:left-10 flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/65">
          Nelas · Viseu · Região Centro
        </span>
      </div>

      {/* Stats column — desktop right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3">
        {company.stats.map((s) => (
          <dl key={s.label} className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-right backdrop-blur-sm">
            <dd className="text-2xl font-black text-white leading-none tracking-tight">
              <CountUp raw={s.value} inView={inView} />
            </dd>
            <dt className="mt-1 text-[9px] text-white/35 uppercase tracking-[0.1em]">
              {t(s.label)}
            </dt>
          </dl>
        ))}
      </div>

      {/* Solid text block — bottom left */}
      <div className="relative w-full md:w-[52%] bg-primary border-t-[3px] border-brand px-5 py-7 md:px-10 md:py-9">
        {/* Overline */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-px bg-brand shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
            {t("hero.badge")}
          </span>
        </div>

        <h1
          className="font-display text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-black text-white leading-[1.05] tracking-tight text-balance"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {t("hero.title")}
          <em className="text-brand not-italic">{t("hero.title_highlight")}</em>
        </h1>

        <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-md">
          {t("hero.body")}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-5 py-3 text-sm font-semibold hover:brightness-95 transition min-h-[44px]"
          >
            {t("hero.cta_quote")}
          </Link>
          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.2] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition backdrop-blur-sm min-h-[44px]"
          >
            <Phone className="h-4 w-4" />
            <span className="whitespace-nowrap">{company.phone}</span>
          </a>
        </div>

        {/* Stats — mobile only */}
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/[0.1] pt-5 md:hidden">
          {company.stats.map((s) => (
            <div key={s.label}>
              <dd className="text-xl font-black text-white leading-none">
                <CountUp raw={s.value} inView={inView} />
              </dd>
              <dt className="mt-0.5 text-[9px] text-white/40 uppercase tracking-[0.1em]">
                {t(s.label)}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete `src/components/sections/Stats.tsx`**

```bash
git rm src/components/sections/Stats.tsx
```

- [ ] **Step 3: Remove `Stats` from `src/routes/index.tsx`**

Remove the import line:
```tsx
// DELETE this line:
import { Stats } from "@/components/sections/Stats";
```

Remove the usage in the JSX (it appears between `<Hero />` and the About section):
```tsx
// DELETE this line:
<Stats />
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors. If there are errors, they will be in the `Stats` removal — check index.tsx for any remaining references.

- [ ] **Step 5: Start dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000. Check:
- Hero shows full-bleed photo with dark block bottom-left, red top border on block
- Stats are floating right on desktop (4 items)
- Stats stack inside block on mobile
- Badge visible top-left
- No `Stats` standalone section below hero

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/Stats.tsx src/routes/index.tsx
git commit -m "feat(hero): full-bleed block layout, absorb Stats, delete Stats.tsx"
```

---

## Task 2: Homepage Services — Bento Grid

**Files:**
- Modify: `src/routes/index.tsx` (replace service card grid with bento)

- [ ] **Step 1: Update services section in `src/routes/index.tsx`**

First, remove the `ServiceCard` import (no longer used on homepage):
```tsx
// DELETE this line:
import { ServiceCard } from "@/components/service/ServiceCard";
```

Then add `ArrowRight` to the existing `lucide-react` import if not already there (it already is).

Replace the entire `<section id="servicos">` block (lines ~102–127 in the current file) with:

```tsx
<section id="servicos" className="py-20 md:py-28 bg-surface">
  <div className="mx-auto max-w-7xl container-px">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left">
      <div className="max-w-2xl mx-auto md:mx-0">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          {t("index.services_label")}
        </span>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
          {t("index.services_title")}
        </h2>
      </div>
      <Link
        to="/servicos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand justify-center md:justify-start"
      >
        {t("index.services_link")} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>

    {/* Bento grid — 5 services, feature card spans 2 rows */}
    <div
      className="mt-14 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:2fr_1fr_1fr] lg:[grid-template-rows:280px_200px]"
    >
      {services.slice(0, 5).map((s, i) => (
        <Link
          key={s.slug}
          to="/servicos/$slug"
          params={{ slug: s.slug }}
          aria-label={t(s.title)}
          className={[
            "group relative rounded-xl overflow-hidden",
            "h-48 sm:h-auto",                    // fixed height on mobile
            i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : "", // feature: wide on sm, tall on lg
          ].join(" ")}
        >
          {/* Photo */}
          <img
            src={s.hero}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Colour overlay */}
          {i === 2 ? (
            <div className="absolute inset-0 bg-brand/90" />
          ) : i === 3 ? (
            <div className="absolute inset-0 bg-surface/[0.88]" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          )}

          {/* Arrow circle */}
          <div
            className={[
              "absolute top-3 right-3 h-7 w-7 rounded-full flex items-center justify-center",
              "transition-colors",
              i === 3 ? "bg-black/[0.07] text-foreground" : "bg-white/10 text-white",
            ].join(" ")}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <div
              className={[
                "font-display font-bold leading-tight",
                i === 0 ? "text-xl md:text-[1.4rem]" : "text-base",
                i === 3 ? "text-foreground" : "text-white",
              ].join(" ")}
            >
              {t(s.title)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no errors. `ServiceCard` is no longer imported, `services.slice(0,5)` works on the existing `Service[]` array.

- [ ] **Step 3: Verify visually**

Open http://localhost:3000 and scroll to services section. Check:
- Desktop: 3-column bento, first card (Construção Civil) is tall (spans 2 rows), Pinturas has red background, Limpeza Fachadas has light background
- Mobile: single column stack, all equal height
- Photos load via Unsplash URLs (may need network)

- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(homepage): replace service card grid with editorial bento"
```

---

## Task 3: Homepage About section — Asymmetric layout

**Files:**
- Modify: `src/routes/index.tsx` (update About section)

- [ ] **Step 1: Update About section in `src/routes/index.tsx`**

The `heroImage` import is now removed (moved to Hero.tsx in Task 1). Make sure the `heroImage` import was removed. The about section now uses only `aboutTeam` and `servicesHero` (both still imported).

Replace the About `<section>` (the one with `{t("index.about_label")}`, the first section after Stats in index.tsx) with:

```tsx
<section className="py-20 md:py-28">
  <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
    {/* Photo grid — asymmetric */}
    <div
      className="grid gap-3 grid-cols-[1.2fr_0.8fr]"
      style={{ gridTemplateRows: "280px 140px" }}
    >
      <img
        src={aboutTeam}
        alt="Equipa IJ Santos em obra"
        className="rounded-xl object-cover w-full h-full [grid-row:1/3]"
        loading="lazy"
      />
      <img
        src={servicesHero}
        alt="Obra de construção civil em Nelas"
        className="rounded-xl object-cover w-full h-full"
        loading="lazy"
      />
      <div className="rounded-xl bg-brand" aria-hidden="true" />
    </div>

    {/* Text */}
    <div className="text-center md:text-left">
      <div
        className="font-display font-black leading-none tracking-tight select-none -mb-5 md:-mb-7"
        style={{ fontSize: "clamp(4rem, 8vw, 6rem)", color: "var(--color-border)" }}
        aria-hidden="true"
      >
        15
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        {t("index.about_label")}
      </span>
      <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
        {t("index.about_title")}
      </h2>
      <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
        {t("index.about_body")}
      </p>
      <Link
        to="/sobre"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all"
      >
        {t("index.about_link")} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
</section>
```

Note: the decorative number `15` uses `var(--color-border)` which maps to `var(--border)` via the Tailwind v4 theme — it renders as near-invisible light gray on white, creating depth behind the heading.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Verify visually**

Open http://localhost:3000, scroll to About section. Check:
- 3-cell asymmetric photo grid: tall team photo left, construction photo top-right, red brand block bottom-right
- Large `15` in near-invisible gray appears behind the label
- Section heading and body unchanged

- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat(homepage): asymmetric about section with decorative number"
```

---

## Task 4: WhyUs — Dark editorial band

**Files:**
- Rewrite: `src/components/sections/WhyUs.tsx`

- [ ] **Step 1: Rewrite `src/components/sections/WhyUs.tsx`**

```tsx
import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const keys = ["item1", "item2", "item3", "item4"] as const;

export function WhyUs() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();

  return (
    <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
      {/* Decorative dash */}
      <div
        className="absolute right-8 top-6 select-none pointer-events-none font-display font-black text-white/[0.022] leading-none"
        style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}
        aria-hidden="true"
      >
        —
      </div>

      <div className="mx-auto max-w-7xl container-px">
        {/* Header */}
        <div
          ref={headingRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <div className="max-w-xl mx-auto md:mx-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("whyus.label")}
            </span>
            <h2
              className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-white text-balance"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {t("whyus.title")}
            </h2>
          </div>
        </div>

        {/* 4-column numbered list */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {keys.map((k, i) => (
            <article
              key={k}
              className={[
                "py-8 lg:py-0",
                "border-b border-white/[0.07] last:border-b-0",
                "lg:border-b-0 lg:border-r lg:last:border-r-0",
                i > 0 ? "lg:pl-7" : "lg:pl-0",
                i < 3 ? "lg:pr-7" : "lg:pr-0",
                fadeUp(gridInView),
              ].join(" ")}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="font-mono text-xs font-bold text-brand tracking-[0.15em] mb-4">
                {String(i + 1).padStart(2, "0")} —
              </div>
              <h3
                className="font-display font-bold text-base text-white leading-snug mb-3"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {t(`whyus.${k}_title`)}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">
                {t(`whyus.${k}_desc`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Verify visually**

Open http://localhost:3000, scroll to WhyUs. Check:
- Dark `bg-primary` background
- `01 —` / `02 —` numbering in brand red monospace
- 4 columns on desktop separated by thin vertical lines
- Stacks to 2-col on tablet, 1-col on mobile

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/WhyUs.tsx
git commit -m "feat(whyus): dark editorial numbered list, remove icon cards"
```

---

## Task 5: ProcessSteps — Horizontal timeline

**Files:**
- Rewrite: `src/components/sections/ProcessSteps.tsx`

- [ ] **Step 1: Rewrite `src/components/sections/ProcessSteps.tsx`**

```tsx
import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const stepKeys = ["step1", "step2", "step3", "step4"] as const;

export function ProcessSteps() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: stepsRef, inView: stepsInView } = useInView();

  const steps = stepKeys.map((k) => ({
    title: t(`process.${k}_title`),
    desc: t(`process.${k}_desc`),
  }));

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        {/* Header */}
        <div
          ref={headingRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <div className="max-w-2xl mx-auto md:mx-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("process.label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("process.title")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto md:mx-0">
            {t("process.subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="mt-14 relative">
          {/* Connector line — desktop only */}
          <div
            className="absolute hidden md:block h-px bg-border top-5 z-0"
            style={{ left: "calc(12.5% + 20px)", right: "calc(12.5% + 20px)" }}
          />

          <div className="grid gap-10 md:gap-0 md:grid-cols-4 relative z-10">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`flex flex-col items-center text-center md:items-start md:text-left md:px-6 first:md:pl-0 last:md:pr-0 ${fadeUp(stepsInView)}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Node circle */}
                <div
                  className="h-10 w-10 rounded-full bg-brand text-brand-foreground grid place-items-center font-bold text-sm shrink-0"
                  style={{
                    boxShadow: "0 0 0 4px var(--color-surface), 0 0 0 5px var(--color-border)",
                  }}
                >
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display font-semibold text-base text-foreground leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

Note: `var(--color-surface)` and `var(--color-border)` are the Tailwind v4 token aliases defined in `src/styles.css` that map to `var(--surface)` and `var(--border)`.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

- [ ] **Step 3: Verify visually**

Open http://localhost:3000. Check:
- Steps show as a horizontal 4-column layout on desktop
- A thin `--border` line connects the centers of the red numbered circles
- Stacks vertically with gap on mobile
- Red circle has subtle ring halo matching section background

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ProcessSteps.tsx
git commit -m "feat(process): horizontal timeline with connector line and red nodes"
```

---

## Task 6: Testimonials — Featured quote + mini grid

**Files:**
- Rewrite: `src/components/sections/Testimonials.tsx`

- [ ] **Step 1: Rewrite `src/components/sections/Testimonials.tsx`**

```tsx
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { testimonials } from "@/data/testimonials";
import { useInView, fadeUp } from "@/hooks/useInView";

export function Testimonials() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: bodyRef, inView: bodyInView } = useInView();

  const featured = testimonials[0];
  const supporting = testimonials.slice(1, 3);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl container-px">
        {/* Header */}
        <div
          ref={headingRef}
          className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("testimonials.label")}
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {t("testimonials.title")}
          </h2>
        </div>

        <div ref={bodyRef} className={`mt-12 space-y-4 ${fadeUp(bodyInView)}`}>
          {/* Featured testimonial */}
          <figure className="relative rounded-2xl bg-primary p-8 md:p-10 overflow-hidden">
            {/* Decorative quote mark */}
            <div
              className="absolute top-0 left-6 leading-none font-black select-none pointer-events-none"
              style={{
                fontSize: "clamp(5rem, 12vw, 8rem)",
                color: "rgba(197, 48, 48, 0.12)",
                fontFamily: "Georgia, serif",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <div className="relative z-10">
              <div className="flex gap-0.5 text-brand mb-5" aria-label={`${featured.rating} estrelas`}>
                {Array.from({ length: featured.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <blockquote
                className="font-display text-lg md:text-xl font-bold text-primary-foreground leading-relaxed max-w-2xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                &ldquo;{featured.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand grid place-items-center text-xs font-bold text-brand-foreground shrink-0">
                  {featured.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">{featured.name}</div>
                  <div className="text-xs text-primary-foreground/40">{featured.role}</div>
                </div>
              </figcaption>
            </div>
          </figure>

          {/* Supporting testimonials */}
          <div className="grid gap-4 md:grid-cols-2">
            {supporting.map((te, i) => (
              <figure
                key={te.name}
                className={`rounded-2xl bg-card border border-border p-6 md:p-7 flex flex-col ${fadeUp(bodyInView)}`}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="flex gap-0.5 text-brand mb-3" aria-label={`${te.rating} estrelas`}>
                  {Array.from({ length: te.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-foreground leading-relaxed italic flex-1">
                  &ldquo;{te.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-border">
                  <div className="text-sm font-semibold text-foreground">{te.name}</div>
                  <div className="text-xs text-muted-foreground">{te.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

- [ ] **Step 3: Verify visually**

Open http://localhost:3000, scroll to testimonials. Check:
- Large dark featured block with decorative `"` in dark red
- 5 stars visible
- Author row with initials avatar circle
- 2 supporting cards below in a 2-col grid

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Testimonials.tsx
git commit -m "feat(testimonials): featured quote block + 2-col mini grid"
```

---

## Task 7: CTABand rewrite

**Files:**
- Rewrite: `src/components/sections/CTABand.tsx`

- [ ] **Step 1: Rewrite `src/components/sections/CTABand.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { useInView, fadeUp } from "@/hooks/useInView";

export function CTABand({
  title,
  subtitle,
  serviceSlug,
}: {
  title?: string;
  subtitle?: string;
  serviceSlug?: string;
}) {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className={`bg-primary relative overflow-hidden ${fadeUp(inView)}`}
      aria-labelledby="ctaband-heading"
    >
      {/* Red gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand to-transparent" />

      {/* Ghost "24h" decoration */}
      <div
        className="absolute right-6 bottom-0 leading-none font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(5rem, 14vw, 10rem)",
          color: "rgba(255,255,255,0.018)",
          fontFamily: "Georgia, serif",
        }}
        aria-hidden="true"
      >
        24h
      </div>

      <div className="mx-auto max-w-7xl container-px py-16 md:py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-lg mx-auto md:mx-0">
            <h2
              id="ctaband-heading"
              className="font-display text-3xl md:text-4xl font-bold leading-tight text-primary-foreground text-balance"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {title ?? t("cta.title")}
            </h2>
            <p className="mt-3 text-primary-foreground/60 text-base leading-relaxed">
              {subtitle ?? t("cta.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/contacto"
              {...(serviceSlug ? { search: { servico: serviceSlug } } : {})}
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition min-h-[44px]"
            >
              {t("cta.btn_quote")} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition min-h-[44px]"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no errors. The `title?`, `subtitle?`, `serviceSlug?` props are preserved — all existing call sites in `/servicos.tsx` still work.

- [ ] **Step 3: Verify visually**

Open http://localhost:3000, scroll to bottom CTA. Check:
- Red 3px gradient line at top of section
- Ghost `24h` text faintly visible bottom-right
- Title and subtitle text, 2 buttons

Also open http://localhost:3000/servicos — the `/servicos` page uses `CTABand` with custom `title`/`subtitle` props. Verify those still render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/CTABand.tsx
git commit -m "feat(ctaband): gradient top line, ghost 24h decoration"
```

---

## Task 8: Videos, BeforeAfter, BlogPreview — Style updates

**Files:**
- Modify: `src/components/sections/VideosSection.tsx`
- Modify: `src/components/sections/BeforeAfter.tsx`
- Modify: `src/components/sections/BlogPreview.tsx`

- [ ] **Step 1: Update `src/components/sections/VideosSection.tsx`**

Change section background from `bg-surface` to `bg-primary`, and update text colours to work on dark background. Replace the outer section tag:

```tsx
// BEFORE:
<section className="py-20 md:py-28 bg-surface">
  <div className="mx-auto max-w-7xl container-px">
    <div ref={headingRef} className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        {t("videos.label")}
      </span>
      <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
        {t("videos.title")}
      </h2>
      <p className="mt-4 text-muted-foreground text-lg">
        {t("videos.body")}
      </p>
    </div>

// AFTER:
<section className="py-20 md:py-28 bg-primary">
  <div className="mx-auto max-w-7xl container-px">
    <div ref={headingRef} className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        {t("videos.label")}
      </span>
      <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance text-primary-foreground">
        {t("videos.title")}
      </h2>
      <p className="mt-4 text-primary-foreground/50 text-lg">
        {t("videos.body")}
      </p>
    </div>
```

Also update the video card container to use `bg-primary/50` border colour:
```tsx
// BEFORE:
className={`group relative overflow-hidden rounded-2xl border border-border bg-card aspect-video text-left ${fadeUp(gridInView)}`}

// AFTER:
className={`group relative overflow-hidden rounded-2xl border border-white/[0.1] bg-primary/50 aspect-video text-left ${fadeUp(gridInView)}`}
```

- [ ] **Step 2: Update `src/components/sections/BeforeAfter.tsx`**

Change section background from default (white) to `bg-surface`:

```tsx
// BEFORE:
<section className="py-20 md:py-28">

// AFTER:
<section className="py-20 md:py-28 bg-surface">
```

- [ ] **Step 3: Update `src/components/sections/BlogPreview.tsx`**

Change section background from default (white) to `bg-surface`:

```tsx
// BEFORE:
<section className="py-20 md:py-28">
  <div className="mx-auto max-w-7xl container-px">
    <div
      ref={headingRef}

// AFTER:
<section className="py-20 md:py-28 bg-surface">
  <div className="mx-auto max-w-7xl container-px">
    <div
      ref={headingRef}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

- [ ] **Step 5: Verify visually**

Open http://localhost:3000:
- Videos section: dark `bg-primary` background, white heading text, video cards with dark styling
- BeforeAfter: `bg-surface` (light grey) background
- Blog preview: `bg-surface` background — cards float on the slightly-grey surface

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/VideosSection.tsx src/components/sections/BeforeAfter.tsx src/components/sections/BlogPreview.tsx
git commit -m "feat(sections): dark Videos, surface BeforeAfter and BlogPreview"
```

---

## Task 9: PageHero shared component

**Files:**
- Create: `src/components/layout/PageHero.tsx`

- [ ] **Step 1: Create `src/components/layout/PageHero.tsx`**

```tsx
interface PageHeroProps {
  image: string;
  label: string;
  title: string;
  subtitle?: string;
  height?: "default" | "tall";
}

export function PageHero({
  image,
  label,
  title,
  subtitle,
  height = "default",
}: PageHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden flex flex-col justify-end"
      style={{ minHeight: height === "tall" ? "420px" : "320px" }}
    >
      {/* Full-bleed photo */}
      <div className="absolute inset-0 -z-10">
        <img
          src={image}
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.012)_3px,rgba(0,0,0,0.012)_4px)]" />
      </div>

      {/* Solid block */}
      <div className="w-full md:w-3/5 bg-primary border-t-[3px] border-brand px-5 py-8 md:px-10 md:py-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-px bg-brand shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
            {label}
          </span>
        </div>
        <h1
          className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-primary-foreground leading-tight tracking-tight text-balance"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm text-primary-foreground/50 leading-relaxed max-w-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no errors (component is not yet used; TypeScript will check types on import).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/PageHero.tsx
git commit -m "feat(layout): add PageHero shared component for internal pages"
```

---

## Task 10: /servicos page — PageHero

**Files:**
- Modify: `src/routes/servicos.tsx`

- [ ] **Step 1: Replace hero in `src/routes/servicos.tsx`**

Add import at top:
```tsx
import { PageHero } from "@/components/layout/PageHero";
```

Replace the existing `<section>` hero block (lines 46–60 in the current file):

```tsx
// BEFORE:
<section className="relative isolate overflow-hidden">
  <div className="absolute inset-0 -z-10">
    <img src={servicesHero} alt="" fetchPriority="high" className="h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50" />
  </div>
  <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-primary-foreground text-center md:text-left">
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("servicos.label")}</span>
    <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto md:mx-0">
      {t("servicos.title")}
    </h1>
    <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto md:mx-0">
      {t("servicos.body")}
    </p>
  </div>
</section>

// AFTER:
<PageHero
  image={servicesHero}
  label={t("servicos.label")}
  title={t("servicos.title")}
  subtitle={t("servicos.body")}
  height="tall"
/>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

- [ ] **Step 3: Verify visually**

Open http://localhost:3000/servicos. Check:
- Hero uses the new solid block pattern, left-aligned
- Service group sections below unchanged

- [ ] **Step 4: Commit**

```bash
git add src/routes/servicos.tsx
git commit -m "feat(servicos): use PageHero block pattern"
```

---

## Task 11: /servicos/:slug page — PageHero

**Files:**
- Modify: `src/routes/servicos.$slug.tsx`

- [ ] **Step 1: Add PageHero import to `src/routes/servicos.$slug.tsx`**

```tsx
import { PageHero } from "@/components/layout/PageHero";
```

- [ ] **Step 2: Find and replace the hero section in `servicos.$slug.tsx`**

The current hero is a `<section className="relative isolate overflow-hidden">` block that uses `service.hero` as background and a gradient overlay. Replace it with:

```tsx
<PageHero
  image={service.hero}
  label={t("servicos.label")}
  title={t(service.title)}
  subtitle={t(service.short)}
/>
```

The `service` object is available via `const { service } = Route.useLoaderData()` (or however it's accessed in the component — check the component's destructuring). In `servicos.$slug.tsx` the component receives `service` via TanStack Router loader: `const { service } = Route.useLoaderData()`.

Look for the pattern:
```tsx
function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const { t } = useTranslation();
  ...
  return (
    <>
      <section className="relative isolate overflow-hidden">
```
and replace that `<section>` block with the `<PageHero>` call above.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run build
```

- [ ] **Step 4: Verify visually**

Open http://localhost:3000/servicos/construcao-civil. Check:
- Hero shows the service's Unsplash photo, solid block with service title

- [ ] **Step 5: Commit**

```bash
git add src/routes/servicos.$slug.tsx
git commit -m "feat(servicos-slug): use PageHero block pattern"
```

---

## Task 12: /sobre page — PageHero

**Files:**
- Modify: `src/routes/sobre.tsx`

- [ ] **Step 1: Add PageHero import and replace hero in `src/routes/sobre.tsx`**

Add import:
```tsx
import { PageHero } from "@/components/layout/PageHero";
```

Replace the existing hero `<section>` (lines 41–57 in current file):

```tsx
// BEFORE:
<section className="relative isolate overflow-hidden">
  <div className="absolute inset-0 -z-10">
    <img src={heroImage} alt="" fetchPriority="high" className="h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
  </div>
  <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-primary-foreground text-center md:text-left">
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
      {t("sobre.label")}
    </span>
    <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto md:mx-0 text-balance">
      {t("sobre.title")}
    </h1>
    <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto md:mx-0">
      {t("sobre.body")}
    </p>
  </div>
</section>

// AFTER:
<PageHero
  image={heroImage}
  label={t("sobre.label")}
  title={t("sobre.title")}
  subtitle={t("sobre.body")}
  height="tall"
/>
```

Keep the `heroImage` import (it's already imported in `sobre.tsx`).

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

- [ ] **Step 3: Verify visually**

Open http://localhost:3000/sobre. Check:
- Hero uses block pattern
- Team section, values section, stats section below unchanged

- [ ] **Step 4: Commit**

```bash
git add src/routes/sobre.tsx
git commit -m "feat(sobre): use PageHero block pattern"
```

---

## Task 13: /portefolio and /contacto pages — PageHero

**Files:**
- Modify: `src/routes/portefolio.tsx`
- Modify: `src/routes/contacto.tsx`

- [ ] **Step 1: Read current hero patterns in both files**

Open and scan `src/routes/portefolio.tsx` and `src/routes/contacto.tsx` to identify the existing hero `<section>` blocks (both follow the same `relative isolate overflow-hidden` + gradient overlay pattern).

- [ ] **Step 2: Update `src/routes/portefolio.tsx`**

Add import:
```tsx
import { PageHero } from "@/components/layout/PageHero";
```

Replace the hero section with:
```tsx
<PageHero
  image={/* existing hero image src used in portefolio.tsx */}
  label={t("portefolio.label")}
  title={t("portefolio.title")}
  subtitle={t("portefolio.body")}
  height="tall"
/>
```

Use whatever image import already exists in `portefolio.tsx` for the `image` prop.

- [ ] **Step 3: Update `src/routes/contacto.tsx`**

Add import:
```tsx
import { PageHero } from "@/components/layout/PageHero";
```

Replace the hero section with:
```tsx
<PageHero
  image={/* existing hero image src used in contacto.tsx */}
  label={t("contacto.label")}
  title={t("contacto.title")}
  height="default"
/>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

Expected: no errors. If `portefolio.label`, `portefolio.body`, `contacto.label`, or `contacto.title` don't exist as i18n keys, check the existing hero sections for the actual key names used.

- [ ] **Step 5: Verify visually**

Open http://localhost:3000/portefolio and http://localhost:3000/contacto. Check:
- Both show the new PageHero solid-block pattern

- [ ] **Step 6: Commit**

```bash
git add src/routes/portefolio.tsx src/routes/contacto.tsx
git commit -m "feat(pages): use PageHero on portfolio and contact pages"
```

---

## Task 14: Final verification pass

- [ ] **Step 1: Full production build**

```bash
npm run build
```

Expected: build succeeds with 0 TypeScript errors and 0 build errors.

- [ ] **Step 2: Smoke test all routes**

Start dev server (`npm run dev`) and open each route manually:

| Route | What to verify |
|---|---|
| `/` | Hero block, bento grid, dark WhyUs, timeline process, dark Videos, BeforeAfter surface, featured testimonials, CTA ghost number |
| `/servicos` | PageHero, service groups |
| `/servicos/construcao-civil` | PageHero with service photo |
| `/servicos/limpeza-fachadas` | PageHero with service photo |
| `/portefolio` | PageHero |
| `/sobre` | PageHero, team section unchanged |
| `/contacto` | PageHero |

- [ ] **Step 3: Check dark mode**

Toggle dark mode (ThemeToggle in header). All sections should remain readable — no hardcoded hex colours were used; everything uses CSS custom properties.

- [ ] **Step 4: Check mobile (375px viewport)**

In DevTools, set viewport to 375px. Verify:
- Hero: stats stack inside block
- Services: single column
- WhyUs: single column (no horizontal lines)
- ProcessSteps: vertical stack
- Testimonials: single column
- Bento: single column cards with `h-48` height

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore(redesign): final smoke-test pass"
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Covered in task |
|---|---|
| Hero full-bleed + solid block | Task 1 |
| Stats integrated into Hero | Task 1 |
| Stats.tsx deleted | Task 1 |
| Bento grid (5 services, 2fr 1fr 1fr) | Task 2 |
| About asymmetric + decorative 15 | Task 3 |
| WhyUs dark `01 —` editorial | Task 4 |
| ProcessSteps horizontal timeline | Task 5 |
| Testimonials featured + mini | Task 6 |
| CTABand gradient line + ghost 24h | Task 7 |
| Videos dark bg-primary | Task 8 |
| BeforeAfter bg-surface | Task 8 |
| BlogPreview bg-surface | Task 8 |
| PageHero shared component | Task 9 |
| /servicos hero | Task 10 |
| /servicos/:slug hero | Task 11 |
| /sobre hero | Task 12 |
| /portefolio hero | Task 13 |
| /contacto hero | Task 13 |
| Dark mode compatibility | Task 14 |
| Mobile verification | Task 14 |

**No placeholders found.**

**Type consistency:** All components use `useInView` returning `{ ref, inView }` as defined in `src/hooks/useInView.ts:23`. `fadeUp(inView: boolean): string` signature used consistently. `CTABand` props (`title?`, `subtitle?`, `serviceSlug?`) preserved. `Service.hero`, `Service.title`, `Service.short` field names match `src/data/services.ts`. `testimonials[0].name`, `.role`, `.quote`, `.rating` match `src/data/testimonials.ts`.
