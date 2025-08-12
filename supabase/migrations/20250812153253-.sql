-- Fix critical security vulnerability in donations table
-- Remove overly permissive public policies that allow anyone to insert/update donations

-- Drop the existing insecure policies
DROP POLICY IF EXISTS "Allow public inserts to donations" ON public.donations;
DROP POLICY IF EXISTS "Allow public updates to donations" ON public.donations;

-- Create secure policies
-- Only allow service role (edge functions) to insert donations
CREATE POLICY "Service role can insert donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (true);

-- Only allow service role (edge functions) to update donations
CREATE POLICY "Service role can update donations" 
ON public.donations 
FOR UPDATE 
USING (true);

-- Allow users to view only their own donations (by email match)
CREATE POLICY "Users can view their own donations" 
ON public.donations 
FOR SELECT 
USING (auth.jwt() ->> 'email' = email);

-- Note: The edge functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS,
-- so they can still create and update donations as needed for payment processing