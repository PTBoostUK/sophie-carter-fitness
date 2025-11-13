# EmailJS Setup Guide

This guide will help you set up EmailJS to receive email notifications when someone completes the contact form.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)
3. Verify your email address

## Step 2: Add Email Service (Gmail)

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail**
4. **Important Gmail Setup Steps:**
   
   a. **Disconnect if Already Connected:**
      - If you see "Connected as [your-email]" with a Disconnect button, click **Disconnect** first
      - This ensures a fresh connection with proper permissions
   
   b. **Connect Gmail Account:**
      - Click the **Connect** button (or reconnect if you disconnected)
      - You'll be redirected to Google's sign-in page
      - **IMPORTANT:** When Google asks for permissions, make sure to:
         - Grant **ALL** requested permissions
         - Look for "Send email on your behalf" permission
         - Click **Allow** for all permission requests
         - Don't skip any permission screens
   
   c. **If You See "Insufficient Authentication Scopes" Error:**
      - This means Google didn't grant all necessary permissions
      - **Solution:**
         1. Click **Disconnect** in EmailJS
         2. Go to [Google Account Permissions](https://myaccount.google.com/permissions)
         3. Find "EmailJS" or "Third-party apps" and **Remove** it
         4. Go back to EmailJS and click **Connect** again
         5. This time, make sure to click **Allow** on ALL permission screens
         6. Don't click "Skip" or "Cancel" on any permission request
   
   d. **Verify Connection:**
      - After connecting, you should see "Connected as [your-email]"
      - The error message should disappear
      - If the test email checkbox is checked, it should work now

5. **Copy the Service ID** (shown in the "Service ID" field, e.g., `service_cqx4anp`)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template** (or edit your existing template)
3. Use this template structure:

**Template Name:** Contact Form Notification

**Subject:** New Contact Form Submission - {{from_name}}

**Content (HTML):**
Copy and paste this HTML into the email template content area:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                New Contact Form Submission
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Hello,
              </p>
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                You have received a new contact form submission from your website.
              </p>
              
              <!-- Details Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Name</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 16px;">{{from_name}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 16px;">
                            <a href="mailto:{{from_email}}" style="color: #ec4899; text-decoration: none;">{{from_email}}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <strong style="color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Fitness Goal</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 16px;">{{fitness_goal}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <strong style="color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 16px; white-space: pre-wrap; line-height: 1.6;">{{message}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="http://localhost:3000/admin" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(236, 72, 153, 0.3);">
                      View in Admin Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                This is an automated notification from your website.<br>
                <a href="http://localhost:3000/admin" style="color: #ec4899; text-decoration: none;">Manage inquiries in your admin dashboard</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**Important Notes:**
- Replace `http://localhost:3000/admin` with your actual admin dashboard URL (e.g., `https://yourdomain.com/admin` or `http://localhost:3000/admin` for testing)
- Make sure to use these exact variable names:
  - `{{from_name}}`
  - `{{from_email}}`
  - `{{fitness_goal}}`
  - `{{message}}`
  - `http://localhost:3000/admin` (you'll need to add this as a variable or hardcode your URL)

4. **Setting up the Admin Dashboard URL:**
   - **Option A (Recommended):** Hardcode your admin URL in the template by replacing `{{admin_dashboard_url}}` with your actual URL (e.g., `https://yourdomain.com/admin`)
   - **Option B:** Add `admin_dashboard_url` as a template variable in your code (we'll update the contact form to include this)

5. Set the **To Email** field to your admin email address (where you want to receive notifications)

6. Click **Save**
7. **Copy the Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. **Copy the Public Key** (you'll need this later)

## Step 5: Add Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add these variables:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

3. Replace the values with:
   - `your_service_id_here` → Your Service ID from Step 2
   - `your_template_id_here` → Your Template ID from Step 3
   - `your_public_key_here` → Your Public Key from Step 4
   - `your-admin-email@example.com` → Your email address where you want notifications

## Step 6: Restart Your Development Server

After adding the environment variables:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
pnpm dev
```

## Testing

1. Fill out the contact form on your website
2. Submit it
3. Check your email inbox - you should receive a notification!

## Troubleshooting

### Gmail Authentication Issues

**"Request had insufficient authentication scopes" Error:**
1. **Disconnect and Reconnect:**
   - In EmailJS, click **Disconnect** for your Gmail service
   - Go to [Google Account Permissions](https://myaccount.google.com/permissions)
   - Remove "EmailJS" from your connected apps
   - Return to EmailJS and click **Connect** again
   - **Important:** When Google shows permission screens, click **Allow** on ALL of them
   - Don't skip any permission requests

2. **Check Gmail Settings:**
   - Make sure "Less secure app access" is not blocking the connection
   - If you have 2-Step Verification enabled, you may need to use an App Password instead
   - However, EmailJS OAuth should work with 2-Step Verification

3. **Try Different Browser:**
   - Sometimes browser extensions or privacy settings can interfere
   - Try connecting in an incognito/private window

**Not receiving emails?**
- Check that all environment variables are set correctly
- Make sure you've restarted your dev server after adding env variables
- Check the browser console for any errors
- Verify your EmailJS service is connected properly (no error messages)
- Check your spam folder
- Try sending a test email from EmailJS dashboard first

**EmailJS errors in console?**
- Verify your Service ID, Template ID, and Public Key are correct
- Make sure the template variable names match exactly (case-sensitive)
- Check that your email service in EmailJS is properly connected (no red error messages)
- Ensure the Gmail connection shows "Connected" status

## Free Tier Limits

- **200 emails per month** on the free tier
- If you need more, upgrade to a paid plan on EmailJS

## Security Note

The environment variables with `NEXT_PUBLIC_` prefix are exposed to the browser. This is safe for EmailJS as they use the Public Key specifically designed for client-side use. The Public Key has limited permissions and can only send emails through your configured templates.

