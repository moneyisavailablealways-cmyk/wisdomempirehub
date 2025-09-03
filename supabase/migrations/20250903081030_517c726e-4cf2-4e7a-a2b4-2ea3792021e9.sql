-- Drop and recreate the SELECT policy with more explicit security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a more restrictive SELECT policy that explicitly checks user authentication
CREATE POLICY "Users can view only their own profile" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Also ensure the profiles table has proper constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_id_not_null 
CHECK (user_id IS NOT NULL);