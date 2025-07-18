#!/usr/bin/env python3
"""
Video Analysis Script (YOLOv8 Only, No OpenCV, No NumPy)
- Uses YOLOv8 (ultralytics) for person detection and analysis
- Uses imageio for video frame extraction (no cv2, no numpy)
- Compatible with Python 3.13+
"""

import json
import sys
import base64
import tempfile
import os
from ultralytics import YOLO
import imageio
from typing import Dict, Any

def mean(values):
    return sum(values) / len(values) if values else 0

def analyze_video(video_path: str, scenario: str, duration: float) -> Dict[str, Any]:
    # Initialize YOLOv8 model
    yolo_model = YOLO('yolov8n.pt')

    # Read video frames using imageio
    try:
        reader = imageio.get_reader(video_path)
    except Exception as e:
        return {"status": "error", "message": f"Could not open video file: {str(e)}"}
    total_frames = reader.count_frames()
    sample_frames = min(50, max(10, total_frames // 10))
    person_detected_frames = 0
    multi_person_frames = 0
    no_person_frames = 0
    for i in range(sample_frames):
        frame_idx = int(i * total_frames / sample_frames)
        try:
            frame = reader.get_data(frame_idx)
        except Exception:
            continue
        # YOLOv8 person detection
        yolo_results = yolo_model(frame, verbose=False)
        person_count = sum(1 for box in yolo_results[0].boxes if int(box.cls[0]) == 0)
        if person_count == 1:
            person_detected_frames += 1
        elif person_count > 1:
            multi_person_frames += 1
        else:
            no_person_frames += 1
    reader.close()
    if person_detected_frames == 0:
        return {"status": "error", "message": "No person detected in the video."}
    # Aggregate results
    person_score = int(100 * person_detected_frames / sample_frames)
    multi_person_score = int(100 * multi_person_frames / sample_frames)
    no_person_score = int(100 * no_person_frames / sample_frames)
    overall_score = person_score - multi_person_score
    feedback = []
    if person_score > 80:
        feedback.append("Excellent person visibility throughout the video.")
    elif person_score > 50:
        feedback.append("A person was detected in most frames. Try to stay in view of the camera.")
    else:
        feedback.append("A person was rarely detected. Please ensure you are visible to the camera.")
    if multi_person_score > 20:
        feedback.append("Multiple people detected in several frames. For best results, only one person should be visible.")
    if no_person_score > 20:
        feedback.append("No person detected in many frames. Try to stay in view of the camera.")
    return {
        "status": "success",
        "message": "Analysis completed successfully.",
        "overallScore": max(0, overall_score),
        "personScore": person_score,
        "multiPersonScore": multi_person_score,
        "noPersonScore": no_person_score,
        "feedback": feedback,
        "framesAnalyzed": sample_frames
    }

def main():
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python video_analysis_latest.py <video_path> <scenario> <duration>"}))
        sys.exit(1)
    video_path = sys.argv[1]
    scenario = sys.argv[2]
    duration = float(sys.argv[3])
    # Handle base64 encoded video data
    if video_path.startswith('data:video') or len(video_path) > 1000:
        try:
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                video_data = base64.b64decode(video_path)
                temp_file.write(video_data)
                temp_file_path = temp_file.name
            video_path = temp_file_path
        except Exception as e:
            print(json.dumps({"error": f"Failed to decode video data: {str(e)}"}))
            sys.exit(1)
    try:
        result = analyze_video(video_path, scenario, duration)
        if video_path != sys.argv[1]:
            os.unlink(video_path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"Analysis failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main() 
