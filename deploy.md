# Deployment Guide

## Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your game will be live!

## Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Drag the `dist` folder to https://app.netlify.com/drop

## Option 3: GitHub Pages

1. Add this to your `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run deploy
```

## Environment Variables

For future features (database, auth), you'll need to set environment variables:

```bash
# .env.local
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Custom Domain

Once deployed, you can add a custom domain in your hosting platform's settings.
