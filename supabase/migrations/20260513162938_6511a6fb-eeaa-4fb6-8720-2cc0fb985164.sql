ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS thumb_url text,
  ADD COLUMN IF NOT EXISTS thumb_storage_path text;