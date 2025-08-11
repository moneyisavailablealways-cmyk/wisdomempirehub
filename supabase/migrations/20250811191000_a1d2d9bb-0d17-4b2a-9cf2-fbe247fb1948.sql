-- Create downloads storage bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('downloads', 'downloads', false, 52428800, ARRAY['application/pdf']);

-- Create branding storage bucket (public for logo access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('branding', 'branding', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read from downloads bucket
CREATE POLICY "Authenticated users can read downloads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'downloads' AND auth.role() = 'authenticated');

-- Policy: Allow edge functions to upload/update files in downloads bucket
CREATE POLICY "Service role can manage downloads" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'downloads' AND auth.role() = 'service_role');

-- Policy: Anyone can read branding files (for logo access)
CREATE POLICY "Anyone can read branding files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'branding');

-- Policy: Service role can manage branding files
CREATE POLICY "Service role can manage branding" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'branding' AND auth.role() = 'service_role');