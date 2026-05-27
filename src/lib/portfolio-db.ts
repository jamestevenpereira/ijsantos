import { supabase } from "@/integrations/supabase/client";
import type { PortfolioCategoryName } from "@/data/portfolio-categories";
import { processImage } from "@/lib/image-processing";
import { listObras, type ObraDbItem } from "@/lib/obras-db";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const DEMO_ITEMS: PortfolioDbItem[] = [
  { id: "demo-1", storage_path: "demo/1.jpg", public_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=60", thumb_storage_path: "demo/thumbs/1.jpg", category: "Construção Habitacional", obra_id: "obra-1", title: "Moradia Unifamiliar — Nelas", created_at: "2026-01-10T10:00:00Z", sort_order: 1 },
  { id: "demo-2", storage_path: "demo/2.jpg", public_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=60", thumb_storage_path: "demo/thumbs/2.jpg", category: "Construção Habitacional", obra_id: "obra-2", title: "Ampliação de Habitação — Viseu", created_at: "2026-01-15T10:00:00Z", sort_order: 2 },
  { id: "demo-3", storage_path: "demo/3.jpg", public_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=60", thumb_storage_path: "demo/thumbs/3.jpg", category: "Pavilhões Industriais", obra_id: "obra-3", title: "Pavilhão Industrial — Mangualde", created_at: "2026-02-01T10:00:00Z", sort_order: 1 },
  { id: "demo-4", storage_path: "demo/4.jpg", public_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=60", thumb_storage_path: "demo/thumbs/4.jpg", category: "Pavilhões Industriais", obra_id: "obra-3", title: "Armazém Logístico — Tondela", created_at: "2026-02-10T10:00:00Z", sort_order: 2 },
  { id: "demo-5", storage_path: "demo/5.jpg", public_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=60", thumb_storage_path: "demo/thumbs/5.jpg", category: "Lojas Comerciais", obra_id: "obra-5", title: "Remodelação Loja — Viseu", created_at: "2026-02-20T10:00:00Z", sort_order: 1 },
  { id: "demo-6", storage_path: "demo/6.jpg", public_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", thumb_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=60", thumb_storage_path: "demo/thumbs/6.jpg", category: "Obras Públicas", obra_id: "obra-6", title: "Arranjo Exterior — Nelas", created_at: "2026-03-01T10:00:00Z", sort_order: 1 },
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
};

export type PortfolioAlbum = {
  obra: ObraDbItem;
  photos: PortfolioDbItem[];
  cover_url: string;
  cover_thumb_url: string;
};

const BUCKET = "portfolio";

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

async function uploadToBucket(file: File, prefix: string): Promise<{ path: string; url: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `${prefix}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "image/webp",
    upsert: false,
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: pub.publicUrl };
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
    const cover = photos[0];
    albums.push({
      obra,
      photos,
      cover_url: cover.public_url,
      cover_thumb_url: cover.thumb_url ?? cover.public_url,
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

  // Gera versões otimizadas no browser antes de enviar.
  const { full, thumb } = await processImage(file);

  const fullRes = await uploadToBucket(full, "");
  let thumbRes: { path: string; url: string } | null = null;
  try {
    thumbRes = await uploadToBucket(thumb, "thumbs/");
  } catch (e) {
    // Se o thumb falhar, continuamos só com o full.
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
      obra_id: obra_id ?? null,
      title: title?.trim() || null,
      sort_order,
    })
    .select("*")
    .single();
  if (error) {
    await supabase.storage.from(BUCKET).remove(
      thumbRes ? [fullRes.path, thumbRes.path] : [fullRes.path],
    );
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
  await supabase.storage.from(BUCKET).remove(paths);
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
  // Mover para o fim da nova categoria, se houver mudança.
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
