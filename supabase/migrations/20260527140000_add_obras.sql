-- obras: registo de obras/projetos independente de fotografias
CREATE TABLE IF NOT EXISTS obras (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT        NOT NULL,
  cliente    TEXT,
  local      TEXT        NOT NULL,
  ano        INTEGER     NOT NULL,
  categoria  TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE obras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read obras"
  ON obras FOR SELECT USING (true);

CREATE POLICY "Auth manage obras"
  ON obras FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS obras_categoria_idx ON obras (categoria);
CREATE INDEX IF NOT EXISTS obras_ano_idx        ON obras (ano DESC);

-- Ligar fotos do portfólio a uma obra (nullable — fotos sem obra continuam válidas)
ALTER TABLE portfolio_items
  ADD COLUMN IF NOT EXISTS obra_id UUID REFERENCES obras(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS portfolio_items_obra_id_idx ON portfolio_items (obra_id);
