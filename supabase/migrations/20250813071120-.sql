-- Fix donations table RLS policies to properly restrict access to service role only
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Service role can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Service role can update donations" ON public.donations;

-- Create properly restricted policies for service role only
CREATE POLICY "Service role can insert donations" 
ON public.donations 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update donations" 
ON public.donations 
FOR UPDATE 
TO service_role
USING (true);

-- Also fix the legacy simile table that has no RLS policies
ALTER TABLE public.simile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view similes legacy" 
ON public.simile 
FOR SELECT 
USING (true);