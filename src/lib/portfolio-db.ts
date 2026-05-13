import { supabase } from "@/integrations/supabase/client";
import type { PortfolioCategoryName } from "@/data/portfolio-categories";
import { processImage } from "@/lib/image-processing";

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

const BUCKET = "portfolio";

export async function listPortfolioItems(): Promise<PortfolioDbItem[]> {
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

export async function uploadPortfolioItem(params: {
  file: File;
  category: PortfolioCategoryName;
  title?: string | null;
}): Promise<PortfolioDbItem> {
  const { file, category, title } = params;

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
