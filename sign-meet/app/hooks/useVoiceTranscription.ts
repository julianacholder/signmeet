'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function useVoiceTranscription(
  onPhraseComplete?: (text: string) => void
) {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        isStartingRef.current = false;
        if (isMountedRef.current) {
          setIsListening(true);
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (!isMountedRef.current) return;

        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        const currentSpeech = final || interim;
        setCurrentTranscript(currentSpeech);

        if (final.trim()) {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          silenceTimerRef.current = setTimeout(() => {
            if (onPhraseComplete && final.trim() && isMountedRef.current) {
              onPhraseComplete(final.trim());
            }
            setCurrentTranscript('');
          }, 1500);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
        
        isStartingRef.current = false;
        
        if (isMountedRef.current) {
          setIsListening(false);
        }

        // Don't auto-restart on network errors or permission issues
        if (event.error === 'network' || event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          console.error('Speech recognition blocked:', event.error);
          return;
        }

        // For other errors, restart after a delay
        setTimeout(() => {
          if (isMountedRef.current && recognitionRef.current && !isStartingRef.current) {
            try {
              isStartingRef.current = true;
              recognitionRef.current.start();
            } catch (e) {
              console.log('Error restarting recognition:', e);
              isStartingRef.current = false;
            }
          }
        }, 1000);
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        isStartingRef.current = false;
        if (isMountedRef.current) {
          setIsListening(false);
        }
        
        // Only auto-restart if not manually stopped and no errors
        if (isMountedRef.current && recognitionRef.current && !isStoppingRef.current) {
          setTimeout(() => {
            if (isMountedRef.current && recognitionRef.current && !isStoppingRef.current && !isStartingRef.current) {
              try {
                isStartingRef.current = true;
                recognitionRef.current.start();
              } catch (e) {
                console.log('Recognition already started on auto-restart');
                isStartingRef.current = false;
              }
            }
          }, 500);
        }
      };
    }

    return () => {
      isMountedRef.current = false;
      isStoppingRef.current = true;
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [onPhraseComplete]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && isSupported && !isStartingRef.current) {
      try {
        isStoppingRef.current = false;
        isStartingRef.current = true;
        recognitionRef.current.start();
        console.log('🎤 Manually starting speech recognition');
      } catch (e) {
        console.log('Recognition start failed:', e);
        isStartingRef.current = false;
      }
    }
  }, [isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        isStoppingRef.current = true;
        recognitionRef.current.stop();
        console.log('🎤 Manually stopping speech recognition');
        setIsListening(false);
        setCurrentTranscript('');
        
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
    }
  }, [isListening]);

  return {
    isListening,
    currentTranscript,
    isSupported,
    startListening,
    stopListening,
  };
}