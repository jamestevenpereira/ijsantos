import { useEffect, useState } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  PORTFOLIO_CATEGORIES,
  type PortfolioCategoryName,
} from "@/data/portfolio-categories";
import {
  updatePortfolioItem,
  type PortfolioDbItem,
} from "@/lib/portfolio-db";

type Props = {
  item: PortfolioDbItem | null;
  onClose: () => void;
  onDelete: (item: PortfolioDbItem) => void;
};

const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function PhotoLightbox({ item, onClose, onDelete }: Props) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PortfolioCategoryName>(PORTFOLIO_CATEGORIES[0]);

  // Reset estado quando o item muda.
  useEffect(() => {
    setEditing(false);
    if (item) {
      setTitle(item.title ?? "");
      setCategory(item.category);
    }
  }, [item]);

  const updateMut = useMutation({
    mutationFn: updatePortfolioItem,
    onSuccess: () => {
      toast.success("Foto atualizada.");
      setEditing(false);
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
    },
    onError: (e: Error) => toast.error(`Erro ao atualizar: ${e.message}`),
  });

  const onSave = () => {
    if (!item) return;
    if (title.length > 120) {
      toast.error("Título não pode exceder 120 caracteres.");
      return;
    }
    updateMut.mutate({
      id: item.id,
      title,
      category,
      currentCategory: item.category,
    });
  };

  const onCancel = () => {
    if (!item) return;
    setTitle(item.title ?? "");
    setCategory(item.category);
    setEditing(false);
  };

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 bg-[#0F0F0F] border-white/10 text-white overflow-hidden">
        {item && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{item.title ?? item.category}</DialogTitle>
              <DialogDescription>Pré-visualização da foto</DialogDescription>
            </DialogHeader>

            <div className="bg-black grid place-items-center max-h-[60vh] md:max-h-[70vh] overflow-hidden">
              <img
                src={item.public_url}
                alt={item.title ?? item.category}
                className="max-h-[60vh] md:max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-5 border-t border-white/10">
              {editing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-white/80">Categoria</Label>
                      <Select
                        value={category}
                        onValueChange={(v) => setCategory(v as PortfolioCategoryName)}
                        disabled={updateMut.isPending}
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
                      <Label htmlFor="edit-title" className="text-white/80">
                        Título (opcional)
                      </Label>
                      <Input
                        id="edit-title"
                        type="text"
                        maxLength={120}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={updateMut.isPending}
                        className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
                        placeholder="Ex.: Pavilhão industrial em Nelas"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={onCancel}
                      disabled={updateMut.isPending}
                      className="inline-flex items-center gap-2 rounded-md bg-white/5 hover:bg-white/10 text-white/80 h-10 px-4 text-sm transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={onSave}
                      disabled={updateMut.isPending}
                      className="inline-flex items-center gap-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-10 px-4 text-sm transition-colors disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {updateMut.isPending ? "A guardar…" : "Guardar"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-white/60 bg-white/5 rounded px-2 py-0.5">
                      {item.category}
                    </span>
                    {item.title && (
                      <h3 className="mt-2 text-base font-medium text-white">{item.title}</h3>
                    )}
                    <p className="mt-1 text-xs text-white/50">
                      Adicionada em {dateFormatter.format(new Date(item.created_at))}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-2 rounded-md bg-white/5 hover:bg-white/10 text-white/90 h-10 px-4 text-sm transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="inline-flex items-center gap-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-10 px-4 text-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remover
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
