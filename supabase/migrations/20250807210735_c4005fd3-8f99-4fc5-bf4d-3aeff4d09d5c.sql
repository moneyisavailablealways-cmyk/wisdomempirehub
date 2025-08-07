-- Create the main wisdom content tables for Wisdom Empire

-- Create proverbs table
CREATE TABLE public.proverbs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'proverb',
  subcategory TEXT NOT NULL,
  text TEXT NOT NULL,
  origin TEXT NOT NULL,
  video_url TEXT,
  audio_voice_type TEXT CHECK (audio_voice_type IN ('child', 'youth', 'old')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'quote',
  subcategory TEXT NOT NULL,
  text TEXT NOT NULL,
  origin TEXT NOT NULL,
  video_url TEXT,
  audio_voice_type TEXT CHECK (audio_voice_type IN ('child', 'youth', 'old')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create idioms table
CREATE TABLE public.idioms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'idiom',
  subcategory TEXT NOT NULL,
  text TEXT NOT NULL,
  origin TEXT NOT NULL,
  video_url TEXT,
  audio_voice_type TEXT CHECK (audio_voice_type IN ('child', 'youth', 'old')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create similes table
CREATE TABLE public.similes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'simile',
  subcategory TEXT NOT NULL,
  text TEXT NOT NULL,
  origin TEXT NOT NULL,
  video_url TEXT,
  audio_voice_type TEXT CHECK (audio_voice_type IN ('child', 'youth', 'old')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.proverbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idioms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.similes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is an educational platform)
CREATE POLICY "Anyone can view proverbs" 
ON public.proverbs 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view quotes" 
ON public.quotes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view idioms" 
ON public.idioms 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view similes" 
ON public.similes 
FOR SELECT 
USING (true);

-- Add some sample data to demonstrate the platform
INSERT INTO public.proverbs (subcategory, text, origin, audio_voice_type) VALUES
('wisdom', 'A journey of a thousand miles begins with a single step.', 'Chinese', 'old'),
('perseverance', 'Fall seven times, stand up eight.', 'Japanese', 'youth'),
('knowledge', 'The pen is mightier than the sword.', 'English', 'old');

INSERT INTO public.quotes (subcategory, text, origin, audio_voice_type) VALUES
('motivation', 'The only way to do great work is to love what you do.', 'American', 'youth'),
('wisdom', 'In the middle of difficulty lies opportunity.', 'German', 'old'),
('success', 'Success is not final, failure is not fatal: it is the courage to continue that counts.', 'British', 'old');

INSERT INTO public.idioms (subcategory, text, origin, audio_voice_type) VALUES
('time', 'Time flies when you''re having fun.', 'English', 'child'),
('opportunity', 'Strike while the iron is hot.', 'English', 'youth'),
('wisdom', 'Don''t judge a book by its cover.', 'English', 'old');

INSERT INTO public.similes (subcategory, text, origin, audio_voice_type) VALUES
('strength', 'Strong as an ox.', 'English', 'child'),
('speed', 'Fast as lightning.', 'English', 'youth'),
('wisdom', 'Wise as an owl.', 'English', 'old');