# Start Tawasl Educational Platform
# This script sets the environment variables and starts both server and client in parallel in the same window, logging all output to tawasl.log

Write-Host "🚀 Starting Tawasl Educational Platform..." -ForegroundColor Green

# Set environment variables
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/tawasl"
$env:NODE_ENV = "development"
$env:SESSION_SECRET = "tawasl-dev-secret-key-2024"
$env:PORT = "5000"

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host "📊 Database URL: $env:DATABASE_URL" -ForegroundColor Cyan
Write-Host "🌍 Environment: $env:NODE_ENV" -ForegroundColor Cyan
Write-Host "🔑 Session Secret: $env:SESSION_SECRET" -ForegroundColor Cyan
Write-Host "🚪 Port: $env:PORT" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔗 Starting both backend and frontend in parallel (output below)..." -ForegroundColor Yellow
Write-Host "📝 All output will also be saved to tawasl.log" -ForegroundColor Yellow

# Run both servers in parallel and log output
npm run dev *>&1 | Tee-Object -FilePath tawasl.log

Write-Host ""
Write-Host "✅ Both processes have exited. Check tawasl.log for the full output." -ForegroundColor Green
Write-Host "Press any key to exit this script..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 