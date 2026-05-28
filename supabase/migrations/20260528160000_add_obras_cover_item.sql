-- Permite definir uma imagem/video de capa por album (obra)
ALTER TABLE public.obras
  ADD COLUMN IF NOT EXISTS cover_item_id UUID REFERENCES public.portfolio_items(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS obras_cover_item_id_idx ON public.obras (cover_item_id);
