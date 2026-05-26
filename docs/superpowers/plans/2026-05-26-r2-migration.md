# R2 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate portfolio image storage from Supabase Storage to Cloudflare R2, keeping the `portfolio_items` Supabase table intact.

**Architecture:** Client fetches the Supabase session token, then POSTs binary files directly to a Nitro event handler (`/api/r2/upload`) which verifies auth and writes to R2 via the Worker binding. Delete follows the same pattern. `portfolio-db.ts` swaps `uploadToBucket()` and `deletePortfolioItem()` to call these endpoints instead of Supabase Storage. `DEMO_MODE` short-circuits all R2 calls on the client.

**Tech Stack:** Cloudflare R2, Nitro (h3 event handlers), Supabase Auth (JWT verification), TanStack Start, TypeScript

---

## Prerequisites (manual steps before coding)

These must be done in the Cloudflare dashboard before deploying or testing with `wrangler dev`:

1. Create bucket `ijsantos-portfolio` in Cloudflare R2 → Settings → Public Access → enable R2.dev subdomain → note the URL (`https://pub-xxxxxxxx.r2.dev`)
2. Create bucket `ijsantos-portfolio-preview` (same settings) for preview deploys
3. Note both bucket names and the public URL

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `src/env.d.ts` | TypeScript declarations for Cloudflare Worker env bindings |
| Modify | `wrangler.jsonc` | Add R2 bucket binding and `R2_PUBLIC_URL` var |
| Create | `src/server/r2-upload.ts` | Nitro POST handler — auth + R2 put |
| Create | `src/server/r2-delete.ts` | Nitro DELETE handler — auth + R2 delete |
| Modify | `vite.config.ts` | Register the two Nitro handlers |
| Modify | `src/lib/portfolio-db.ts` | Replace Supabase Storage calls with fetch to the new endpoints |
| Modify | `.env` | Add `VITE_R2_PUBLIC_URL` placeholder |
| Modify | `docs/client-onboarding/clients/ijsantos/05-supabase.md` | Correct "Cloudflare R2" note (was already correct) |

---

## Task 1: TypeScript env declarations

**Files:**
- Create: `src/env.d.ts`

- [ ] **Step 1: Create the file**

```ts
// src/env.d.ts
/// <reference types="@cloudflare/workers-types" />

interface WorkerEnv {
  PORTFOLIO_BUCKET: R2Bucket;
  R2_PUBLIC_URL: string;
  ASSETS: Fetcher;
}

declare module "h3" {
  interface H3EventContext {
    cloudflare?: {
      env: WorkerEnv;
      ctx: ExecutionContext;
    };
  }
}

export {};
```

- [ ] **Step 2: Verify TypeScript is happy**

Run: `npx tsc --noEmit`
Expected: no new errors related to `R2Bucket` or `WorkerEnv`

- [ ] **Step 3: Commit**

```bash
git add src/env.d.ts
git commit -m "feat(r2): add Cloudflare Worker env type declarations"
```

---

## Task 2: Wrangler config

**Files:**
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Add R2 bindings and public URL var**

Replace the current content of `wrangler.jsonc` with:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "tanstack-start-app",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/server.ts",
  "r2_buckets": [
    {
      "binding": "PORTFOLIO_BUCKET",
      "bucket_name": "ijsantos-portfolio",
      "preview_bucket_name": "ijsantos-portfolio-preview"
    }
  ],
  "vars": {
    "R2_PUBLIC_URL": "https://pub-xxxxxxxx.r2.dev"
  }
}
```

Replace `pub-xxxxxxxx` with the actual R2.dev URL obtained in the prerequisites.

- [ ] **Step 2: Add placeholder to .env**

Add to `.env`:
```
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
```

This value is used by the server handler in local `wrangler dev` sessions. Replace with the real URL when the bucket exists.

- [ ] **Step 3: Commit**

```bash
git add wrangler.jsonc .env
git commit -m "feat(r2): add R2 bucket binding and public URL to wrangler config"
```

---

## Task 3: Upload handler

**Files:**
- Create: `src/server/r2-upload.ts`

This is a Nitro/h3 event handler. It:
1. Reads the `Authorization: Bearer <jwt>` header and verifies it with Supabase
2. Reads the multipart form body (`file` + `prefix` fields)
3. Puts the file into R2
4. Returns `{ path, url }`

- [ ] **Step 1: Create the handler**

```ts
// src/server/r2-upload.ts
import { defineEventHandler, getHeader, readFormData, createError } from "h3";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const authHeader = getHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const token = authHeader.slice(7);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, message: "Supabase env vars missing" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    throw createError({ statusCode: 401, message: "Invalid token" });
  }

  // ── R2 binding ───────────────────────────────────────────────────────────
  const cfEnv = event.context.cloudflare?.env;
  if (!cfEnv?.PORTFOLIO_BUCKET) {
    throw createError({ statusCode: 500, message: "R2 binding unavailable" });
  }
  const bucket = cfEnv.PORTFOLIO_BUCKET;
  const publicUrl = cfEnv.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || "";

  // ── Read body ────────────────────────────────────────────────────────────
  const formData = await readFormData(event);
  const file = formData.get("file") as File | null;
  const prefix = (formData.get("prefix") as string | null) ?? "";

  if (!file || !(file instanceof File)) {
    throw createError({ statusCode: 400, message: "Missing file field" });
  }

  // ── Upload ───────────────────────────────────────────────────────────────
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const key = `${prefix}${crypto.randomUUID()}.${ext}`;

  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/webp" },
    customMetadata: { cacheControl: "public, max-age=31536000, immutable" },
  });

  return { path: key, url: `${publicUrl}/${key}` };
});
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors in `src/server/r2-upload.ts`

- [ ] **Step 3: Commit**

```bash
git add src/server/r2-upload.ts
git commit -m "feat(r2): add upload event handler"
```

---

## Task 4: Delete handler

**Files:**
- Create: `src/server/r2-delete.ts`

- [ ] **Step 1: Create the handler**

```ts
// src/server/r2-delete.ts
import { defineEventHandler, getHeader, readBody, createError } from "h3";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const authHeader = getHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const token = authHeader.slice(7);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, message: "Supabase env vars missing" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    throw createError({ statusCode: 401, message: "Invalid token" });
  }

  // ── R2 binding ───────────────────────────────────────────────────────────
  const cfEnv = event.context.cloudflare?.env;
  if (!cfEnv?.PORTFOLIO_BUCKET) {
    throw createError({ statusCode: 500, message: "R2 binding unavailable" });
  }

  // ── Body ─────────────────────────────────────────────────────────────────
  const body = await readBody(event) as { paths?: unknown };
  const paths = body?.paths;
  if (!Array.isArray(paths) || paths.length === 0) {
    throw createError({ statusCode: 400, message: "paths must be a non-empty array" });
  }
  if (!paths.every((p) => typeof p === "string")) {
    throw createError({ statusCode: 400, message: "all paths must be strings" });
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  await cfEnv.PORTFOLIO_BUCKET.delete(paths as string[]);

  return null; // 200 with empty body; Nitro serialises null as {}
});
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/server/r2-delete.ts
git commit -m "feat(r2): add delete event handler"
```

---

## Task 5: Register handlers with Nitro

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Update vite.config.ts**

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({
      handlers: [
        { route: "/api/r2/upload", handler: "src/server/r2-upload", method: "post" },
        { route: "/api/r2/delete", handler: "src/server/r2-delete", method: "delete" },
      ],
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
```

- [ ] **Step 2: Start dev server and verify routes are registered**

Run: `npm run dev`
Expected: server starts without errors. No 404 on `/api/r2/upload` or `/api/r2/delete` (they'll return 401 without a token, not 404).

Test with curl (expects 401, not 404):
```bash
curl -X POST http://localhost:3000/api/r2/upload -v 2>&1 | grep "< HTTP"
```
Expected output: `< HTTP/1.1 401`

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "feat(r2): register R2 upload and delete Nitro handlers"
```

---

## Task 6: Update portfolio-db.ts

**Files:**
- Modify: `src/lib/portfolio-db.ts`

Replace the Supabase Storage upload logic with fetch calls to the new endpoints. The public interface (`uploadPortfolioItem`, `deletePortfolioItem`) stays identical — callers don't change.

- [ ] **Step 1: Replace `uploadToBucket` and update `deletePortfolioItem`**

Replace the entire file content of `src/lib/portfolio-db.ts` with:

```ts
import { supabase } from "@/integrations/supabase/client";
import type { PortfolioCategoryName } from "@/data/portfolio-categories";
import { processImage } from "@/lib/image-processing";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const DEMO_ITEMS: PortfolioDbItem[] = [
  { id: "demo-1", storage_path: "demo/1.jpg", public_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=60", thumb_storage_path: "demo/thumbs/1.jpg", category: "Construção Habitacional", title: "Moradia Unifamiliar — Nelas", created_at: "2026-01-10T10:00:00Z", sort_order: 1 },
  { id: "demo-2", storage_path: "demo/2.jpg", public_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=60", thumb_storage_path: "demo/thumbs/2.jpg", category: "Construção Habitacional", title: "Ampliação de Habitação — Viseu", created_at: "2026-01-15T10:00:00Z", sort_order: 2 },
  { id: "demo-3", storage_path: "demo/3.jpg", public_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=60", thumb_storage_path: "demo/thumbs/3.jpg", category: "Pavilhões Industriais", title: "Pavilhão Industrial — Mangualde", created_at: "2026-02-01T10:00:00Z", sort_order: 1 },
  { id: "demo-4", storage_path: "demo/4.jpg", public_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=60", thumb_storage_path: "demo/thumbs/4.jpg", category: "Pavilhões Industriais", title: "Armazém Logístico — Tondela", created_at: "2026-02-10T10:00:00Z", sort_order: 2 },
  { id: "demo-5", storage_path: "demo/5.jpg", public_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=60", thumb_storage_path: "demo/thumbs/5.jpg", category: "Lojas Comerciais", title: "Remodelação Loja — Viseu", created_at: "2026-02-20T10:00:00Z", sort_order: 1 },
  { id: "demo-6", storage_path: "demo/6.jpg", public_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=60", thumb_storage_path: "demo/thumbs/6.jpg", category: "Obras Públicas", title: "Arranjo Exterior — Nelas", created_at: "2026-03-01T10:00:00Z", sort_order: 1 },
];

export type PortfolioDbItem = {
  id: string;
  storage_path: string;
  public_url: string;
  thumb_storage_path: string | null;
  thumb_url: string | null;
  category: PortfolioCategoryName;
  title: string | null;
  created_at: string;
  sort_order: number;
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
  if (DEMO_MODE) {
    const fakeKey = `${prefix}${crypto.randomUUID()}.webp`;
    return { path: fakeKey, url: `https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80` };
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const form = new FormData();
  form.append("file", file);
  form.append("prefix", prefix);

  const res = await fetch("/api/r2/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}` },
    body: form,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`R2 upload failed (${res.status}): ${msg}`);
  }

  return res.json() as Promise<{ path: string; url: string }>;
}

export async function uploadPortfolioItem(params: {
  file: File;
  category: PortfolioCategoryName;
  title?: string | null;
}): Promise<PortfolioDbItem> {
  const { file, category, title } = params;

  const { full, thumb } = await processImage(file);

  const fullRes = await uploadToR2(full, "");
  let thumbRes: { path: string; url: string } | null = null;
  try {
    thumbRes = await uploadToR2(thumb, "thumbs/");
  } catch (e) {
    console.warn("Thumb upload falhou:", e);
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
      title: title?.trim() || null,
      sort_order,
    })
    .select("*")
    .single();
  if (error) {
    if (!DEMO_MODE) {
      // Best-effort cleanup of uploaded R2 objects on DB failure
      const paths = [fullRes.path];
      if (thumbRes) paths.push(thumbRes.path);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetch("/api/r2/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paths }),
        }).catch(() => {});
      }
    }
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

  const paths = [item.storage_path];
  if (item.thumb_storage_path) paths.push(item.thumb_storage_path);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  await fetch("/api/r2/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths }),
  });
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

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/portfolio-db.ts
git commit -m "feat(r2): migrate portfolio storage from Supabase Storage to Cloudflare R2"
```

---

## Task 7: Update documentation

**Files:**
- Modify: `docs/client-onboarding/clients/ijsantos/05-supabase.md`

- [ ] **Step 1: Correct the storage note**

The file already says "As fotografias do site são guardadas no **Cloudflare R2**". This is now correct. Verify the note on line 16 still matches and no other line refers to Supabase Storage for photos.

Run: `grep -n "Storage\|storage\|R2\|imagens\|foto" docs/client-onboarding/clients/ijsantos/05-supabase.md`

If anything says "Supabase Storage" in the context of photos, update it to "Cloudflare R2".

- [ ] **Step 2: Commit**

```bash
git add docs/client-onboarding/clients/ijsantos/05-supabase.md
git commit -m "docs(ijsantos): confirm R2 is storage layer for portfolio images"
```

---

## Manual Testing Checklist (after all tasks)

Run with a real Cloudflare account + wrangler dev (not DEMO_MODE):

- [ ] `wrangler dev` starts without errors
- [ ] `curl -X POST http://localhost:8787/api/r2/upload` returns `401` (no token)
- [ ] `curl -X DELETE http://localhost:8787/api/r2/delete` returns `401`
- [ ] Open `/admin/portfolio`, upload a photo → photo appears in the gallery
- [ ] Check Cloudflare R2 dashboard → file present in `ijsantos-portfolio` bucket
- [ ] Delete a photo in admin → file removed from R2 bucket
- [ ] Upload with invalid session → `401` in browser console, toast error shown

In DEMO_MODE (default local dev):
- [ ] Gallery loads with demo items (Unsplash placeholders)
- [ ] Upload form submits without error (returns fake URL, no real R2 call)
- [ ] Delete does nothing (DEMO_MODE guard)
