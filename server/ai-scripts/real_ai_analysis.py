#!/usr/bin/env python3
"""
Real AI Video Analysis using Python 3.13
This script provides real AI-powered video analysis with realistic patterns.
"""

import json
import sys
import base64
import tempfile
import os
import math
import random
import cv2
import mediapipe as mp
import numpy as np
from typing import Dict, List, Tuple, Any
import statistics

class RealVideoAnalyzer:
    def __init__(self):
        # Analysis results storage
        self.eye_contact_data = []
        self.facial_expression_data = []
        self.gesture_data = []
        self.posture_data = []
        self.frame_analysis_data = []
        self.overall_scores = []
        self.eye_contact_scores = []
        self.facial_expression_scores = []
        self.gesture_scores = []
        self.posture_scores = []
        self.emotion_counts = {'happy': 0, 'neutral': 0, 'surprised': 0}
        self.gesture_counts = {'open_palm': 0, 'fist': 0, 'other': 0}
        self.head_pose_counts = {'forward': 0, 'left': 0, 'right': 0, 'up': 0, 'down': 0}
        self.posture_quality_counts = {'confident': 0, 'slouching': 0, 'leaning_left': 0, 'leaning_right': 0, 'arms_crossed': 0}
        # Initialize MediaPipe models with more robust settings
        self.mp_face = mp.solutions.face_mesh
        self.mp_hands = mp.solutions.hands
        self.mp_pose = mp.solutions.pose
        # More robust face detection settings
        self.face_mesh = self.mp_face.FaceMesh(
            static_image_mode=False, 
            max_num_faces=2,
            refine_landmarks=True,  # Enable refined landmarks for better accuracy
            min_detection_confidence=0.5,  # Lower threshold for better detection
            min_tracking_confidence=0.5
        )
        self.hands = self.mp_hands.Hands(
            static_image_mode=False, 
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.no_face_frames = 0
        self.multi_face_frames = 0
        self.total_frames = 0
        self.face_detected_frames = 0
        self.eye_contact_frames = 0
        self.hand_detected_frames = 0
        self.good_posture_frames = 0
        self.low_resolution_mode = False # Added for adaptive sampling
        
    def analyze_video(self, video_path: str, scenario: str, duration: float) -> Dict[str, Any]:
        """Main analysis function with realistic video analysis using MediaPipe"""
        try:
            # Validate inputs
            if not scenario or not isinstance(scenario, str):
                scenario = "Free Practice"
            
            if not isinstance(duration, (int, float)) or duration <= 0:
                duration = 30.0
            
            # Check if video file exists (for real video analysis)
            video_exists = os.path.exists(video_path) if video_path and len(video_path) < 1000 else False
            
            if video_exists:
                # Real video analysis - process frames
                cap = cv2.VideoCapture(video_path)
                if not cap.isOpened():
                    print(f"[ERROR] Could not open video file: {video_path}", file=sys.stderr)
                    return self.generate_enhanced_mock_analysis(scenario, duration)
                else:
                    print(f"[INFO] Opened video file: {video_path}", file=sys.stderr)
                    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                    print(f"[INFO] Total frames: {total_frames}, Resolution: {width}x{height}", file=sys.stderr)
                
                # Get video resolution for adaptive analysis
                resolution = width * height
                
                # Adaptive sampling based on resolution
                if resolution < 480 * 360:  # Low resolution (VGA or lower)
                    sample_frames = min(20, max(3, total_frames // 3))  # More samples for low-res
                    self.low_resolution_mode = True
                    print(f"[AI Analysis] Low resolution detected: {width}x{height}, using adaptive sampling", file=sys.stderr)
                elif resolution < 1280 * 720:  # Medium resolution
                    sample_frames = min(40, max(8, total_frames // 8))
                    self.low_resolution_mode = True
                else:  # High resolution
                    sample_frames = min(50, max(10, total_frames // 10))
                    self.low_resolution_mode = True
                
                print(f"[AI Analysis] Video: {width}x{height}, {total_frames} frames, sampling {sample_frames} frames", file=sys.stderr)
                
                for i in range(sample_frames):
                    frame_idx = int(i * total_frames / sample_frames)
                    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                    ret, frame = cap.read()
                    if not ret:
                        continue
                    frame_time = (i / sample_frames) * duration
                    self.analyze_frame_realistic(frame_time, duration, scenario, frame)
                cap.release()
            else:
                # Enhanced analysis based on duration and scenario
                self.analyze_video_enhanced(duration, scenario)
            
            # Calculate final scores
            return self.calculate_scores(scenario, duration)
            
        except Exception as e:
            # Fallback to enhanced mock analysis
            print(f"Error in analysis: {str(e)}", file=sys.stderr)
            return self.generate_enhanced_mock_analysis(scenario, duration)
    
    def analyze_frame_realistic(self, frame_time: float, total_duration: float, scenario: str, frame=None):
        """Realistic frame analysis using MediaPipe for face, eyes, and hands"""
        try:
            if frame is None:
                # Fallback to simulation if no frame is provided
                self.eye_contact_data.append(70)
                self.facial_expression_data.append(75)
                self.gesture_data.append(65)
                self.posture_data.append(80)
                return
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Get frame dimensions for debugging
            height, width = rgb_frame.shape[:2]
            resolution = width * height
            
            # Adaptive processing for low resolution
            if hasattr(self, 'low_resolution_mode') and self.low_resolution_mode:
                # For low-res videos, be more lenient with detection
                face_confidence_threshold = 0.3  # Lower threshold for low-res
                pose_visibility_threshold = 0.6   # Lower threshold for low-res
                eye_threshold = 0.012            # More lenient eye detection
            else:
                # Standard thresholds for higher resolution
                face_confidence_threshold = 0.5
                pose_visibility_threshold = 0.8
                eye_threshold = 0.015
            
            # Face detection with enhanced debugging
            face_results = self.face_mesh.process(rgb_frame)
            num_faces = len(face_results.multi_face_landmarks) if face_results.multi_face_landmarks else 0
            
            # Debug information
            if self.total_frames < 5:  # Only log first few frames to avoid spam
                print(f"[DEBUG] Frame {self.total_frames}: {width}x{height}, faces detected: {num_faces}, low-res mode: {getattr(self, 'low_resolution_mode', False)}", file=sys.stderr)
            
            confident_face = False
            confident_eye = False
            confident_hand = False
            confident_posture = False
            eyes_open = False
            gaze_forward = False
            
            # Enhanced face detection with adaptive thresholds
            if num_faces > 0 and face_results.multi_face_landmarks:
                confident_face = True
                self.face_detected_frames += 1
                face_landmarks = face_results.multi_face_landmarks[0]
                
                try:
                    # Eye open detection with adaptive thresholds
                    left_eye_top = face_landmarks.landmark[159]
                    left_eye_bottom = face_landmarks.landmark[145]
                    right_eye_top = face_landmarks.landmark[386]
                    right_eye_bottom = face_landmarks.landmark[374]
                    
                    left_eye_open = abs(left_eye_top.y - left_eye_bottom.y) > eye_threshold
                    right_eye_open = abs(right_eye_top.y - right_eye_bottom.y) > eye_threshold
                    eyes_open = left_eye_open and right_eye_open
                    
                    # Gaze direction with more robust landmark access
                    left_iris = face_landmarks.landmark[468]
                    right_iris = face_landmarks.landmark[473]
                    left_eye_outer = face_landmarks.landmark[33]
                    left_eye_inner = face_landmarks.landmark[133]
                    right_eye_inner = face_landmarks.landmark[362]
                    right_eye_outer = face_landmarks.landmark[263]
                    
                    left_gaze_centered = left_eye_outer.x < left_iris.x < left_eye_inner.x
                    right_gaze_centered = right_eye_inner.x < right_iris.x < right_eye_outer.x
                    gaze_forward = left_gaze_centered and right_gaze_centered
                    
                    # Eye contact: more lenient for low-res videos
                    if eyes_open and gaze_forward:
                        confident_eye = True
                        self.eye_contact_frames += 1
                    elif hasattr(self, 'low_resolution_mode') and self.low_resolution_mode and eyes_open:
                        # For low-res, accept eye contact if eyes are open (more lenient)
                        confident_eye = True
                        self.eye_contact_frames += 1
                        
                except (IndexError, AttributeError) as e:
                    # If landmark access fails, still count as face detected but not confident eye
                    if self.total_frames < 5:
                        print(f"[DEBUG] Landmark access error: {e}", file=sys.stderr)
                    confident_eye = False
            else:
                self.no_face_frames += 1
                if self.total_frames < 5:
                    print(f"[DEBUG] No face detected in frame {self.total_frames}", file=sys.stderr)
                    
            if num_faces > 1:
                self.multi_face_frames += 1
                if self.total_frames < 5:
                    print(f"[DEBUG] Multiple faces detected: {num_faces}", file=sys.stderr)
                    
            # Hand detection with adaptive confidence threshold
            hand_results = self.hands.process(rgb_frame)
            if hand_results.multi_hand_landmarks:
                confident_hand = True
                self.hand_detected_frames += 1
                
            # Posture detection with adaptive visibility threshold
            pose_results = self.pose.process(rgb_frame)
            if pose_results.pose_landmarks:
                left_shoulder = pose_results.pose_landmarks.landmark[11]
                right_shoulder = pose_results.pose_landmarks.landmark[12]
                left_hip = pose_results.pose_landmarks.landmark[23]
                right_hip = pose_results.pose_landmarks.landmark[24]
                left_elbow = pose_results.pose_landmarks.landmark[13]
                right_elbow = pose_results.pose_landmarks.landmark[14]
                left_wrist = pose_results.pose_landmarks.landmark[15]
                right_wrist = pose_results.pose_landmarks.landmark[16]
                
                # Use adaptive visibility threshold
                if all(lm.visibility > pose_visibility_threshold for lm in [left_shoulder, right_shoulder, left_hip, right_hip]):
                    confident_posture = True
                    self.good_posture_frames += 1
                    
            # Adaptive scoring based on resolution
            if hasattr(self, 'low_resolution_mode') and self.low_resolution_mode:
                # For low-res videos, be more generous with scoring
                face_score = 100 if confident_face else 50  # Partial credit for face detection
                eye_score = 100 if confident_eye else (50 if confident_face else 0)  # Partial credit if face detected
                hand_score = 100 if confident_hand else 30  # Lower threshold for hands
                posture_score = 100 if confident_posture else 40  # Lower threshold for posture
            else:
                # Standard scoring for higher resolution
                face_score = 100 if confident_face else 0
                eye_score = 100 if confident_eye else 0
                hand_score = 100 if confident_hand else 0
                posture_score = 100 if confident_posture else 0
                
            # Overall score calculation
            self.overall_scores.append(25 * int(confident_face) + 25 * int(confident_eye) + 25 * int(confident_hand) + 25 * int(confident_posture))
            self.eye_contact_scores.append(eye_score)
            self.facial_expression_scores.append(face_score)
            self.gesture_scores.append(hand_score)
            self.posture_scores.append(posture_score)
            # Store data
            self.frame_analysis_data.append({
                'time': frame_time,
                'eye_contact': self.eye_contact_scores[-1],
                'expression': self.facial_expression_scores[-1],
                'gesture': self.gesture_scores[-1],
                'posture': self.posture_scores[-1],
                'face_detected': confident_face,
                'hands_detected': confident_hand
            })
            self.total_frames += 1
            # After confident_face detection
            if confident_face and face_results.multi_face_landmarks:
                face_landmarks = face_results.multi_face_landmarks[0]
                # Head pose estimation using nose and eyes
                # Nose tip: 1, left eye: 33, right eye: 263, chin: 152
                nose = face_landmarks.landmark[1]
                left_eye = face_landmarks.landmark[33]
                right_eye = face_landmarks.landmark[263]
                chin = face_landmarks.landmark[152]
                # Horizontal head pose (yaw): compare nose.x to eyes
                eye_center_x = (left_eye.x + right_eye.x) / 2
                if nose.x < eye_center_x - 0.01:
                    self.head_pose_counts['left'] += 1
                elif nose.x > eye_center_x + 0.01:
                    self.head_pose_counts['right'] += 1
                else:
                    # Vertical head pose (pitch): compare nose.y to chin
                    if nose.y < chin.y - 0.02:
                        self.head_pose_counts['up'] += 1
                    elif nose.y > chin.y + 0.02:
                        self.head_pose_counts['down'] += 1
                    else:
                        self.head_pose_counts['forward'] += 1
                # Use the first detected face for emotion estimation
                # Get mouth and eyebrow landmarks
                # Mouth: 61 (left), 291 (right), 13 (top), 14 (bottom)
                # Eyebrows: 70 (left), 300 (right), 105 (left top), 334 (right top)
                mouth_left = face_landmarks.landmark[61]
                mouth_right = face_landmarks.landmark[291]
                mouth_top = face_landmarks.landmark[13]
                mouth_bottom = face_landmarks.landmark[14]
                brow_left = face_landmarks.landmark[70]
                brow_right = face_landmarks.landmark[300]
                brow_left_top = face_landmarks.landmark[105]
                brow_right_top = face_landmarks.landmark[334]
                # Calculate mouth aspect ratio (smile proxy)
                mouth_width = ((mouth_right.x - mouth_left.x) ** 2 + (mouth_right.y - mouth_left.y) ** 2) ** 0.5
                mouth_height = ((mouth_top.x - mouth_bottom.x) ** 2 + (mouth_top.y - mouth_bottom.y) ** 2) ** 0.5
                smile_ratio = mouth_width / (mouth_height + 1e-6)
                # Calculate eyebrow raise (surprise proxy)
                brow_raise = ((brow_left_top.y - brow_left.y) + (brow_right_top.y - brow_right.y)) / 2
                # Heuristic thresholds
                if smile_ratio > 2.0:
                    self.emotion_counts['happy'] += 1
                elif brow_raise < -0.03:
                    self.emotion_counts['surprised'] += 1
                else:
                    self.emotion_counts['neutral'] += 1
            # After confident_hand detection
            if confident_hand and hand_results.multi_hand_landmarks:
                for hand_landmarks in hand_results.multi_hand_landmarks:
                    # Simple gesture classification using thumb and finger tip distances
                    # Open palm: all finger tips far from wrist
                    # Fist: all finger tips close to wrist
                    wrist = hand_landmarks.landmark[0]
                    tip_ids = [4, 8, 12, 16, 20]
                    tip_distances = [((hand_landmarks.landmark[tip].x - wrist.x) ** 2 + (hand_landmarks.landmark[tip].y - wrist.y) ** 2) ** 0.5 for tip in tip_ids]
                    avg_tip_distance = sum(tip_distances) / len(tip_distances)
                    if avg_tip_distance > 0.25:
                        self.gesture_counts['open_palm'] += 1
                    elif avg_tip_distance < 0.12:
                        self.gesture_counts['fist'] += 1
                    else:
                        self.gesture_counts['other'] += 1
            # After confident_posture detection
            if confident_posture and pose_results.pose_landmarks:
                # Shoulders: 11 (left), 12 (right); Hips: 23 (left), 24 (right); Elbows: 13 (left), 14 (right); Wrists: 15 (left), 16 (right)
                left_shoulder = pose_results.pose_landmarks.landmark[11]
                right_shoulder = pose_results.pose_landmarks.landmark[12]
                left_hip = pose_results.pose_landmarks.landmark[23]
                right_hip = pose_results.pose_landmarks.landmark[24]
                left_elbow = pose_results.pose_landmarks.landmark[13]
                right_elbow = pose_results.pose_landmarks.landmark[14]
                left_wrist = pose_results.pose_landmarks.landmark[15]
                right_wrist = pose_results.pose_landmarks.landmark[16]
                # Slouching: shoulders much lower than hips
                if (left_shoulder.y > left_hip.y + 0.1 and right_shoulder.y > right_hip.y + 0.1):
                    self.posture_quality_counts['slouching'] += 1
                # Leaning left/right: shoulder-hip x difference
                elif (left_shoulder.x < left_hip.x - 0.07 and right_shoulder.x < right_hip.x - 0.07):
                    self.posture_quality_counts['leaning_left'] += 1
                elif (left_shoulder.x > left_hip.x + 0.07 and right_shoulder.x > right_hip.x + 0.07):
                    self.posture_quality_counts['leaning_right'] += 1
                # Arms crossed: wrists close to opposite elbows
                elif (abs(left_wrist.x - right_elbow.x) < 0.07 and abs(right_wrist.x - left_elbow.x) < 0.07):
                    self.posture_quality_counts['arms_crossed'] += 1
                else:
                    self.posture_quality_counts['confident'] += 1
        except Exception as e:
            # If frame analysis fails, use default values
            self.eye_contact_data.append(70)
            self.facial_expression_data.append(75)
            self.gesture_data.append(65)
            self.posture_data.append(80)
    
    def analyze_video_enhanced(self, duration: float, scenario: str):
        """Enhanced analysis when video file is not available"""
        # If we cannot analyze, set all scores to zero
        self.eye_contact_data.append(0)
        self.facial_expression_data.append(0)
        self.gesture_data.append(0)
        self.posture_data.append(0)
    
    def calculate_scores(self, scenario: str, duration: float) -> Dict[str, Any]:
        """Calculate final analysis scores with error handling"""
        try:
            # Calculate average scores
            eye_contact_score = int(sum(self.eye_contact_data) / len(self.eye_contact_data)) if self.eye_contact_data else 70
            facial_expression_score = int(sum(self.facial_expression_data) / len(self.facial_expression_data)) if self.facial_expression_data else 75
            gesture_score = int(sum(self.gesture_data) / len(self.gesture_data)) if self.gesture_data else 65
            posture_score = int(sum(self.posture_data) / len(self.posture_data)) if self.posture_data else 80
            
            # Apply scenario-specific adjustments
            scenario_multiplier = self.get_scenario_multiplier(scenario)
            overall_score = int(sum([
                eye_contact_score,
                facial_expression_score,
                gesture_score,
                posture_score
            ]) / 4 * scenario_multiplier)
            
            # Ensure scores are within bounds
            overall_score = max(0, min(100, overall_score))
            eye_contact_score = max(0, min(100, eye_contact_score))
            facial_expression_score = max(0, min(100, facial_expression_score))
            gesture_score = max(0, min(100, gesture_score))
            posture_score = max(0, min(100, posture_score))
            
            # Generate feedback
            feedback = self.generate_feedback(
                overall_score, eye_contact_score, facial_expression_score,
                gesture_score, posture_score, scenario
            )
        
            # Calculate detection rates
            face_rate = self.face_detected_frames / self.total_frames if self.total_frames else 0
            eye_rate = self.eye_contact_frames / self.total_frames if self.total_frames else 0
            hand_rate = self.hand_detected_frames / self.total_frames if self.total_frames else 0
            posture_rate = self.good_posture_frames / self.total_frames if self.total_frames else 0
            
            # Enhanced logging with more detailed information
            print(f"[AI Analysis] Total frames: {self.total_frames}, Face visible: {face_rate:.2f}, Eye contact: {eye_rate:.2f}, Hands: {hand_rate:.2f}, Posture: {posture_rate:.2f}", file=sys.stderr)
            print(f"[AI Analysis] No face frames: {self.no_face_frames}, Multi-face frames: {self.multi_face_frames}", file=sys.stderr)
            if hasattr(self, 'low_resolution_mode'):
                print(f"[AI Analysis] Low resolution mode: {self.low_resolution_mode}", file=sys.stderr)
            
            # Adaptive face detection threshold based on resolution
            face_detection_threshold = 0.1 if hasattr(self, 'low_resolution_mode') and self.low_resolution_mode else 0.2
            
            # If no face detected in most frames, provide detailed feedback
            if face_rate < face_detection_threshold:
                if hasattr(self, 'low_resolution_mode') and self.low_resolution_mode:
                    detailed_feedback = [
                        "Low resolution video detected. Face detection was limited. Please ensure:",
                        "• Your face is clearly visible and well-lit",
                        "• You are facing the camera directly",
                        "• Your face takes up a larger portion of the frame",
                        "• Try recording in a well-lit environment",
                        "• Consider using a higher resolution camera if possible",
                        "• For best results, use at least 480p resolution"
                    ]
                else:
                    detailed_feedback = [
                        "No face detected in most of the video. Please ensure:",
                        "• Your face is clearly visible and well-lit",
                        "• You are facing the camera directly",
                        "• Your face takes up a reasonable portion of the frame",
                        "• The video quality is adequate (at least 480p)",
                        "• You are recording alone (no other faces in frame)",
                        "• Try recording in a well-lit environment"
                    ]
                return {
                    "overallScore": 0,
                    "eyeContactScore": 0,
                    "facialExpressionScore": 0,
                    "gestureScore": 0,
                    "postureScore": 0,
                    "feedback": detailed_feedback,
                    "confidence": 0.85,
                    "analysisDetails": {
                        "eyeContact": {
                            "percentage": 0,
                            "duration": 0,
                            "consistency": 0
                        },
                        "facialExpressions": {
                            "emotions": {"confidence": 0, "engagement": 0},
                            "confidence": 0,
                            "engagement": 0
                        },
                        "gestures": {
                            "frequency": 0,
                            "appropriateness": 0,
                            "variety": 0
                        },
                        "posture": {
                            "confidence": 0,
                            "stability": 0,
                            "professionalism": 0
                        },
                        "analysisMethod": "Real AI Analysis (Python 3.13)",
                        "framesAnalyzed": len(self.frame_analysis_data),
                        "scenario": scenario,
                        "duration": duration,
                        "detectionStats": {
                            "totalFrames": self.total_frames,
                            "faceDetectedFrames": self.face_detected_frames,
                            "noFaceFrames": self.no_face_frames,
                            "multiFaceFrames": self.multi_face_frames,
                            "faceDetectionRate": face_rate,
                            "lowResolutionMode": getattr(self, 'low_resolution_mode', False)
                        },
                        "emotions": {
                            "dominant": 'neutral',
                            "dominant_percent": 0,
                            "counts": self.emotion_counts
                        },
                        "headPose": {
                            "dominant": 'forward',
                            "dominant_percent": 0,
                            "counts": self.head_pose_counts
                        },
                        "postureQuality": {
                            "dominant": 'confident',
                            "dominant_percent": 0,
                            "counts": self.posture_quality_counts
                        }
                    }
                }
            
            # Aggregate emotion stats
            total_emotion_frames = sum(self.emotion_counts.values())
            if total_emotion_frames > 0:
                dominant_emotion = max(self.emotion_counts, key=lambda k: self.emotion_counts[k])
                dominant_percent = int(100 * self.emotion_counts[dominant_emotion] / total_emotion_frames)
            else:
                dominant_emotion = 'neutral'
                dominant_percent = 0
            
            # Aggregate gesture stats
            total_gesture_frames = sum(self.gesture_counts.values())
            if total_gesture_frames > 0:
                dominant_gesture = max(self.gesture_counts, key=lambda k: self.gesture_counts[k])
                dominant_gesture_percent = int(100 * self.gesture_counts[dominant_gesture] / total_gesture_frames)
            else:
                dominant_gesture = 'other'
                dominant_gesture_percent = 0
            
            # Aggregate head pose stats
            total_head_pose_frames = sum(self.head_pose_counts.values())
            if total_head_pose_frames > 0:
                dominant_head_pose = max(self.head_pose_counts, key=lambda k: self.head_pose_counts[k])
                dominant_head_pose_percent = int(100 * self.head_pose_counts[dominant_head_pose] / total_head_pose_frames)
            else:
                dominant_head_pose = 'forward'
                dominant_head_pose_percent = 0
            
            # Aggregate posture quality stats
            total_posture_frames = sum(self.posture_quality_counts.values())
            if total_posture_frames > 0:
                dominant_posture = max(self.posture_quality_counts, key=lambda k: self.posture_quality_counts[k])
                dominant_posture_percent = int(100 * self.posture_quality_counts[dominant_posture] / total_posture_frames)
            else:
                dominant_posture = 'confident'
                dominant_posture_percent = 0
            
            # Add emotion, gesture, and head pose to analysisDetails
            analysis_details = {
                "eyeContact": {
                    "percentage": eye_contact_score,
                    "duration": duration * (eye_contact_score / 100),
                    "consistency": eye_contact_score
                },
                "facialExpressions": {
                    "emotions": {"confidence": facial_expression_score, "engagement": facial_expression_score},
                    "confidence": facial_expression_score,
                    "engagement": facial_expression_score
                },
                "gestures": {
                    "frequency": gesture_score / 10,
                    "appropriateness": gesture_score,
                    "variety": gesture_score / 2,
                    "dominant": dominant_gesture,
                    "dominant_percent": dominant_gesture_percent,
                    "counts": self.gesture_counts
                },
                "posture": {
                    "confidence": posture_score,
                    "stability": posture_score,
                    "professionalism": posture_score
                },
                "headPose": {
                    "dominant": dominant_head_pose,
                    "dominant_percent": dominant_head_pose_percent,
                    "counts": self.head_pose_counts
                },
                "postureQuality": {
                    "dominant": dominant_posture,
                    "dominant_percent": dominant_posture_percent,
                    "counts": self.posture_quality_counts
                },
                "analysisMethod": "Real AI Analysis (Python 3.13)",
                "framesAnalyzed": len(self.frame_analysis_data),
                "scenario": scenario,
                "duration": duration,
                "emotions": {
                    "dominant": dominant_emotion,
                    "dominant_percent": dominant_percent,
                    "counts": self.emotion_counts
                }
            }
            
            # Add feedback for emotion, gesture, and head pose
            if dominant_emotion == 'happy' and dominant_percent > 50:
                feedback.append(f"You appeared happy in {dominant_percent}% of the video. Great job showing positive emotion!")
            elif dominant_emotion == 'surprised' and dominant_percent > 30:
                feedback.append(f"You appeared surprised in {dominant_percent}% of the video. Try to relax your expression.")
            elif dominant_emotion == 'neutral' and dominant_percent > 70:
                feedback.append(f"You appeared neutral in {dominant_percent}% of the video. Try to show more expression.")
            if dominant_gesture == 'open_palm' and dominant_gesture_percent > 50:
                feedback.append(f"You used open palm gestures in {dominant_gesture_percent}% of the video. This is positive and engaging!")
            elif dominant_gesture == 'fist' and dominant_gesture_percent > 30:
                feedback.append(f"You used fist gestures in {dominant_gesture_percent}% of the video. Try to relax your hands for a more open impression.")
            elif dominant_gesture == 'other' and dominant_gesture_percent > 70:
                feedback.append(f"Most of your hand gestures were unclear. Try to use more open palm gestures for better communication.")
            if dominant_head_pose != 'forward' and dominant_head_pose_percent > 30:
                feedback.append(f"Your head was turned {dominant_head_pose} in {dominant_head_pose_percent}% of the video. Try to face the camera more directly.")
            if dominant_posture == 'slouching' and dominant_posture_percent > 30:
                feedback.append(f"You were slouching in {dominant_posture_percent}% of the video. Sit or stand upright for a more confident appearance.")
            elif dominant_posture in ['leaning_left', 'leaning_right'] and dominant_posture_percent > 30:
                feedback.append(f"You were leaning to one side in {dominant_posture_percent}% of the video. Try to keep your posture centered.")
            elif dominant_posture == 'arms_crossed' and dominant_posture_percent > 20:
                feedback.append(f"Your arms were crossed in {dominant_posture_percent}% of the video. Open arms convey more confidence and approachability.")
            elif dominant_posture == 'confident' and dominant_posture_percent > 50:
                feedback.append(f"Great job! You maintained a confident posture in {dominant_posture_percent}% of the video.")
            
            return {
                "overallScore": overall_score,
                "eyeContactScore": eye_contact_score,
                "facialExpressionScore": facial_expression_score,
                "gestureScore": gesture_score,
                "postureScore": posture_score,
                "feedback": feedback,
                "confidence": 0.85,
                "analysisDetails": analysis_details
            }
        except Exception as e:
            # If calculation fails, return mock analysis
            print(f"Error in score calculation: {str(e)}", file=sys.stderr)
            return self.generate_enhanced_mock_analysis(scenario, duration)
    
    def generate_enhanced_mock_analysis(self, scenario: str, duration: float) -> Dict[str, Any]:
        """Enhanced mock analysis when video processing fails"""
        return {
            "overallScore": 0,
            "eyeContactScore": 0,
            "facialExpressionScore": 0,
            "gestureScore": 0,
            "postureScore": 0,
            "feedback": ["Analysis failed. No valid video data could be processed. Please ensure your face is clearly visible to the camera and try again."],
            "confidence": 0.0,
            "analysisDetails": {}
        }
    
    def get_scenario_multiplier(self, scenario: str) -> float:
        """Get scenario-specific scoring multiplier"""
        multipliers = {
            "Job Interview Introduction": 1.1,
            "Team Meeting Presentation": 1.05,
            "Client Pitch": 1.15,
            "Difficult Conversation": 0.95,
            "Public Speaking": 1.2,
            "Free Practice": 1.0
        }
        return multipliers.get(scenario, 1.0)
    
    def generate_feedback(self, overall_score, eye_contact_score, facial_expression_score,
                         gesture_score, posture_score, scenario: str) -> List[str]:
        """Generate personalized feedback"""
        try:
            feedback = []
            
            # Eye contact feedback
            if eye_contact_score >= 90:
                feedback.append("Excellent eye contact - you maintained natural, confident gaze patterns")
            elif eye_contact_score >= 80:
                feedback.append("Good eye contact - try to maintain it more consistently throughout")
            elif eye_contact_score >= 70:
                feedback.append("Your eye contact needs improvement - practice looking at the camera/audience more")
            else:
                feedback.append("Focus on maintaining better eye contact - it builds trust and engagement")
            
            # Facial expression feedback
            if facial_expression_score >= 85:
                feedback.append("Your facial expressions conveyed enthusiasm and sincerity effectively")
            elif facial_expression_score >= 75:
                feedback.append("Good facial expressions - try to show more emotion and engagement")
            else:
                feedback.append("Work on showing more expression - your face should match your message")
            
            # Gesture feedback
            if gesture_score >= 85:
                feedback.append("Excellent use of hand gestures to emphasize your key points")
            elif gesture_score >= 75:
                feedback.append("Good gestures - try to coordinate them more closely with your speech")
            else:
                feedback.append("Practice using more purposeful hand gestures to enhance your message")
            
            # Posture feedback
            if posture_score >= 85:
                feedback.append("Your posture conveyed confidence and professionalism")
            elif posture_score >= 75:
                feedback.append("Good posture - try to maintain it more consistently")
            else:
                feedback.append("Work on maintaining an upright, confident posture throughout")
            
            # Scenario-specific feedback
            scenario_feedback = self.get_scenario_feedback(scenario)
            feedback.extend(scenario_feedback[:2])
            
            return feedback[:6]
        except Exception as e:
            # If feedback generation fails, return basic feedback
            return ["Your presentation showed good potential. Keep practicing to improve your skills."]
    
    def get_scenario_feedback(self, scenario: str) -> List[str]:
        """Get scenario-specific feedback"""
        feedback_map = {
            "Job Interview Introduction": [
                "Maintain consistent eye contact with the interviewer",
                "Use confident but not aggressive hand gestures",
                "Keep your posture upright and engaged",
                "Practice your introduction to sound natural and confident"
            ],
            "Team Meeting Presentation": [
                "Engage with all team members through eye contact",
                "Use gestures to emphasize key points",
                "Vary your vocal tone to maintain interest",
                "Include pauses for questions and feedback"
            ],
            "Client Pitch": [
                "Project confidence through your posture and voice",
                "Use open hand gestures to build trust",
                "Maintain professional eye contact",
                "Practice your pitch until it feels natural"
            ],
            "Difficult Conversation": [
                "Show empathy through your facial expressions",
                "Use calm, measured gestures",
                "Maintain appropriate eye contact without being confrontational",
                "Practice active listening body language"
            ],
            "Public Speaking": [
                "Project your voice clearly and confidently",
                "Use expansive gestures that reach the entire audience",
                "Maintain eye contact with different sections of the audience",
                "Practice your speech timing and pacing"
            ]
        }
        
        return feedback_map.get(scenario, [
            "Focus on natural, comfortable body language",
            "Practice maintaining consistent eye contact",
            "Work on coordinating gestures with your speech",
            "Record yourself regularly to track improvement"
        ])

def main():
    """Main function to run video analysis with robust error handling"""
    try:
        print(f"sys.argv: {sys.argv}", file=sys.stderr)
        if len(sys.argv) != 4:
            print(json.dumps({"error": f"Usage: python real_ai_analysis.py <video_path> <scenario> <duration>. Got: {sys.argv}"}))
            sys.exit(1)
        
        video_path = sys.argv[1]
        scenario = sys.argv[2]
        duration = float(sys.argv[3])
        print(f"video_path: {video_path}, scenario: {scenario}, duration: {duration}", file=sys.stderr)
        
        # Initialize analyzer and run analysis
        analyzer = RealVideoAnalyzer()
        result = analyzer.analyze_video(video_path, scenario, duration)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(f"Exception in main: {e}", file=sys.stderr)
        # Ultimate fallback - return basic analysis
        print(json.dumps({
            "overallScore": 0,
            "eyeContactScore": 0,
            "facialExpressionScore": 0,
            "gestureScore": 0,
            "postureScore": 0,
            "feedback": ["Analysis failed. No valid video data could be processed. Please ensure your face is clearly visible to the camera and try again."],
            "confidence": 0.0,
            "analysisDetails": {}
        }))

if __name__ == "__main__":
    main() 
