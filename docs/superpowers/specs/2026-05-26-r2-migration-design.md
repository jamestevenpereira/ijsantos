# Design Spec — Migração de Storage para Cloudflare R2

**Data:** 2026-05-26  
**Âmbito:** Portfolio image storage — Supabase Storage → Cloudflare R2  
**Stack:** TanStack Start + Nitro + Cloudflare Pages + Supabase

---

## Contexto

O portfolio de obras usa o Supabase Storage (bucket `portfolio`) para guardar imagens. A documentação do cliente (`05-supabase.md`, `solicitacao-cliente-materiais-e-acessos.md`) indica Cloudflare R2 como solução de storage. Esta migração alinha o código com a arquitectura documentada.

---

## Arquitectura

### O que muda

| Ficheiro | Mudança |
|----------|---------|
| `wrangler.jsonc` | Adiciona binding R2 `PORTFOLIO_BUCKET` |
| `.env` | Adiciona `VITE_R2_PUBLIC_URL` (URL base pública do bucket) |
| `src/routes/api/r2.upload.ts` | Novo — endpoint POST para upload de ficheiros ao R2 |
| `src/routes/api/r2.delete.ts` | Novo — endpoint DELETE para apagar keys do R2 |
| `src/lib/portfolio-db.ts` | `uploadToBucket()` e `deletePortfolioItem()` passam a chamar os novos endpoints |

### O que não muda

- Tabela `portfolio_items` no Supabase (schema, queries, tudo igual)
- `BatchUploader.tsx` — sem alterações
- `listPortfolioItems()` — continua a ler de Supabase (que guarda `public_url`)
- Fluxo de auth, admin layout, demo mode

---

## Fluxos de dados

### Upload

```
Browser
  → processImage() [sem mudança — gera full + thumb]
  → POST /api/r2/upload { file, prefix }
      Authorization: Bearer <supabase-jwt>
      └─ verifica JWT via Supabase server client (401 se inválido)
      └─ key = `{prefix}{uuid}.{ext}`
      └─ env.PORTFOLIO_BUCKET.put(key, stream, { httpMetadata })
      └─ devolve { path: key, url: `${R2_PUBLIC_URL}/${key}` }
  → supabase.insert("portfolio_items") [sem mudança]
```

### Delete

```
Browser
  → supabase.delete("portfolio_items") [sem mudança]
  → DELETE /api/r2/delete { paths: [storage_path, thumb_storage_path] }
      Authorization: Bearer <supabase-jwt>
      └─ verifica JWT
      └─ env.PORTFOLIO_BUCKET.delete(paths)
      └─ devolve 204
```

---

## Configuração de infraestrutura

### Buckets R2 a criar no Cloudflare dashboard

| Nome | Ambiente |
|------|----------|
| `ijsantos-portfolio` | Produção |
| `ijsantos-portfolio-preview` | Dev / Preview deploys |

Ambos com **Public Access activado** — gera URL `pub-xxxxxxxx.r2.dev`.

### `wrangler.jsonc` (diff)

```jsonc
"r2_buckets": [
  {
    "binding": "PORTFOLIO_BUCKET",
    "bucket_name": "ijsantos-portfolio",
    "preview_bucket_name": "ijsantos-portfolio-preview"
  }
]
```

### Variáveis de ambiente

| Variável | Onde | Valor |
|----------|------|-------|
| `VITE_R2_PUBLIC_URL` | `.env` + Cloudflare Pages env vars | `https://pub-xxxxxxxx.r2.dev` |

---

## API Routes

### `POST /api/r2/upload`

**Request:** `multipart/form-data` com campos `file` (File) e `prefix` (string, ex: `""` ou `"thumbs/"`)  
**Headers:** `Authorization: Bearer <jwt>`  
**Response 200:** `{ path: string, url: string }`  
**Response 401:** JWT inválido ou ausente  
**Response 500:** Falha no R2

Acesso ao binding via Nitro/Vinxi:
```ts
import { getEvent } from "vinxi/http";
const env = getEvent().context.cloudflare?.env as { PORTFOLIO_BUCKET: R2Bucket };
```

### `DELETE /api/r2/delete`

**Request:** `application/json` com campo `paths: string[]`  
**Headers:** `Authorization: Bearer <jwt>`  
**Response 204:** Sucesso  
**Response 401:** JWT inválido ou ausente

O R2 aceita array de keys numa única chamada a `.delete()`.

---

## Alterações em `portfolio-db.ts`

`uploadToBucket()` — nova implementação:
1. `supabase.auth.getSession()` → obtém `access_token`
2. Constrói `FormData` com `file` e `prefix`
3. `fetch("/api/r2/upload", { method: "POST", headers: { Authorization }, body })`
4. Devolve `{ path, url }` — interface idêntica, nenhum caller muda

`deletePortfolioItem()` — adiciona chamada ao delete endpoint após apagar da tabela Supabase.

---

## DEMO_MODE

Os endpoints verificam `VITE_DEMO_MODE`. Se activo, devolvem mock sem tocar no R2 — comportamento idêntico ao actual.

---

## Migração de dados existentes

As imagens já no Supabase Storage ficam acessíveis enquanto os `public_url` na tabela `portfolio_items` não forem alterados. Não é necessária migração de dados — as fotos novas vão para R2, as antigas ficam no Supabase Storage até serem apagadas manualmente.

---

## Actualização de documentação

Após implementação, actualizar:
- `docs/client-onboarding/clients/ijsantos/05-supabase.md` — confirmar que storage é R2
- `docs/solicitacao-cliente-materiais-e-acessos.md` — já menciona R2, está correcto
