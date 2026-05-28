import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star, X } from "lucide-react";
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
  setAlbumCover,
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

const PAGE_SIZE = 8;

const searchSchema = z.object({
  obra_id: z.string().optional(),
});

type AdminMode = "categorias" | "albuns";
type CategoryFilter = "todos" | PortfolioCategoryName;

export const Route = createFileRoute("/_admin/admin/portfolio")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Portefólio - Admin - IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPortfolioPage,
});

function AdminPortfolioPage() {
  const qc = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const { obra_id } = Route.useSearch();

  const [mode, setMode] = useState<AdminMode>(obra_id ? "albuns" : "categorias");
  const [filter, setFilter] = useState<CategoryFilter>("todos");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(obra_id ?? "");
  const [page, setPage] = useState(1);
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

  // Mutable local list for optimistic ordering.
  const [order, setOrder] = useState<PortfolioDbItem[]>([]);
  useEffect(() => {
    setOrder(items);
  }, [items]);

  // If opened from /admin/obras, jump directly into that album.
  useEffect(() => {
    if (!obra_id) return;
    setSelectedAlbumId(obra_id);
    setMode("albuns");
  }, [obra_id]);

  useEffect(() => {
    setPage(1);
  }, [mode, filter, selectedAlbumId]);

  const clearObraFilter = () => navigate({ search: {} });

  const byObra = useMemo(() => {
    const map = new Map<string, PortfolioDbItem[]>();
    for (const item of order) {
      if (!item.obra_id) continue;
      const list = map.get(item.obra_id) ?? [];
      list.push(item);
      map.set(item.obra_id, list);
    }
    return map;
  }, [order]);

  const albums = useMemo(() => {
    return obras
      .map((obra) => {
        const photos = byObra.get(obra.id) ?? [];
        if (photos.length === 0) return null;
        const selectedCover = obra.cover_item_id
          ? photos.find((p) => p.id === obra.cover_item_id)
          : null;
        const cover = selectedCover ?? photos.find((p) => p.media_type === "image") ?? photos[0];
        return { obra, photos, cover };
      })
      .filter((album): album is NonNullable<typeof album> => album !== null);
  }, [obras, byObra]);

  const filteredAlbums = useMemo(() => {
    if (filter === "todos") return albums;
    return albums.filter((a) => a.obra.categoria === filter);
  }, [albums, filter]);

  const selectedAlbum = useMemo(
    () => albums.find((a) => a.obra.id === selectedAlbumId) ?? null,
    [albums, selectedAlbumId],
  );

  const categoryItems = useMemo(() => {
    let list = filter === "todos" ? order : order.filter((i) => i.category === filter);
    if (obra_id) {
      list = list.filter((i) => i.obra_id === obra_id);
    }
    return list;
  }, [order, filter, obra_id]);

  const albumItems = useMemo(
    () => (selectedAlbumId ? order.filter((i) => i.obra_id === selectedAlbumId) : []),
    [order, selectedAlbumId],
  );

  const listItems = mode === "albuns" ? albumItems : categoryItems;
  const totalPages = Math.max(1, Math.ceil(listItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = listItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const dragEnabled =
    mode === "albuns" ? !!selectedAlbumId : Boolean(obra_id) || filter !== "todos";

  const deleteMut = useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      toast.success("Ficheiro removido.");
      setPendingDelete(null);
      setPreview(null);
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
      qc.invalidateQueries({ queryKey: ["portfolio_albums"] });
      qc.invalidateQueries({ queryKey: ["obras"] });
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

  const coverMut = useMutation({
    mutationFn: setAlbumCover,
    onSuccess: () => {
      toast.success("Imagem de capa atualizada.");
      qc.invalidateQueries({ queryKey: ["obras"] });
      qc.invalidateQueries({ queryKey: ["portfolio_albums"] });
    },
    onError: (e: Error) => toast.error(`Erro ao definir capa: ${e.message}`),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    if (!dragEnabled) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const visibleIds = pagedItems.map((i) => i.id);
    const oldIndex = visibleIds.indexOf(active.id as string);
    const newIndex = visibleIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newVisible = arrayMove(pagedItems, oldIndex, newIndex);
    const visibleSet = new Set(visibleIds);
    const newGlobal: PortfolioDbItem[] = [];
    let cursor = 0;

    for (const it of order) {
      if (visibleSet.has(it.id)) {
        newGlobal.push(newVisible[cursor++]);
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

  const openAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setPage(1);
  };

  const closeAlbum = () => {
    setSelectedAlbumId("");
    if (obra_id) clearObraFilter();
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginacao">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="h-10 px-4 rounded-md border border-white/10 bg-[#1A1A1A] text-sm font-medium hover:border-white/30 disabled:opacity-40 disabled:pointer-events-none"
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
          const active = n === currentPage;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={active ? "page" : undefined}
              className={`h-10 w-10 rounded-md text-sm font-medium border transition-colors ${
                active
                  ? "bg-[#DC2626] text-white border-[#DC2626]"
                  : "bg-[#1A1A1A] text-white/80 border-white/10 hover:border-white/30"
              }`}
            >
              {n}
            </button>
          );
        })}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="h-10 px-4 rounded-md border border-white/10 bg-[#1A1A1A] text-sm font-medium hover:border-white/30 disabled:opacity-40 disabled:pointer-events-none"
        >
          Seguinte
        </button>
      </nav>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Portefólio</h1>
        <p className="mt-1 text-sm text-white/60">
          Gestão de ficheiros do portefólio. Vista por categorias ou por álbuns.
        </p>
      </div>

      <BatchUploader />

      <section>
        <div className="mb-6 inline-flex rounded-lg border border-white/10 bg-[#1A1A1A] p-1">
          <button
            onClick={() => setMode("categorias")}
            className={`h-9 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "categorias" ? "bg-[#DC2626] text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setMode("albuns")}
            className={`h-9 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === "albuns" ? "bg-[#DC2626] text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Álbuns
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setFilter("todos")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === "todos"
                ? "bg-[#DC2626] text-white border-[#DC2626]"
                : "bg-[#1A1A1A] text-white/80 border-white/10 hover:border-white/30"
            }`}
          >
            Todas
          </button>
          {PORTFOLIO_CATEGORIES.map((c) => {
            const active = filter === c;
            const count =
              mode === "albuns"
                ? albums.filter((a) => a.obra.categoria === c).length
                : order.filter((i) => i.category === c).length;
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

        {mode === "albuns" && selectedAlbum ? (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/25 px-4 py-3">
            <div className="flex-1 min-w-0">
              <span className="text-sm text-white/70">Album selecionado: </span>
              <strong className="text-white">{selectedAlbum.obra.nome}</strong>
              <span className="ml-2 text-xs text-white/50">
                {selectedAlbum.obra.local} - {selectedAlbum.obra.ano}
              </span>
            </div>
            <button
              onClick={closeAlbum}
              className="shrink-0 h-7 w-7 grid place-items-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar album"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {!obra_id && mode === "categorias" && filter === "todos" && (
          <p className="mb-4 text-xs text-white/40">
            A ordenação é guardada por categoria. Filtre por uma categoria para reordenar.
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/60" />
          </div>
        ) : mode === "albuns" && !selectedAlbumId ? (
          filteredAlbums.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-[#1A1A1A]/50 py-16 text-center text-white/60">
              Sem álbuns para este filtro.
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredAlbums.map((album) => (
                <button
                  key={album.obra.id}
                  onClick={() => openAlbum(album.obra.id)}
                  className="group text-left rounded-xl border border-white/10 bg-[#1A1A1A] overflow-hidden hover:border-white/25 transition-colors"
                >
                  <div className="aspect-video bg-[#0F0F0F]">
                    <img
                      src={album.cover.thumb_url ?? album.cover.public_url}
                      alt={album.obra.nome}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white line-clamp-1">{album.obra.nome}</h3>
                        <p className="mt-1 text-xs text-white/50">
                          {album.obra.local} - {album.obra.ano}
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center h-6 rounded-full px-2 text-xs font-medium bg-white/5 text-white/70 border border-white/10">
                        {album.photos.length}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/60">{album.obra.categoria}</p>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : pagedItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-[#1A1A1A]/50 py-16 text-center text-white/60">
            Sem ficheiros neste filtro.
          </div>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={dragEnabled ? onDragEnd : undefined}
            >
              <SortableContext
                items={pagedItems.map((i) => i.id)}
                strategy={rectSortingStrategy}
                disabled={!dragEnabled}
              >
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {pagedItems.map((item) => (
                    <SortablePhotoCard
                      key={item.id}
                      item={item}
                      onPreview={setPreview}
                      onDelete={setPendingDelete}
                      disableDrag={!dragEnabled}
                      onSetCover={
                        mode === "albuns" && selectedAlbumId
                          ? (it) => coverMut.mutate({ obraId: selectedAlbumId, itemId: it.id })
                          : undefined
                      }
                      isCover={Boolean(selectedAlbum?.obra.cover_item_id === item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="mt-4 flex items-center justify-between text-xs text-white/50">
              <span>
                Página {currentPage} de {totalPages}
              </span>
              {mode === "albuns" && selectedAlbum ? (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  Clique em "Definir capa" para mudar a capa do álbum.
                </span>
              ) : null}
            </div>

            {renderPagination()}
          </>
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
            <AlertDialogTitle>Remover ficheiro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que quer remover este ficheiro? Esta ação não pode ser anulada.
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
              {deleteMut.isPending ? "A remover..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
