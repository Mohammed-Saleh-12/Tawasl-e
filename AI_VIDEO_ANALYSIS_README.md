# AI Video Analysis Implementation

## Overview

This implementation provides **real AI-powered video analysis** for the Tawasl Educational Platform using local computer vision and machine learning technologies. The system analyzes communication skills including eye contact, facial expressions, gestures, and posture.

## Features

### Real AI Analysis
- **Eye Contact Detection**: Analyzes gaze patterns and eye movement
- **Facial Expression Recognition**: Detects emotions and engagement levels
- **Gesture Analysis**: Tracks hand movements and gesture appropriateness
- **Posture Assessment**: Evaluates body positioning and confidence indicators

### Privacy-First Approach
- **Local Processing**: All analysis happens on your server
- **No External APIs**: No data sent to third-party services
- **GDPR Compliant**: Full control over user data

### Performance Optimized
- **Frame Sampling**: Analyzes every 10th frame for efficiency
- **Fallback System**: Graceful degradation if AI processing fails
- **Real-time Feedback**: Quick analysis results

## Technology Stack

### Core Technologies
- **OpenCV**: Computer vision and image processing
- **MediaPipe**: Google's ML framework for face, hand, and pose detection
- **Python**: AI processing backend
- **TypeScript/Node.js**: API integration

### Dependencies
```
opencv-python==4.8.1.78
mediapipe==0.10.7
numpy==1.24.3
```

## Installation

### Prerequisites
1. **Python 3.8+** installed on your system
2. **pip** package manager
3. **Node.js** and npm (already configured)

### Setup Steps

1. **Run the setup script**:
   ```powershell
   .\setup-ai.ps1
   ```

2. **Manual installation** (if script fails):
   ```bash
   pip install -r server/ai-scripts/requirements.txt
   ```

3. **Verify installation**:
   ```bash
   python server/ai-scripts/video_analysis.py --help
   ```

## How It Works

### 1. Video Processing Pipeline
```
User Records Video → Convert to Base64 → Send to Server → 
Save as Temp File → Python AI Analysis → Return Results → 
Save to Database → Display to User
```

### 2. AI Analysis Process
1. **Frame Extraction**: Sample frames from video for analysis
2. **Face Detection**: MediaPipe face mesh for facial landmarks
3. **Hand Tracking**: MediaPipe hands for gesture analysis
4. **Pose Estimation**: MediaPipe pose for body posture
5. **Score Calculation**: Convert AI data to meaningful scores
6. **Feedback Generation**: Create personalized improvement tips

### 3. Analysis Metrics

#### Eye Contact Score (0-100)
- **90-100**: Excellent eye contact patterns
- **80-89**: Good eye contact with room for improvement
- **70-79**: Needs improvement in eye contact
- **0-69**: Focus on maintaining better eye contact

#### Facial Expression Score (0-100)
- **85-100**: Excellent emotional expression
- **75-84**: Good expressions with engagement
- **0-74**: Work on showing more expression

#### Gesture Score (0-100)
- **85-100**: Excellent hand gesture usage
- **75-84**: Good gestures with coordination
- **0-74**: Practice purposeful gestures

#### Posture Score (0-100)
- **85-100**: Excellent confident posture
- **75-84**: Good posture with consistency
- **0-74**: Work on upright, confident stance

## API Integration

### Request Format
```typescript
POST /api/video-analyses
{
  "videoData": "base64_encoded_video_data",
  "scenario": "Job Interview Introduction",
  "duration": 45
}
```

### Response Format
```typescript
{
  "message": "Video analysis completed successfully",
  "analysis": {
    "id": 1,
    "overallScore": 85,
    "eyeContactScore": 90,
    "facialExpressionScore": 80,
    "gestureScore": 75,
    "postureScore": 85,
    "feedback": ["Excellent eye contact...", "Good facial expressions..."]
  },
  "aiDetails": {
    "eyeContact": { "percentage": 90, "duration": 40.5, "consistency": 90 },
    "facialExpressions": { "confidence": 80, "engagement": 80 },
    "gestures": { "frequency": 7.5, "appropriateness": 75, "variety": 37.5 },
    "posture": { "confidence": 85, "stability": 85, "professionalism": 85 }
  },
  "confidence": 0.85
}
```

## Scenario-Specific Analysis

The AI adapts its analysis based on the communication scenario:

### Job Interview Introduction
- Higher expectations for eye contact and confidence
- Focus on professional posture and gestures
- Emphasis on natural, confident delivery

### Team Meeting Presentation
- Balanced scoring across all metrics
- Focus on engagement with multiple people
- Emphasis on clear communication

### Client Pitch
- Highest expectations for confidence indicators
- Focus on trust-building gestures
- Emphasis on professional presentation

### Difficult Conversation
- More forgiving scoring for emotional scenarios
- Focus on empathy and active listening
- Emphasis on appropriate body language

### Public Speaking
- Highest overall expectations
- Focus on audience engagement
- Emphasis on voice projection and gestures

## Troubleshooting

### Common Issues

1. **Python not found**
   - Install Python 3.8+ from https://python.org
   - Ensure Python is in your system PATH

2. **MediaPipe installation fails**
   - Update pip: `pip install --upgrade pip`
   - Install Visual C++ build tools (Windows)
   - Try: `pip install mediapipe --no-cache-dir`

3. **Analysis fails**
   - Check video format (MP4 recommended)
   - Ensure video has clear face visibility
   - Check server logs for detailed errors

4. **Slow performance**
   - Reduce video resolution
   - Shorten video duration
   - Check server CPU/memory usage

### Performance Optimization

1. **Video Quality**: Use 720p or lower for faster processing
2. **Duration**: Keep videos under 5 minutes for optimal performance
3. **Lighting**: Ensure good lighting for better face detection
4. **Camera Position**: Position camera at eye level for best results

## Security Considerations

- **Local Processing**: No video data leaves your server
- **Temporary Files**: Video files are deleted after analysis
- **No External Dependencies**: No API keys or external services required
- **Privacy Compliance**: Full GDPR and privacy compliance

## Future Enhancements

### Planned Features
- **Voice Analysis**: Tone and speech pattern analysis
- **Advanced Emotions**: More detailed emotion detection
- **Multi-person Analysis**: Support for group presentations
- **Real-time Analysis**: Live feedback during recording
- **Custom Scenarios**: User-defined analysis criteria

### Performance Improvements
- **GPU Acceleration**: CUDA support for faster processing
- **Batch Processing**: Multiple video analysis
- **Caching**: Cache analysis results for repeated videos
- **Optimization**: Further performance tuning

## Support

For technical support or questions about the AI video analysis:

1. Check the troubleshooting section above
2. Review server logs for error details
3. Test with a simple video first
4. Ensure all dependencies are properly installed

## License

This AI video analysis implementation is part of the Tawasl Educational Platform and follows the same licensing terms. 