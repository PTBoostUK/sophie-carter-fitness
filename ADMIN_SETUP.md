# Admin CMS Setup Guide

This guide will help you set up the admin CMS page for your website.

## Prerequisites

- Supabase project already created
- Supabase project URL and anon key (already configured)

## Database Setup

1. Go to your Supabase dashboard: https://bljbxzchhcjrhwntwell.supabase.co
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-schema.sql` to create the necessary tables:
   - `section_content` - stores all section content (text, images)
   - `theme_settings` - stores theme customization (colors, fonts)
   - Storage bucket `website-assets` for image uploads

## Storage Bucket Setup

The SQL script will create a storage bucket called `website-assets`. Make sure:

1. The bucket is set to **public** (for public image access)
2. Storage policies are set up correctly (the SQL script includes these)

## Accessing the Admin Page

Once the database is set up, you can access the admin page at:
```
http://localhost:3000/admin
```

## Features

### Content Management
- **Hero Section**: Edit title, subtitle, and button text
- **About Section**: Edit title, description, stats, and upload/replace the about image
- **Services Section**: Edit all three service cards (titles and descriptions)
- **Testimonials Section**: Edit all three testimonials (text, names, ages)

### Theme Customization
- **Colors**: Change primary, secondary, and accent colors
- **Fonts**: Select from a list of popular fonts

### Image Management
- Upload new images to replace existing ones
- Images are stored in Supabase Storage
- Images are automatically optimized and served via CDN

## Security Note

Currently, the database policies allow all operations. For production, you should:

1. Set up Row Level Security (RLS) policies
2. Add authentication to the admin page
3. Restrict access to only authorized users

## Next Steps

1. Run the SQL script in your Supabase dashboard
2. Test the admin page at `/admin`
3. Add authentication if needed
4. Customize the RLS policies for better security

