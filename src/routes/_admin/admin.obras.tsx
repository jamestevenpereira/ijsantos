import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Images, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PORTFOLIO_CATEGORIES, type PortfolioCategoryName } from "@/data/portfolio-categories";
import { listObras, createObra, updateObra, deleteObra, type ObraDbItem } from "@/lib/obras-db";
import { listPortfolioItems } from "@/lib/portfolio-db";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_admin/admin/obras")({
  head: () => ({
    meta: [
      { title: "Obras · Admin · IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminObrasPage,
});

type ObraForm = {
  nome: string;
  cliente: string;
  local: string;
  ano: string;
  categoria: PortfolioCategoryName;
};

const EMPTY_FORM: ObraForm = {
  nome: "",
  cliente: "",
  local: "",
  ano: new Date().getFullYear().toString(),
  categoria: PORTFOLIO_CATEGORIES[0],
};

function obraToForm(obra: ObraDbItem): ObraForm {
  return {
    nome: obra.nome,
    cliente: obra.cliente ?? "",
    local: obra.local,
    ano: obra.ano.toString(),
    categoria: obra.categoria,
  };
}

function AdminObrasPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingObra, setEditingObra] = useState<ObraDbItem | null>(null);
  const [form, setForm] = useState<ObraForm>(EMPTY_FORM);
  const [pendingDelete, setPendingDelete] = useState<ObraDbItem | null>(null);

  const { data: obras = [], isLoading } = useQuery({
    queryKey: ["obras"],
    queryFn: listObras,
  });

  const { data: portfolioItems = [] } = useQuery({
    queryKey: ["portfolio_items"],
    queryFn: listPortfolioItems,
  });

  const photoCountByObra = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of portfolioItems) {
      if (item.obra_id) {
        map.set(item.obra_id, (map.get(item.obra_id) ?? 0) + 1);
      }
    }
    return map;
  }, [portfolioItems]);

  const openNew = () => {
    setEditingObra(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (obra: ObraDbItem) => {
    setEditingObra(obra);
    setForm(obraToForm(obra));
    setDialogOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: async () => {
      const anoNum = parseInt(form.ano);
      if (!form.nome.trim() || !form.local.trim() || isNaN(anoNum)) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }
      const params = {
        nome: form.nome.trim(),
        cliente: form.cliente.trim() || null,
        local: form.local.trim(),
        ano: anoNum,
        categoria: form.categoria,
      };
      if (editingObra) return updateObra(editingObra.id, params);
      return createObra(params);
    },
    onSuccess: () => {
      toast.success(editingObra ? "Obra atualizada." : "Obra criada.");
      setDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["obras"] });
      qc.invalidateQueries({ queryKey: ["portfolio_albums"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteObra(pendingDelete!.id),
    onSuccess: () => {
      toast.success("Obra removida.");
      setPendingDelete(null);
      qc.invalidateQueries({ queryKey: ["obras"] });
      qc.invalidateQueries({ queryKey: ["portfolio_albums"] });
    },
    onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
  });

  const setField = <K extends keyof ObraForm>(key: K, value: ObraForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Obras</h1>
          <p className="mt-1 text-sm text-white/60">
            Gerir projetos/obras. As obras com fotos aparecem como álbuns no portefólio.
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-white/60" />
        </div>
      ) : obras.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-[#1A1A1A]/50 py-16 text-center text-white/60">
          Nenhuma obra criada ainda.
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-[#1A1A1A] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-white/50 font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-white/50 font-medium hidden sm:table-cell">
                  Categoria
                </th>
                <th className="text-left px-4 py-3 text-white/50 font-medium hidden md:table-cell">
                  Local
                </th>
                <th className="text-left px-4 py-3 text-white/50 font-medium hidden lg:table-cell">
                  Ano
                </th>
                <th className="text-right px-4 py-3 text-white/50 font-medium">Fotos</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {obras.map((obra) => {
                const count = photoCountByObra.get(obra.id) ?? 0;
                return (
                  <tr
                    key={obra.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{obra.nome}</div>
                      {obra.cliente && (
                        <div className="text-xs text-white/50 mt-0.5">{obra.cliente}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/70 hidden sm:table-cell">
                      {obra.categoria}
                    </td>
                    <td className="px-4 py-3 text-white/70 hidden md:table-cell">{obra.local}</td>
                    <td className="px-4 py-3 text-white/70 hidden lg:table-cell">{obra.ano}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center justify-center h-6 min-w-[1.5rem] rounded-full px-1.5 text-xs font-semibold ${
                          count > 0
                            ? "bg-[#DC2626]/20 text-[#DC2626]"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {count}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {count > 0 && (
                          <Link
                            to="/admin/portfolio"
                            search={{ obra_id: obra.id }}
                            className="h-8 w-8 rounded-md grid place-items-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                            aria-label="Ver fotos"
                            title="Ver fotos no Portefólio"
                          >
                            <Images className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => openEdit(obra)}
                          className="h-8 w-8 rounded-md grid place-items-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setPendingDelete(obra)}
                          className="h-8 w-8 rounded-md grid place-items-center text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          aria-label="Remover"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => !saveMut.isPending && setDialogOpen(o)}
      >
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingObra ? "Editar Obra" : "Nova Obra"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMut.mutate();
            }}
            className="space-y-4 mt-2"
          >
            <div className="space-y-2">
              <Label className="text-white/80">Nome *</Label>
              <Input
                value={form.nome}
                onChange={(e) => setField("nome", e.target.value)}
                placeholder="Ex.: Pavilhão Industrial Mangualde"
                className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Categoria *</Label>
              <Select
                value={form.categoria}
                onValueChange={(v) => setField("categoria", v as PortfolioCategoryName)}
              >
                <SelectTrigger className="bg-[#0F0F0F] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PORTFOLIO_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Local *</Label>
                <Input
                  value={form.local}
                  onChange={(e) => setField("local", e.target.value)}
                  placeholder="Ex.: Nelas"
                  className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Ano *</Label>
                <Input
                  type="number"
                  min={1990}
                  max={2100}
                  value={form.ano}
                  onChange={(e) => setField("ano", e.target.value)}
                  className="bg-[#0F0F0F] border-white/10 text-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Cliente (opcional)</Label>
              <Input
                value={form.cliente}
                onChange={(e) => setField("cliente", e.target.value)}
                placeholder="Ex.: Empresa XYZ, Lda."
                className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={saveMut.isPending}
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saveMut.isPending}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
              >
                {saveMut.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    A guardar…
                  </>
                ) : editingObra ? (
                  "Guardar"
                ) : (
                  "Criar Obra"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover obra</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que quer remover "{pendingDelete?.nome}"? As fotos associadas ficam
              sem álbum mas não são eliminadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMut.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMut.isPending}
              onClick={(e) => {
                e.preventDefault();
                deleteMut.mutate();
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
