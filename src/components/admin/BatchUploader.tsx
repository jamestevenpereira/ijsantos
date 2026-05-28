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
