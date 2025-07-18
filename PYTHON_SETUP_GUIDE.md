# Python Setup Guide for AI Video Analysis

## Step 1: Download Python

1. **Go to Python.org**: Visit https://python.org/downloads/
2. **Download Python 3.11 or 3.12**: Click the big yellow "Download Python" button
3. **Save the installer**: Save it to your Downloads folder

## Step 2: Install Python Properly

1. **Run the installer**: Double-click the downloaded .exe file
2. **IMPORTANT**: Check "Add Python to PATH" at the bottom of the installer
3. **Choose "Install Now"**: This installs Python for all users
4. **Wait for installation**: This may take a few minutes
5. **Click "Close"** when installation is complete

## Step 3: Verify Installation

1. **Open a new PowerShell window** (close the current one)
2. **Test Python**:
   ```powershell
   python --version
   ```
3. **Test pip**:
   ```powershell
   pip --version
   ```

## Step 4: Install AI Dependencies

Once Python is working, run these commands:

```powershell
# Navigate to your project
cd "C:\Users\EVO.Store\OneDrive\المستندات\EducationalNetwork"

# Install AI dependencies
pip install opencv-python==4.8.1.78
pip install mediapipe==0.10.7
pip install numpy==1.24.3
```

## Step 5: Test the AI System

```powershell
# Test the AI script
python server/ai-scripts/video_analysis.py --help
```

## Alternative: Quick Setup Script

If the above works, you can run our setup script:

```powershell
.\setup-ai.ps1
```

## Troubleshooting

### If "python" command not found:
1. **Restart PowerShell** after installation
2. **Check PATH**: Make sure "Add Python to PATH" was checked during installation
3. **Manual PATH**: Add Python to PATH manually if needed

### If pip installation fails:
1. **Update pip**: `python -m pip install --upgrade pip`
2. **Install Visual C++**: Download from Microsoft if needed
3. **Try alternative**: `pip install --user opencv-python mediapipe numpy`

### If MediaPipe fails:
1. **Install Visual Studio Build Tools**
2. **Try**: `pip install mediapipe --no-cache-dir`
3. **Alternative**: Use the enhanced mock system temporarily

## Success Indicators

✅ **Python works**: `python --version` shows version number
✅ **Pip works**: `pip --version` shows pip version
✅ **AI dependencies installed**: No errors during pip install
✅ **AI script works**: `python server/ai-scripts/video_analysis.py --help` runs

## Next Steps

Once Python is properly installed and working:

1. **Test the video analysis** with a short recording
2. **Enjoy real AI-powered analysis**!
3. **Monitor performance** and adjust video quality if needed

## Need Help?

If you encounter issues:
1. Make sure Python is added to PATH during installation
2. Restart PowerShell after installation
3. Try the manual installation steps above
4. Check the troubleshooting section 