import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiClient } from "@/lib/api";
import type { TestCategory, TestQuestion, TestResult } from "@shared/schema";

interface TestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  testCategory: TestCategory;
}

// Simple Modal Component
function SimpleModal({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '2px solid #e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px', 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '20px' 
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: 0, 
            color: '#111827',
            textShadow: 'none'
          }}>
            {title}
          </h2>
          <button
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L14 14M6 14L14 6" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ backgroundColor: '#ffffff' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TestModal({ isOpen, onOpenChange, testCategory }: TestModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(testCategory.duration * 60); // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery<TestQuestion[]>({
    queryKey: [`/test-categories/${testCategory.id}/questions`],
    queryFn: async () => {
      const response = await apiClient.get(`/test-categories/${testCategory.id}/questions`);
      return response.questions || [];
    },
    enabled: isOpen && testCategory.id > 0
  });

  const submitTestMutation = useMutation({
    mutationFn: async (testData: any) => {
      console.log('Mutation function called with data:', testData);
      const response = await apiClient.post("/test-results", testData);
      console.log('API response:', response);
      return response;
    },
    onSuccess: async (data) => {
      console.log('Mutation success with data:', data);
      setTestResult(data);
      setIsSubmitted(true);
      
      // Invalidate and refetch test results
      await queryClient.invalidateQueries({ queryKey: ["/test-results"] });
      await queryClient.refetchQueries({ queryKey: ["/test-results"] });
      
      toast({
        title: "Test Submitted",
        description: "Your test has been submitted successfully!"
      });
    },
    onError: (error: any) => {
      console.error('Test submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your test. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Timer effect
  useEffect(() => {
    if (!isOpen || isSubmitted || !testCategory) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitTest(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, testCategory, answers]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && testCategory) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setSelectedAnswer("");
      setTimeLeft(testCategory.duration * 60);
      setIsSubmitted(false);
      setTestResult(null);
    }
  }, [isOpen, testCategory]);

  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Save current answer
    const newAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer };
    setAnswers(newAnswers);

    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      if (questions) {
        const answeredQuestions = Object.keys(newAnswers).length;
        const totalQuestions = questions.length;
        if (answeredQuestions < totalQuestions) {
          toast({
            title: "Incomplete Test",
            description: `Please answer all ${totalQuestions} questions before submitting.`,
            variant: "destructive"
          });
          return;
        }
        handleSubmitTest(newAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || "");
    }
  };

  const handleSubmitTest = (finalAnswers = answers) => {
    if (!questions) {
      console.error('No questions available for submission');
      return;
    }

    console.log('Submitting test with data:', {
      categoryId: testCategory.id,
      questionsCount: questions.length,
      answersCount: Object.keys(finalAnswers).length,
      finalAnswers
    });

    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const testData = {
      categoryId: testCategory.id,
      score: correctCount,
      totalQuestions: questions.length,
      answers: finalAnswers,
      feedback: generateFeedback(correctCount, questions.length)
    };

    console.log('Submitting test data:', testData);
    submitTestMutation.mutate(testData);
  };

  const generateFeedback = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) {
      return "Excellent work! You have a strong understanding of communication skills. Keep practicing to maintain this level.";
    } else if (percentage >= 80) {
      return "Good job! You have a solid foundation in communication skills. Focus on the areas where you missed questions.";
    } else if (percentage >= 70) {
      return "Fair performance. You understand the basics but should review key concepts and practice more.";
    } else {
      return "You may benefit from additional study and practice. Consider reviewing the related articles and taking the test again.";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 80) return "text-blue-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent!";
    if (percentage >= 80) return "Good Job!";
    if (percentage >= 70) return "Fair";
    return "Needs Improvement";
  };

  if (isLoading || !testCategory) {
    return (
      <SimpleModal
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        title="Loading Test"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              animation: 'spin 1s linear infinite',
              borderRadius: '50%',
              height: '32px',
              width: '32px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3B82F6',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280' }}>Loading test questions...</p>
          </div>
        </div>
      </SimpleModal>
    );
  }

  // Check if there are no questions
  if (!questions || questions.length === 0) {
    return (
      <SimpleModal
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        title={`${testCategory.name} - No Questions Available`}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px',
              color: '#9CA3AF',
              marginBottom: '16px'
            }}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style={{ color: '#374151', marginBottom: '8px' }}>No Questions Available</h3>
            <p style={{ color: '#6b7280' }}>This test category doesn't have any questions yet.</p>
          </div>
        </div>
      </SimpleModal>
    );
  }

  if (isSubmitted && testResult) {
    const percentage = Math.round((testResult.score / testResult.totalQuestions) * 100);
    
    return (
      <SimpleModal
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        title={`Test Results - ${testCategory.name}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Score Display */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: percentage >= 90 ? '#10B981' : percentage >= 80 ? '#3B82F6' : percentage >= 70 ? '#F59E0B' : '#EF4444'
            }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '20px', color: '#6b7280', marginBottom: '16px' }}>
              {getScoreMessage(percentage)}
            </div>
            <div style={{ color: '#9CA3AF' }}>
              {testResult.score} out of {testResult.totalQuestions} questions correct
            </div>
          </div>

          {/* Feedback */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '24px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
              <i className="fas fa-lightbulb" style={{ color: '#F59E0B', marginRight: '8px' }}></i>
              Personalized Feedback
            </h3>
            <p style={{ color: '#374151' }}>{testResult.feedback}</p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={() => onOpenChange(false)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
              Continue Learning
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setTestResult(null);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setSelectedAnswer("");
                setTimeLeft(testCategory.duration * 60);
              }}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
              Retake Test
            </button>
          </div>
        </div>
      </SimpleModal>
    );
  }

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title={testCategory.name}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Test Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
              {testCategory.name}
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>Answer all questions to receive your personalized feedback</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>{formatTime(timeLeft)}</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Time Left</div>
          </div>
        </div>

        {/* Test Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Question {currentQuestionIndex + 1} of {questions?.length || 0}
              </span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>{Math.round(progress)}% Complete</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                backgroundColor: '#3B82F6',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                {currentQuestion.question}
              </h3>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px', 
                background: '#ffffff !important', 
                border: '2px solid #e5e7eb', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                padding: '24px',
                marginBottom: '16px',
                position: 'relative',
                zIndex: 1
              }}>
                {currentQuestion.options.map((option, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '16px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: selectedAnswer === option ? '#f3f4f6' : '#ffffff',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedAnswer === option ? '0 2px 4px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                    onClick={() => handleAnswerChange(option)}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => handleAnswerChange(option)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ flex: 1, fontSize: '16px', color: '#374151', fontWeight: '500' }}>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                opacity: currentQuestionIndex === 0 ? 0.5 : 1
              }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={submitTestMutation.isPending || !selectedAnswer}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: submitTestMutation.isPending || !selectedAnswer ? '#9CA3AF' : '#3B82F6',
                color: 'white',
                cursor: submitTestMutation.isPending || !selectedAnswer ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                opacity: submitTestMutation.isPending || !selectedAnswer ? 0.6 : 1
              }}
            >
              {questions && currentQuestionIndex === questions.length - 1 ? (
                <>
                  {submitTestMutation.isPending ? "Submitting..." : "Submit Test"}
                  <i className="fas fa-check" style={{ marginLeft: '8px' }}></i>
                </>
              ) : (
                <>
                  Next
                  <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
}
