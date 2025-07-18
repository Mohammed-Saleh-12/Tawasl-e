# Video Download Troubleshooting Guide

## Overview
This guide helps resolve video download issues in the Tawasl Educational Platform.

## Quick Fixes

### 1. **Browser Compatibility**
- **Recommended**: Chrome, Firefox, Edge (latest versions)
- **Not Recommended**: Internet Explorer, Safari (older versions)
- **Mobile**: May have limited download support

### 2. **Browser Settings**
- **Allow Popups**: Enable popups for the site
- **Download Permissions**: Allow automatic downloads
- **Camera/Microphone**: Grant permissions when prompted

### 3. **Network Issues**
- **HTTPS Required**: Site must be accessed via HTTPS for camera access
- **Firewall**: Ensure no firewall blocking downloads
- **Corporate Networks**: Some networks block blob downloads

## Debug Steps

### Step 1: Test Browser Capabilities
1. Go to the Video Practice page
2. Click "Debug Browser Capabilities" button
3. Check browser console for supported formats
4. Verify all required APIs are available

### Step 2: Test Download Functionality
1. Click "Test Download" button
2. This creates a simple test image to verify download works
3. If test fails, the issue is with browser/download settings

### Step 3: Check Recording Process
1. Start a video recording
2. Record for at least 5-10 seconds
3. Stop recording
4. Check console for blob creation messages
5. Verify blob size is not 0

## Common Issues & Solutions

### Issue: "Download Failed" Error
**Causes:**
- Browser doesn't support blob downloads
- Popup blocker active
- Network restrictions
- Corrupted video data

**Solutions:**
1. Try different browser (Chrome recommended)
2. Allow popups for the site
3. Check network settings
4. Record video again

### Issue: "Video data is empty or corrupted"
**Causes:**
- Recording too short
- Camera/microphone not working
- Browser media API issues

**Solutions:**
1. Record for longer (10+ seconds)
2. Check camera/microphone permissions
3. Refresh page and try again
4. Use different browser

### Issue: "Popup blocked" Error
**Causes:**
- Browser popup blocker active
- Site not trusted

**Solutions:**
1. Click popup blocker icon in address bar
2. Allow popups for this site
3. Add site to trusted sites list

### Issue: Download starts but file is corrupted
**Causes:**
- Incomplete blob data
- Wrong MIME type
- Browser compatibility issues

**Solutions:**
1. Record longer videos
2. Use recommended browsers
3. Check file extension (.webm, .mp4)
4. Try different video player

## Advanced Troubleshooting

### Browser Console Debugging
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages during:
   - Recording start/stop
   - Download attempts
   - Blob creation

### Manual Download Method
If automatic download fails:
1. Right-click on video player
2. Select "Save video as..."
3. Choose download location
4. Save with .webm extension

### Alternative Download Methods
The app tries multiple download methods:
1. **Direct download** (preferred)
2. **Popup window** (fallback)
3. **File System Access API** (modern browsers)
4. **Clipboard copy** (last resort)

## Browser-Specific Issues

### Chrome
- **Best compatibility**
- Supports all download methods
- May show "Keep" dialog for downloads

### Firefox
- **Good compatibility**
- May require popup permission
- Check download settings in about:preferences

### Edge
- **Good compatibility**
- Similar to Chrome
- May have enterprise restrictions

### Safari
- **Limited support**
- May not support blob downloads
- Try alternative browsers

## Technical Details

### Supported Video Formats
- **WebM** (VP8/VP9 + Opus) - Primary
- **MP4** (H.264 + AAC) - Fallback
- **OGG** (Theora + Vorbis) - Alternative

### Required Browser APIs
- `MediaRecorder` - Video recording
- `Blob` - Data handling
- `URL.createObjectURL` - Download links
- `fetch` - Data retrieval

### File Naming Convention
- Format: `Scenario_YYYY-MM-DDTHH-MM-SS.webm`
- Example: `Job_Interview_Introduction_2024-01-15T14-30-45.webm`

## Getting Help

If issues persist:
1. Check browser console for specific errors
2. Try different browser/device
3. Test with shorter recordings
4. Contact support with error details

## Prevention Tips

1. **Use recommended browsers**
2. **Allow necessary permissions**
3. **Record longer videos** (10+ seconds)
4. **Check network stability**
5. **Keep browser updated** 