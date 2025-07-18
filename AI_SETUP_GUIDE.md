# AI Video Analysis Setup Guide

## Step 1: Install Python

### Option A: Install from Python.org (Recommended)
1. Go to https://python.org/downloads/
2. Download Python 3.8 or higher for Windows
3. Run the installer
4. **Important**: Check "Add Python to PATH" during installation
5. Verify installation by opening PowerShell and running:
   ```powershell
   python --version
   pip --version
   ```

### Option B: Install from Microsoft Store
1. Open Microsoft Store
2. Search for "Python 3.11" or higher
3. Click "Get" or "Install"
4. Wait for installation to complete
5. Verify installation as above

### Option C: Using Chocolatey (if you have it)
```powershell
choco install python
```

## Step 2: Install AI Dependencies

After Python is installed, run the setup script:
```powershell
.\setup-ai.ps1
```

Or install manually:
```powershell
pip install opencv-python==4.8.1.78
pip install mediapipe==0.10.7
pip install numpy==1.24.3
```

## Step 3: Verify Installation

Test the AI script:
```powershell
python server/ai-scripts/video_analysis.py --help
```

## Alternative: Use Mock AI (No Python Required)

If you prefer not to install Python right now, you can use the enhanced mock AI system:

1. The system will automatically fall back to intelligent mock analysis
2. It provides realistic scores based on video duration and scenario
3. You can upgrade to real AI later by installing Python

## Troubleshooting

### Python Installation Issues
- **"Python was not found"**: Make sure Python is added to PATH
- **Permission errors**: Run PowerShell as Administrator
- **Version conflicts**: Use Python 3.8+ only

### MediaPipe Installation Issues
- **Build errors**: Install Visual Studio Build Tools
- **Memory errors**: Close other applications and try again
- **Network errors**: Check your internet connection

### Performance Issues
- **Slow analysis**: Reduce video quality or duration
- **Memory usage**: Close other applications
- **CPU usage**: The AI processing is CPU-intensive

## Next Steps

1. **Install Python** using one of the methods above
2. **Run the setup script** to install dependencies
3. **Test the system** with a short video
4. **Start using real AI analysis** in your educational platform

## Support

If you encounter issues:
1. Check this guide first
2. Ensure Python is properly installed and in PATH
3. Try the manual installation steps
4. Check the troubleshooting section in AI_VIDEO_ANALYSIS_README.md 