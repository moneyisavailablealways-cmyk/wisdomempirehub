
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_proverbs_created_at ON public.proverbs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proverbs_subcategory ON public.proverbs (subcategory);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_subcategory ON public.quotes (subcategory);
CREATE INDEX IF NOT EXISTS idx_idioms_created_at ON public.idioms (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_idioms_subcategory ON public.idioms (subcategory);
CREATE INDEX IF NOT EXISTS idx_similes_created_at ON public.similes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_similes_subcategory ON public.similes (subcategory);
CREATE INDEX IF NOT EXISTS idx_proverbs_text_trgm ON public.proverbs USING gin (text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_quotes_text_trgm ON public.quotes USING gin (text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_idioms_text_trgm ON public.idioms USING gin (text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_similes_text_trgm ON public.similes USING gin (text gin_trgm_ops);
