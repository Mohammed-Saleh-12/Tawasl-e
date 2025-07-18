# Favicon Setup for Tawasl Platform

This directory contains the favicon files for the Tawasl educational platform.

## Files Included:

- `favicon.svg` - Modern SVG favicon (primary)
- `favicon.ico` - Traditional ICO format (fallback)
- `favicon-32x32.png` - 32x32 PNG version
- `favicon-16x16.png` - 16x16 PNG version
- `site.webmanifest` - Web app manifest for PWA support

## Design:

The favicon features:
- Blue gradient background representing trust and professionalism
- Speech bubble design symbolizing communication
- Central dot representing active listening
- Small dots representing conversation flow

## For Production:

1. **Convert SVG to PNG/ICO**: Use online tools like:
   - https://favicon.io/favicon-converter/
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/

2. **Replace placeholder files**: 
   - Replace `favicon.ico` with actual ICO file
   - Replace `favicon-32x32.png` with actual PNG file
   - Replace `favicon-16x16.png` with actual PNG file

3. **Test across browsers**: Ensure the favicon displays correctly in:
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers
   - Different operating systems

## Current Setup:

The HTML includes comprehensive favicon support:
- SVG favicon for modern browsers
- ICO fallback for older browsers
- PNG versions for specific sizes
- Apple touch icon for iOS devices
- Web manifest for PWA features 