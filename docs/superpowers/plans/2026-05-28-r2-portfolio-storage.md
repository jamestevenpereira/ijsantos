# Cloudflare R2 Portfolio Storage (Imagens + Vídeos) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Supabase Storage with Cloudflare R2 for portfolio images and videos, adding video upload support throughout admin and public portfolio.

**Architecture:** Two new Cloudflare Pages Functions (`/api/upload`, `/api/delete-files`) proxy file operations to an R2 bucket, validating the Supabase JWT before any write. The Supabase DB gains a `media_type` column. Admin and public portfolio render `<video>` elements where appropriate.

**Tech Stack:** Cloudflare Pages Functions (TypeScript), Cloudflare R2, Supabase (DB only), React + TanStack Query, Lucide icons.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `wrangler.jsonc` | Modify | Add R2 bucket binding |
| `.dev.vars` | Modify | Add `SUPABASE_SERVICE_ROLE_KEY`, `VITE_R2_PUBLIC_URL` |
| `functions/api/upload.ts` | Create | Pages Function: validate JWT, upload file to R2, return URL |
| `functions/api/delete-files.ts` | Create | Pages Function: validate JWT, delete keys from R2 |
| `src/integrations/supabase/types.ts` | Modify | Add `media_type` to generated DB types |
| `src/lib/portfolio-db.ts` | Modify | Replace Supabase Storage with R2 calls; handle video |
| `src/components/admin/BatchUploader.tsx` | Modify | Accept `video/*`; per-type size limits; Film icon |
| `src/components/admin/SortablePhotoCard.tsx` | Modify | Video placeholder with Play icon |
| `src/components/admin/PhotoLightbox.tsx` | Modify | Render `<video>` for video items |
| `src/routes/portefolio.tsx` | Modify | Video in album grid and lightbox |

---

### Task 1: Infraestrutura — R2 bucket, wrangler binding, variáveis de ambiente

**Files:**
- Modify: `wrangler.jsonc`
- Modify: `.dev.vars`

- [ ] **Step 1: Criar bucket R2 de produção no dashboard Cloudflare**

Abrir `dash.cloudflare.com` → R2 Object Storage → **Create bucket**.
Nome: `ijsantos-portfolio`. Localização: Automatic. Clicar **Create bucket**.

- [ ] **Step 2: Criar bucket de preview**

Repetir: bucket com nome `ijsantos-portfolio-preview`.

- [ ] **Step 3: Activar acesso público**

No bucket `ijsantos-portfolio` → **Settings** → **Public access** → **Allow Access**.
Copiar o URL gerado (formato `https://pub-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.r2.dev`). Guardar.

- [ ] **Step 4: Actualizar wrangler.jsonc**

Substituir o conteúdo completo do ficheiro:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "VITE_SUPABASE_URL": "https://bltfbxuivvretztavuqe.supabase.co",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdGZieHVpdnZyZXR6dGF2dXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjAzMjEsImV4cCI6MjA5NTQzNjMyMX0.mYV92N_nEesIux-m3s0If9ziJPhlLo5epxBYJ68c248",
    "SUPABASE_URL": "https://bltfbxuivvretztavuqe.supabase.co",
    "SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdGZieHVpdnZyZXR6dGF2dXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjAzMjEsImV4cCI6MjA5NTQzNjMyMX0.mYV92N_nEesIux-m3s0If9ziJPhlLo5epxBYJ68c248"
  },
  "r2_buckets": [
    {
      "binding": "PORTFOLIO_BUCKET",
      "bucket_name": "ijsantos-portfolio",
      "preview_bucket_name": "ijsantos-portfolio-preview"
    }
  ]
}
```

- [ ] **Step 5: Adicionar variáveis ao .dev.vars**

Adicionar ao `.dev.vars` existente (que já tem `RESEND_API_KEY` etc.):

```
SUPABASE_SERVICE_ROLE_KEY=<service role key do Supabase dashboard → Project Settings → API>
VITE_R2_PUBLIC_URL=https://pub-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.r2.dev
```

- [ ] **Step 6: Commit**

```bash
git add wrangler.jsonc
git commit -m "chore(infra): add R2 bucket binding to wrangler"
```

`.dev.vars` não é committed (está no `.gitignore`).

---

### Task 2: Base de dados — coluna media_type + types.ts

**Files:**
- Modify: `src/integrations/supabase/types.ts`

- [ ] **Step 1: Correr migração no Supabase SQL Editor**

Abrir Supabase dashboard → SQL Editor → New query. Colar e executar:

```sql
ALTER TABLE portfolio_items
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image'
  CHECK (media_type IN ('image', 'video'));
```

Expected: `Success. No rows returned.`

- [ ] **Step 2: Verificar**

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'portfolio_items' AND column_name = 'media_type';
```

Expected: uma linha com `media_type | text | 'image'::text`.

- [ ] **Step 3: Actualizar src/integrations/supabase/types.ts**

No bloco `portfolio_items`, adicionar `media_type` nas três interfaces:

```typescript
portfolio_items: {
  Row: {
    category: string
    created_at: string
    id: string
    media_type: string          // ← adicionar
    obra_id: string | null
    public_url: string
    sort_order: number
    storage_path: string
    thumb_storage_path: string | null
    thumb_url: string | null
    title: string | null
  }
  Insert: {
    category: string
    created_at?: string
    id?: string
    media_type?: string         // ← adicionar (opcional — DEFAULT 'image')
    obra_id?: string | null
    public_url: string
    sort_order?: number
    storage_path: string
    thumb_storage_path?: string | null
    thumb_url?: string | null
    title?: string | null
  }
  Update: {
    category?: string
    created_at?: string
    id?: string
    media_type?: string         // ← adicionar
    obra_id?: string | null
    public_url?: string
    sort_order?: number
    storage_path?: string
    thumb_storage_path?: string | null
    thumb_url?: string | null
    title?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "portfolio_items_obra_id_fkey"
      columns: ["obra_id"]
      isOneToOne: false
      referencedRelation: "obras"
      referencedColumns: ["id"]
    }
  ]
}
```

- [ ] **Step 4: Verificar que o TypeScript compila**

```bash
npm run build 2>&1 | head -30
```

Expected: sem erros TypeScript.

- [ ] **Step 5: Commit**

```bash
git add src/integrations/supabase/types.ts
git commit -m "feat(db): add media_type column to portfolio_items"
```

---

### Task 3: Pages Function — /api/upload

**Files:**
- Create: `functions/api/upload.ts`

- [ ] **Step 1: Criar o ficheiro**

```typescript
// Cloudflare Pages Function — POST /api/upload
// Env: PORTFOLIO_BUCKET (R2 binding), SUPABASE_URL (var), SUPABASE_SERVICE_ROLE_KEY (secret), VITE_R2_PUBLIC_URL (secret)

interface Env {
  PORTFOLIO_BUCKET: R2Bucket;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  VITE_R2_PUBLIC_URL: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

async function validateJwt(request: Request, env: Env): Promise<boolean> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "").trim();
  if (!token) return false;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
  return res.ok;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await validateJwt(request, env))) {
    return new Response("Unauthorized", { status: 401 });
  }

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json({ error: "Invalid multipart body" }, 400);
  }

  const file = fd.get("file") as File | null;
  const prefix = ((fd.get("prefix") as string | null) ?? "").replace(/[^a-z0-9/_-]/gi, "");

  if (!file || file.size === 0) return json({ error: "Missing file" }, 400);

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${prefix}${crypto.randomUUID()}.${ext}`;

  try {
    await env.PORTFOLIO_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
  } catch (err) {
    console.error("R2 upload error", err);
    return json({ error: "Upload failed" }, 500);
  }

  const url = `${env.VITE_R2_PUBLIC_URL}/${key}`;
  return json({ path: key, url });
};
```

- [ ] **Step 2: Arrancar dev server e confirmar sem erros de compilação**

```bash
npm run dev
```

Expected: servidor arranca sem erros TypeScript no terminal.

- [ ] **Step 3: Commit**

```bash
git add functions/api/upload.ts
git commit -m "feat(api): add R2 upload Pages Function"
```

---

### Task 4: Pages Function — /api/delete-files

**Files:**
- Create: `functions/api/delete-files.ts`

- [ ] **Step 1: Criar o ficheiro**

```typescript
// Cloudflare Pages Function — POST /api/delete-files
// Env: PORTFOLIO_BUCKET (R2 binding), SUPABASE_URL (var), SUPABASE_SERVICE_ROLE_KEY (secret)

interface Env {
  PORTFOLIO_BUCKET: R2Bucket;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

async function validateJwt(request: Request, env: Env): Promise<boolean> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "").trim();
  if (!token) return false;
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
  return res.ok;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await validateJwt(request, env))) {
    return new Response("Unauthorized", { status: 401 });
  }

  let paths: string[];
  try {
    const body = await request.json<{ paths: unknown }>();
    if (!Array.isArray(body.paths) || body.paths.some((p) => typeof p !== "string")) {
      return json({ error: "paths must be string[]" }, 400);
    }
    paths = body.paths as string[];
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (paths.length === 0) return json({ ok: true });

  try {
    await env.PORTFOLIO_BUCKET.delete(paths);
  } catch (err) {
    console.error("R2 delete error", err);
    return json({ error: "Delete failed" }, 500);
  }

  return json({ ok: true });
};
```

- [ ] **Step 2: Commit**

```bash
git add functions/api/delete-files.ts
git commit -m "feat(api): add R2 delete-files Pages Function"
```

---

### Task 5: portfolio-db.ts — substituir Supabase Storage por R2

**Files:**
- Modify: `src/lib/portfolio-db.ts`

- [ ] **Step 1: Substituir o conteúdo completo de src/lib/portfolio-db.ts**

```typescript
import { supabase } from "@/integrations/supabase/client";
import type { PortfolioCategoryName } from "@/data/portfolio-categories";
import { processImage } from "@/lib/image-processing";
import { listObras, type ObraDbItem } from "@/lib/obras-db";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const DEMO_ITEMS: PortfolioDbItem[] = [
  { id: "demo-1", storage_path: "demo/1.jpg", public_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=60", thumb_storage_path: "demo/thumbs/1.jpg", category: "Construção Habitacional", obra_id: "obra-1", title: "Moradia Unifamiliar — Nelas", created_at: "2026-01-10T10:00:00Z", sort_order: 1, media_type: "image" },
  { id: "demo-2", storage_path: "demo/2.jpg", public_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=60", thumb_storage_path: "demo/thumbs/2.jpg", category: "Construção Habitacional", obra_id: "obra-2", title: "Ampliação de Habitação — Viseu", created_at: "2026-01-15T10:00:00Z", sort_order: 2, media_type: "image" },
  { id: "demo-3", storage_path: "demo/3.jpg", public_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=60", thumb_storage_path: "demo/thumbs/3.jpg", category: "Pavilhões Industriais", obra_id: "obra-3", title: "Pavilhão Industrial — Mangualde", created_at: "2026-02-01T10:00:00Z", sort_order: 1, media_type: "image" },
  { id: "demo-4", storage_path: "demo/4.jpg", public_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=60", thumb_storage_path: "demo/thumbs/4.jpg", category: "Pavilhões Industriais", obra_id: "obra-3", title: "Armazém Logístico — Tondela", created_at: "2026-02-10T10:00:00Z", sort_order: 2, media_type: "image" },
  { id: "demo-5", storage_path: "demo/5.jpg", public_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=60", thumb_storage_path: "demo/thumbs/5.jpg", category: "Lojas Comerciais", obra_id: "obra-5", title: "Remodelação Loja — Viseu", created_at: "2026-02-20T10:00:00Z", sort_order: 1, media_type: "image" },
  { id: "demo-6", storage_path: "demo/6.jpg", public_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=60", thumb_storage_path: "demo/thumbs/6.jpg", category: "Obras Públicas", obra_id: "obra-6", title: "Arranjo Exterior — Nelas", created_at: "2026-03-01T10:00:00Z", sort_order: 1, media_type: "image" },
];

export type PortfolioDbItem = {
  id: string;
  storage_path: string;
  public_url: string;
  thumb_storage_path: string | null;
  thumb_url: string | null;
  category: PortfolioCategoryName;
  obra_id: string | null;
  title: string | null;
  created_at: string;
  sort_order: number;
  media_type: "image" | "video";
};

export type PortfolioAlbum = {
  obra: ObraDbItem;
  photos: PortfolioDbItem[];
  cover_url: string;
  cover_thumb_url: string;
  cover_media_type: "image" | "video";
};

export async function listPortfolioItems(): Promise<PortfolioDbItem[]> {
  if (DEMO_MODE) return DEMO_ITEMS;
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as PortfolioDbItem[];
}

async function nextSortOrder(category: PortfolioCategoryName): Promise<number> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data?.sort_order ?? 0) + 1;
}

async function uploadToR2(file: File, prefix: string): Promise<{ path: string; url: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Não autenticado.");

  const fd = new FormData();
  fd.append("file", file);
  fd.append("prefix", prefix);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload falhou (${res.status}): ${text}`);
  }
  return res.json();
}

async function deleteFromR2(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Não autenticado.");

  const res = await fetch("/api/delete-files", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paths }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete R2 falhou (${res.status}): ${text}`);
  }
}

export async function listPortfolioAlbums(): Promise<PortfolioAlbum[]> {
  const [items, obras] = await Promise.all([listPortfolioItems(), listObras()]);

  const byObra = new Map<string, PortfolioDbItem[]>();
  for (const item of items) {
    if (!item.obra_id) continue;
    const list = byObra.get(item.obra_id) ?? [];
    list.push(item);
    byObra.set(item.obra_id, list);
  }

  const albums: PortfolioAlbum[] = [];
  for (const obra of obras) {
    const photos = byObra.get(obra.id);
    if (!photos || photos.length === 0) continue;
    const cover = photos.find((p) => p.media_type === "image") ?? photos[0];
    albums.push({
      obra,
      photos,
      cover_url: cover.public_url,
      cover_thumb_url: cover.thumb_url ?? cover.public_url,
      cover_media_type: cover.media_type,
    });
  }
  return albums;
}

export async function uploadPortfolioItem(params: {
  file: File;
  category: PortfolioCategoryName;
  obra_id?: string | null;
  title?: string | null;
}): Promise<PortfolioDbItem> {
  const { file, category, obra_id, title } = params;
  const isVideo = file.type.startsWith("video/");

  let fullRes: { path: string; url: string };
  let thumbRes: { path: string; url: string } | null = null;

  if (isVideo) {
    fullRes = await uploadToR2(file, "videos/");
  } else {
    const { full, thumb } = await processImage(file);
    fullRes = await uploadToR2(full, "");
    try {
      thumbRes = await uploadToR2(thumb, "thumbs/");
    } catch (e) {
      console.warn("Thumb upload falhou:", e);
    }
  }

  const sort_order = await nextSortOrder(category);

  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      storage_path: fullRes.path,
      public_url: fullRes.url,
      thumb_storage_path: thumbRes?.path ?? null,
      thumb_url: thumbRes?.url ?? null,
      category,
      obra_id: obra_id ?? null,
      title: title?.trim() || null,
      sort_order,
      media_type: isVideo ? "video" : "image",
    })
    .select("*")
    .single();

  if (error) {
    const pathsToDelete = [fullRes.path, thumbRes?.path].filter(Boolean) as string[];
    await deleteFromR2(pathsToDelete).catch(console.warn);
    throw error;
  }
  return data as PortfolioDbItem;
}

export async function deletePortfolioItem(item: PortfolioDbItem): Promise<void> {
  if (DEMO_MODE) return;

  const { error: delErr } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", item.id);
  if (delErr) throw delErr;

  const paths = [item.storage_path, item.thumb_storage_path].filter(Boolean) as string[];
  await deleteFromR2(paths).catch((e) => console.warn("R2 cleanup falhou:", e));
}

export async function updatePortfolioItem(params: {
  id: string;
  title: string | null;
  category: PortfolioCategoryName;
  currentCategory: PortfolioCategoryName;
}): Promise<PortfolioDbItem> {
  const { id, title, category, currentCategory } = params;
  const patch: { title: string | null; category: PortfolioCategoryName; sort_order?: number } = {
    title: title?.trim() ? title.trim() : null,
    category,
  };
  if (category !== currentCategory) {
    patch.sort_order = await nextSortOrder(category);
  }
  const { data, error } = await supabase
    .from("portfolio_items")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as PortfolioDbItem;
}

export async function reorderPortfolioItems(
  updates: { id: string; sort_order: number }[],
): Promise<void> {
  const results = await Promise.all(
    updates.map((u) =>
      supabase
        .from("portfolio_items")
        .update({ sort_order: u.sort_order })
        .eq("id", u.id),
    ),
  );
  const firstErr = results.find((r) => r.error)?.error;
  if (firstErr) throw firstErr;
}
```

- [ ] **Step 2: Verificar build TypeScript**

```bash
npm run build 2>&1 | grep -i "error" | head -20
```

Expected: sem erros TypeScript em `portfolio-db.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/portfolio-db.ts
git commit -m "feat(storage): replace Supabase Storage with Cloudflare R2"
```

---

### Task 6: BatchUploader — suporte a vídeo

**Files:**
- Modify: `src/components/admin/BatchUploader.tsx`

- [ ] **Step 1: Substituir o conteúdo completo de BatchUploader.tsx**

```typescript
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Film, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { listObras, type ObraDbItem } from "@/lib/obras-db";
import { uploadPortfolioItem } from "@/lib/portfolio-db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 500;

type Status = "pending" | "uploading" | "done" | "error";

type Item = {
  id: string;
  file: File;
  status: Status;
  error?: string;
};

export function BatchUploader() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedObraId, setSelectedObraId] = useState<string>("");
  const [title, setTitle] = useState("");

  const { data: obras = [], isLoading: obrasLoading } = useQuery({
    queryKey: ["obras"],
    queryFn: listObras,
    staleTime: 300_000,
  });

  const selectedObra: ObraDbItem | undefined = obras.find((o) => o.id === selectedObraId);

  const uploadMut = useMutation({
    mutationFn: async () => {
      if (!selectedObra) throw new Error("Selecione uma obra.");
      let success = 0;
      let failed = 0;
      for (const item of items) {
        if (item.status === "done") continue;
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "uploading", error: undefined } : p)),
        );
        try {
          await uploadPortfolioItem({
            file: item.file,
            category: selectedObra.categoria,
            obra_id: selectedObra.id,
            title: title || null,
          });
          setItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: "done" } : p)),
          );
          success++;
        } catch (e) {
          const msg = e instanceof Error ? e.message : "erro desconhecido";
          setItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: "error", error: msg } : p)),
          );
          failed++;
        }
        qc.invalidateQueries({ queryKey: ["portfolio_items"] });
        qc.invalidateQueries({ queryKey: ["portfolio_albums"] });
      }
      return { success, failed };
    },
    onSuccess: ({ success, failed }) => {
      if (failed === 0) {
        toast.success(
          success === 1
            ? "Ficheiro carregado com sucesso."
            : `${success} ficheiros carregados com sucesso.`,
        );
        setItems([]);
        setTitle("");
        if (inputRef.current) inputRef.current.value = "";
      } else {
        toast.error(`${success} carregados, ${failed} falharam.`);
      }
    },
  });

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Item[] = [];
    let skipped = 0;
    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) { skipped++; continue; }
      const limitMB = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
      if (file.size > limitMB * 1024 * 1024) { skipped++; continue; }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        status: "pending",
      });
    }
    if (skipped > 0) {
      toast.error(`${skipped} ficheiro(s) ignorado(s) — formato não suportado ou excede tamanho máximo.`);
    }
    setItems((prev) => [...prev, ...next]);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObraId) { toast.error("Selecione uma obra."); return; }
    if (items.length === 0) { toast.error("Selecione pelo menos um ficheiro."); return; }
    uploadMut.mutate();
  };

  const pending = items.filter((i) => i.status !== "done").length;
  const total = items.length;
  const done = total - pending;
  const isUploading = uploadMut.isPending;

  return (
    <section className="rounded-xl bg-[#1A1A1A] border border-white/5 p-6 mb-10">
      <h2 className="text-lg font-semibold mb-4">Carregar fotos e vídeos</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="files" className="text-white/80 mb-2 block">
            Fotos e vídeos (vários permitidos)
          </Label>
          <label
            htmlFor="files"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 bg-[#0F0F0F] hover:border-white/30 transition-colors cursor-pointer py-8 px-4 text-center"
          >
            <ImagePlus className="h-6 w-6 text-white/50" />
            <span className="text-sm text-white/70">
              Clique para selecionar ou largue ficheiros aqui
            </span>
            <span className="text-xs text-white/40">
              Imagens (JPG, PNG, WebP) até {MAX_IMAGE_MB} MB · Vídeos (MP4, MOV) até {MAX_VIDEO_MB} MB
            </span>
            <input
              id="files"
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
              disabled={isUploading}
            />
          </label>
        </div>

        {items.length > 0 && (
          <ul className="rounded-lg border border-white/10 divide-y divide-white/5 bg-[#0F0F0F] max-h-64 overflow-auto">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    it.status === "done" ? "bg-emerald-400"
                    : it.status === "uploading" ? "bg-amber-400 animate-pulse"
                    : it.status === "error" ? "bg-red-400"
                    : "bg-white/30"
                  }`}
                />
                {it.file.type.startsWith("video/") ? (
                  <Film className="h-3.5 w-3.5 text-white/40 shrink-0" />
                ) : (
                  <ImagePlus className="h-3.5 w-3.5 text-white/40 shrink-0" />
                )}
                <span className="flex-1 truncate text-white/80">{it.file.name}</span>
                <span className="text-xs text-white/40 shrink-0">
                  {(it.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                {it.status === "error" && (
                  <span className="text-xs text-red-400 truncate max-w-[10rem]" title={it.error}>
                    {it.error}
                  </span>
                )}
                {!isUploading && it.status !== "done" && (
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="text-white/40 hover:text-white"
                    aria-label="Remover ficheiro"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">Obra (aplicada a todos) *</Label>
            {obrasLoading ? (
              <div className="flex items-center gap-2 text-sm text-white/40 h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
                A carregar obras…
              </div>
            ) : obras.length === 0 ? (
              <p className="text-sm text-white/50 h-10 flex items-center">
                Crie primeiro uma obra no separador <strong className="ml-1 text-white/70">Obras</strong>.
              </p>
            ) : (
              <Select value={selectedObraId} onValueChange={setSelectedObraId} disabled={isUploading}>
                <SelectTrigger className="bg-[#0F0F0F] border-white/10 text-white">
                  <SelectValue placeholder="Selecionar obra…" />
                </SelectTrigger>
                <SelectContent>
                  {obras.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.nome}
                      <span className="ml-2 text-muted-foreground text-xs">{o.local} · {o.ano}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedObra && (
              <p className="text-xs text-white/50">
                Categoria: <span className="text-white/70">{selectedObra.categoria}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80">Título (opcional, partilhado)</Label>
            <Input
              id="title"
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
              placeholder="Ex.: Pavilhão industrial em Nelas"
            />
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>A carregar {done + 1} de {total}…</span>
              <span>{Math.round((done / total) * 100)}%</span>
            </div>
            <Progress value={(done / total) * 100} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-white/50">
            {items.length === 0
              ? "Nenhum ficheiro selecionado."
              : `${items.length} ficheiro(s) selecionado(s).`}
          </p>
          <button
            type="submit"
            disabled={isUploading || items.length === 0 || !selectedObraId}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-11 px-6 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading
              ? "A carregar…"
              : items.length > 1
                ? `Carregar ${items.length} ficheiros`
                : "Carregar ficheiro"}
          </button>
        </div>
      </form>
    </section>
  );
}
```

- [ ] **Step 2: Verificar no browser**

```bash
npm run dev
```

Aceder a `http://localhost:5173/admin/portfolio`. A drop zone deve mostrar o texto novo e aceitar vídeos ao selecionar ficheiros.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/BatchUploader.tsx
git commit -m "feat(admin): add video upload support to BatchUploader"
```

---

### Task 7: Admin — SortablePhotoCard e PhotoLightbox com suporte a vídeo

**Files:**
- Modify: `src/components/admin/SortablePhotoCard.tsx`
- Modify: `src/components/admin/PhotoLightbox.tsx`

- [ ] **Step 1: Substituir SortablePhotoCard.tsx**

```typescript
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play, Trash2 } from "lucide-react";
import type { PortfolioDbItem } from "@/lib/portfolio-db";

type Props = {
  item: PortfolioDbItem;
  onPreview: (item: PortfolioDbItem) => void;
  onDelete: (item: PortfolioDbItem) => void;
};

export function SortablePhotoCard({ item, onPreview, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-lg border bg-[#1A1A1A] ${
        isDragging ? "border-[#DC2626] shadow-2xl" : "border-white/10"
      }`}
    >
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="block w-full aspect-square text-left"
        aria-label={`Pré-visualizar ${item.title ?? item.category}`}
      >
        {item.media_type === "video" ? (
          <div className="h-full w-full bg-[#0F0F0F] grid place-items-center">
            <Play className="h-10 w-10 text-white/40" />
          </div>
        ) : (
          <img
            src={item.thumb_url ?? item.public_url}
            alt={item.title ?? item.category}
            loading="lazy"
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}
      </button>

      <div className="p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-white/60 bg-white/5 rounded px-2 py-0.5">
            {item.category}
          </span>
          {item.media_type === "video" && (
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-blue-400/80 bg-blue-400/10 rounded px-2 py-0.5">
              vídeo
            </span>
          )}
        </div>
        {item.title && (
          <p className="mt-2 text-sm text-white/90 line-clamp-2">{item.title}</p>
        )}
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className="absolute top-2 left-2 h-9 w-9 grid place-items-center rounded-full bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
        aria-label="Remover"
        className="absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#DC2626] hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  );
}
```

- [ ] **Step 2: Actualizar o bloco de media em PhotoLightbox.tsx**

No ficheiro `src/components/admin/PhotoLightbox.tsx`, localizar o bloco (linhas 98–104):

```typescript
<div className="bg-black grid place-items-center max-h-[60vh] md:max-h-[70vh] overflow-hidden">
  <img
    src={item.public_url}
    alt={item.title ?? item.category}
    className="max-h-[60vh] md:max-h-[70vh] w-auto object-contain"
  />
</div>
```

Substituir por:

```typescript
<div className="bg-black grid place-items-center max-h-[60vh] md:max-h-[70vh] overflow-hidden">
  {item.media_type === "video" ? (
    <video
      key={item.id}
      src={item.public_url}
      controls
      className="max-h-[60vh] md:max-h-[70vh] w-auto"
    />
  ) : (
    <img
      src={item.public_url}
      alt={item.title ?? item.category}
      className="max-h-[60vh] md:max-h-[70vh] w-auto object-contain"
    />
  )}
</div>
```

Também actualizar a `DialogDescription` de "Pré-visualização da foto" para "Pré-visualização do ficheiro".

- [ ] **Step 3: Verificar no browser**

```bash
npm run dev
```

Aceder a `http://localhost:5173/admin/portfolio`. Os cards existentes em DEMO_MODE continuam a mostrar imagens. Clicar num card abre o lightbox.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/SortablePhotoCard.tsx src/components/admin/PhotoLightbox.tsx
git commit -m "feat(admin): render video placeholder and player in portfolio components"
```

---

### Task 8: Portefólio público — vídeo na grelha e lightbox

**Files:**
- Modify: `src/routes/portefolio.tsx`

- [ ] **Step 1: Adicionar Play ao import de lucide-react**

Encontrar:
```typescript
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Images } from "lucide-react";
```

Substituir por:
```typescript
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Images, Play } from "lucide-react";
```

- [ ] **Step 2: Actualizar a grelha interna do álbum**

Encontrar o bloco que mapeia `openAlbum.photos` na grelha (em torno da linha 231):

```typescript
{openAlbum.photos.map((photo, i) => (
  <button
    key={photo.id}
    onClick={() => setLightboxIndex(i)}
    className="group relative overflow-hidden rounded-lg border border-white/10 aspect-square"
    aria-label={`Ver foto ${i + 1}`}
  >
    <img
      src={photo.thumb_url ?? photo.public_url}
      alt={photo.title ?? openAlbum.obra.nome}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
  </button>
))}
```

Substituir por:
```typescript
{openAlbum.photos.map((photo, i) => (
  <button
    key={photo.id}
    onClick={() => setLightboxIndex(i)}
    className="group relative overflow-hidden rounded-lg border border-white/10 aspect-square"
    aria-label={`Ver ${photo.media_type === "video" ? "vídeo" : "foto"} ${i + 1}`}
  >
    {photo.media_type === "video" ? (
      <div className="h-full w-full bg-[#111] grid place-items-center">
        <Play className="h-8 w-8 text-white/50 group-hover:text-white transition-colors" />
      </div>
    ) : (
      <img
        src={photo.thumb_url ?? photo.public_url}
        alt={photo.title ?? openAlbum.obra.nome}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    )}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
  </button>
))}
```

- [ ] **Step 3: Actualizar o lightbox para renderizar vídeo**

Encontrar o bloco `<figure ...>` no lightbox (em torno da linha 293):

```typescript
<figure
  className="max-h-[88vh] max-w-[96vw]"
  onClick={(e) => e.stopPropagation()}
>
  <img
    src={openAlbum.photos[lightboxIndex].public_url}
    alt={openAlbum.photos[lightboxIndex].title ?? openAlbum.obra.nome}
    className="max-h-[80vh] max-w-[96vw] object-contain rounded-lg shadow-2xl"
  />
  <figcaption className="mt-3 text-center text-white/80 text-sm">
    {openAlbum.obra.nome} — {lightboxIndex + 1} / {openAlbum.photos.length}
  </figcaption>
</figure>
```

Substituir por:
```typescript
<figure
  className="max-h-[88vh] max-w-[96vw]"
  onClick={(e) => e.stopPropagation()}
>
  {openAlbum.photos[lightboxIndex].media_type === "video" ? (
    <video
      key={openAlbum.photos[lightboxIndex].id}
      src={openAlbum.photos[lightboxIndex].public_url}
      controls
      autoPlay
      className="max-h-[80vh] max-w-[96vw] rounded-lg shadow-2xl"
    />
  ) : (
    <img
      src={openAlbum.photos[lightboxIndex].public_url}
      alt={openAlbum.photos[lightboxIndex].title ?? openAlbum.obra.nome}
      className="max-h-[80vh] max-w-[96vw] object-contain rounded-lg shadow-2xl"
    />
  )}
  <figcaption className="mt-3 text-center text-white/80 text-sm">
    {openAlbum.obra.nome} — {lightboxIndex + 1} / {openAlbum.photos.length}
  </figcaption>
</figure>
```

- [ ] **Step 4: Actualizar AlbumCard para suportar cover de vídeo**

Encontrar a função `AlbumCard` no fundo do ficheiro. Substituir o `<img ...>` da capa:

```typescript
      <img
        src={album.cover_thumb_url}
        alt={album.obra.nome}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
```

Por:
```typescript
      {album.cover_media_type === "video" ? (
        <div className="h-full w-full bg-[#111] grid place-items-center">
          <Play className="h-12 w-12 text-white/40 group-hover:text-white/70 transition-colors" />
        </div>
      ) : (
        <img
          src={album.cover_thumb_url}
          alt={album.obra.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
```

- [ ] **Step 5: Verificar no browser**

```bash
npm run dev
```

Aceder a `http://localhost:5173/portefolio`. Os álbuns em DEMO_MODE mostram imagens normalmente. Clicar num álbum e numa foto abre o lightbox.

- [ ] **Step 6: Commit**

```bash
git add src/routes/portefolio.tsx
git commit -m "feat(portfolio): add video support to public album grid and lightbox"
```

---

### Task 9: Cloudflare Pages — variáveis de ambiente de produção

**Files:** (configuração manual no dashboard)

- [ ] **Step 1: Adicionar variáveis no Cloudflare Pages**

Cloudflare Pages → projecto `ijsantos` → **Settings** → **Environment variables** → **Production**.

| Variável | Tipo | Valor |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Service role key (Supabase → Project Settings → API) |
| `VITE_R2_PUBLIC_URL` | Secret | `https://pub-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.r2.dev` |

- [ ] **Step 2: Fazer deploy**

```bash
git push origin main
```

Aguardar build no dashboard Cloudflare Pages.

- [ ] **Step 3: Testar em produção**

1. Aceder ao admin em produção e fazer login
2. Criar obra de teste se necessário
3. Fazer upload de uma imagem — URL deve começar com `https://pub-XXXXX.r2.dev/`
4. Verificar imagem visível no portefólio público
5. Fazer upload de vídeo curto MP4 (≤200 MB) — aparece placeholder de play no admin
6. Abrir álbum no portefólio público → clicar no vídeo → lightbox reproduz com controlos
7. Apagar um item — desaparece da grelha e do R2
