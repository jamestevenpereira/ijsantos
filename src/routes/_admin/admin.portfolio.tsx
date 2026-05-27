import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  PORTFOLIO_CATEGORIES,
  type PortfolioCategoryName,
} from "@/data/portfolio-categories";
import {
  deletePortfolioItem,
  listPortfolioItems,
  reorderPortfolioItems,
  type PortfolioDbItem,
} from "@/lib/portfolio-db";
import { listObras } from "@/lib/obras-db";
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
import { BatchUploader } from "@/components/admin/BatchUploader";
import { SortablePhotoCard } from "@/components/admin/SortablePhotoCard";
import { PhotoLightbox } from "@/components/admin/PhotoLightbox";

const searchSchema = z.object({
  obra_id: z.string().optional(),
});

export const Route = createFileRoute("/_admin/admin/portfolio")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Portefólio · Admin · IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPortfolioPage,
});

function AdminPortfolioPage() {
  const qc = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const { obra_id } = Route.useSearch();

  const [filter, setFilter] = useState<"todos" | PortfolioCategoryName>("todos");
  const [pendingDelete, setPendingDelete] = useState<PortfolioDbItem | null>(null);
  const [preview, setPreview] = useState<PortfolioDbItem | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["portfolio_items"],
    queryFn: listPortfolioItems,
  });

  const { data: obras = [] } = useQuery({
    queryKey: ["obras"],
    queryFn: listObras,
    staleTime: 300_000,
  });

  const activeObra = obra_id ? (obras.find((o) => o.id === obra_id) ?? null) : null;

  // Lista local mutável para reordenação otimista.
  const [order, setOrder] = useState<PortfolioDbItem[]>([]);
  useEffect(() => {
    setOrder(items);
  }, [items]);

  // Auto-seleccionar a categoria da obra quando chega via URL.
  useEffect(() => {
    if (activeObra) {
      setFilter(activeObra.categoria as PortfolioCategoryName);
    }
  }, [activeObra?.id]);

  const filtered = useMemo(() => {
    let list = filter === "todos" ? order : order.filter((i) => i.category === filter);
    if (obra_id) {
      list = list.filter((i) => i.obra_id === obra_id);
    }
    return list;
  }, [order, filter, obra_id]);

  const clearObraFilter = () => navigate({ search: {} });

  const deleteMut = useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      toast.success("Foto removida.");
      setPendingDelete(null);
      setPreview(null);
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
    },
    onError: (e: Error) => toast.error(`Erro ao remover: ${e.message}`),
  });

  const reorderMut = useMutation({
    mutationFn: reorderPortfolioItems,
    onSuccess: () => {
      toast.success("Ordem guardada.");
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
    },
    onError: (e: Error) => {
      toast.error(`Erro a guardar ordem: ${e.message}`);
      setOrder(items);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const visibleIds = filtered.map((i) => i.id);
    const oldIndex = visibleIds.indexOf(active.id as string);
    const newIndex = visibleIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newVisible = arrayMove(filtered, oldIndex, newIndex);

    const visibleSet = new Set(visibleIds);
    const newGlobal: PortfolioDbItem[] = [];
    let visibleCursor = 0;
    for (const it of order) {
      if (visibleSet.has(it.id)) {
        newGlobal.push(newVisible[visibleCursor++]);
      } else {
        newGlobal.push(it);
      }
    }

    setOrder(newGlobal);

    const perCategoryCounter = new Map<PortfolioCategoryName, number>();
    const updates: { id: string; sort_order: number }[] = [];
    for (const it of newGlobal) {
      const next = (perCategoryCounter.get(it.category) ?? 0) + 1;
      perCategoryCounter.set(it.category, next);
      if (it.sort_order !== next) {
        updates.push({ id: it.id, sort_order: next });
      }
    }
    if (updates.length > 0) reorderMut.mutate(updates);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Portefólio</h1>
        <p className="mt-1 text-sm text-white/60">
          Gerir as fotos de obras visíveis no website público. Arraste para reordenar.
        </p>
      </div>

      <BatchUploader />

      {/* Banda de filtro por obra */}
      {activeObra && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/25 px-4 py-3">
          <div className="flex-1 min-w-0">
            <span className="text-sm text-white/70">A mostrar fotos de: </span>
            <strong className="text-white">{activeObra.nome}</strong>
            <span className="ml-2 text-xs text-white/50">
              {activeObra.local} · {activeObra.ano}
            </span>
          </div>
          <button
            onClick={clearObraFilter}
            className="shrink-0 h-7 w-7 grid place-items-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Limpar filtro de obra"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
            Todas <span className="opacity-70 ml-1">{order.length}</span>
          </button>
          {PORTFOLIO_CATEGORIES.map((c) => {
            const count = order.filter((i) => i.category === c).length;
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

        {!obra_id && filter === "todos" && (
          <p className="mb-4 text-xs text-white/40">
            A ordem é guardada por categoria. Filtre por uma categoria para reordenar dentro dela.
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/60" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-[#1A1A1A]/50 py-16 text-center text-white/60">
            {obra_id
              ? `Sem fotos neste álbum${filter !== "todos" ? ` para "${filter}"` : ""}.`
              : `Sem fotos ${filter === "todos" ? "" : `na categoria "${filter}"`}.`}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={obra_id ? undefined : onDragEnd}
          >
            <SortableContext
              items={filtered.map((i) => i.id)}
              strategy={rectSortingStrategy}
              disabled={!!obra_id}
            >
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((item) => (
                  <SortablePhotoCard
                    key={item.id}
                    item={item}
                    onPreview={setPreview}
                    onDelete={setPendingDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      <PhotoLightbox
        item={preview}
        onClose={() => setPreview(null)}
        onDelete={(it) => setPendingDelete(it)}
      />

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
