# 🚀 Deployment Guide

This guide covers deploying Hacker Trends to production using Vercel and Supabase.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Supabase CLI** installed globally
- **Vercel CLI** (optional, but recommended)
- **Git** repository

## 🔧 Supabase Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `hacker-trends` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 3. Link Local Project to Supabase

```bash
# Login to Supabase
supabase login

# Link your project (run from project root)
supabase link --project-ref YOUR_PROJECT_REF
```

**To find your project ref:**
- Go to your Supabase dashboard
- Navigate to Settings → General
- Copy the "Reference ID"

### 4. Deploy Edge Functions

Deploy all required edge functions with a single command:

```bash
supabase functions deploy
```

This will deploy:
- `get-top-stories` - Fetches top 100 stories from Hacker News
- `get-comment-sentiments` - Analyzes sentiment of comments  
- `get-story-with-comments` - Retrieves full story details with threaded comments

### 5. Get Your Credentials

```bash
# Get your project URL and anon key
supabase status
```

Or from the Supabase dashboard:
- Go to Settings → API
- Copy **Project URL** and **anon public** key

## 🌐 Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add the following:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redeploy with environment variables
vercel --prod
```

## 🔍 Verification

After deployment, verify everything works:

1. **Visit your deployed app**
2. **Check the dashboard loads** with real data
3. **Test deep-dive features** by clicking on charts
4. **Verify sentiment analysis** is working

## 🐛 Troubleshooting

### Edge Functions Not Working

```bash
# Check function status
supabase functions list

# View function logs
supabase functions logs get-top-stories
```

### Environment Variables Issues

```bash
# Verify environment variables in Vercel
vercel env ls

# Check local environment
cat .env
```

### CORS Issues

If you encounter CORS errors, ensure your edge functions include proper CORS headers (they should already be configured).

## 🔄 Updates and Maintenance

### Updating Edge Functions

```bash
# Deploy specific function
supabase functions deploy get-top-stories

# Deploy all functions
supabase functions deploy
```

### Updating Frontend

```bash
# Push changes to trigger automatic deployment
git push origin main
```

## 📊 Monitoring

- **Vercel Analytics**: Monitor performance and usage
- **Supabase Dashboard**: Monitor edge function usage and errors
- **Browser DevTools**: Check for client-side errors

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys if needed
- Monitor usage to prevent unexpected costs

## 💡 Tips

- **Custom Domain**: Add your domain in Vercel project settings
- **Preview Deployments**: Every PR gets a preview URL automatically
- **Function Logs**: Use Supabase dashboard to debug edge function issues
- **Performance**: Monitor Core Web Vitals in Vercel Analytics