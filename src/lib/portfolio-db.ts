import { supabase } from "@/integrations/supabase/client";
import type { PortfolioCategoryName } from "@/data/portfolio-categories";

export type PortfolioDbItem = {
  id: string;
  storage_path: string;
  public_url: string;
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

export async function uploadPortfolioItem(params: {
  file: File;
  category: PortfolioCategoryName;
  title?: string | null;
}): Promise<PortfolioDbItem> {
  const { file, category, title } = params;
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${safeName}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (uploadErr) throw uploadErr;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const sort_order = await nextSortOrder(category);

  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      storage_path: storagePath,
      public_url: pub.publicUrl,
      category,
      title: title?.trim() || null,
      sort_order,
    })
    .select("*")
    .single();
  if (error) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
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
  await supabase.storage.from(BUCKET).remove([item.storage_path]);
}

export async function reorderPortfolioItems(
  updates: { id: string; sort_order: number }[],
): Promise<void> {
  // Postgrest não suporta bulk update por id diferente; enviamos em paralelo.
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
