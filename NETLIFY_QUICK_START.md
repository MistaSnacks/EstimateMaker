# Quick Netlify Deployment Guide

## ✅ Your app is ready to deploy!

All configuration files have been created:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `public/_redirects` - SPA routing support
- ✅ Build tested and working

## 🚀 Deploy in 3 Steps

### Step 1: Push to Git
```bash
git init
git add .
git commit -m "Ready for Netlify deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Netlify will auto-detect settings from `netlify.toml` ✅

### Step 3: Add Environment Variable
**CRITICAL:** Add your OpenAI API key:
1. In Netlify dashboard: **Site settings** → **Environment variables**
2. Click **"Add variable"**
3. Key: `VITE_OPENAI_API_KEY`
4. Value: `your-openai-api-key-here`
5. Click **"Save"**

### Step 4: Deploy!
Click **"Deploy site"** and wait for the build to complete.

## 📝 Important Notes

- **Environment Variable**: The app requires `VITE_OPENAI_API_KEY` to work
- **Voice Input**: Will only work after adding the API key
- **Build Time**: ~1-2 minutes
- **Auto-Deploy**: Future pushes to main branch will auto-deploy

## 🔍 Verify Deployment

After deployment:
1. Visit your Netlify URL
2. Check browser console for errors
3. Test voice input (requires API key)

## 🐛 Troubleshooting

**Build fails?**
- Check Netlify build logs
- Verify Node version is 18+ (set in netlify.toml)

**Voice input not working?**
- Verify `VITE_OPENAI_API_KEY` is set in Netlify environment variables
- Check browser console for API errors

**Routing issues?**
- The `_redirects` file handles SPA routing
- Should work automatically

## 📚 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

