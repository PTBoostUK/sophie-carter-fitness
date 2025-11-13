# Storage Bucket Setup Guide

## Quick Setup (Recommended)

### Option 1: Run SQL Script

1. Go to your Supabase Dashboard: https://bljbxzchhcjrhwntwell.supabase.co
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute the script
5. This will create:
   - The storage bucket `website-assets`
   - All necessary policies for public access

### Option 2: Manual Setup via Dashboard

If the SQL script doesn't work, you can create the bucket manually:

1. **Create the Bucket:**
   - Go to Supabase Dashboard → **Storage**
   - Click **New bucket**
   - Name: `website-assets`
   - Check **Public bucket** (important!)
   - Click **Create bucket**

2. **Set up Policies:**
   - Go to **Storage** → **Policies** tab
   - Select the `website-assets` bucket
   - Click **New Policy**
   
   **Policy 1: Public Read Access**
   - Policy name: `Public Access`
   - Allowed operation: `SELECT`
   - Policy definition:
     ```sql
     (bucket_id = 'website-assets')
     ```
   
   **Policy 2: Public Upload**
   - Policy name: `Public can upload`
   - Allowed operation: `INSERT`
   - Policy definition:
     ```sql
     (bucket_id = 'website-assets')
     ```
   
   **Policy 3: Public Update**
   - Policy name: `Public can update`
   - Allowed operation: `UPDATE`
   - Policy definition:
     ```sql
     (bucket_id = 'website-assets')
     ```
   
   **Policy 4: Public Delete**
   - Policy name: `Public can delete`
   - Allowed operation: `DELETE`
   - Policy definition:
     ```sql
     (bucket_id = 'website-assets')
     ```

## Verify Setup

After creating the bucket, verify it exists:

1. Go to **Storage** in Supabase Dashboard
2. You should see `website-assets` in the list
3. It should show as **Public**

## Troubleshooting

If you still get errors:

1. **Check bucket exists:**
   - Go to Storage → Buckets
   - Verify `website-assets` is listed

2. **Check policies:**
   - Go to Storage → Policies
   - Verify all 4 policies exist for `website-assets`

3. **Check bucket is public:**
   - The bucket must be marked as **Public** for images to be accessible

4. **Try refreshing the admin page:**
   - Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
   - The error should disappear once the bucket exists

## Security Note

⚠️ **Important:** These policies allow public access. For production, you should:
- Add authentication to the admin panel
- Restrict policies to authenticated users only
- Or use service role key for admin operations

