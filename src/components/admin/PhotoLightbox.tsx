import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PortfolioDbItem } from "@/lib/portfolio-db";

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
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 bg-[#0F0F0F] border-white/10 text-white overflow-hidden">
        {item && (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{item.title ?? item.category}</DialogTitle>
              <DialogDescription>Pré-visualização da foto</DialogDescription>
            </DialogHeader>

            <div className="bg-black grid place-items-center max-h-[75vh] overflow-hidden">
              <img
                src={item.public_url}
                alt={item.title ?? item.category}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-5 flex flex-wrap items-center gap-4 justify-between border-t border-white/10">
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

              <button
                type="button"
                onClick={() => onDelete(item)}
                className="inline-flex items-center gap-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-10 px-4 text-sm transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
