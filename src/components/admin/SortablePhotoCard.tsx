import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play, Trash2 } from "lucide-react";
import type { PortfolioDbItem } from "@/lib/portfolio-db";

type Props = {
  item: PortfolioDbItem;
  onPreview: (item: PortfolioDbItem) => void;
  onDelete: (item: PortfolioDbItem) => void;
};

export function SortablePhotoCard({ item, onPreview, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-lg border bg-[#1A1A1A] ${
        isDragging ? "border-[#DC2626] shadow-2xl" : "border-white/10"
      }`}
    >
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="block w-full aspect-square text-left"
        aria-label={`Pré-visualizar ${item.title ?? item.category}`}
      >
        {item.media_type === "video" ? (
          <div className="h-full w-full bg-[#0F0F0F] grid place-items-center">
            <Play className="h-10 w-10 text-white/40" />
          </div>
        ) : (
          <img
            src={item.thumb_url ?? item.public_url}
            alt={item.title ?? item.category}
            loading="lazy"
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}
      </button>

      <div className="p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-white/60 bg-white/5 rounded px-2 py-0.5">
            {item.category}
          </span>
          {item.media_type === "video" && (
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-blue-400/80 bg-blue-400/10 rounded px-2 py-0.5">
              vídeo
            </span>
          )}
        </div>
        {item.title && (
          <p className="mt-2 text-sm text-white/90 line-clamp-2">{item.title}</p>
        )}
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className="absolute top-2 left-2 h-9 w-9 grid place-items-center rounded-full bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
        aria-label="Remover"
        className="absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#DC2626] hover:text-white"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  );
}
