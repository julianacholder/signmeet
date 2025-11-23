// hooks/useMediaPipeHands.ts - FIXED VERSION WITH STABLE INITIALIZATION

'use client';

import { useEffect, useRef, useState } from 'react';

interface UseMediaPipeHandsProps {
  videoElement: HTMLVideoElement | null;
  onLandmarksDetected: (landmarks: number[], results: any) => void;
  enabled?: boolean;
}

export function useMediaPipeHands({
  videoElement,
  onLandmarksDetected,
  enabled = true
}: UseMediaPipeHandsProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handsRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);
  const hasInitializedRef = useRef(false); // ✅ Prevent double initialization

  useEffect(() => {
    if (!enabled || !videoElement) return;
    
    // ✅ Prevent re-initialization
    if (hasInitializedRef.current) {
      console.log('⚠️ Already initialized, skipping...');
      return;
    }

    let cancelled = false;
    hasInitializedRef.current = true; // ✅ Mark as initialized immediately

    const initializeHands = async () => {
      try {
        console.log('🚀 Initializing MediaPipe Hands...');
        
        const { Hands } = await import('@mediapipe/hands');

        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
          if (cancelled) return;

          let landmarks: number[] = [];
          
          // Extract hand landmarks (126 values for 2 hands)
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const handLandmarks of results.multiHandLandmarks) {
              for (const landmark of handLandmarks) {
                landmarks.push(landmark.x, landmark.y, landmark.z);
              }
            }
          }
          
          // Pad to 126 (hands only - Python will add pose zeros)
          while (landmarks.length < 126) landmarks.push(0);
          landmarks = landmarks.slice(0, 126);
          
          onLandmarksDetected(landmarks, results);
          isProcessingRef.current = false;
        });

        handsRef.current = hands;
        setIsReady(true);
        console.log('✅ MediaPipe Hands ready');

        const processFrame = async () => {
          if (cancelled || !handsRef.current || !videoElement) return;
          if (isProcessingRef.current) {
            animationFrameRef.current = requestAnimationFrame(processFrame);
            return;
          }

          try {
            isProcessingRef.current = true;
            await handsRef.current.send({ image: videoElement });
          } catch (err) {
            isProcessingRef.current = false;
          }

          animationFrameRef.current = requestAnimationFrame(processFrame);
        };

        processFrame();

      } catch (err: any) {
        if (!cancelled) {
          console.error('MediaPipe initialization failed:', err);
          setError(err.message);
          hasInitializedRef.current = false; // ✅ Allow retry on error
        }
      }
    };

    initializeHands();

    return () => {
      cancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
      // ✅ DON'T reset hasInitializedRef here - we want it to stay true
    };
  }, [videoElement, enabled]); // ✅ Removed onLandmarksDetected from deps

  return { isReady, error };
}