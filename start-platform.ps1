# Educational Network Platform Startup Script
Write-Host "🚀 Starting Educational Network Platform..." -ForegroundColor Green

# Start Backend Server
Write-Host "📡 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; npm run dev" -WindowStyle Normal

# Wait for servers to start
Write-Host "⏳ Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test the servers
Write-Host "🔍 Testing servers..." -ForegroundColor Yellow

# Test Backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/articles" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Backend: http://localhost:5000 (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Not responding yet" -ForegroundColor Red
}

# Test Frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Frontend: http://localhost:5173 (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: Not responding yet" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Platform startup complete!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 Database: localhost:5433" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 