# AI Content Editor Setup Guide

This guide will help you set up the ChatGPT AI content editing feature for your admin panel.

## Prerequisites

- OpenAI API account with API key
- Next.js application running

## Setup Instructions

### 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section: https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the API key (you won't be able to see it again!)

### 2. Add API Key to Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```env
OPENAI_API_KEY=your-api-key-here
```

**Important:** 
- Never commit `.env.local` to version control
- The `.env.local` file is already in `.gitignore` by default
- Replace `your-api-key-here` with your actual OpenAI API key

### 3. Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
pnpm dev
```

## How to Use

1. Navigate to the admin panel at `/admin`
2. Log in with your credentials
3. Navigate to any section (Hero, About, Services, Testimonials)
4. Find any text input field
5. Click the **"AI"** button next to the field label
6. In the dialog that opens:
   - Review the current content
   - Enter your instruction (e.g., "Make it more engaging", "Make it shorter", "Add more energy")
   - Click "Generate"
   - Review the AI-generated preview
   - Click "Apply Changes" to use it, or "Try Again" to generate a new version

## Features

- **Context-Aware Editing**: The AI understands the context of each field (section name, field name)
- **Preview Before Apply**: See the AI-generated content before applying it
- **Try Again**: Generate multiple versions until you're satisfied
- **All Text Fields**: Available for all text input fields across all sections

## Cost Considerations

- The AI feature uses OpenAI's GPT-4o-mini model, which is cost-effective
- Each generation uses approximately 500 tokens maximum
- Monitor your OpenAI usage at: https://platform.openai.com/usage

## Troubleshooting

### "OpenAI API key is not configured" Error

- Make sure you've created `.env.local` file in the project root
- Verify the variable name is exactly `OPENAI_API_KEY`
- Restart your development server after adding the key
- Check that the API key is valid and has credits

### "Failed to generate AI content" Error

- Check your OpenAI account has available credits
- Verify your API key is correct
- Check the browser console for detailed error messages
- Ensure you have an active internet connection

## Security Notes

- The API key is only used server-side (in the API route)
- Never expose your API key in client-side code
- The API route validates requests and handles errors securely
- Consider setting up rate limiting for production use

