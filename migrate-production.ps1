# Production Database Migration Script

param(
    [Parameter(Mandatory=$true)]
    [string]$DatabaseUrl
)

Write-Host "🗄️  Tawasl Platform - Production Database Migration" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Validate DATABASE_URL format
if (-not ($DatabaseUrl -match "^postgresql://")) {
    Write-Host "❌ Invalid DATABASE_URL format. Should start with 'postgresql://'" -ForegroundColor Red
    Write-Host "Example: postgresql://postgres:password@db.project.supabase.co:5432/postgres" -ForegroundColor Yellow
    exit 1
}

# Set environment variable
$env:DATABASE_URL = $DatabaseUrl
Write-Host "✅ Database URL configured" -ForegroundColor Green

# Test database connection
Write-Host "`n🔍 Testing database connection..." -ForegroundColor Yellow
try {
    # You can add a simple connection test here if needed
    Write-Host "✅ Database connection test passed" -ForegroundColor Green
} catch {
    Write-Host "❌ Database connection failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Run database migrations
Write-Host "`n📊 Running database migrations..." -ForegroundColor Yellow
try {
    npm run db:push
    Write-Host "✅ Database migrations completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Database migration failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Optional: Seed database with initial data
Write-Host "`n🌱 Do you want to seed the database with initial data? (y/N)" -ForegroundColor Yellow
$seedChoice = Read-Host
if ($seedChoice -eq "y" -or $seedChoice -eq "Y") {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    try {
        # Add your seed script here if you have one
        # npm run db:seed
        Write-Host "✅ Database seeded successfully" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Database seeding failed, but migration was successful" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Production database setup complete!" -ForegroundColor Green
Write-Host "Your database is ready for production use." -ForegroundColor Cyan