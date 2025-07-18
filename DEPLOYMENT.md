# Deployment Guide for Tawasl

## Local Development Setup

### Prerequisites
- Node.js 18+ (recommended: Node.js 20)
- PostgreSQL 14+
- npm or yarn

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd tawasl
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb tawasl
   
   # Push schema to database
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:5000`

## Production Deployment

### Option 1: Traditional Server Deployment

1. **Server Requirements**
   - Node.js 18+
   - PostgreSQL 14+
   - Reverse proxy (nginx recommended)

2. **Deploy Steps**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd tawasl
   
   # Install dependencies
   npm install
   
   # Set environment variables
   export DATABASE_URL="postgresql://user:pass@localhost:5432/tawasl_prod"
   export NODE_ENV="production"
   export SESSION_SECRET="your-secure-session-secret"
   
   # Setup database
   npm run db:push
   
   # Build application
   npm run build
   
   # Start production server
   npm run start
   ```

3. **Nginx Configuration** (optional)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Build application
   RUN npm run build
   
   # Expose port
   EXPOSE 5000
   
   # Start application
   CMD ["npm", "run", "start"]
   ```

2. **Docker Compose** (with PostgreSQL)
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=postgresql://tawasl:password@db:5432/tawasl
         - SESSION_SECRET=your-secure-session-secret
       depends_on:
         - db
     
     db:
       image: postgres:16
       environment:
         - POSTGRES_DB=tawasl
         - POSTGRES_USER=tawasl
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
   
   volumes:
     postgres_data:
   ```

### Option 3: Cloud Platform Deployment

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

#### Heroku
```bash
# Install Heroku CLI and deploy
heroku create tawasl-app
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SESSION_SECRET=your-secure-secret
git push heroku main
```

## Environment Variables

Required environment variables for production:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Application
NODE_ENV=production
SESSION_SECRET=your-very-secure-random-string-here

# Optional
PORT=5000
```

## Database Migration

The application uses Drizzle ORM with schema push instead of traditional migrations:

```bash
# Push schema changes to database
npm run db:push

# Open database studio (development)
npx drizzle-kit studio
```

## Monitoring and Maintenance

### Health Check Endpoint
The application automatically serves on `/` - if it loads, the app is healthy.

### Logs
Application logs are output to stdout. In production, redirect to your logging system:

```bash
npm run start 2>&1 | tee -a /var/log/tawasl.log
```

### Database Backup
```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check PostgreSQL server is running
   - Ensure database exists

2. **Build Failures**
   - Check Node.js version (needs 18+)
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

3. **Session Issues**
   - Ensure SESSION_SECRET is set
   - Check database connection for session storage

4. **Static Files Not Loading**
   - Verify build completed successfully
   - Check file permissions in dist/ directory

### Performance Optimization

1. **Database**
   - Add indexes for frequently queried columns
   - Enable connection pooling
   - Consider read replicas for high traffic

2. **Application**
   - Enable gzip compression in reverse proxy
   - Set up CDN for static assets
   - Monitor memory usage

3. **Caching**
   - Add Redis for session storage
   - Implement query result caching
   - Use HTTP caching headers

## Security Considerations

1. **Environment Variables**
   - Never commit .env files
   - Use secure random SESSION_SECRET
   - Rotate secrets regularly

2. **Database**
   - Use SSL connections in production
   - Limit database user permissions
   - Regular security updates

3. **Application**
   - Keep dependencies updated
   - Implement rate limiting
   - Use HTTPS in production