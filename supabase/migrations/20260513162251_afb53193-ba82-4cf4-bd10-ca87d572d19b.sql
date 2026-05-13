ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_portfolio_items_sort
  ON public.portfolio_items (category, sort_order, created_at DESC);

-- Backfill: ordem inicial = posição por created_at DESC dentro da categoria
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY created_at DESC) AS rn
  FROM public.portfolio_items
)
UPDATE public.portfolio_items p
SET sort_order = r.rn
FROM ranked r
WHERE p.id = r.id;

CREATE POLICY "Authenticated can update portfolio items"
  ON public.portfolio_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);