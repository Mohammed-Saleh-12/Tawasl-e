# Deployment script for Tawasl Platform to Vercel

param(
    [switch]$SkipBuild,
    [switch]$Production
)

Write-Host "🚀 Deploying Tawasl Platform to Vercel" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Using Vercel CLI version: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Run pre-deployment checks unless skipped
if (-not $SkipBuild) {
    Write-Host "`n📋 Running pre-deployment checks..." -ForegroundColor Yellow
    .\pre-deploy-check.ps1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Pre-deployment checks failed. Please fix issues before deploying." -ForegroundColor Red
        exit 1
    }
}

# Set deployment environment
$deploymentFlag = if ($Production) { "--prod" } else { "" }
$environmentName = if ($Production) { "production" } else { "preview" }

Write-Host "`n🌐 Deploying to $environmentName environment..." -ForegroundColor Yellow

# Deploy to Vercel
try {
    if ($Production) {
        Write-Host "Deploying to production..." -ForegroundColor Green
        vercel --prod
    } else {
        Write-Host "Deploying preview..." -ForegroundColor Green
        vercel
    }
    
    Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green
    
    # Get deployment URL
    $deploymentUrl = vercel ls --limit=1 | Select-String -Pattern "https://" | ForEach-Object { $_.Matches[0].Value }
    if ($deploymentUrl) {
        Write-Host "🌍 Your application is live at: $deploymentUrl" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Post-deployment reminders
Write-Host "`n📝 Post-Deployment Checklist:" -ForegroundColor Yellow
Write-Host "1. ✅ Test your deployed application" -ForegroundColor White
Write-Host "2. ✅ Verify database connectivity" -ForegroundColor White
Write-Host "3. ✅ Check all features are working" -ForegroundColor White
Write-Host "4. ✅ Monitor Vercel function logs for any errors" -ForegroundColor White

if ($Production) {
    Write-Host "`n🎉 Production deployment complete!" -ForegroundColor Green
    Write-Host "Monitor your application at: https://vercel.com/dashboard" -ForegroundColor Cyan
} else {
    Write-Host "`n🔍 Preview deployment complete!" -ForegroundColor Green
    Write-Host "Use --Production flag for production deployment" -ForegroundColor Yellow
}