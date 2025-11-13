# Deployment Guide - Netlify

This guide will help you deploy the Estimate Maker application to Netlify.

## Prerequisites

- A Netlify account (sign up at https://netlify.com)
- Your OpenAI API key
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended for first-time deployment)

1. **Push your code to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   Netlify should auto-detect these settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

4. **Add Environment Variables**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add: `VITE_OPENAI_API_KEY` = `your-openai-api-key-here`
   - Click "Save"

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live!

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   # Follow the prompts:
   # - Create & configure a new site
   # - Team: Select your team
   # - Site name: (press enter for random name or enter custom name)
   # - Build command: npm run build
   # - Directory to deploy: dist
   ```

4. **Set Environment Variable**
   ```bash
   netlify env:set VITE_OPENAI_API_KEY "your-openai-api-key-here"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Post-Deployment

### Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

### Environment Variables
Make sure `VITE_OPENAI_API_KEY` is set in Netlify:
- Site settings → Environment variables → Add variable
- Key: `VITE_OPENAI_API_KEY`
- Value: Your OpenAI API key

## Troubleshooting

### Build Fails
- Check that Node version is 18+ in `netlify.toml`
- Verify all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### Voice Input Not Working
- Verify `VITE_OPENAI_API_KEY` is set in Netlify environment variables
- Check browser console for errors
- Ensure API key has proper permissions

### Routing Issues
- The `_redirects` file in `public/` handles SPA routing
- Verify it's included in the build output

## Continuous Deployment

Once connected to Git, Netlify will automatically:
- Deploy on every push to main branch
- Run build command
- Update the live site

To disable auto-deploy or configure branch settings:
- Site settings → Build & deploy → Continuous deployment

