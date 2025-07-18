// Add this at the top for Node.js type support
// If you see type errors for Node.js built-ins, ensure @types/node is installed and 'node' is in tsconfig.json types.
import axios from 'axios';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { Buffer } from 'buffer';

export interface AIAnalysisResult {
  overallScore: number;
  eyeContactScore: number;
  facialExpressionScore: number;
  gestureScore: number;
  postureScore: number;
  feedback: string[];
  confidence: number;
  analysisDetails: {
    eyeContact: {
      percentage: number;
      duration: number;
      consistency: number;
    };
    facialExpressions: {
      emotions: { [key: string]: number };
      confidence: number;
      engagement: number;
    };
    gestures: {
      frequency: number;
      appropriateness: number;
      variety: number;
    };
    posture: {
      confidence: number;
      stability: number;
      professionalism: number;
    };
  };
}

// Use 'python' for Windows compatibility
const PYTHON_PATH = 'python';
const PYTHON_ARGS: string[] = [];
const SCRIPT_PATH = join(process.cwd(), 'server', 'ai-scripts', 'ai_strict_video_analysis.py');
let pythonAvailable = false;

try {
  // Synchronous check for Python availability
  const pythonCheck = spawnSync(PYTHON_PATH, PYTHON_ARGS);
  pythonAvailable = pythonCheck.status === 0;
  console.log(`Python availability: ${pythonAvailable} (${PYTHON_PATH})`);
} catch (error) {
  console.log('Python not available, will use enhanced mock analysis');
  pythonAvailable = false;
}

export async function analyzeVideoWithAI(
  videoBuffer: Buffer,
  scenario: string,
  duration: number,
  mimeType?: string
): Promise<AIAnalysisResult> {
  try {
    // Convert video buffer to base64
    const videoData = videoBuffer.toString('base64');
    // Call the Flask AI service
    const response = await axios.post(
      process.env.AI_SERVICE_URL || 'http://tawasl-ai-video-analysis:8000/analyze',
      {
        video_path: videoData,
        scenario,
        duration
      },
      { timeout: 120000 } // 2 minute timeout for long video analysis
    );
    return response.data;
  } catch (error: any) {
    console.error('AI service error:', error.response?.data || error.message);
    // Return zero scores instead of mock analysis
    return {
      overallScore: 0,
      eyeContactScore: 0,
      facialExpressionScore: 0,
      gestureScore: 0,
      postureScore: 0,
      feedback: ["Analysis failed. Please ensure your video contains a clear view of one person."],
      confidence: 0.0,
      analysisDetails: {
        eyeContact: { percentage: 0, duration: 0, consistency: 0 },
        facialExpressions: { emotions: { confidence: 0, engagement: 0 }, confidence: 0, engagement: 0 },
        gestures: { frequency: 0, appropriateness: 0, variety: 0 },
        posture: { confidence: 0, stability: 0, professionalism: 0 }
      }
    };
  }
}

function generateEnhancedMockAnalysis(scenario: string, duration: number): AIAnalysisResult {
  const baseScore = Math.min(100, 60 + (duration / 60) * 20);
  const scenarioMultiplier = getScenarioMultiplier(scenario);
  const adjustedBaseScore = baseScore * scenarioMultiplier;
  
  const overallScore = Math.round(adjustedBaseScore);
  const eyeContactScore = Math.round(Math.max(0, Math.min(100, overallScore + (Math.random() - 0.5) * 20)));
  const facialExpressionScore = Math.round(Math.max(0, Math.min(100, overallScore + (Math.random() - 0.5) * 15)));
  const gestureScore = Math.round(Math.max(0, Math.min(100, overallScore + (Math.random() - 0.5) * 25)));
  const postureScore = Math.round(Math.max(0, Math.min(100, overallScore + (Math.random() - 0.5) * 10)));

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    eyeContactScore,
    facialExpressionScore,
    gestureScore,
    postureScore,
    feedback: generateFeedback(overallScore, eyeContactScore, facialExpressionScore, gestureScore, postureScore, scenario),
    confidence: pythonAvailable ? 0.6 : 0.8,
    analysisDetails: {
      eyeContact: {
        percentage: eyeContactScore,
        duration: duration * (eyeContactScore / 100),
        consistency: eyeContactScore
      },
      facialExpressions: {
        emotions: { 
          confidence: facialExpressionScore, 
          engagement: facialExpressionScore,
          enthusiasm: Math.round(facialExpressionScore * 0.9)
        },
        confidence: facialExpressionScore,
        engagement: facialExpressionScore
      },
      gestures: {
        frequency: gestureScore / 10,
        appropriateness: gestureScore,
        variety: gestureScore / 2
      },
      posture: {
        confidence: postureScore,
        stability: postureScore,
        professionalism: postureScore
      }
    }
  };
}

function getScenarioMultiplier(scenario: string): number {
  const multipliers: { [key: string]: number } = {
    "Job Interview Introduction": 1.1,
    "Team Meeting Presentation": 1.05,
    "Client Pitch": 1.15,
    "Difficult Conversation": 0.95,
    "Public Speaking": 1.2,
    "Free Practice": 1.0
  };
  return multipliers[scenario] || 1.0;
}

function generateFeedback(
  overallScore: number,
  eyeContactScore: number,
  facialExpressionScore: number,
  gestureScore: number,
  postureScore: number,
  scenario: string
): string[] {
  const feedback: string[] = [];

  if (eyeContactScore >= 90) {
    feedback.push("Excellent eye contact - you maintained natural, confident gaze patterns");
  } else if (eyeContactScore >= 80) {
    feedback.push("Good eye contact - try to maintain it more consistently throughout");
  } else if (eyeContactScore >= 70) {
    feedback.push("Your eye contact needs improvement - practice looking at the camera/audience more");
  } else {
    feedback.push("Focus on maintaining better eye contact - it builds trust and engagement");
  }

  if (facialExpressionScore >= 85) {
    feedback.push("Your facial expressions conveyed enthusiasm and sincerity effectively");
  } else if (facialExpressionScore >= 75) {
    feedback.push("Good facial expressions - try to show more emotion and engagement");
  } else {
    feedback.push("Work on showing more expression - your face should match your message");
  }

  if (gestureScore >= 85) {
    feedback.push("Excellent use of hand gestures to emphasize your key points");
  } else if (gestureScore >= 75) {
    feedback.push("Good gestures - try to coordinate them more closely with your speech");
  } else {
    feedback.push("Practice using more purposeful hand gestures to enhance your message");
  }

  if (postureScore >= 85) {
    feedback.push("Your posture conveyed confidence and professionalism");
  } else if (postureScore >= 75) {
    feedback.push("Good posture - try to maintain it more consistently");
  } else {
    feedback.push("Work on maintaining an upright, confident posture throughout");
  }

  const scenarioFeedback = getScenarioFeedback(scenario);
  feedback.push(...scenarioFeedback.slice(0, 2));

  return feedback.slice(0, 6);
}

function getScenarioFeedback(scenario: string): string[] {
  const feedbackMap: { [key: string]: string[] } = {
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
  };

  return feedbackMap[scenario] || [
    "Focus on natural, comfortable body language",
    "Practice maintaining consistent eye contact",
    "Work on coordinating gestures with your speech",
    "Record yourself regularly to track improvement"
  ];
}
