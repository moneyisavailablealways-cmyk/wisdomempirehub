-- Create donation_tiers table
CREATE TABLE public.donation_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tier_name TEXT NOT NULL,
  stripe_link TEXT NOT NULL,
  amount NUMERIC NOT NULL
);

-- Create donations table (drop existing if it exists to recreate with new structure)
DROP TABLE IF EXISTS public.donations CASCADE;

CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  tier_id UUID REFERENCES public.donation_tiers(id),
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for both tables
ALTER TABLE public.donation_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for donation_tiers (public read access)
CREATE POLICY "Anyone can view donation tiers" 
ON public.donation_tiers 
FOR SELECT 
USING (true);

-- Create RLS policies for donations (restrict access)
CREATE POLICY "Allow public inserts to donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public updates to donations" 
ON public.donations 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates on donations
CREATE TRIGGER update_donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();