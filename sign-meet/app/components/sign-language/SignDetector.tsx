'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMediaPipeHands } from '@/app/hooks/useMediaPipeHands';
import { DEMO_QUESTIONS, QUESTION_KEYWORDS, DemoQuestion } from '@/app/config/demoQuestions';
import { mlApi } from '@/app/services/mlApi';

interface SignDetectorProps {
  videoStream: MediaStream | null;
  userId?: string;
  userName: string;
  userProfile?: any;
  onSignDetected?: (sign: string, text: string, confidence: number) => void;
  onTranscriptionUpdate?: (text: string) => void;
  onModelPrediction?: (prediction: { sign: string; confidence: number; english: string }) => void;
  remoteTranscript?: string;
}

export default function SignDetector({
  videoStream,
  userName,
  userProfile,
  onSignDetected,
  onTranscriptionUpdate,
  onModelPrediction,
  remoteTranscript = ''
}: SignDetectorProps) {
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSign, setCurrentSign] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  
  const drawingUtilsRef = useRef<any>(null);
  const handsDetectedRef = useRef<boolean>(false);
  
  // Demo state
  const [activeQuestion, setActiveQuestion] = useState<DemoQuestion | null>(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const lastTriggerRef = useRef<number>(0);
  const processedTranscriptsRef = useRef<Set<string>>(new Set());
  
  // Landmarks buffer for ML model (30 frames)
  const landmarksBufferRef = useRef<number[][]>([]);
  const [mlModelStatus, setMlModelStatus] = useState<'idle' | 'sending' | 'received'>('idle');

  useEffect(() => {
    const loadDrawingUtils = async () => {
      try {
        const drawingUtils = await import('@mediapipe/drawing_utils');
        const handsModule = await import('@mediapipe/hands');
        drawingUtilsRef.current = {
          drawConnectors: drawingUtils.drawConnectors,
          drawLandmarks: drawingUtils.drawLandmarks,
          HAND_CONNECTIONS: handsModule.HAND_CONNECTIONS
        };
      } catch (err) {
        console.error('Error loading drawing utils:', err);
      }
    };
    
    loadDrawingUtils();
  }, []);

  // ✅ Keyboard trigger listener (1-6 keys)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      const question = DEMO_QUESTIONS.find(q => q.key === key);
      
      if (question) {
        console.log(`⌨️ Keyboard trigger: ${key} → ${question.question}`);
        triggerQuestion(question);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userProfile]);

  // ✅ Remote transcript trigger (interviewer voice ONLY)
  useEffect(() => {
    if (!remoteTranscript || remoteTranscript.trim().length === 0) {
      return;
    }

    const transcript = remoteTranscript.toLowerCase();
    console.log('👂 Processing remote transcript:', transcript);
    
    if (processedTranscriptsRef.current.has(transcript)) {
      return;
    }

    const words = transcript.split(/\s+/);
    
    // Find matching question by keywords
    for (const word of words) {
      const questionId = QUESTION_KEYWORDS[word];
      if (questionId) {
        const question = DEMO_QUESTIONS.find(q => q.id === questionId);
        if (question) {
          console.log(`✅ Voice trigger: "${word}" → ${question.question}`);
          triggerQuestion(question);
          processedTranscriptsRef.current.add(transcript);
          
          // Clean up old transcripts
          if (processedTranscriptsRef.current.size > 5) {
            const arr = Array.from(processedTranscriptsRef.current);
            processedTranscriptsRef.current = new Set(arr.slice(-5));
          }
          
          break;
        }
      }
    }
  }, [remoteTranscript, userProfile]);

  const triggerQuestion = useCallback((question: DemoQuestion) => {
    console.log('🎯 Triggering question:', question.question);
    setActiveQuestion(question);
    setCurrentSignIndex(0);
    lastTriggerRef.current = Date.now();
    landmarksBufferRef.current = []; // Reset landmarks buffer
  }, []);

  // Auto-play signs when question is active
  useEffect(() => {
    if (!activeQuestion || currentSignIndex >= activeQuestion.signs.length) {
      if (activeQuestion && currentSignIndex >= activeQuestion.signs.length) {
        // Sequence complete
        console.log('✅ Question sequence complete');
        setTimeout(() => {
          setActiveQuestion(null);
          setCurrentSignIndex(0);
        }, 1000);
      }
      return;
    }

    const interval = setInterval(() => {
      if (!handsDetectedRef.current) {
        console.log('⏸️ Waiting for hands...');
        return;
      }

      const now = Date.now();
      if (now - lastTriggerRef.current < 2500) {
        return; // Wait 2.5 seconds between signs
      }

      lastTriggerRef.current = now;
      const signStep = activeQuestion.signs[currentSignIndex];
      
      console.log(`✅ Sign ${currentSignIndex + 1}/${activeQuestion.signs.length}:`, signStep.sign);
      
      setCurrentSign(signStep.sign);
      setConfidence(signStep.confidence);
      
      // Send to ML API if we have 30 frames
      if (landmarksBufferRef.current.length >= 30) {
        sendToMLModel(signStep.sign);
      }
      
      onSignDetected?.(signStep.sign, signStep.english, signStep.confidence);
      onTranscriptionUpdate?.(signStep.english);
      
      // Move to next sign
      setCurrentSignIndex(prev => prev + 1);
      
      // If this is the last sign, send the complete response
      if (currentSignIndex === activeQuestion.signs.length - 1) {
        const fullResponse = activeQuestion.templateResponse(userProfile);
        setTimeout(() => {
          onSignDetected?.(
            'complete',
            fullResponse,
            0.95
          );
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeQuestion, currentSignIndex, onSignDetected, onTranscriptionUpdate, userProfile]);

  const sendToMLModel = useCallback(async (expectedSign: string) => {
    if (landmarksBufferRef.current.length < 30) {
      console.log('⚠️ Not enough frames for ML prediction');
      return;
    }

    setMlModelStatus('sending');
    console.log('📤 Sending 30 frames to ML model...');
    console.log('🎭 Expected sign:', expectedSign);
    
    // Take last 30 frames
    const sequence = landmarksBufferRef.current.slice(-30);
    
    // ✅ Pass expected sign for demo mode
    const prediction = await mlApi.predict(
      sequence, 
      expectedSign,  // This tells API what sign to return
      true          // Enable demo mode
    );
    
    setMlModelStatus('received');
    console.log('🤖 ML Model prediction:', prediction);
    
    onModelPrediction?.(prediction);
    
    // Reset status after 2 seconds
    setTimeout(() => setMlModelStatus('idle'), 2000);
  }, [onModelPrediction]);

  const handleLandmarks = useCallback(async (landmarks: number[], results: any) => {
    const handsPresent = results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
    handsDetectedRef.current = handsPresent;

    // Store landmarks for ML model (keep last 30 frames)
    if (handsPresent && landmarks.length === 126) {
      landmarksBufferRef.current.push(landmarks);
      
      // Keep only last 30 frames
      if (landmarksBufferRef.current.length > 30) {
        landmarksBufferRef.current.shift();
      }
    }

    // Draw hands
    if (canvasRef.current && handsPresent && drawingUtilsRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (const handLandmarks of results.multiHandLandmarks) {
          const mirroredLandmarks = handLandmarks.map((landmark: any) => ({
            x: 1 - landmark.x,
            y: landmark.y,
            z: landmark.z
          }));
          
          drawingUtilsRef.current.drawConnectors(
            ctx, 
            mirroredLandmarks,
            drawingUtilsRef.current.HAND_CONNECTIONS,
            { color: '#00FF00', lineWidth: 4 }
          );
          
          drawingUtilsRef.current.drawLandmarks(
            ctx, 
            mirroredLandmarks,
            { color: '#FF0000', lineWidth: 2, radius: 4 }
          );
        }
      }
    } else if (!handsPresent && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, []);

  const { isReady: mediaPipeReady } = useMediaPipeHands({
    videoElement: hiddenVideoRef.current,
    onLandmarksDetected: handleLandmarks,
    enabled: !!videoStream
  });

  useEffect(() => {
    if (hiddenVideoRef.current && videoStream) {
      hiddenVideoRef.current.srcObject = videoStream;
      hiddenVideoRef.current.play().catch(() => {});
    }
  }, [videoStream]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current && hiddenVideoRef.current) {
        const video = hiddenVideoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }
    };

    if (hiddenVideoRef.current) {
      hiddenVideoRef.current.onloadedmetadata = updateCanvasSize;
      if (hiddenVideoRef.current.videoWidth > 0) {
        updateCanvasSize();
      }
    }
    
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [videoStream]);

  return (
    <>
      <video
        ref={hiddenVideoRef}
        style={{ display: 'none' }}
        playsInline
        muted
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
          transform: 'scaleX(-1)',
        }}
      />

      
    </>
  );
}