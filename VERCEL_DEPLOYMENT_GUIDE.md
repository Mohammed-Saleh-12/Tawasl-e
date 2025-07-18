# 🚀 Vercel Deployment Guide for Tawasl Educational Platform

This guide will walk you through deploying your Tawasl educational platform to Vercel step by step.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ A GitHub account
- ✅ A Vercel account (free tier available)
- ✅ Your project code pushed to GitHub
- ✅ A PostgreSQL database (Neon, Supabase, or similar)

## 🗄️ Step 1: Database Setup

### 1.1 Create a PostgreSQL Database
Choose one of these options:

**Option A: Neon (Recommended)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy your database connection string

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection string

### 1.2 Database Connection String Format
```
postgresql://username:password@host:port/database?sslmode=require
```

## 🔧 Step 2: Prepare Your Project

### 2.1 Update Environment Variables
Create a `.env` file in your project root (for local testing):

```env
DATABASE_URL=your_postgresql_connection_string_here
NODE_ENV=production
SESSION_SECRET=your_secure_session_secret_here
PORT=5000
```

### 2.2 Verify Build Scripts
Ensure your `package.json` has these scripts:
```json
{
  "scripts": {
    "build": "npm run build:server && npm run build:client",
    "build:server": "tsc --project tsconfig.server.json",
    "build:client": "cd client && npm run build",
    "start": "node dist/server/index.js"
  }
}
```

### 2.3 Check Vercel Configuration
Your `vercel.json` should look like this:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "dist/public/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 📤 Step 3: Deploy to Vercel

### 3.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"

### 3.2 Import Your Repository
1. Select your GitHub repository
2. Vercel will automatically detect it's a Node.js project
3. Click "Import"

### 3.3 Configure Project Settings

**Project Name:**
- Enter: `tawasl-educational-platform`
- Or your preferred name

**Framework Preset:**
- Select: `Other`

**Root Directory:**
- Leave as `/` (root)

**Build Command:**
- Enter: `npm run build`

**Output Directory:**
- Enter: `dist/public`

**Install Command:**
- Enter: `npm install`

### 3.4 Environment Variables
Add these environment variables in Vercel:

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | A secure random string (32+ characters) |

**To add environment variables:**
1. Click "Environment Variables" section
2. Click "Add"
3. Enter each variable name and value
4. Select "Production" environment
5. Click "Save"

### 3.5 Deploy
1. Click "Deploy"
2. Wait for the build to complete (usually 2-5 minutes)

## 🔍 Step 4: Verify Deployment

### 4.1 Check Build Logs
- Monitor the build process in Vercel dashboard
- Look for any errors in the build logs
- Ensure both server and client build successfully

### 4.2 Test Your Application
1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test the following features:
   - ✅ Home page loads
   - ✅ Navigation works
   - ✅ API endpoints respond
   - ✅ Database connections work
   
   - ✅ Video practice features

### 4.3 Common Issues & Solutions

**Issue: Build fails with TypeScript errors**
- Solution: Run `npm run type-check` locally first
- Fix any TypeScript errors before deploying

**Issue: Database connection fails**
- Solution: Check your `DATABASE_URL` environment variable
- Ensure the database is accessible from Vercel's servers

**Issue: API routes return 404**
- Solution: Verify your `vercel.json` routes configuration
- Check that API endpoints are properly prefixed with `/api`

**Issue: Static assets not loading**
- Solution: Ensure client build outputs to `dist/public`
- Check that `client/vite.config.ts` is configured correctly

## 🔄 Step 5: Continuous Deployment

### 5.1 Automatic Deployments
- Vercel automatically deploys when you push to your main branch
- Each push creates a new deployment
- You can preview deployments before promoting to production

### 5.2 Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## 📊 Step 6: Monitoring & Analytics

### 6.1 Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and user behavior

### 6.2 Function Logs
- View serverless function logs in Vercel dashboard
- Monitor API performance and errors

## 🛠️ Step 7: Post-Deployment Tasks

### 7.1 Database Migration
If you need to run database migrations:
1. Use Vercel CLI: `vercel env pull`
2. Run migrations locally with production database
3. Or use a database management tool

### 7.2 Performance Optimization
- Enable Vercel's Edge Network
- Optimize images and assets
- Monitor Core Web Vitals

## 🔧 Troubleshooting

### Common Deployment Issues

**Build Timeout**
- Optimize your build process
- Consider using Vercel's build cache

**Memory Issues**
- Increase function memory in Vercel settings
- Optimize your code for serverless environment

**Cold Starts**
- Use Vercel's Edge Functions where possible
- Implement proper caching strategies

## 📞 Support

If you encounter issues:
1. Check Vercel's documentation
2. Review build logs for specific errors
3. Test locally with production environment variables
4. Contact Vercel support if needed

## 🎉 Success!

Once deployed successfully, your Tawasl educational platform will be live at:
`https://your-project-name.vercel.app`

Your platform is now accessible worldwide! 🌍

---

**Next Steps:**
- Set up monitoring and analytics
- Configure custom domain (optional)
- Set up automated testing
- Plan for scaling as your user base grows

Happy deploying! 🚀 