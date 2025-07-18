#!/usr/bin/env python3
"""
Strict AI-Only Video Analysis Script
- Uses MediaPipe for face, hand, and pose detection
- Analyzes eyes (contact/open), facial expressions (emotion), hand movements (gesture), body position (posture)
- If any feature is not detected, its score is zero
- If no person is detected, all results are zero
- No simulation or random values
- Outputs detailed JSON results
"""

import json
import sys
import base64
import tempfile
import os
import cv2
import mediapipe as mp
import numpy as np
from typing import Dict, Any

def get_recommendations(overall, eye, face, gesture, posture):
    recs = []
    if overall < 60:
        recs.append("Practice more to improve your overall communication score.")
    if eye < 60:
        recs.append("Try to maintain better eye contact with the camera.")
    if face < 60:
        recs.append("Smile more and use expressive facial gestures.")
    if gesture < 60:
        recs.append("Incorporate more hand gestures to emphasize your points.")
    if posture < 60:
        recs.append("Sit or stand up straight to project confidence.")
    if not recs:
        recs.append("Great job! Keep practicing to maintain your strong communication skills.")
    return recs

def analyze(video_path, scenario, duration):
    # Handle base64 encoded video data
    if video_path.startswith('data:video') or len(video_path) > 1000:
        try:
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                video_data = base64.b64decode(video_path)
                temp_file.write(video_data)
                temp_file_path = temp_file.name
            video_path = temp_file_path
        except Exception as e:
            return {"error": f"Failed to decode video data: {str(e)}"}

    try:
        mp_face = mp.solutions.face_mesh
        mp_hands = mp.solutions.hands
        mp_pose = mp.solutions.pose

        face_mesh = mp_face.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)
        hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2)
        pose = mp_pose.Pose(static_image_mode=False)

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {
                "status": "error",
                "message": "Could not open video file.",
                "overallScore": 0,
                "eyeContactScore": 0,
                "facialExpressionScore": 0,
                "gestureScore": 0,
                "postureScore": 0,
                "feedback": ["Could not open video file."],
                "recommendations": get_recommendations(0, 0, 0, 0, 0)
            }

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        sample_frames = min(50, max(10, total_frames // 10))
        frame_indices = [int(i * total_frames / sample_frames) for i in range(sample_frames)]

        eye_scores = []
        expression_scores = []
        gesture_scores = []
        posture_scores = []
        valid_person_frames = 0

        for idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if not ret:
                continue
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_results = face_mesh.process(rgb_frame)
            hand_results = hands.process(rgb_frame)
            pose_results = pose.process(rgb_frame)

            # --- Person/Face detection ---
            if not face_results.multi_face_landmarks or len(face_results.multi_face_landmarks) == 0:
                # No face detected: all scores zero for this frame
                eye_scores.append(0)
                expression_scores.append(0)
                gesture_scores.append(0)
                posture_scores.append(0)
                continue
            valid_person_frames += 1
            face_landmarks = face_results.multi_face_landmarks[0]

            # --- Eye contact (very basic: eyes open) ---
            try:
                left_eye_top = face_landmarks.landmark[159]
                left_eye_bottom = face_landmarks.landmark[145]
                right_eye_top = face_landmarks.landmark[386]
                right_eye_bottom = face_landmarks.landmark[374]
                left_eye_open = abs(left_eye_top.y - left_eye_bottom.y) > 0.005
                right_eye_open = abs(right_eye_top.y - right_eye_bottom.y) > 0.005
                eyes_open = left_eye_open or right_eye_open
                eye_score = 100 if eyes_open else 0
            except Exception:
                eye_score = 0
            eye_scores.append(eye_score)

            # --- Facial expression (very basic: mouth open) ---
            try:
                mouth_top = face_landmarks.landmark[13]
                mouth_bottom = face_landmarks.landmark[14]
                mouth_open = abs(mouth_top.y - mouth_bottom.y) > 0.03
                expression_score = 100 if mouth_open else 60
            except Exception:
                expression_score = 0
            expression_scores.append(expression_score)

            # --- Hand gesture (any hand detected) ---
            gesture_score = 100 if hand_results.multi_hand_landmarks else 0
            gesture_scores.append(gesture_score)

            # --- Posture (shoulders visible) ---
            try:
                if pose_results.pose_landmarks:
                    left_shoulder = pose_results.pose_landmarks.landmark[11]
                    right_shoulder = pose_results.pose_landmarks.landmark[12]
                    if left_shoulder.visibility > 0.8 and right_shoulder.visibility > 0.8:
                        posture_score = 100
                    else:
                        posture_score = 0
                else:
                    posture_score = 0
            except Exception:
                posture_score = 0
            posture_scores.append(posture_score)

        cap.release()

        # If no valid person frames, all results are zero
        if valid_person_frames == 0:
            return {
                "status": "error",
                "message": "No person detected in the video.",
                "overallScore": 0,
                "eyeContactScore": 0,
                "facialExpressionScore": 0,
                "gestureScore": 0,
                "postureScore": 0,
                "feedback": ["No person detected in the video."],
                "recommendations": get_recommendations(0, 0, 0, 0, 0)
            }

        # Aggregate scores
        eye_contact_score = int(np.mean(eye_scores))
        facial_expression_score = int(np.mean(expression_scores))
        gesture_score = int(np.mean(gesture_scores))
        posture_score = int(np.mean(posture_scores))
        overall_score = int(np.mean([eye_contact_score, facial_expression_score, gesture_score, posture_score]))

        result = {
            "status": "success",
            "overallScore": overall_score,
            "eyeContactScore": eye_contact_score,
            "facialExpressionScore": facial_expression_score,
            "gestureScore": gesture_score,
            "postureScore": posture_score,
            "feedback": [],
            "recommendations": get_recommendations(overall_score, eye_contact_score, facial_expression_score, gesture_score, posture_score)
        }

        # Clean up temporary file if created
        if 'temp_file_path' in locals() and video_path == temp_file_path:
            os.unlink(video_path)
        return result

    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}

def main():
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python ai_strict_video_analysis.py <video_path> <scenario> <duration>"}))
        sys.exit(1)
    video_path = sys.argv[1]
    scenario = sys.argv[2]
    duration = float(sys.argv[3])
    result = analyze(video_path, scenario, duration)
    print(json.dumps(result))

if __name__ == "__main__":
    main() 
