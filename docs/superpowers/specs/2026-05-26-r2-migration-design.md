# Design Spec — Cloudflare R2: Portfolio Storage (Imagens + Vídeos)

**Data:** 2026-05-28 (atualizado)
**Âmbito:** Substituir Supabase Storage por Cloudflare R2 para imagens e vídeos do portfólio
**Stack:** TanStack Start + Cloudflare Pages Functions + Supabase (DB) + R2

---

## Contexto

O portfólio de obras usa Supabase Storage (bucket `portfolio`) para guardar imagens. O objetivo é substituir completamente o Supabase Storage por Cloudflare R2, que oferece 10 GB gratuitos e zero egress. Adicionalmente, o suporte a vídeos curtos de obra (30s–2min) é introduzido nesta migração.

Não há fotos existentes a migrar — o Supabase Storage está vazio.

---

## Âmbito

| Componente | O que muda |
|---|---|
| `wrangler.jsonc` | Adiciona binding R2 `PORTFOLIO_BUCKET` |
| `functions/api/upload.ts` | Novo — Pages Function para upload ao R2 |
| `functions/api/delete-files.ts` | Novo — Pages Function para apagar keys do R2 |
| `src/lib/portfolio-db.ts` | Substitui Supabase Storage por chamadas às Pages Functions; suporte a vídeo |
| `src/components/admin/BatchUploader.tsx` | Aceita `video/*`; limites por tipo de ficheiro |
| `src/components/admin/SortablePhotoCard.tsx` | Placeholder com ícone play para vídeos |
| `src/routes/portefolio.tsx` | Lightbox e grelha de álbum renderizam `<video>` quando `media_type === "video"` |
| Supabase DB | Nova coluna `media_type` em `portfolio_items` |

**Não muda:** tabela `portfolio_items` (exceto a nova coluna), queries Supabase, auth flow, demo mode, lógica de reordenação.

---

## Infraestrutura

### Bucket R2

Criar no dashboard Cloudflare R2:

| Nome | Uso |
|---|---|
| `ijsantos-portfolio` | Produção |
| `ijsantos-portfolio-preview` | Preview deploys / desenvolvimento |

Ambos com **Public Access ativado** — gera URL `https://pub-XXXXX.r2.dev`.
Quando o domínio `ijsantos.com` estiver verificado no Cloudflare, adicionar domínio personalizado `cdn.ijsantos.com` — env var only, sem alteração de código.

### `wrangler.jsonc`

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

| Variável | Onde | Exemplo |
|---|---|---|
| `VITE_R2_PUBLIC_URL` | `.env` + Cloudflare Pages env vars | `https://pub-XXXXX.r2.dev` |

---

## Base de dados (Supabase)

Adicionar coluna `media_type` à tabela `portfolio_items`:

```sql
ALTER TABLE portfolio_items
  ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image'
  CHECK (media_type IN ('image', 'video'));
```

O tipo TypeScript `PortfolioDbItem` passa a incluir `media_type: "image" | "video"`.

---

## Pages Functions

### `functions/api/upload.ts` — POST

**Auth:** `Authorization: Bearer <supabase-access-token>` obrigatório.
Valida chamando `GET https://<supabase-url>/auth/v1/user` com o token. Devolve 401 se inválido.

**Request:** `multipart/form-data` com campos:
- `file` — File (imagem ou vídeo)
- `prefix` — string (`""` para full, `"thumbs/"` para thumbnail)

**Response 200:** `{ path: string, url: string }`
**Response 401:** JWT inválido ou ausente
**Response 500:** Falha no R2

Implementação:
```ts
interface Env {
  PORTFOLIO_BUCKET: R2Bucket;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  VITE_R2_PUBLIC_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // 1. Validar JWT
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return new Response("Unauthorized", { status: 401 });
  const authRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_SERVICE_ROLE_KEY },
  });
  if (!authRes.ok) return new Response("Unauthorized", { status: 401 });

  // 2. Ler ficheiro
  const fd = await request.formData();
  const file = fd.get("file") as File | null;
  const prefix = (fd.get("prefix") as string | null) ?? "";
  if (!file) return new Response("Missing file", { status: 400 });

  // 3. Gerar key e fazer upload
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${prefix}${crypto.randomUUID()}.${ext}`;
  await env.PORTFOLIO_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  const url = `${env.VITE_R2_PUBLIC_URL}/${key}`;
  return new Response(JSON.stringify({ path: key, url }), {
    headers: { "content-type": "application/json" },
  });
};
```

### `functions/api/delete-files.ts` — POST

**Auth:** igual ao upload.

**Request:** `application/json` → `{ paths: string[] }`
**Response 200:** `{ ok: true }`
**Response 401:** JWT inválido
**Response 500:** Falha no R2

```ts
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // validar JWT (igual ao upload) ...
  const { paths } = await request.json<{ paths: string[] }>();
  await env.PORTFOLIO_BUCKET.delete(paths);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
};
```

---

## Fluxo de upload

### Imagens
```
Browser
  → processImage(file) → { full: File, thumb: File } (WebP, max 1920px)
  → POST /api/upload { file: full, prefix: "" } → { path, url: fullUrl }
  → POST /api/upload { file: thumb, prefix: "thumbs/" } → { path, url: thumbUrl }
  → supabase.insert("portfolio_items", { ..., public_url: fullUrl, thumb_url: thumbUrl, media_type: "image" })
```

### Vídeos
```
Browser
  → POST /api/upload { file: videoFile, prefix: "videos/" } → { path, url: videoUrl }
  → supabase.insert("portfolio_items", { ..., public_url: videoUrl, thumb_url: null, thumb_storage_path: null, media_type: "video" })
```

## Fluxo de delete
```
Browser
  → supabase.delete("portfolio_items").eq("id", item.id)
  → POST /api/delete-files { paths: [storage_path, thumb_storage_path].filter(Boolean) }
```

---

## Alterações em `portfolio-db.ts`

- Remover `const BUCKET = "portfolio"` e todos os `supabase.storage` imports
- Nova função `uploadToR2(file, prefix)` que chama `POST /api/upload` com o JWT do utilizador atual (`supabase.auth.getSession()`)
- `uploadPortfolioItem` bifurca por `file.type.startsWith("video/")`:
  - Imagem → `processImage` → upload full + thumb → `media_type: "image"`
  - Vídeo → upload direto sem processamento → `thumb_url: null` → `media_type: "video"`
- `deletePortfolioItem` apaga a row do DB primeiro; depois chama `POST /api/delete-files` para limpar os ficheiros do R2
- `PortfolioDbItem` type: adicionar `media_type: "image" | "video"`

---

## Interface de admin

### `BatchUploader.tsx`

- `accept="image/*,video/*"` no input de ficheiros
- Limite por tipo: imagens 10 MB, vídeos 500 MB
- Label: *"JPG, PNG, WebP, MP4, MOV — imagens até 10 MB · vídeos até 500 MB"*
- Ícone `Film` (lucide) na lista para itens de vídeo; `ImagePlus` mantém-se para imagens
- Texto do botão: *"Carregar N fotos/vídeos"* (singular/plural genérico)

### `SortablePhotoCard.tsx`

- Se `item.media_type === "video"`: renderizar em vez de `<img>` um `<div>` com fundo escuro + ícone `Play` centrado (Opção A — placeholder estático, sem autoplay)
- Se `item.media_type === "image"`: comportamento atual sem alteração

---

## Portefólio público (`portefolio.tsx`)

### Cover do álbum (`AlbumCard`)

Em `listPortfolioAlbums` (portfolio-db.ts), ao selecionar a capa:
- Preferir o primeiro item com `media_type === "image"`
- Fallback: primeiro item (vídeo) — neste caso `cover_media_type = "video"`

`PortfolioAlbum` type passa a incluir `cover_media_type: "image" | "video"`.

`AlbumCard`: se `cover_media_type === "video"`, mostrar fundo escuro + ícone play em vez de `<img>`.

### Grelha interna do álbum

Para cada `photo` da grelha (`openAlbum.photos.map(...)`):
- Se `media_type === "image"`: `<img src={photo.thumb_url ?? photo.public_url}>` (atual)
- Se `media_type === "video"`: placeholder escuro + ícone play; `thumb_url` é `null` para vídeos

### Lightbox

Para `openAlbum.photos[lightboxIndex]`:
- Se `media_type === "image"`: `<img>` (atual)
- Se `media_type === "video"`: `<video controls autoPlay src={photo.public_url} className="max-h-[80vh] max-w-[96vw] rounded-lg shadow-2xl" />`

Navegação por teclado (← →) mantém-se. Ao navegar para um vídeo, `autoPlay` inicia reprodução automaticamente.

---

## Limites e considerações

- **Tamanho máximo de request** nas Pages Functions: ~100 MB (Cloudflare Pages). Vídeos acima deste limite falham com erro de rede — para agora é aceitável dado o uso de vídeos curtos de obra.
- **Streaming**: R2 suporta `Content-Range` nativamente, por isso o seek em vídeo funciona sem configuração adicional.
- **DEMO_MODE**: gerido no cliente — `portfolio-db.ts` faz `if (DEMO_MODE) return` antes de chamar os endpoints. As Pages Functions não precisam de verificar (variáveis `VITE_*` não estão disponíveis em runtime nas Functions).

---

## Caminho futuro (fora de âmbito agora)

- Adicionar domínio `cdn.ijsantos.com` ao bucket R2 → alterar `VITE_R2_PUBLIC_URL` env var (sem código)
- Para vídeos > 100 MB: usar R2 presigned URLs (upload direto do browser para R2)
- Thumbnail automático de vídeo (frame 0): requer Cloudflare Workers com FFmpeg (muito complexo — descartado por agora)

---

## Checklist de testes

- [ ] Criar bucket `ijsantos-portfolio` com acesso público no dashboard
- [ ] Adicionar binding em `wrangler.jsonc` e `VITE_R2_PUBLIC_URL` em `.env` e Cloudflare Pages
- [ ] Fazer upload de imagem no admin — verificar URL R2 na DB e foto visível no portfólio
- [ ] Fazer upload de vídeo no admin — verificar URL R2, `media_type = "video"`, sem thumb
- [ ] Verificar placeholder de vídeo na grelha admin
- [ ] Abrir álbum no portfólio público — verificar `<video controls>` no lightbox
- [ ] Apagar foto — verificar que o ficheiro desaparece do R2 e da grelha
- [ ] Apagar vídeo — verificar que o ficheiro desaparece do R2
- [ ] Testar com utilizador não autenticado — upload deve devolver 401
