import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategoryName,
} from "@/data/portfolio-categories";
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

const MAX_FILE_MB = 10;

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
  const [category, setCategory] = useState<PortfolioCategoryName>(PORTFOLIO_CATEGORIES[0]);
  const [title, setTitle] = useState("");

  const uploadMut = useMutation({
    mutationFn: async () => {
      let success = 0;
      let failed = 0;
      // Sequencial — feedback fiável e evita saturar a ligação.
      for (const item of items) {
        if (item.status === "done") continue;
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "uploading", error: undefined } : p)),
        );
        try {
          await uploadPortfolioItem({ file: item.file, category, title: title || null });
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
      }
      return { success, failed };
    },
    onSuccess: ({ success, failed }) => {
      if (failed === 0) {
        toast.success(
          success === 1 ? "Foto carregada com sucesso." : `${success} fotos carregadas com sucesso.`,
        );
        setItems([]);
        setTitle("");
        if (inputRef.current) inputRef.current.value = "";
      } else {
        toast.error(`${success} carregadas, ${failed} falharam.`);
      }
    },
  });

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Item[] = [];
    let skipped = 0;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        skipped++;
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        skipped++;
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        status: "pending",
      });
    }
    if (skipped > 0) {
      toast.error(
        `${skipped} ficheiro(s) ignorado(s) (não é imagem ou excede ${MAX_FILE_MB} MB).`,
      );
    }
    setItems((prev) => [...prev, ...next]);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Selecione pelo menos uma foto.");
      return;
    }
    uploadMut.mutate();
  };

  const pending = items.filter((i) => i.status !== "done").length;
  const total = items.length;
  const done = total - pending;
  const isUploading = uploadMut.isPending;

  return (
    <section className="rounded-xl bg-[#1A1A1A] border border-white/5 p-6 mb-10">
      <h2 className="text-lg font-semibold mb-4">Carregar fotos</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="files" className="text-white/80 mb-2 block">
            Fotos (várias permitidas)
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
              JPG, PNG, WebP — até {MAX_FILE_MB} MB por ficheiro
            </span>
            <input
              id="files"
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
              disabled={isUploading}
            />
          </label>
        </div>

        {items.length > 0 && (
          <ul className="rounded-lg border border-white/10 divide-y divide-white/5 bg-[#0F0F0F] max-h-64 overflow-auto">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center gap-3 px-3 py-2 text-sm"
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    it.status === "done"
                      ? "bg-emerald-400"
                      : it.status === "uploading"
                        ? "bg-amber-400 animate-pulse"
                        : it.status === "error"
                          ? "bg-red-400"
                          : "bg-white/30"
                  }`}
                />
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
            <Label className="text-white/80">Categoria (aplicada a todas)</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as PortfolioCategoryName)}
              disabled={isUploading}
            >
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

          <div className="space-y-2">
            <Label htmlFor="title" className="text-white/80">
              Título (opcional, partilhado)
            </Label>
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
              ? "Nenhuma foto selecionada."
              : `${items.length} foto(s) selecionada(s).`}
          </p>
          <button
            type="submit"
            disabled={isUploading || items.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-11 px-6 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading
              ? "A carregar…"
              : items.length > 1
                ? `Carregar ${items.length} fotos`
                : "Carregar foto"}
          </button>
        </div>
      </form>
    </section>
  );
}
