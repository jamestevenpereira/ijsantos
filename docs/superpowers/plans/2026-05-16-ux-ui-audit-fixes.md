# UX/UI Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply all 15 UX/UI audit fixes across 9 files to improve accessibility, performance, visual hierarchy, and code quality.

**Architecture:** Grouped by file (Approach A) — each file is edited exactly once, applying all its fixes in a single pass. No new components or abstractions are introduced; all changes are targeted edits to existing files plus one new public asset.

**Tech Stack:** React 19, TanStack Start, Tailwind CSS v4, lucide-react, i18next. No test framework present — verification is TypeScript build (`npm run build`) + visual inspection in dev server (`npm run dev`).

---

## File Map

| File | Fixes Applied |
|------|--------------|
| `public/og-image.jpg` | Created — copy of hero-construction.jpg (#11) |
| `src/styles.css` | Darken muted-foreground (#10) |
| `src/routes/__root.tsx` | Skip link (#2), main id (#2), OG image (#11), font preload (#5) |
| `src/components/layout/Header.tsx` | aria-expanded (#1), focus rings (#3), animation (#6) |
| `src/components/sections/TrustBand.tsx` | Full redesign as dark strip (#7) |
| `src/components/sections/ProcessSteps.tsx` | Remove connector (#8), remove dead field (#14) |
| `src/components/sections/Testimonials.tsx` | Curly quotes (#9) |
| `src/components/sections/CTABand.tsx` | Deduplicate branch (#12) |
| `src/routes/index.tsx` | Image dimensions (#13) |
| `src/components/sections/Hero.tsx` | srcset (#4) |

---

### Task 1: Copy hero image to public/ for OG use

**Files:**
- Create: `public/og-image.jpg`

- [ ] **Step 1: Copy the asset**

In PowerShell from the project root:
```powershell
Copy-Item "src\assets\hero-construction.jpg" "public\og-image.jpg"
```

- [ ] **Step 2: Verify the file exists**

```powershell
Test-Path "public\og-image.jpg"
# Expected: True
```

- [ ] **Step 3: Commit**

```powershell
git add public/og-image.jpg
git commit -m "asset: add og-image.jpg (hero photo stopgap for social sharing)"
```

---

### Task 2: Darken muted-foreground for WCAG AA headroom

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Update the light-mode value**

In `src/styles.css`, find the `:root` block and change line 53:
```css
/* Before */
--muted-foreground: oklch(0.45 0 0);

/* After */
--muted-foreground: oklch(0.40 0 0);
```

The dark mode value (`oklch(0.7 0 0)` in `.dark`) is already sufficient — do not change it.

- [ ] **Step 2: Start dev server and verify**

```powershell
npm run dev
```

Open the homepage. Check that footer text, card descriptions, and stat labels are legible but still visually subordinate to primary text. The change is subtle — foreground text should look slightly darker than before.

- [ ] **Step 3: Commit**

```powershell
git add src/styles.css
git commit -m "a11y: darken muted-foreground to oklch(0.40) for safer WCAG AA contrast"
```

---

### Task 3: Skip link, main id, OG image, font preload (`__root.tsx`)

**Files:**
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Update OG_IMAGE constant**

Find line 28:
```tsx
const OG_IMAGE = `${SITE_URL}/logo.png`;
```
Replace with:
```tsx
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
```

- [ ] **Step 2: Add font preload link**

In the `head()` return value, find the `links` array. Add a preload entry **before** the existing Google Fonts stylesheet link:
```tsx
links: [
  { rel: "stylesheet", href: appCss },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  // ADD THIS LINE:
  {
    rel: "preload",
    as: "style",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
  },
  // existing stylesheet link stays:
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
  },
],
```

- [ ] **Step 3: Add skip-to-content link in RootShell**

Find the `RootShell` function. Add the skip link as the **first element inside `<body>`**, before `{children}`:
```tsx
function RootShell({ children }: { children: React.ReactNode }) {
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;if(t==='dark'){d.classList.add('dark');}d.style.colorScheme=t;}catch(e){}})();`;
  return (
    <html lang="pt-PT">
      <head>
        <HeadContent />
        <CanonicalLink />
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-foreground"
        >
          Saltar para o conteúdo
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Add `id="main-content"` to `<main>`**

Find the `RootComponent` function. Add `id="main-content"` to the `<main>` element:
```tsx
<main className="flex-1 pb-[72px] md:pb-0" id="main-content">
  <PageTransition />
</main>
```

- [ ] **Step 5: Verify in browser**

Run `npm run dev`, open the homepage. Press **Tab** once — a red "Saltar para o conteúdo" button should appear in the top-left corner. Press **Enter** — focus should jump to the main content. Press **Tab** again — the skip link should disappear (it's sr-only when not focused).

Also check the browser DevTools Network tab — confirm `og-image.jpg` would be the meta tag value (check page source or the `<meta property="og:image">` tag).

- [ ] **Step 6: Commit**

```powershell
git add src/routes/__root.tsx
git commit -m "a11y(root): skip link, main#id, OG image stopgap, font preload hint"
```

---

### Task 4: Header accessibility and animation (`Header.tsx`)

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Add focus rings to LanguageSwitcher buttons**

Find the `LanguageSwitcher` component. Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm` to both buttons:

```tsx
function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n: i18nInstance } = useTranslation();
  const current = i18nInstance.language;

  const switchTo = (lang: string) => {
    i18n.changeLanguage(lang);
    try { localStorage.setItem("ijs.lang", lang); } catch { /* noop */ }
  };

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${className}`}>
      <button
        onClick={() => switchTo("en")}
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm ${current === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-border select-none">/</span>
      <button
        onClick={() => switchTo("pt")}
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm ${current === "pt" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}`}
        aria-label="Mudar para Português"
      >
        PT
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Add focus rings to desktop nav links and phone link**

Find the desktop `<nav>` block (line ~88). Update the `<Link>` className to add focus ring:
```tsx
<Link
  key={n.to}
  to={n.to}
  activeOptions={{ exact: n.to === "/" }}
  activeProps={{ className: "text-foreground" }}
  inactiveProps={{ className: "text-muted-foreground" }}
  className="px-4 py-2 text-sm font-medium hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm data-[status=active]:after:opacity-100 relative after:opacity-0 after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-px after:bg-brand"
>
  {n.label}
</Link>
```

Find the phone `<a>` link in the desktop header (line ~104):
```tsx
<a
  href={company.phoneHref}
  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm"
>
  <Phone className="h-4 w-4" />
  {company.phone}
</a>
```

- [ ] **Step 3: Add `aria-expanded` and `aria-controls` to hamburger button, add `id` to mobile nav**

Find the hamburger button (line ~141):
```tsx
<button
  className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-border"
  aria-label="Menu"
  aria-expanded={open}
  aria-controls="mobile-nav"
  onClick={() => setOpen((v) => !v)}
>
  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
</button>
```

Find the mobile dropdown div (line ~152):
```tsx
{open && (
  <div id="mobile-nav" className="md:hidden border-t border-border bg-background">
```

- [ ] **Step 4: Replace max-width inline styles with Tailwind conditional classes**

Find the desktop urgency tag span (line ~113). Replace the inline `style` with Tailwind classes:
```tsx
<span
  className={`flex items-center gap-1.5 overflow-hidden whitespace-nowrap transition-all duration-500 ${
    pastHero ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
  }`}
>
  <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t("header.urgency")}</span>
</span>
```

Find the mobile CTA span (line ~131). Replace the inline `style`:
```tsx
<span
  className={`overflow-hidden transition-all duration-300 ${
    pastHero ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
  }`}
>
  <Link
    to="/contacto"
    onClick={() => setOpen(false)}
    className="inline-flex items-center gap-1 rounded-md bg-brand text-brand-foreground px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
  >
    {t("header.cta_short")} <ArrowRight className="h-3 w-3" />
  </Link>
</span>
```

- [ ] **Step 5: Verify in browser**

Run `npm run dev`. Check:
- Press **Tab** through the desktop header — each nav link, phone link, EN/PT buttons should show a red ring outline on focus.
- Open mobile view, open the hamburger menu — inspect the button in DevTools to confirm `aria-expanded="true"` when open and `aria-expanded="false"` when closed.
- Scroll past the hero — the urgency tag and mobile CTA should animate in smoothly.

- [ ] **Step 6: Commit**

```powershell
git add src/components/layout/Header.tsx
git commit -m "a11y(header): aria-expanded, focus rings, remove inline style animations"
```

---

### Task 5: Redesign TrustBand as dark horizontal strip

**Files:**
- Modify: `src/components/sections/TrustBand.tsx`

- [ ] **Step 1: Replace the full component**

Replace the entire contents of `src/components/sections/TrustBand.tsx` with:

```tsx
import { ShieldCheck, FileCheck2, Clock4, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const icons = [ShieldCheck, FileCheck2, Clock4, Award];
const keys = ["item1", "item2", "item3", "item4"] as const;

export function TrustBand() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className={`bg-primary text-primary-foreground py-10 md:py-12 ${fadeUp(inView)}`}
      aria-label="Garantias e confiança"
    >
      <div className="mx-auto max-w-7xl container-px">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {keys.map((k, i) => {
            const Icon = icons[i];
            return (
              <div key={k} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-brand shrink-0" />
                <span className="text-sm font-semibold">{t(`trustband.${k}_title`)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

Note: The description text (`trustband.${k}_desc`) is intentionally dropped — the strip format is scannable at a glance, and the full descriptions remain in WhyUs cards above.

- [ ] **Step 2: Verify visually**

Run `npm run dev` and scroll through the homepage. Confirm:
- TrustBand now appears as a dark band (same color as footer/hero), clearly distinct from the white WhyUs card section above it.
- Four trust items appear in a 2×2 grid on mobile, inline 4-column on desktop.
- No card borders, no background boxes on icons — just icon + label.

- [ ] **Step 3: Commit**

```powershell
git add src/components/sections/TrustBand.tsx
git commit -m "design(trustband): redesign as dark horizontal strip to differentiate from WhyUs"
```

---

### Task 6: Remove invisible connector and dead code from ProcessSteps

**Files:**
- Modify: `src/components/sections/ProcessSteps.tsx`

- [ ] **Step 1: Remove unused `n` field from the steps map**

Find the `steps` constant (line ~11). Remove the `n` field:
```tsx
const steps = stepKeys.map((k) => ({
  title: t(`process.${k}_title`),
  desc: t(`process.${k}_desc`),
}));
```

- [ ] **Step 2: Remove the invisible step connector**

Find the connector inside the step render (lines ~45–47). Delete these lines entirely:
```tsx
{i < steps.length - 1 && (
  <div className="hidden md:block absolute top-10 -right-3 h-px w-6 bg-border" />
)}
```

The full step card after the removal should look like:
```tsx
<div
  key={s.title}
  className={`relative rounded-xl bg-card border border-border p-7 text-center md:text-left ${fadeUp(gridInView)}`}
  style={{ transitionDelay: `${i * 100}ms` }}
>
  <div className="font-display text-5xl font-bold text-brand/30">0{i + 1}</div>
  <h3 className="mt-4 font-display font-semibold text-lg text-foreground">{s.title}</h3>
  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
</div>
```

Note: The key changed from `s.n` to `s.title` since `n` was removed. `s.title` is unique per step.

- [ ] **Step 3: Verify**

Run `npm run dev` and scroll to the "Como Trabalhamos" (ProcessSteps) section. Confirm:
- The four step cards render correctly with `01`/`02`/`03`/`04` numbers.
- No dangling short line visible between cards.

- [ ] **Step 4: Commit**

```powershell
git add src/components/sections/ProcessSteps.tsx
git commit -m "chore(process): remove invisible step connector and dead n field"
```

---

### Task 7: Typographic curly quotes in Testimonials

**Files:**
- Modify: `src/components/sections/Testimonials.tsx`

- [ ] **Step 1: Replace ASCII quotes with curly quotes**

Find line ~33 (the blockquote):
```tsx
<blockquote className="text-foreground leading-relaxed flex-1">
  "{te.quote}"
</blockquote>
```

Replace with (using proper Unicode curly quotes `"` U+201C and `"` U+201D):
```tsx
<blockquote className="text-foreground leading-relaxed flex-1">
  "{te.quote}"
</blockquote>
```

- [ ] **Step 2: Verify**

Run `npm run dev` and scroll to the Testimonials section. Confirm the opening and closing quote marks are visually curved/typographic, not straight ASCII `"`.

- [ ] **Step 3: Commit**

```powershell
git add src/components/sections/Testimonials.tsx
git commit -m "polish(testimonials): use typographic curly quotes instead of ASCII"
```

---

### Task 8: Deduplicate CTABand branch

**Files:**
- Modify: `src/components/sections/CTABand.tsx`

- [ ] **Step 1: Replace the duplicated if/else Link with a single Link**

Find the `serviceSlug ?` ternary (lines ~30–45). Replace both branches with:
```tsx
<Link
  to="/contacto"
  {...(serviceSlug ? { search: { servico: serviceSlug } } : {})}
  className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition"
>
  {t("cta.btn_quote")} <ArrowRight className="h-4 w-4" />
</Link>
```

The full `<div className="flex flex-wrap gap-3 ...">` block should now be:
```tsx
<div className="flex flex-wrap gap-3 justify-center md:justify-start">
  <Link
    to="/contacto"
    {...(serviceSlug ? { search: { servico: serviceSlug } } : {})}
    className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition"
  >
    {t("cta.btn_quote")} <ArrowRight className="h-4 w-4" />
  </Link>
  <a
    href={company.phoneHref}
    className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold hover:bg-primary-foreground/10 transition"
  >
    <Phone className="h-4 w-4" /> {company.phone}
  </a>
</div>
```

- [ ] **Step 2: Verify build compiles**

```powershell
npm run build
```

Expected: build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```powershell
git add src/components/sections/CTABand.tsx
git commit -m "refactor(ctaband): deduplicate serviceSlug Link branches"
```

---

### Task 9: Add explicit dimensions to about-section images

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Add `width` and `height` to both images**

Find the two `<img>` tags in the "Sobre Nós" section (lines ~82–93):

```tsx
<img
  src={aboutTeam}
  alt="Limpeza de fachada"
  width={480}
  height={640}
  className="rounded-xl aspect-[3/4] object-cover"
  loading="lazy"
/>
<img
  src={servicesHero}
  alt="Construção"
  width={480}
  height={640}
  className="rounded-xl aspect-[3/4] object-cover mt-8"
  loading="lazy"
/>
```

The `width={480} height={640}` matches the 3:4 aspect ratio declared by `aspect-[3/4]`.

- [ ] **Step 2: Verify no layout shift**

Run `npm run dev`. Open DevTools → Performance tab → record a page reload. Confirm CLS (Cumulative Layout Shift) for the about section images is 0 or negligible.

- [ ] **Step 3: Commit**

```powershell
git add src/routes/index.tsx
git commit -m "perf(index): add width/height to about-section images to prevent CLS"
```

---

### Task 10: Add srcset to Hero image

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Add `srcSet` and `sizes` to the hero image**

Find the hero `<img>` (line ~21):
```tsx
<img
  src={heroImage}
  alt="Equipa IJ Santos em obra de construção civil"
  width={1920}
  height={1280}
  fetchPriority="high"
  className="h-full w-full object-cover"
/>
```

Replace with:
```tsx
<img
  src={heroImage}
  srcSet={`${heroImage}?width=640&format=webp 640w, ${heroImage}?width=1280&format=webp 1280w, ${heroImage} 1920w`}
  sizes="100vw"
  alt="Equipa IJ Santos em obra de construção civil"
  width={1920}
  height={1280}
  fetchPriority="high"
  className="h-full w-full object-cover"
/>
```

Note: The `?width=640&format=webp` params are handled by Cloudflare Image Resizing at runtime. If the site is not behind Cloudflare Image Resizing, browsers will fall back to the original `src` — no visual degradation occurs.

- [ ] **Step 2: Verify**

Run `npm run dev`. Open DevTools → Network → filter by "Img". Resize the browser window and confirm the correct variant would be selected based on viewport width. On mobile (<640px), the browser should request the 640w variant.

- [ ] **Step 3: Final build check**

```powershell
npm run build
```

Expected: clean build with no TypeScript errors.

- [ ] **Step 4: Commit**

```powershell
git add src/components/sections/Hero.tsx
git commit -m "perf(hero): add srcset for Cloudflare responsive image resizing"
```

---

## Self-Review Checklist

- [x] **Fix #1** (aria-expanded) — Task 4, Step 3
- [x] **Fix #2** (skip link + main id) — Task 3, Steps 3–4
- [x] **Fix #3** (focus rings) — Task 4, Steps 1–2
- [x] **Fix #4** (hero srcset) — Task 10
- [x] **Fix #5** (font preload) — Task 3, Step 2
- [x] **Fix #6** (max-width animation) — Task 4, Step 4
- [x] **Fix #7** (TrustBand redesign) — Task 5
- [x] **Fix #8** (ProcessSteps connector) — Task 6, Step 2
- [x] **Fix #9** (curly quotes) — Task 7
- [x] **Fix #10** (muted-foreground) — Task 2
- [x] **Fix #11** (OG image) — Tasks 1 + 3 Step 1
- [x] **Fix #12** (CTABand dedup) — Task 8
- [x] **Fix #13** (image dimensions) — Task 9
- [x] **Fix #14** (dead `n` field) — Task 6, Step 1
