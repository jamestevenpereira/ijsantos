# SEO & Lead Generation — Design Spec
**Date:** 2026-05-15  
**Project:** IJ Santos (ijsantos.pt)  
**Status:** Approved

---

## Context

The site is a TanStack Start (React 19 + Vite + Cloudflare) prototype for IJ Santos — a construction and exterior cleaning company based in Nelas, Viseu, Portugal. The site is not yet live; it runs at `ijsantos.vercel.app` and localhost. The client budget has been submitted and is awaiting confirmation.

Goals (equal priority):
1. Rank organically on Google for local construction/cleaning searches in the Viseu region.
2. Convert visitors into leads via quote form submissions, phone calls, and WhatsApp.

---

## Section 1 — Critical Bug Fixes

### 1.1 Lovable Meta Tag Override

**File:** `src/routes/__root.tsx`, lines 157–164

Lovable injected a second batch of meta tags after the real company meta tags. TanStack's `HeadContent` renders them in order, so the Lovable tags win:

- `{ title: "Lovable App" }` overrides the real `DEFAULT_TITLE`
- `{ property: "og:title", content: "Lovable App" }` overrides OG title
- `{ name: "twitter:title", content: "Lovable App" }` overrides Twitter title
- The description and OG image also get overridden with Lovable placeholders

**Fix:** Delete lines 157–164 in `__root.tsx`. The existing `DEFAULT_TITLE`, `DEFAULT_DESC`, and `OG_IMAGE` constants are correct and will take effect once the overrides are removed. No other changes needed.

### 1.2 Missing OG Image

**File:** `public/og-default.jpg` — referenced in `__root.tsx` but does not exist.

**Fix:** Create a 1200×630 branded JPEG and save as `public/og-default.jpg`. Simplest approach: use any image editor (Canva, Figma, Photoshop) or a Node script to compose: dark background (#0a0a0a), IJ Santos company name centred in white, tagline "Construção Civil e Limpezas Exteriores" below, "Nelas · Viseu · Região Centro" in smaller muted text. The existing `public/logo.png` can be used as an asset. This image appears whenever the site URL is shared on WhatsApp, Facebook, or LinkedIn — critical for trust with local clients. If no design tool is available at implementation time, use `public/logo.png` as a temporary fallback by updating the `OG_IMAGE` constant to point to `/logo.png`.

---

## Section 2 — Blog Post Pages + Content

### 2.1 Route

New file: `src/routes/blog.$slug.tsx`

- URL pattern: `/blog/:slug`
- Reads slug from route params, looks up post in `blogPosts` array
- If post not found, throws a 404 (TanStack `notFound()`)
- Renders full article: header (title, date, category, read time), body paragraphs, mid-article CTA, remaining paragraphs, end-of-article CTA
- `head()` returns: `<title>`, `<meta name="description">`, OG tags, canonical URL, and `Article` JSON-LD schema

**Article JSON-LD schema fields:**
```json
{
  "@type": "Article",
  "headline": "<post title>",
  "description": "<post excerpt>",
  "datePublished": "<post date>",
  "dateModified": "<post date>",
  "author": { "@type": "Organization", "name": "IJ Santos" },
  "publisher": { "@id": "https://ijsantos.pt/#organization" },
  "url": "https://ijsantos.pt/blog/<slug>",
  "image": "<post image URL>"
}
```

### 2.2 Data Structure

`src/data/blog.ts` gets a `bodyPt` field added to `BlogPost`:

```ts
type BlogPost = {
  slug: string;
  titlePt: string;
  titleEn: string;        // kept for future i18n
  excerptPt: string;
  excerptEn: string;      // kept for future i18n
  category: string;
  readTime: number;
  date: string;           // ISO date, YYYY-MM-DD
  image: string;
  bodyPt: BlogSection[];  // full article content
};

type BlogSection = {
  type: "paragraph" | "heading" | "list";
  text?: string;          // for paragraph and heading
  items?: string[];       // for list
};
```

### 2.3 Post List (6 posts, all 2026)

All existing 3 posts are updated with 2026 dates and real full content. Three new posts are added:

| # | Slug | Title (PT) | Target keyword | Date |
|---|------|-----------|----------------|------|
| 1 | `guia-precos-remodelacao-viseu` | Guia de preços para remodelação de casa em Viseu (2026) | "preço remodelação casa Viseu 2026" | 2026-03-10 |
| 2 | `como-limpar-fachadas-granito` | Como limpar fachadas de granito sem danificar a pedra | "limpeza fachadas granito" | 2026-02-18 |
| 3 | `sinais-telhado-precisa-manutencao` | 5 sinais de que o seu telhado precisa de manutenção urgente | "manutenção telhados sinais" | 2026-01-22 |
| 4 | `quanto-custa-construir-moradia-nelas` | Quanto custa construir uma moradia em Nelas em 2026 | "custo construção moradia Nelas" | 2026-04-05 |
| 5 | `etics-isolamento-fachadas-vale-a-pena` | ETICS: isolamento de fachadas — vale a pena na região centro? | "etics isolamento fachadas Viseu" | 2026-04-22 |
| 6 | `impermeabilizacao-telhados-guia-regiao-centro` | Impermeabilização de telhados: guia completo para o centro de Portugal | "impermeabilização telhados Viseu" | 2026-05-08 |

Each article body is written in Portuguese, covers the topic accurately, and naturally references IJ Santos and the service area (Viseu, Nelas, região centro). Minimum ~400 words per post.

### 2.4 Blog Index Route

The existing `BlogPreview` section on the homepage shows 3 posts. A dedicated `/blog` listing page is **out of scope** for this spec — it can be added later. Blog post links from the homepage preview will point to `/blog/:slug`.

If `BlogPreview` currently links to a non-existent route, that link is fixed to point to `/blog/:slug`.

### 2.5 Sitemap

`public/sitemap.xml` gains 6 new `<url>` entries for blog posts, with `priority 0.8` and `lastmod` set to each post's date. All existing entries also receive `lastmod` dates (set to reasonable estimates: service pages 2026-04-01, area pages 2026-04-01, homepage 2026-05-15).

---

## Section 3 — Schema Markup

All schema additions use data already present in the codebase — no new content is needed.

### 3.1 FAQPage Schema on Service Pages

**File:** `src/routes/servicos.$slug.tsx`

Each service in `data/services.ts` has a `faq` array with `{ q, a }` objects (i18n keys). The service page's `head()` already injects some JSON-LD. Add a second `FAQPage` script block using the resolved (translated) FAQ strings.

Because translation keys need to be resolved, the FAQ schema is injected as a client-rendered `<script>` inside the component (not in `head()`) using a `useEffect` — or alternatively, the FAQ text is duplicated as plain strings alongside the i18n keys in `data/services.ts`. The second approach (plain strings alongside i18n keys) is simpler and more reliable for SSR/crawlers. Plain Portuguese strings are added for each FAQ `q` and `a`.

Schema shape:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<question text>",
      "acceptedAnswer": { "@type": "Answer", "text": "<answer text>" }
    }
  ]
}
```

### 3.2 FAQPage Schema on Area Pages

**File:** `src/routes/areas.$slug.tsx`

Same pattern as 3.1. Area FAQ data in `data/local-areas.ts` already has plain Portuguese strings (not i18n keys), so this is straightforward — inject directly into `head()`.

### 3.3 Service Schema on Service Pages

**File:** `src/routes/servicos.$slug.tsx`

Add a `Service` JSON-LD block alongside the existing WebPage block:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "<service title in PT>",
  "provider": { "@id": "https://ijsantos.pt/#organization" },
  "areaServed": ["Nelas", "Viseu", "Mangualde", "Tondela", "Carregal do Sal", "Seia", "Gouveia", "Coimbra"],
  "url": "https://ijsantos.pt/servicos/<slug>"
}
```

Service title plain strings are added alongside i18n keys in `data/services.ts` (same approach as 3.1).

---

## Section 4 — In-Blog Lead Capture CTAs

### 4.1 Mid-Article CTA

A compact inline component `<BlogCTA>` rendered after the 2nd item in the `bodyPt` array (i.e., after index 1, zero-based). The blog post page splits the `bodyPt` array at index 2: renders items 0–1, then `<BlogCTA>`, then the remaining items.

Content:
> **Precisa de um orçamento?**  
> A IJ Santos responde em menos de 24 horas — sem compromisso.  
> [Pedir orçamento gratuito →] (links to `/contacto?servico=<related-slug>`)

Each blog post has a `relatedService` field added to `BlogPost` in `data/blog.ts` (optional string matching a service slug). When present, the CTA link pre-fills the service dropdown on the contact page via the existing `?servico=` query param (already supported by `src/routes/contacto.tsx`).

### 4.2 End-of-Article CTA

A fuller section at the bottom of each post, visually consistent with the site's existing `CTABand` component. Contains:
- Headline: "Pronto para começar o seu projeto?"
- Subtext with phone number and response time promise
- Two buttons: "Pedir orçamento" (→ `/contacto`) and "Ligar agora" (→ `tel:+351926051178`)

This is a new reusable component `<BlogCTABand>` placed in `src/components/sections/` and reused across all blog posts.

---

## Out of Scope

- Dedicated `/blog` listing page (can be added as a follow-up)
- English versions of blog posts
- Google Analytics / Search Console setup (separate concern, no code required)
- Google My Business profile (off-site, no code required)
- Admin CMS for blog posts (data stays in `data/blog.ts` for now)

---

## Files Changed / Created

| Action | File |
|--------|------|
| Edit | `src/routes/__root.tsx` — remove Lovable meta overrides |
| Create | `public/og-default.jpg` — branded OG image |
| Create | `src/routes/blog.$slug.tsx` — blog post page |
| Edit | `src/data/blog.ts` — new type fields + 6 posts with full content |
| Edit | `src/routes/servicos.$slug.tsx` — FAQPage + Service schema |
| Edit | `src/routes/areas.$slug.tsx` — FAQPage schema |
| Edit | `src/data/services.ts` — add plain PT strings for schema |
| Create | `src/components/sections/BlogCTABand.tsx` |
| Create | `src/components/blog/BlogCTA.tsx` |
| Edit | `public/sitemap.xml` — add blog URLs + lastmod dates |
