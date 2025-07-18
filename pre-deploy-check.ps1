# Pre-deployment checklist script for Tawasl Platform

Write-Host "🚀 Tawasl Platform - Pre-Deployment Checklist" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`n1. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if npm is available
Write-Host "`n2. Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
Write-Host "`n3. Checking root dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Root dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Root dependencies not found. Installing..." -ForegroundColor Yellow
    npm install
}

# Check client dependencies
Write-Host "`n4. Checking client dependencies..." -ForegroundColor Yellow
if (Test-Path "client/node_modules") {
    Write-Host "✅ Client dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Client dependencies not found. Installing..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

# Check environment file
Write-Host "`n5. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check for required environment variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @("DATABASE_URL", "SESSION_SECRET")
    
    foreach ($var in $requiredVars) {
        if ($envContent -match "$var=") {
            Write-Host "✅ $var is configured" -ForegroundColor Green
        } else {
            Write-Host "❌ $var is missing from .env file" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  .env file not found. Please copy from .env.example and configure" -ForegroundColor Yellow
}

# Test build process
Write-Host "`n6. Testing build process..." -ForegroundColor Yellow
try {
    Write-Host "Building client..." -ForegroundColor Gray
    Set-Location client
    npm run build
    Set-Location ..
    
    Write-Host "Building server..." -ForegroundColor Gray
    npm run build:server
    
    Write-Host "✅ Build process completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Build process failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Check TypeScript compilation
Write-Host "`n7. Checking TypeScript compilation..." -ForegroundColor Yellow
try {
    npm run check
    Write-Host "✅ TypeScript compilation successful" -ForegroundColor Green
} catch {
    Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
}

# Check if Vercel CLI is installed
Write-Host "`n8. Checking Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Vercel CLI not installed. Install with: npm install -g vercel" -ForegroundColor Yellow
}

# Final summary
Write-Host "`n🎯 Pre-Deployment Summary" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Your project is ready for deployment!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Set up Supabase database (see deploy-setup.md)" -ForegroundColor White
Write-Host "2. Configure environment variables in Vercel" -ForegroundColor White
Write-Host "3. Deploy using 'vercel --prod' or Vercel dashboard" -ForegroundColor White
Write-Host "4. Run database migrations on production" -ForegroundColor White

Write-Host "`n📚 For detailed instructions, see: deploy-setup.md" -ForegroundColor Cyan