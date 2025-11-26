// hooks/useTransformerModel.ts - FIXED WITH ENGLISH FIELD

'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseTransformerModelReturn {
  isModelLoaded: boolean;
  predict: (sequence: number[][]) => Promise<{
    sign: string;
    english: string;
    confidence: number;
  } | null>;
  error: string | null;
}

export function useTransformerModel(): UseTransformerModelReturn {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        console.log('🔍 Checking Python ML server...');
        
        const response = await fetch('http://localhost:8000/health');
        const data = await response.json();
        
        if (data.model_loaded) {
          console.log('✅ Python ML server ready!');
          setIsModelLoaded(true);
        } else {
          setError('Model not loaded on server');
        }
      } catch (err: any) {
        console.error('❌ Python server not running:', err);
        setError('Python ML server not running. Start it with: python ml-server/app.py');
      }
    };

    checkServer();
  }, []);

  const predict = useCallback(async (
    sequence: number[][]
  ): Promise<{ sign: string; english: string; confidence: number } | null> => {
    if (!isModelLoaded) {
      console.warn('Model not loaded yet');
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sequence })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      //  FIXED: Include all three fields from server response
      return {
        sign: data.sign,          // e.g., "hello"
        english: data.english,    // e.g., "Hello"
        confidence: data.confidence // e.g., 0.95
      };

    } catch (err: any) {
      console.error('Error during prediction:', err);
      return null;
    }
  }, [isModelLoaded]);

  return { isModelLoaded, predict, error };
}