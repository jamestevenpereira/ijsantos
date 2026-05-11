# Plano · SEO técnico, SSG e deploy Cloudflare

## 1. Estratégia de renderização

O projeto **já é TanStack Start (SSR)** — não é uma SPA cega. Os crawlers já recebem HTML completo. O que falta é gerar esse HTML **uma vez no build** (SSG) em vez de a cada request, para poder ser servido como ficheiros estáticos.

**Decisão:** ativar **prerender** do TanStack Start para todas as rotas conhecidas → output 100% estático → deploy em **Cloudflare Pages** (com uma Pages Function só para o formulário).

Não é necessário migrar para Astro nem usar Worker de prerender por crawler.

## 2. Configuração de build (SSG)

`vite.config.ts` — adicionar opção `prerender` ao plugin `tanstackStart`:

```text
tanstackStart({
  server: { entry: "server" },
  prerender: {
    enabled: true,
    crawlLinks: true,
    pages: [
      "/", "/sobre", "/servicos", "/portefolio",
      "/contacto", "/privacidade", "/resolucao-litigios",
      // serviços (slugs novos, ver §4)
      "/servicos/construcao-civil",
      "/servicos/remodelacoes-reabilitacao",
      "/servicos/pinturas-interiores-exteriores",
      "/servicos/limpeza-fachadas",
      "/servicos/limpeza-telhados",
      "/servicos/limpeza-pavimentos-exteriores",
      // áreas locais
      "/areas/nelas", "/areas/viseu", "/areas/mangualde",
      "/areas/tondela", "/areas/carregal-do-sal",
      "/areas/seia", "/areas/gouveia", "/areas/coimbra",
    ],
  },
}),
```

Trocar o preset Nitro de Worker para **static** (gera `dist/` pronto a servir). Eliminar/arquivar `wrangler.jsonc` e `src/server.ts` (deixam de ser usados como entry de produção).

## 3. Cloudflare Pages

- **Build command:** `bun run build`
- **Output directory:** `dist` (ou `dist/client` consoante o preset; o plano confirma após build local)
- **Worker necessário:** **Não.** Apenas uma **Pages Function** em `functions/api/contacto.ts` para receber o formulário (POST → Resend) — Resend API key como secret no painel Pages.
- **`public/_headers`:** cache longa para `assets/*` e imagens; `Cache-Control: no-cache` para HTML.
- **`public/_redirects`:** opcional, só para legacy paths se existirem.

## 4. Correções SEO obrigatórias

**a) Geografia (Nelas/Viseu, não Lisboa)** — atualizar `src/routes/__root.tsx`, `src/routes/index.tsx` e `Hero.tsx`: title, meta description, H1, OG, JSON-LD passam a falar de **Nelas, Viseu e região centro**.

**b) Slugs de serviços** — renomear em `src/data/services.ts`:
- `remodelacoes` → `remodelacoes-reabilitacao`
- `pinturas` → `pinturas-interiores-exteriores`
- `limpeza-pavimentos` → `limpeza-pavimentos-exteriores`

Cada página de serviço (`servicos.$slug.tsx`) já tem hero/benefícios/processo/galeria/FAQ/CTA. **Adicionar:**
- title + meta description únicos com localidade
- canonical
- bloco de **links internos para áreas locais** relevantes ao serviço
- JSON-LD `Service` + `FAQPage` + `BreadcrumbList`

**c) Áreas locais** — expandir `src/data/local-areas.ts` com 5 novas localidades (Tondela, Carregal do Sal, Seia, Gouveia, Coimbra) com conteúdo único (intro, body, highlights, distanceNote). Cada `/areas/$slug` ganha:
- title/desc/canonical próprios
- lista de serviços prestados na zona com links para `/servicos/...`
- FAQ local (3 perguntas)
- JSON-LD `LocalBusiness` + `Service` com `areaServed` + `BreadcrumbList`

**d) `public/sitemap.xml` e `public/robots.txt`** — gerar sitemap estático com todas as 19 rotas; robots permite tudo e aponta para o sitemap.

**e) Metadata global vs por rota** — root mantém defaults genéricos; cada rota define title/description/og/twitter/canonical próprios. OG image específica para home, sobre, cada serviço e cada área (reaproveitar imagens já existentes em `src/assets`).

**f) JSON-LD global** no `__root.tsx`: `Organization` + `WebSite` + `LocalBusiness` (com sede em Nelas, telefones, horários, `areaServed` com as 8 localidades, `ContactPoint`).

## 5. Performance

- `width`/`height` em todos os `<img>` para evitar CLS
- `fetchpriority="high"` + `loading="eager"` no LCP do Hero; restantes `loading="lazy"`
- Pré-gerar variantes WebP/AVIF das imagens em `src/assets` no build (ou converter manualmente — já são poucas)
- Remover JS desnecessário: `recharts`, `embla-carousel-react`, `vaul`, `cmdk`, `react-day-picker`, `input-otp`, `react-resizable-panels` parecem não usados no site institucional → auditar e remover
- Fontes Google: usar `&display=swap` (já está) + `<link rel="preload">` para a fonte do H1

## 6. Formulário de contacto

`functions/api/contacto.ts` (Pages Function):
- valida com Zod (nome, email, telefone, mensagem, honeypot)
- envia via **Resend** para `jpsantos@ijsantos.com`
- rate-limit simples por IP (KV opcional, ou só honeypot + tempo mínimo)
- responde 200/400 em JSON; o `QuoteForm` faz `fetch('/api/contacto')`

## 7. Legal (RGPD)

Rever `/privacidade`: identificar responsável (Irmãos J. Santos, Lda., NIPC 503 534 633), finalidade (pedidos de orçamento via Resend), prazo de retenção, direitos RGPD, contacto. Atualizar `CookieConsent`: se não há analytics, basta banner informativo de cookies técnicos (sem consent gate).

## 8. Entregáveis finais (no fim da implementação)

- **Ficheiros alterados/criados:** lista completa
- **Rotas finais:** 19 (1 home + 6 institucionais + 6 serviços + 8 áreas, ajustando totais)
- **Estratégia:** SSG (prerender no build, output estático)
- **Cloudflare Pages:**
  - Build: `bun run build`
  - Output: `dist`
  - Worker: não — apenas 1 Pages Function (`functions/api/contacto.ts`)
  - Secret: `RESEND_API_KEY`
- **Checklist SEO de teste:**
  1. `curl https://site/servicos/limpeza-fachadas` devolve HTML com H1 e conteúdo (não `<div id="root"></div>` vazio)
  2. `/sitemap.xml` e `/robots.txt` acessíveis
  3. Cada rota tem `<title>`, `<meta description>`, `<link rel="canonical">`, OG, Twitter Card únicos
  4. JSON-LD validado em [validator.schema.org](https://validator.schema.org)
  5. Lighthouse mobile ≥ 90 em Performance/SEO/Best Practices/Accessibility
  6. Rich Results test passa em FAQPage e LocalBusiness
  7. Form `/contacto` envia email via Resend e mostra confirmação

## Riscos / pontos a confirmar

- Preset estático do TanStack Start gera HTML por rota — confirmar nome exato da pasta de output após primeiro build (`dist`, `dist/client` ou `.output/public`); ajusto o passo Cloudflare Pages em conformidade.
- Renomear slugs de serviços quebra links antigos: adiciono entradas em `_redirects` (`/servicos/pinturas /servicos/pinturas-interiores-exteriores 301`).
