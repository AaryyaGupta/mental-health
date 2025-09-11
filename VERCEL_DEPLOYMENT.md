# Vercel Deployment Guide for Zephy

## 🚀 Deployment Options

### Option 1: Root-Level Deployment (Recommended)

Since Vercel handles the frontend routing, we'll deploy from the root with proper routing to the frontend folder.

**Current Setup:**
- `vercel.json` is configured to route traffic to the `frontend/` folder
- Backend is handled by Supabase (no server deployment needed)

### Option 2: Frontend-Only Deployment

If you prefer to deploy only the frontend folder:

1. **Create a new repository** with just the frontend files
2. **Copy all files** from `frontend/` to the root of the new repo
3. **Deploy that repository** to Vercel

## 📋 Deployment Steps

### Step 1: Prepare for Deployment

1. **Update Supabase Configuration**
   - Go to your Supabase project settings
   - Add your production domain to allowed origins
   - Update redirect URLs for Google OAuth

2. **Update config.js**
   ```javascript
   // Make sure your Supabase config is correct
   const SUPABASE_URL = 'https://your-actual-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-actual-anon-key';
   ```

### Step 2: Deploy to Vercel

**Method 1: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

**Method 2: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project root
vercel

# Follow the prompts
```

### Step 3: Configure Production Settings

1. **Update Supabase URLs**
   - Go to Supabase Dashboard → Authentication → Settings
   - Add your Vercel domain to "Site URL"
   - Add `https://your-app.vercel.app/index.html` to "Redirect URLs"

2. **Update Google OAuth (if using)**
   - Go to Google Cloud Console
   - Update authorized redirect URIs to include:
     - `https://your-project-id.supabase.co/auth/v1/callback`
   - Update authorized origins to include your Vercel domain

### Step 4: Test Production Deployment

1. **Visit your deployed site**
2. **Test authentication**
   - Email/password signup and login
   - Google OAuth (if configured)
3. **Test all pages**
   - Home, Communities, Polls, Fit Check
4. **Test mobile responsiveness**

## 🔧 Troubleshooting

### Common Issues:

**1. Files not loading properly**
- Check that `vercel.json` is routing correctly
- Verify all file paths are relative (no leading slashes)

**2. Authentication not working**
- Check Supabase site URL configuration
- Verify CORS settings in Supabase
- Check Google OAuth redirect URLs

**3. CSS/JS not loading**
- Ensure all paths in HTML are relative
- Check for any hardcoded localhost URLs

**4. Mobile menu not working**
- Verify all JavaScript files are loading
- Check browser console for errors

## 📁 File Structure After Deployment

```
your-domain.vercel.app/
├── index.html (from frontend/)
├── communities.html (from frontend/)
├── polls.html (from frontend/)
├── fitcheck.html (from frontend/)
├── style.css (from frontend/)
├── script.js (from frontend/)
├── auth.js (from frontend/)
├── config.js (from frontend/)
└── attached_assets/ (from frontend/)
```

## 🌐 Environment Configuration

### Development
- Local server: `http://localhost:3000`
- Supabase Site URL: `http://localhost:3000`

### Production
- Vercel domain: `https://your-app.vercel.app`
- Supabase Site URL: `https://your-app.vercel.app`

## ✅ Pre-Deployment Checklist

- [ ] Supabase database schema applied
- [ ] Supabase authentication configured
- [ ] Google OAuth configured (optional)
- [ ] All file paths are relative
- [ ] No hardcoded localhost URLs
- [ ] vercel.json properly configured
- [ ] Repository pushed to GitHub

## 🚀 Post-Deployment Tasks

1. **Test all functionality**
2. **Update Supabase settings with production URLs**
3. **Configure custom domain** (optional)
4. **Set up analytics** (optional)
5. **Configure error monitoring** (optional)

Your Zephy student wellness hub will be live and fully functional! 🎉
