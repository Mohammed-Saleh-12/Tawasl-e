# Test Python Installation
Write-Host "Testing Python Installation..." -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Test Python
Write-Host "`n1. Testing Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python from python.org" -ForegroundColor Red
    Write-Host "   Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    exit 1
}

# Test pip
Write-Host "`n2. Testing pip..." -ForegroundColor Yellow
try {
    $pipVersion = pip --version 2>&1
    Write-Host "✅ pip found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pip not found. Please reinstall Python" -ForegroundColor Red
    exit 1
}

# Test Python script
Write-Host "`n3. Testing Python script..." -ForegroundColor Yellow
try {
    python test-python.py
    Write-Host "✅ Python script works!" -ForegroundColor Green
} catch {
    Write-Host "❌ Python script failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Python is properly installed!" -ForegroundColor Green
Write-Host "You can now run: .\setup-ai.ps1" -ForegroundColor Cyan 