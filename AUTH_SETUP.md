# Admin Authentication Setup Guide

The admin panel now requires email and password authentication before access.

## Setting Up Your Admin Account

### Option 1: Create Account via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://bljbxzchhcjrhwntwell.supabase.co
2. Navigate to **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Enter:
   - **Email**: Your admin email (e.g., `admin@yourdomain.com`)
   - **Password**: A strong password
   - **Auto Confirm User**: Check this box (so you don't need email verification)
5. Click **Create user**

### Option 2: Create Account via SQL (Alternative)

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this SQL (replace with your email and password):

```sql
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@yourdomain.com',  -- Change this to your email
  crypt('your-password-here', gen_salt('bf')),  -- Change this to your password
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  '',
  ''
);

-- Note: The password encryption above is simplified. 
-- For production, use Supabase's built-in user creation.
```

**Better approach**: Use the Supabase Dashboard method above.

## Logging In

1. Navigate to `/admin` in your browser
2. You'll see a login form
3. Enter your email and password
4. Click **Sign In**

## Security Features

- ✅ Email and password authentication required
- ✅ Session management (stays logged in until logout)
- ✅ Automatic session check on page load
- ✅ Logout functionality
- ✅ Protected admin routes

## Logging Out

Click the **Logout** button in the top-right corner of the admin panel.

## Creating Additional Admin Users

To add more admin users:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Check **Auto Confirm User**
5. Click **Create user**

All users created this way can access the admin panel.

## Troubleshooting

### "Invalid email or password" error
- Verify the email and password are correct
- Make sure the user exists in Supabase Auth
- Check that "Auto Confirm User" was checked when creating the user

### Session expires unexpectedly
- Sessions are managed by Supabase and typically last 7 days
- You can adjust session duration in Supabase Dashboard → **Authentication** → **Settings**

### Can't create user
- Make sure you have admin access to the Supabase project
- Check that email authentication is enabled in Supabase Dashboard → **Authentication** → **Providers**

## Next Steps

1. Create your admin account using one of the methods above
2. Log in to `/admin`
3. Start managing your website content!

