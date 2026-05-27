import { supabase } from "@/integrations/supabase/client";
import type { PortfolioCategoryName } from "@/data/portfolio-categories";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export type ObraDbItem = {
  id: string;
  nome: string;
  cliente: string | null;
  local: string;
  ano: number;
  categoria: PortfolioCategoryName;
  created_at: string;
};

const DEMO_OBRAS: ObraDbItem[] = [
  { id: "obra-1", nome: "Moradia Unifamiliar Santos", cliente: "Família Santos", local: "Nelas", ano: 2024, categoria: "Construção Habitacional", created_at: "2024-01-10T10:00:00Z" },
  { id: "obra-2", nome: "Ampliação de Habitação", cliente: null, local: "Viseu", ano: 2024, categoria: "Construção Habitacional", created_at: "2024-03-15T10:00:00Z" },
  { id: "obra-3", nome: "Pavilhão Industrial Mangualde", cliente: "Empresa Logística, Lda.", local: "Mangualde", ano: 2023, categoria: "Pavilhões Industriais", created_at: "2023-06-01T10:00:00Z" },
  { id: "obra-4", nome: "Armazém Logístico Tondela", cliente: null, local: "Tondela", ano: 2023, categoria: "Pavilhões Industriais", created_at: "2023-09-10T10:00:00Z" },
  { id: "obra-5", nome: "Remodelação Loja Centro", cliente: "Comércio Local", local: "Viseu", ano: 2025, categoria: "Lojas Comerciais", created_at: "2025-01-20T10:00:00Z" },
  { id: "obra-6", nome: "Arranjo Exterior Largo Municipal", cliente: "Câmara Municipal de Nelas", local: "Nelas", ano: 2022, categoria: "Obras Públicas", created_at: "2022-11-01T10:00:00Z" },
];

export async function listObras(): Promise<ObraDbItem[]> {
  if (DEMO_MODE) return DEMO_OBRAS;
  const { data, error } = await supabase
    .from("obras")
    .select("*")
    .order("ano", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ObraDbItem[];
}

export async function createObra(
  params: Omit<ObraDbItem, "id" | "created_at">,
): Promise<ObraDbItem> {
  const { data, error } = await supabase
    .from("obras")
    .insert(params)
    .select("*")
    .single();
  if (error) throw error;
  return data as ObraDbItem;
}

export async function updateObra(
  id: string,
  params: Partial<Omit<ObraDbItem, "id" | "created_at">>,
): Promise<ObraDbItem> {
  const { data, error } = await supabase
    .from("obras")
    .update(params)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as ObraDbItem;
}

export async function deleteObra(id: string): Promise<void> {
  const { error } = await supabase.from("obras").delete().eq("id", id);
  if (error) throw error;
}
