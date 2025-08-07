-- Add missing columns to existing tables
ALTER TABLE public.proverbs 
ADD COLUMN IF NOT EXISTS meaning text,
ADD COLUMN IF NOT EXISTS example text,
ADD COLUMN IF NOT EXISTS bg_style text DEFAULT 'bg-card',
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS meaning text,
ADD COLUMN IF NOT EXISTS example text,
ADD COLUMN IF NOT EXISTS bg_style text DEFAULT 'bg-card',
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.idioms 
ADD COLUMN IF NOT EXISTS meaning text,
ADD COLUMN IF NOT EXISTS example text,
ADD COLUMN IF NOT EXISTS bg_style text DEFAULT 'bg-card',
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.similes 
ADD COLUMN IF NOT EXISTS meaning text,
ADD COLUMN IF NOT EXISTS example text,
ADD COLUMN IF NOT EXISTS bg_style text DEFAULT 'bg-card',
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add RLS policies for all tables
-- Proverbs policies
CREATE POLICY "Allow authenticated inserts" ON public.proverbs
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update own cards" ON public.proverbs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own cards" ON public.proverbs
FOR DELETE USING (auth.uid() = user_id);

-- Quotes policies
CREATE POLICY "Allow authenticated inserts" ON public.quotes
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update own cards" ON public.quotes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own cards" ON public.quotes
FOR DELETE USING (auth.uid() = user_id);

-- Idioms policies
CREATE POLICY "Allow authenticated inserts" ON public.idioms
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update own cards" ON public.idioms
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own cards" ON public.idioms
FOR DELETE USING (auth.uid() = user_id);

-- Similes policies
CREATE POLICY "Allow authenticated inserts" ON public.similes
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update own cards" ON public.similes
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own cards" ON public.similes
FOR DELETE USING (auth.uid() = user_id);