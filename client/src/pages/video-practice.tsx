import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiClient } from "@/lib/api";
import type { VideoAnalysis } from "@shared/schema";

export default function VideoPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState("Job Interview Introduction");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<VideoAnalysis | null>(null);
  const [savedVideos, setSavedVideos] = useState<Array<{id: string, name: string, url: string, scenario: string, date: string}>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [downloadingVideo, setDownloadingVideo] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();

  const scenarios = [
    "Job Interview Introduction",
    "Team Meeting Presentation", 
    "Client Pitch",
    "Difficult Conversation",
    "Public Speaking",
    "Free Practice"
  ];

  const { data: previousAnalysesData } = useQuery({
    queryKey: ["video-analyses"],
    queryFn: async () => {
      const data = await apiClient.get("/video-analyses");
      return data.analyses || [];
    }
  });

  const previousAnalyses = previousAnalysesData || [];

  const analyzeVideoMutation = useMutation({
    mutationFn: async (videoData: any) => {
      // Convert video blob to base64 for AI analysis
      const videoBlob = await fetch(recordedVideoUrl!).then(r => r.blob());
      const base64Video = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Remove data URL prefix
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(videoBlob);
      });

      // Send video data for real AI analysis
      const data = await apiClient.post("/video-analyses", {
        videoData: base64Video,
        videoMimeType: videoBlob.type, // <-- send MIME type
        scenario: selectedScenario,
        duration: recordingTime
      });
      
      return data.analysis;
    },
    onSuccess: (data) => {
      setAnalysisData(data);
      setShowAnalysis(true);
      queryClient.invalidateQueries({ queryKey: ["video-analyses"] });
      
      // Check if this is an error case (no person detected, multiple people, etc.)
      const isErrorCase = data.overallScore === 0 && data.feedback && data.feedback.length > 0 && 
                         (data.feedback[0].includes('No person detected') || 
                          data.feedback[0].includes('Multiple people detected') ||
                          data.feedback[0].includes('Could not open video file'));
      
      if (isErrorCase) {
        toast({
          title: "Analysis Issue Detected",
          description: data.feedback[0] || "No person detected in the video. Please ensure your face is clearly visible.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "AI Analysis Complete",
          description: "Your video has been analyzed using real AI technology!"
        });
      }
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your video. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up video URL when component unmounts
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
      
      // Stop any ongoing recording
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clear intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recordedVideoUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Determine the best MIME type for the browser
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
        'video/ogg;codecs=theora,vorbis',
        'video/ogg'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log('Using MIME type:', selectedMimeType);
          break;
        }
      }
      
      if (!selectedMimeType) {
        console.warn('No supported MIME type found, using default');
        selectedMimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      // Clear previous chunks
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
          console.log('Data chunk received, size:', event.data.size);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped, chunks:', recordedChunksRef.current.length);
        const blob = new Blob(recordedChunksRef.current, { type: selectedMimeType });
        console.log('Created blob, size:', blob.size, 'type:', blob.type);
        
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
        }
      };

      // Request data every second for better reliability
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Your practice session is now being recorded."
      });
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to record your practice session.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      toast({
        title: "Recording Stopped",
        description: "Click 'Analyze Video' to get your feedback."
      });
    }
  };

  const analyzeVideo = () => {
    if (recordedVideoUrl) {
      analyzeVideoMutation.mutate({ videoUrl: recordedVideoUrl, scenario: selectedScenario });
    }
  };

  const saveVideo = async () => {
    if (!recordedVideoUrl) return;
    
    setIsSaving(true);
    try {
      // Create a unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${selectedScenario.replace(/\s+/g, '_')}_${timestamp}.mp4`;
      
      // Use the improved download function
      await downloadVideo(recordedVideoUrl, filename);
      
      // Create a new blob from the original video for saved video
      const response = await fetch(recordedVideoUrl);
      const blob = await response.blob();
      const savedVideoUrl = URL.createObjectURL(blob);

      // Add to saved videos list
      const newSavedVideo = {
        id: Date.now().toString(),
        name: filename,
        url: savedVideoUrl, // Unique blob URL for each saved video
        scenario: selectedScenario,
        date: new Date().toLocaleDateString()
      };
      
      setSavedVideos(prev => [newSavedVideo, ...prev]);
      
      toast({
        title: "Video Saved",
        description: "Your video has been saved successfully!"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save the video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const reRecord = () => {
    // Reset all recording states
    setIsRecording(false);
    
    // Clean up previous video URL to prevent memory leaks
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    setRecordingTime(0);
    setShowAnalysis(false);
    setAnalysisData(null);
    
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop any existing streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear recorded chunks
    recordedChunksRef.current = [];
    
    toast({
      title: "Ready to Record",
      description: "You can now start a new recording session."
    });
  };

  const downloadVideo = async (videoUrl: string, filename: string) => {
    setDownloadingVideo(filename);
    console.log('Starting download for:', filename, 'URL:', videoUrl);
    
    try {
      // Check if the browser supports the required APIs
      if (!window.URL || !window.URL.createObjectURL) {
        throw new Error('Your browser does not support video downloads');
      }

      // Method 1: Try direct download first (for blob URLs)
      if (videoUrl.startsWith('blob:')) {
        console.log('Attempting blob URL download...');
        
        try {
          // Fetch the blob data
          const response = await fetch(videoUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          console.log('Blob size:', blob.size, 'bytes');
          
          if (blob.size === 0) {
            throw new Error('Video data is empty or corrupted');
          }
          
          // Create object URL
          const objectUrl = URL.createObjectURL(blob);
          console.log('Created object URL:', objectUrl);
          
          // Method 1a: Try with download attribute
          try {
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            link.style.display = 'none';
            link.target = '_blank';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Download link clicked successfully');
          } catch (linkError) {
            console.log('Download link method failed, trying alternative...');
            
            // Method 1b: Try opening in new window/tab
            const newWindow = window.open(objectUrl, '_blank');
            if (!newWindow) {
              throw new Error('Popup blocked. Please allow popups for this site.');
            }
          }
          
          // Clean up the temporary URL
          // setTimeout(() => {
          //   URL.revokeObjectURL(objectUrl);
          //   console.log('Cleaned up object URL');
          // }, 1000);
          
        } catch (blobError) {
          console.error('Blob download failed:', blobError);
          
          // Method 2: Try alternative approach for blob URLs
          try {
            console.log('Trying alternative blob download method...');
            
            // Get the video element and try to download from it
            if (videoRef.current && videoRef.current.src) {
              const videoBlob = await new Promise<Blob>((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const video = videoRef.current!;
                
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to create blob from canvas'));
                  }, 'video/webm');
                } else {
                  reject(new Error('Canvas context not available'));
                }
              });
              
              const url = URL.createObjectURL(videoBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              link.click();
              URL.revokeObjectURL(url);
            } else {
              throw new Error('Video element not available');
            }
          } catch (altError) {
            console.error('Alternative method failed:', altError);
            
            // Method 3: Try File System Access API (modern browsers)
            try {
              console.log('Trying File System Access API...');
              if ('showSaveFilePicker' in window) {
                const response = await fetch(videoUrl);
                const blob = await response.blob();
                
                const handle = await (window as any).showSaveFilePicker({
                  suggestedName: filename,
                  types: [{
                    description: 'Video File',
                    accept: {
                      'video/*': ['.webm', '.mp4', '.ogg']
                    }
                  }]
                });
                
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                
                console.log('File saved using File System Access API');
              } else {
                throw new Error('File System Access API not supported');
              }
            } catch (fsError) {
              console.error('File System Access API failed:', fsError);
              
              // Method 4: Last resort - try to copy to clipboard and show instructions
              try {
                console.log('Trying clipboard method...');
                const response = await fetch(videoUrl);
                const blob = await response.blob();
                
                // Try to copy blob to clipboard (this might not work for videos)
                const clipboardItem = new ClipboardItem({
                  [blob.type]: blob
                });
                
                await navigator.clipboard.write([clipboardItem]);
                
                toast({
                  title: "Video Copied to Clipboard",
                  description: "The video has been copied to your clipboard. You can paste it into a video editor or save it manually.",
                });
                
                return; // Don't show error since we handled it differently
              } catch (clipboardError) {
                console.error('Clipboard method failed:', clipboardError);
                throw new Error('All download methods failed. Please try recording again or use a different browser.');
              }
            }
          }
        }
      } else {
        // For regular URLs
        console.log('Attempting regular URL download...');
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = filename;
        link.style.display = 'none';
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Download Started",
        description: "Your video download has begun. Check your downloads folder."
      });
      
    } catch (error) {
      console.error('Download error:', error);
      
      // Provide specific error messages
      let errorMessage = "Failed to download the video. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('popup')) {
          errorMessage = "Please allow popups for this site to download videos.";
        } else if (error.message.includes('blob')) {
          errorMessage = "Video data is corrupted. Please record again.";
        } else if (error.message.includes('HTTP')) {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.message.includes('browser')) {
          errorMessage = "Your browser doesn't support video downloads. Please try Chrome, Firefox, or Edge.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setDownloadingVideo(null);
    }
  };

  const deleteSavedVideo = (id: string) => {
    const videoToDelete = savedVideos.find(video => video.id === id);
    if (videoToDelete) {
      URL.revokeObjectURL(videoToDelete.url);
    }
    setSavedVideos(prev => prev.filter(video => video.id !== id));
    toast({
      title: "Video Deleted",
      description: "Video has been removed from your saved list."
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const debugDownloadCapabilities = () => {
    const capabilities = {
      url: !!window.URL,
      createObjectURL: !!window.URL?.createObjectURL,
      revokeObjectURL: !!window.URL?.revokeObjectURL,
      fetch: !!window.fetch,
      blob: !!window.Blob,
      mediaRecorder: !!window.MediaRecorder,
      fileSystemAccess: 'showSaveFilePicker' in window,
      clipboard: !!navigator.clipboard,
      userAgent: navigator.userAgent,
      supportedMimeTypes: [] as string[]
    };

    // Test MIME type support
    const testMimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus', 
      'video/webm',
      'video/mp4',
      'video/ogg;codecs=theora,vorbis',
      'video/ogg'
    ];

    testMimeTypes.forEach(mimeType => {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        capabilities.supportedMimeTypes.push(mimeType);
      }
    });

    console.log('Browser Download Capabilities:', capabilities);
    
    toast({
      title: "Debug Info",
      description: `Check console for browser capabilities. Supported formats: ${capabilities.supportedMimeTypes.length}`,
    });
  };

  const testDownloadFunctionality = async () => {
    try {
      // Create a simple test video blob
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }
      
      // Draw a simple test pattern
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 160, 120);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(160, 0, 160, 120);
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(0, 120, 160, 120);
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(160, 120, 160, 120);
      
      // Add text
      ctx.fillStyle = '#000000';
      ctx.font = '20px Arial';
      ctx.fillText('Test Video', 120, 120);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create test blob'));
        }, 'image/png');
      });
      
      // Test download
      const testFilename = `test_video_${Date.now()}.png`;
      await downloadVideo(URL.createObjectURL(blob), testFilename);
      
      toast({
        title: "Test Successful",
        description: "Test download completed successfully!",
      });
      
    } catch (error) {
      console.error('Test download failed:', error);
      toast({
        title: "Test Failed",
        description: "Test download failed. Check console for details.",
        variant: "destructive"
      });
    }
  };

  // File upload handling functions
  const validateVideoFile = (file: File): boolean => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a video file (MP4, WebM, OGG, MOV, AVI)",
        variant: "destructive"
      });
      return false;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a video smaller than 100MB",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const processUploadedVideo = async (file: File) => {
    if (!validateVideoFile(file)) return;
    
    setIsUploading(true);
    try {
      console.log('Processing uploaded video:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Create blob URL for the uploaded video
      const videoUrl = URL.createObjectURL(file);
      
      // Create a temporary video element to get duration
      const tempVideo = document.createElement('video');
      tempVideo.src = videoUrl;
      
      // Wait for video metadata to load
      await new Promise((resolve, reject) => {
        tempVideo.onloadedmetadata = resolve;
        tempVideo.onerror = reject;
        tempVideo.load();
      });
      
      // Check video duration (minimum 3 seconds, maximum 10 minutes)
      const duration = tempVideo.duration;
      if (duration < 3) {
        toast({
          title: "Video Too Short",
          description: "Please upload a video that's at least 3 seconds long.",
          variant: "destructive"
        });
        URL.revokeObjectURL(videoUrl);
        return;
      }
      
      if (duration > 600) {
        toast({
          title: "Video Too Long",
          description: "Please upload a video that's shorter than 10 minutes.",
          variant: "destructive"
        });
        URL.revokeObjectURL(videoUrl);
        return;
      }
      
      console.log('Video duration:', duration, 'seconds');
      
      // Set the video URL and display it
      setRecordedVideoUrl(videoUrl);
      
      // Update video element
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      }
      
      // Reset analysis state
      setShowAnalysis(false);
      setAnalysisData(null);
      
      toast({
        title: "Video Uploaded Successfully",
        description: `"${file.name}" has been uploaded (${Math.round(duration)}s). You can now analyze it.`
      });
      
    } catch (error) {
      console.error('Error processing uploaded video:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the uploaded video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processUploadedVideo(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      processUploadedVideo(videoFile);
    } else {
      toast({
        title: "No Video File Found",
        description: "Please drop a video file (MP4, WebM, OGG, etc.)",
        variant: "destructive"
      });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Communication Practice</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Record yourself practicing communication skills and receive AI-powered feedback on your body language, eye contact, and presentation style
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button 
            onClick={debugDownloadCapabilities}
            variant="outline"
            size="sm"
            className="px-4 py-2"
          >
            <i className="fas fa-bug mr-2"></i>
            Debug Browser Capabilities
          </Button>
          <Button 
            onClick={testDownloadFunctionality}
            variant="outline"
            size="sm"
            className="px-4 py-2"
          >
            <i className="fas fa-download mr-2"></i>
            Test Download
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Recording Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Session</CardTitle>
            <p className="text-gray-600">Choose a scenario and start recording to practice your communication skills</p>
          </CardHeader>
          
          {/* Video Display Area */}
          <div className="relative bg-gray-900 mx-6" style={{aspectRatio: "16/9"}}>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            
            {!isRecording && !recordedVideoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <i className="fas fa-video text-6xl mb-4 opacity-50"></i>
                  <p className="text-lg">Click "Start Recording" to begin</p>
                </div>
              </div>
            )}
            
            {/* Recording Status */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <i className="fas fa-circle animate-pulse-recording mr-1"></i>
                Recording
              </div>
            )}
            
            {/* Timer */}
            {isRecording && (
              <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-mono">
                {formatTime(recordingTime)}
              </div>
            )}
          </div>
          
          {/* Controls */}
          <CardContent className="p-6">
            {/* Scenario Selection */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <label className="block text-lg font-semibold text-gray-900 mb-2">Choose Practice Scenario</label>
                <p className="text-sm text-gray-600">Select a scenario that matches your practice goals</p>
              </div>
              <div className="max-w-md mx-auto">
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger className="text-center">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario} value={scenario}>
                        {scenario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Recording Controls */}
            <div className="space-y-4">
              {/* Primary Action Buttons */}
              <div className="flex items-center justify-center">
                {!isRecording && !recordedVideoUrl && (
                  <Button onClick={startRecording} className="btn-record px-8 py-3 text-lg">
                    <i className="fas fa-video mr-3"></i>
                    Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <Button onClick={stopRecording} className="btn-secondary px-8 py-3 text-lg">
                    <i className="fas fa-stop mr-3"></i>
                    Stop Recording
                  </Button>
                )}
              </div>
              
              {/* Secondary Action Buttons - After Recording */}
              {recordedVideoUrl && !showAnalysis && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Button 
                      onClick={analyzeVideo} 
                      disabled={analyzeVideoMutation.isPending} 
                      className="btn-analyze px-8 py-3 text-lg"
                    >
                      <i className="fas fa-brain mr-3"></i>
                      {analyzeVideoMutation.isPending ? "Analyzing..." : "Analyze Video"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-3">
                    <Button 
                      onClick={async () => {
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        const filename = `${selectedScenario.replace(/\s+/g, '_')}_${timestamp}.webm`;
                        try {
                          await downloadVideo(recordedVideoUrl, filename);
                        } catch (error) {
                          console.error('Download failed:', error);
                        }
                      }}
                      disabled={downloadingVideo !== null}
                      className="btn-outline px-6 py-2"
                    >
                      <i className={`fas ${downloadingVideo !== null ? 'fa-spinner fa-spin' : 'fa-download'} mr-2`}></i>
                      {downloadingVideo !== null ? 'Downloading...' : 'Download'}
                    </Button>
                    <Button onClick={reRecord} className="btn-outline px-6 py-2">
                      <i className="fas fa-redo mr-2"></i>
                      Record Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Post-Analysis Action Buttons */}
              {showAnalysis && analysisData && (
                <div className="space-y-4">
                  {/* Primary Actions */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button onClick={saveVideo} disabled={isSaving} className="btn-save px-6 py-3">
                      <i className="fas fa-save mr-2"></i>
                      {isSaving ? "Saving..." : "Save Video"}
                    </Button>
                    <Button 
                      onClick={async () => {
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        const filename = `${selectedScenario.replace(/\s+/g, '_')}_${timestamp}.webm`;
                        try {
                          await downloadVideo(recordedVideoUrl!, filename);
                        } catch (error) {
                          console.error('Download failed:', error);
                        }
                      }}
                      disabled={downloadingVideo !== null}
                      className="btn-outline px-6 py-3"
                    >
                      <i className={`fas ${downloadingVideo !== null ? 'fa-spinner fa-spin' : 'fa-download'} mr-2`}></i>
                      {downloadingVideo !== null ? 'Downloading...' : 'Download Video'}
                    </Button>
                  </div>
                  
                  {/* Secondary Actions */}
                  <div className="flex items-center justify-center">
                    <Button onClick={reRecord} className="btn-outline px-8 py-2">
                      <i className="fas fa-redo mr-2"></i>
                      Record New Video
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Upload Option */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Existing Video</h3>
                <p className="text-sm text-gray-600">Or upload a video you've recorded elsewhere</p>
              </div>
              
              <div className="flex items-center justify-center w-full">
                <div
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <>
                          <i className="fas fa-spinner fa-spin text-blue-500 text-2xl mb-2"></i>
                          <p className="text-sm text-blue-600 font-medium">Processing video...</p>
                        </>
                      ) : isDragOver ? (
                        <>
                          <i className="fas fa-cloud-upload-alt text-blue-500 text-2xl mb-2"></i>
                          <p className="text-sm text-blue-600 font-medium">Drop your video here</p>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
                          <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">MP4, WebM, OGG, MOV, AVI up to 100MB</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="video/*" 
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
              
              {recordedVideoUrl && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check-circle text-green-500 mr-3 text-lg"></i>
                    <div className="text-center">
                      <p className="text-sm text-green-700 font-medium">
                        Video uploaded successfully!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Click "Analyze Video" above to get feedback.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <p className="text-gray-600">
              {showAnalysis ? "Here's your detailed feedback" : "Complete a recording to receive detailed feedback"}
            </p>
          </CardHeader>
          
          {showAnalysis ? (
            analysisData && (
              <CardContent className="p-6 space-y-6">
                {/* Error or Normal Analysis Display */}
                {analysisData.overallScore === 0 && analysisData.feedback && analysisData.feedback.length > 0 && 
                 (analysisData.feedback[0].includes('No person detected') || 
                  analysisData.feedback[0].includes('Multiple people detected') ||
                  analysisData.feedback[0].includes('Could not open video file') ||
                  analysisData.feedback[0].includes('Analysis failed') ||
                  analysisData.feedback[0].includes('Python analysis not available')) ? (
                  <div className="text-center p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                      <h3 className="text-xl font-semibold text-red-800 mb-2">Analysis Issue Detected</h3>
                      <p className="text-red-700 mb-4">{analysisData.feedback[0]}</p>
                      <div className="space-y-2 text-sm text-red-600">
                        <p>• Ensure your face is clearly visible to the camera</p>
                        <p>• Make sure there is adequate lighting</p>
                        <p>• Position yourself in the center of the frame</p>
                        <p>• Avoid having multiple people in the video</p>
                        <p>• Check that your video file is not corrupted</p>
                        <p>• Try recording a new video if the issue persists</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Overall Score */}
                    <div className="text-center gradient-primary text-white p-6 rounded-lg">
                      <div className="text-3xl font-bold mb-2">{analysisData.overallScore}%</div>
                      <div className="text-lg opacity-90">Overall Communication Score</div>
                    </div>
                    {/* Detailed Metrics */}
                    <div className="space-y-4">
                      {[
                        { label: "Eye Contact", score: analysisData.eyeContactScore, icon: "fas fa-eye", desc: "Maintained appropriate eye contact" },
                        { label: "Facial Expression", score: analysisData.facialExpressionScore, icon: "fas fa-smile", desc: "Confident and engaging expressions" },
                        { label: "Hand Gestures", score: analysisData.gestureScore, icon: "fas fa-hand-paper", desc: "Room for improvement in gesture timing" },
                        { label: "Posture", score: analysisData.postureScore, icon: "fas fa-user", desc: "Professional and confident stance" }
                      ].map((metric, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`${getScoreBarColor(metric.score)} text-white p-2 rounded-full`}>
                                <i className={`${metric.icon} text-sm`}></i>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                                <p className="text-sm text-gray-600">{metric.desc}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>{metric.score}%</div>
                              <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                                <div className={`h-full rounded-full ${getScoreBarColor(metric.score)}`} style={{ width: `${metric.score}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Recommendations Section */}
                    {Array.isArray((analysisData as any).recommendations) && (analysisData as any).recommendations.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                        <div className="space-y-2">
                          {(analysisData as any).recommendations.map((rec: string, idx: number) => (
                            <div key={idx} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                              <i className="fas fa-check-circle text-green-500 mt-1"></i>
                              <p className="text-sm text-gray-700">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            )
          ) : (
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <i className="fas fa-brain text-4xl mb-4"></i>
                  <p>AI analysis will appear here after recording</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Saved Videos Section */}
      {savedVideos.length > 0 && (
        <div className="mt-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Saved Videos</CardTitle>
              <p className="text-gray-600">Your previously saved practice sessions</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedVideos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 truncate text-sm">{video.name}</h4>
                      <Button
                        onClick={() => deleteSavedVideo(video.id)}
                        className="btn-icon btn-icon-danger"
                        size="sm"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 font-medium">{video.scenario}</p>
                      <p className="text-xs text-gray-500">Saved: {video.date}</p>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={async () => {
                          try {
                            await downloadVideo(video.url, video.name);
                          } catch (error) {
                            console.error('Download failed:', error);
                          }
                        }}
                        disabled={downloadingVideo === video.name}
                        size="sm"
                        className="w-full btn-outline"
                      >
                        <i className={`fas ${downloadingVideo === video.name ? 'fa-spinner fa-spin' : 'fa-download'} mr-2`}></i>
                        {downloadingVideo === video.name ? 'Downloading...' : 'Download Video'}
                      </Button>
                      <Button
                        onClick={() => window.open(video.url, '_blank')}
                        size="sm"
                        className="w-full btn-primary"
                      >
                        <i className="fas fa-play mr-2"></i>
                        Play Video
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
