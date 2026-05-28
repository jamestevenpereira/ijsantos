-- Schema access (required for new Supabase projects — no longer auto-granted)
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Explicit grants for portfolio_items
GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;

-- Create obras table
CREATE TABLE IF NOT EXISTS public.obras (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT        NOT NULL,
  cliente    TEXT,
  local      TEXT        NOT NULL,
  ano        INTEGER     NOT NULL,
  categoria  TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read obras"
  ON public.obras FOR SELECT USING (true);

CREATE POLICY "Auth manage obras"
  ON public.obras FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS obras_categoria_idx ON public.obras (categoria);
CREATE INDEX IF NOT EXISTS obras_ano_idx        ON public.obras (ano DESC);

-- Explicit grants for obras
GRANT SELECT ON public.obras TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obras TO authenticated;

-- Add obra_id FK to portfolio_items (nullable, no impact on existing data)
ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS portfolio_items_obra_id_idx ON public.portfolio_items (obra_id);
