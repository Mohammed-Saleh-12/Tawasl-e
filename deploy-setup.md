# Vercel Deployment with Supabase Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git repository
- Vercel account
- Supabase account

## Step 1: Setup Supabase Database

1. **Create Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Enter project details:
     - Name: `tawasl-platform`
     - Database Password: (save this securely!)
     - Region: Choose closest to your users
   - Click "Create new project"

2. **Get Database Connection String**:
   - Go to Settings → Database
   - Copy the "Connection string" under "Connection parameters"
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Example: `postgresql://postgres:your_password@db.abc123.supabase.co:5432/postgres`

3. **Run Database Migrations**:
   ```bash
   # Set your DATABASE_URL environment variable (replace with your actual connection string)
   export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.grkxmgtoyckegnxdrztv.supabase.co:5432/postgres"
   
   # Run migrations
   npm run db:push
   ```

## Step 2: Prepare for Vercel Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   cd client && npm install
   ```

2. **Test Build Locally**:
   ```bash
   npm run build
   ```

3. **Create Production Environment File**:
   - Copy `.env.example` to `.env.production`
   - Update with your Supabase credentials:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@db.abc123.supabase.co:5432/postgres
   NODE_ENV=production
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   ```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add SESSION_SECRET
   vercel env add NODE_ENV
   ```

### Option B: Deploy via Vercel Dashboard

1. **Connect Repository**:
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

2. **Configure Build Settings**:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add the following variables:
     - `DATABASE_URL`: Your Supabase connection string
     - `SESSION_SECRET`: A secure random string
     - `NODE_ENV`: `production`

4. **Deploy**:
   - Click "Deploy"

## Step 4: Post-Deployment Setup

1. **Run Database Migrations on Production**:
   ```bash
   # Using Vercel CLI
   vercel env pull .env.production
   npm run db:push
   ```

2. **Test Your Deployment**:
   - Visit your Vercel URL
   - Test all features
   - Check database connectivity

## Step 5: Domain Configuration (Optional)

1. **Add Custom Domain**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

## Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Verify DATABASE_URL is correct
   - Check Supabase project is active
   - Ensure password is URL-encoded

2. **Build Failures**:
   - Check all dependencies are installed
   - Verify TypeScript compilation
   - Check for missing environment variables

3. **Runtime Errors**:
   - Check Vercel function logs
   - Verify all environment variables are set
   - Check database migrations are applied

### Useful Commands:

```bash
# Check deployment logs
vercel logs

# Pull environment variables
vercel env pull

# Redeploy
vercel --prod

# Check build locally
npm run build
npm run start
```

## Security Checklist

- [ ] Strong SESSION_SECRET generated
- [ ] Database password is secure
- [ ] Environment variables are not committed to Git
- [ ] Supabase RLS (Row Level Security) configured if needed
- [ ] CORS settings configured properly

## Performance Optimization

1. **Enable Vercel Analytics**:
   - Go to Project Settings → Analytics
   - Enable Web Analytics

2. **Configure Caching**:
   - Static assets are automatically cached
   - API responses can be cached with headers

3. **Monitor Performance**:
   - Use Vercel's built-in monitoring
   - Set up error tracking (Sentry, etc.)

## Maintenance

- Regularly update dependencies
- Monitor database usage in Supabase
- Check Vercel function usage and limits
- Backup database regularly

## Your Deployment is Live! 

**URL:** https://educational-network-54260s9sf-mohammeds-projects-7a007fd8.vercel.app

## Next Steps to Verify Everything Works:

### 1. **Test the Frontend**
- Visit the URL above in your browser
- Check if the homepage loads correctly
- Test navigation between pages

### 2. **Test API Endpoints**
Try these endpoints to verify your backend is working:

```bash
# Test API health
curl https://educational-network-54260s9sf-mohammeds-projects-7a007fd8.vercel.app/api/test-session

# Test articles endpoint
curl https://educational-network-54260s9sf-mohammeds-projects-7a007fd8.vercel.app/api/articles

# Test test categories
curl https://educational-network-54260s9sf-mohammeds-projects-7a007fd8.vercel.app/api/test-categories
```

### 3. **Check Environment Variables**
Make sure these are set in your Vercel dashboard:
- `DATABASE_URL` (your Supabase connection string)
- `SESSION_SECRET` (a secure random string)
- `NODE_ENV` (should be `production`)

### 4. **Test Database Connection**
If the API endpoints return errors, it might be a database connection issue. Check:
- Your Supabase database is accessible
- The `DATABASE_URL` in Vercel is correct
- The session table was created in Supabase

### 5. **Create the Session Table**
If you haven't already, run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE IF NOT EXISTS user_sessions (
  sid varchar NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE user_sessions ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

CREATE INDEX "IDX_user_sessions_expire" ON "user_sessions" ("expire");
```

## What to Do Next:

1. **Visit your deployed URL** and test the application
2. **If you encounter issues**, let me know the specific error messages
3. **If everything works**, your deployment is successful!

Would you like me to help you test specific functionality or troubleshoot any issues you find?