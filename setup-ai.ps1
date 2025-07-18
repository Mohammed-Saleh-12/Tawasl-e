# AI Video Analysis Setup Script
Write-Host "Setting up AI Video Analysis dependencies..." -ForegroundColor Green

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python not found. Please install Python 3.8+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Check if pip is available
Write-Host "Checking pip installation..." -ForegroundColor Yellow
try {
    $pipVersion = pip --version 2>&1
    Write-Host "pip found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "pip not found. Please install pip or upgrade Python" -ForegroundColor Red
    exit 1
}

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
try {
    pip install -r server/ai-scripts/requirements.txt
    Write-Host "Python dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to install Python dependencies. Please check your Python installation." -ForegroundColor Red
    exit 1
}

# Test the AI script
Write-Host "Testing AI analysis script..." -ForegroundColor Yellow
try {
    python server/ai-scripts/video_analysis.py --help 2>&1 | Out-Null
    Write-Host "AI script test passed!" -ForegroundColor Green
} catch {
    Write-Host "AI script test failed. Please check the installation." -ForegroundColor Red
}

Write-Host "AI Video Analysis setup completed!" -ForegroundColor Green
Write-Host "You can now use real AI-powered video analysis in your educational platform." -ForegroundColor Cyan 