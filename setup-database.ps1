# Tawasl Database Setup Script
# This script helps you set up a local Postgres database using Docker

Write-Host "🐳 Setting up Tawasl Database with Docker..." -ForegroundColor Green

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not running!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Write-Host "After installation, restart your computer and run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker ps > $null 2>&1
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Yellow
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Blue
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created from env.example" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Start the database containers
Write-Host "🚀 Starting Postgres database..." -ForegroundColor Blue
docker-compose up -d postgres

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test database connection
Write-Host "🔍 Testing database connection..." -ForegroundColor Blue
try {
    docker exec tawasl-postgres psql -U tawasl_user -d tawasl -c "SELECT version();" > $null 2>&1
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Database connection failed. Please wait a moment and try again." -ForegroundColor Red
    exit 1
}

# Run database setup
Write-Host "🔧 Setting up database schema..." -ForegroundColor Blue
npm run db:setup

# Seed the database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Blue
npm run db:seed

Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Database Information:" -ForegroundColor Cyan
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Port: 5432" -ForegroundColor White
Write-Host "   Database: tawasl" -ForegroundColor White
Write-Host "   Username: tawasl_user" -ForegroundColor White
Write-Host "   Password: tawasl_password" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Optional: pgAdmin is available at http://localhost:8080" -ForegroundColor Cyan
Write-Host "   Email: admin@tawasl.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "🚀 You can now start the development server with: npm run dev" -ForegroundColor Green 