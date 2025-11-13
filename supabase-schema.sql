-- Create section_content table
CREATE TABLE IF NOT EXISTS section_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  field TEXT NOT NULL,
  value TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(section, field)
);

-- Create theme_settings table
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create storage bucket for website assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

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

-- Enable Row Level Security
ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for section_content (allow all operations for now - you may want to restrict this)
CREATE POLICY "Allow all operations on section_content" ON section_content
FOR ALL
USING (true)
WITH CHECK (true);

-- Create policies for theme_settings (allow all operations for now - you may want to restrict this)
CREATE POLICY "Allow all operations on theme_settings" ON theme_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to update updated_at
CREATE TRIGGER update_section_content_updated_at BEFORE UPDATE ON section_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at BEFORE UPDATE ON theme_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create customer_inquiries table
CREATE TABLE IF NOT EXISTS customer_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  fitness_goal TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security for customer_inquiries
ALTER TABLE customer_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for form submissions)
CREATE POLICY "Allow public inserts on customer_inquiries" ON customer_inquiries
FOR INSERT
WITH CHECK (true);

-- Create policy to allow authenticated users to read all inquiries (for admin panel)
CREATE POLICY "Allow authenticated users to read customer_inquiries" ON customer_inquiries
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create policy to allow authenticated users to delete inquiries (for admin panel)
CREATE POLICY "Allow authenticated users to delete customer_inquiries" ON customer_inquiries
FOR DELETE
USING (auth.uid() IS NOT NULL);

