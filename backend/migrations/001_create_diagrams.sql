CREATE TABLE IF NOT EXISTS diagrams (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
  graph_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_diagrams_updated_at ON diagrams;
CREATE TRIGGER trg_diagrams_updated_at
BEFORE UPDATE ON diagrams
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
