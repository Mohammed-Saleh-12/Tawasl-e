# Python Installation and AI Setup Script
Write-Host "Python Installation and AI Setup Guide" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Python is already installed
Write-Host "`nChecking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    
    # Test pip
    try {
        $pipVersion = pip --version 2>&1
        Write-Host "✅ pip found: $pipVersion" -ForegroundColor Green
        
        # Install AI dependencies
        Write-Host "`nInstalling AI dependencies..." -ForegroundColor Yellow
        pip install opencv-python==4.8.1.78
        pip install mediapipe==0.10.7
        pip install numpy==1.24.3
        
        Write-Host "`n✅ AI dependencies installed successfully!" -ForegroundColor Green
        
        # Test the AI script
        Write-Host "`nTesting AI analysis script..." -ForegroundColor Yellow
        python test-python.py
        
        Write-Host "`n🎉 Setup complete! You can now use real AI video analysis." -ForegroundColor Green
        
    } catch {
        Write-Host "❌ pip not found. Please install Python properly." -ForegroundColor Red
        ShowInstallationGuide
    }
    
} catch {
    Write-Host "❌ Python not found. Please install Python first." -ForegroundColor Red
    ShowInstallationGuide
}

function ShowInstallationGuide {
    Write-Host "`n📋 Installation Guide:" -ForegroundColor Cyan
    Write-Host "1. Go to https://python.org/downloads/" -ForegroundColor White
    Write-Host "2. Download Python 3.11 or 3.12" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. IMPORTANT: Check 'Add Python to PATH'" -ForegroundColor Yellow
    Write-Host "5. Choose 'Install Now'" -ForegroundColor White
    Write-Host "6. Restart PowerShell after installation" -ForegroundColor White
    Write-Host "7. Run this script again" -ForegroundColor White
    
    Write-Host "`n📖 For detailed instructions, see PYTHON_SETUP_GUIDE.md" -ForegroundColor Cyan
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 