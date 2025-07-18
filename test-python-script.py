#!/usr/bin/env python3
import json
import sys

def test_python():
    result = {
        "overallScore": 85,
        "eyeContactScore": 80,
        "facialExpressionScore": 85,
        "gestureScore": 75,
        "postureScore": 90,
        "feedback": [
            "Excellent eye contact - you maintained natural, confident gaze patterns",
            "Your facial expressions conveyed enthusiasm and sincerity effectively",
            "Good gestures - try to coordinate them more closely with your speech",
            "Your posture conveyed confidence and professionalism",
            "Maintain consistent eye contact with the interviewer",
            "Use confident but not aggressive hand gestures"
        ],
        "confidence": 0.85,
        "analysisDetails": {
            "eyeContact": {"percentage": 80, "duration": 24.0, "consistency": 80},
            "facialExpressions": {"emotions": {"confidence": 85, "engagement": 85}, "confidence": 85, "engagement": 85},
            "gestures": {"frequency": 7.5, "appropriateness": 75, "variety": 37.5},
            "posture": {"confidence": 90, "stability": 90, "professionalism": 90},
            "analysisMethod": "Test AI Analysis",
            "framesAnalyzed": 50
        }
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    test_python() 