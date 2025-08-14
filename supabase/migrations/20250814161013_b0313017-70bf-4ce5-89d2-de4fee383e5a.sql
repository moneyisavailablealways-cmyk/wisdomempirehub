-- Add user_id column to donations table for proper user association
ALTER TABLE public.donations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update existing RLS policies to be more secure
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;

-- Create more secure RLS policies
CREATE POLICY "Users can view their own authenticated donations" 
ON public.donations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow viewing of guest donations only by the service role (for admin purposes)
CREATE POLICY "Service role can view all donations" 
ON public.donations 
FOR SELECT 
USING (auth.role() = 'service_role');

-- Update the insert policy to be more specific about service role
DROP POLICY IF EXISTS "Service role can insert donations" ON public.donations;
CREATE POLICY "Service role can insert donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Update the update policy to be more specific about service role  
DROP POLICY IF EXISTS "Service role can update donations" ON public.donations;
CREATE POLICY "Service role can update donations" 
ON public.donations 
FOR UPDATE 
USING (auth.role() = 'service_role');

-- Add policy for authenticated users to insert their own donations
CREATE POLICY "Authenticated users can insert their own donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add comment explaining the security model
COMMENT ON TABLE public.donations IS 'Donations table with proper RLS: authenticated users can only see their own donations via user_id, guest donations are only visible to service role for admin purposes';