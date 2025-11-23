'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMediaPipeHands } from '@/app/hooks/useMediaPipeHands';

interface SignDetectorProps {
  videoStream: MediaStream | null;
  userId?: string;
  userName: string;
  userProfile?: any;
  onSignDetected?: (sign: string, text: string, confidence: number) => void;
  onTranscriptionUpdate?: (text: string) => void;
  remoteTranscript?: string; // ✅ NEW: Receive interviewer's speech
}

// ✅ DEMO SIGNS - Add your interview responses here
const DEMO_SIGNS = {
  experience: [
    { sign: 'i', english: 'I', confidence: 0.92 },
    { sign: 'have', english: 'have', confidence: 0.90 },
    { sign: 'experience', english: 'experience', confidence: 0.93 },
    { sign: 'work', english: 'working', confidence: 0.91 },
    { sign: 'rwanda', english: 'in Rwanda', confidence: 0.88 },
  ],
  introduce: [
    { sign: 'hello', english: 'Hello', confidence: 0.95 },
    { sign: 'name', english: 'my name is', confidence: 0.93 },
    { sign: 'crystal', english: 'Crystal', confidence: 0.91 },
    { sign: 'from', english: 'from', confidence: 0.89 },
    { sign: 'rwanda', english: 'Rwanda', confidence: 0.94 },
  ],
  skills: [
    { sign: 'i', english: 'I', confidence: 0.90 },
    { sign: 'have', english: 'have', confidence: 0.89 },
    { sign: 'skills', english: 'skills in', confidence: 0.94 },
    { sign: 'leadership', english: 'leadership', confidence: 0.92 },
    { sign: 'communication', english: 'and communication', confidence: 0.91 },
  ],
  hello: [
    { sign: 'hello', english: 'Hello', confidence: 0.95 },
    { sign: 'nice', english: 'nice', confidence: 0.93 },
    { sign: 'meet', english: 'to meet', confidence: 0.92 },
    { sign: 'you', english: 'you', confidence: 0.91 },
  ],
  thankyou: [
    { sign: 'thank', english: 'Thank', confidence: 0.94 },
    { sign: 'you', english: 'you', confidence: 0.93 },
    { sign: 'much', english: 'very much', confidence: 0.92 },
  ],
};

export default function SignDetector({
  videoStream,
  onSignDetected,
  onTranscriptionUpdate,
  remoteTranscript = '' // ✅ NEW: Receive remote speech
}: SignDetectorProps) {
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSign, setCurrentSign] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  
  const drawingUtilsRef = useRef<any>(null);
  const handsDetectedRef = useRef<boolean>(false);
  
  // ✅ AUTO-TRIGGER STATE
  const [activeSigns, setActiveSigns] = useState<any[]>([]);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const lastTriggerRef = useRef<number>(0);
  const processedTranscriptsRef = useRef<Set<string>>(new Set());

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

 
useEffect(() => {
  if (!remoteTranscript || remoteTranscript.trim().length === 0) {
    return;
  }

  const transcript = remoteTranscript.toLowerCase();
  console.log('👂 Processing remote transcript:', transcript);
  
  // Avoid processing the same transcript multiple times
  if (processedTranscriptsRef.current.has(transcript)) {
    return;
  }

  // More flexible keyword matching
  const words = transcript.split(/\s+/);
  let matchedSigns = null;

  // Check for keywords in any position
  if (words.some(word => word.includes('experience') || words.some(word => word.includes('worked')))) {
    console.log('✅ TRIGGERING: experience signs');
    matchedSigns = DEMO_SIGNS.experience;
  } else if (words.some(word => word.includes('introduce') || words.some(word => word.includes('yourself')) || 
             words.some(word => word.includes('tell')) && words.some(word => word.includes('about')))) {
    console.log('✅ TRIGGERING: introduce signs');
    matchedSigns = DEMO_SIGNS.introduce;
  } else if (words.some(word => word.includes('skill'))) {
    console.log('✅ TRIGGERING: skills signs');
    matchedSigns = DEMO_SIGNS.skills;
  } else if (words.some(word => word.includes('hello') || words.some(word => word.includes('hi')))) {
    console.log('✅ TRIGGERING: hello signs');
    matchedSigns = DEMO_SIGNS.hello;
  } else if (words.some(word => word.includes('thank'))) {
    console.log('✅ TRIGGERING: thank you signs');
    matchedSigns = DEMO_SIGNS.thankyou;
  }

  if (matchedSigns) {
    setActiveSigns(matchedSigns);
    setCurrentSignIndex(0);
    lastTriggerRef.current = Date.now();
    processedTranscriptsRef.current.add(transcript);
    
    // Clean up old transcripts (keep only last 5)
    if (processedTranscriptsRef.current.size > 5) {
      const arr = Array.from(processedTranscriptsRef.current);
      processedTranscriptsRef.current = new Set(arr.slice(-5));
    }
  }
}, [remoteTranscript]);

  // AUTO-TRIGGER TIMER (runs every frame when hands present)

useEffect(() => {
  if (activeSigns.length === 0 || currentSignIndex >= activeSigns.length) {
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
    const sign = activeSigns[currentSignIndex];
    
    console.log(`✅ Sign ${currentSignIndex + 1}/${activeSigns.length}:`, sign.sign);
    
    setCurrentSign(sign.sign);
    setConfidence(sign.confidence);
    
    onSignDetected?.(sign.sign, sign.english, sign.confidence);
    onTranscriptionUpdate?.(sign.english);
    
    // 🚨 REMOVE THIS LINE - Let VideoCall handle speech synthesis
    // speak(sign.english);
    
    setCurrentSignIndex(prev => prev + 1);
  }, 100);

  return () => clearInterval(interval);
}, [activeSigns, currentSignIndex, onSignDetected, onTranscriptionUpdate]);

  const handleLandmarks = useCallback(async (landmarks: number[], results: any) => {
    const handsPresent = results.multiHandLandmarks && results.multiHandLandmarks.length > 0;
    handsDetectedRef.current = handsPresent;

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

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

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

      {/* Status display */}
      <div className="fixed top-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs space-y-1 z-50 font-mono">
        <div className="text-blue-400 font-bold">
          🎤 Voice Interview Mode
        </div>
        {activeSigns.length > 0 && (
          <div className="text-green-400">
            Responding... ({currentSignIndex}/{activeSigns.length})
          </div>
        )}
        <div className={mediaPipeReady ? 'text-green-400' : 'text-yellow-400'}>
          MediaPipe: {mediaPipeReady ? '✅ Ready' : '⏳ Loading'}
        </div>
        <div className={handsDetectedRef.current ? 'text-green-400' : 'text-gray-400'}>
          Hands: {handsDetectedRef.current ? '✅ Detected' : '❌ None'}
        </div>
        <div>Sign: {currentSign || 'none'}</div>
        <div>Confidence: {(confidence * 100).toFixed(1)}%</div>
        {remoteTranscript && (
          <div className="text-xs text-gray-400 pt-2 border-t">
            Heard: "{remoteTranscript.slice(-50)}"
          </div>
        )}
      </div>
    </>
  );
}