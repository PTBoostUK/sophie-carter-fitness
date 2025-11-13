# Image Setup Guide

## Current Images

The following images have been uploaded to Supabase Storage and are managed through the admin panel:

1. **About Section Image** (`about.image`)
   - Original: `/public/professional-female-personal-trainer-smiling-confi.jpg`
   - Supabase URL: Stored in `section_content` table with `section='about'` and `field='image'`
   - Can be changed from: Admin Panel → About Tab → About Image upload field

## Uploading New Images

### Option 1: Through Admin Panel (Recommended)
1. Go to `/admin`
2. Navigate to the relevant section tab
3. Use the image upload field
4. Select your new image
5. Click "Save All"

### Option 2: Using the Upload Script
If you need to upload images programmatically:

```bash
pnpm run upload-images
```

This script will:
- Upload the about image from `/public/professional-female-personal-trainer-smiling-confi.jpg`
- Store the URL in the database

## Adding New Image Fields

To add a new image field that can be managed from the admin:

1. **Add the image field to the admin panel** in `app/admin/page.tsx`:
   ```tsx
   <div className="space-y-2">
     <Label>Your Image Label</Label>
     <div className="flex items-center gap-4">
       {getImageUrl('section', 'field') && (
         <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
           <img
             src={getImageUrl('section', 'field')}
             alt="Preview"
             className="w-full h-full object-cover"
           />
         </div>
       )}
       <div className="flex-1">
         <Input
           type="file"
           accept="image/*"
           onChange={(e) => {
             const file = e.target.files?.[0]
             if (file) {
               handleImageUpload('section', 'field', file)
             }
           }}
         />
       </div>
     </div>
   </div>
   ```

2. **Update the main page** in `app/page.tsx` to use the image:
   ```tsx
   const imageUrl = getContent('section', 'field', '/fallback-image.jpg')
   ```

3. **The image will automatically be:**
   - Uploaded to Supabase Storage (`website-assets` bucket)
   - Stored in the database (`section_content` table)
   - Displayed on the website

## Storage Structure

Images are stored in Supabase Storage under:
- Bucket: `website-assets`
- Path: `images/{section}-{field}-{timestamp}.{ext}`

The public URL is automatically generated and stored in the database.

