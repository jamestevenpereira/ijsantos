import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategoryName,
} from "@/data/portfolio-categories";
import {
  deletePortfolioItem,
  listPortfolioItems,
  uploadPortfolioItem,
  type PortfolioDbItem,
} from "@/lib/portfolio-db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_admin/admin/portfolio")({
  head: () => ({
    meta: [
      { title: "Portefólio · Admin · IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPortfolioPage,
});

const MAX_FILE_MB = 10;

function AdminPortfolioPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<PortfolioCategoryName>(PORTFOLIO_CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState<"todos" | PortfolioCategoryName>("todos");
  const [pendingDelete, setPendingDelete] = useState<PortfolioDbItem | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["portfolio_items"],
    queryFn: listPortfolioItems,
  });

  const uploadMut = useMutation({
    mutationFn: uploadPortfolioItem,
    onSuccess: () => {
      toast.success("Foto carregada com sucesso.");
      setFile(null);
      setTitle("");
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
    },
    onError: (e: Error) => toast.error(`Erro ao carregar foto: ${e.message}`),
  });

  const deleteMut = useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      toast.success("Foto removida.");
      setPendingDelete(null);
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
    },
    onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
  });

  const filtered = useMemo(
    () => (filter === "todos" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione uma foto.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Ficheiro excede ${MAX_FILE_MB} MB.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas ficheiros de imagem.");
      return;
    }
    uploadMut.mutate({ file, category, title: title || null });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Portefólio</h1>
        <p className="mt-1 text-sm text-white/60">
          Gerir as fotos de obras visíveis no website público.
        </p>
      </div>

      <section className="rounded-xl bg-[#1A1A1A] border border-white/5 p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Carregar nova foto</h2>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-white/80">Foto</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="bg-[#0F0F0F] border-white/10 text-white file:text-white file:bg-white/10 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
            />
            {file && (
              <p className="text-xs text-white/50">
                {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as PortfolioCategoryName)}>
              <SelectTrigger className="bg-[#0F0F0F] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title" className="text-white/80">Título (opcional)</Label>
            <Input
              id="title"
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
              placeholder="Ex.: Pavilhão industrial em Nelas"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={uploadMut.isPending || !file}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-11 px-6 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploadMut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploadMut.isPending ? "A carregar…" : "Carregar foto"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setFilter("todos")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === "todos"
                ? "bg-[#DC2626] text-white border-[#DC2626]"
                : "bg-[#1A1A1A] text-white/80 border-white/10 hover:border-white/30"
            }`}
          >
            Todas <span className="opacity-70 ml-1">{items.length}</span>
          </button>
          {PORTFOLIO_CATEGORIES.map((c) => {
            const count = items.filter((i) => i.category === c).length;
            const active = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? "bg-[#DC2626] text-white border-[#DC2626]"
                    : "bg-[#1A1A1A] text-white/80 border-white/10 hover:border-white/30"
                }`}
              >
                {c} <span className="opacity-70 ml-1">{count}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/60" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-[#1A1A1A]/50 py-16 text-center text-white/60">
            Sem fotos {filter === "todos" ? "" : `na categoria "${filter}"`}.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#1A1A1A]"
              >
                <div className="aspect-square">
                  <img
                    src={item.public_url}
                    alt={item.title ?? item.category}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-white/60 bg-white/5 rounded px-2 py-0.5">
                    {item.category}
                  </span>
                  {item.title && (
                    <p className="mt-2 text-sm text-white/90 line-clamp-2">{item.title}</p>
                  )}
                </div>
                <button
                  onClick={() => setPendingDelete(item)}
                  aria-label="Remover foto"
                  className="absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#DC2626] hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover foto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que quer remover esta foto? Esta ação não pode ser anulada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMut.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMut.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (pendingDelete) deleteMut.mutate(pendingDelete);
              }}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
            >
              {deleteMut.isPending ? "A remover…" : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
