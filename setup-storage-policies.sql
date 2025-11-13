-- This script sets up storage policies for the website-assets bucket
-- Run this in Supabase SQL Editor if the bucket exists but policies are missing

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload" ON storage.objects;
DROP POLICY IF EXISTS "Public can update" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Create storage policy for public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'website-assets');

-- Create storage policy for public uploads (using anon key)
CREATE POLICY "Public can upload" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'website-assets');

-- Create storage policy for public updates
CREATE POLICY "Public can update" ON storage.objects
FOR UPDATE
USING (bucket_id = 'website-assets');

-- Create storage policy for public deletes
CREATE POLICY "Public can delete" ON storage.objects
FOR DELETE
USING (bucket_id = 'website-assets');

