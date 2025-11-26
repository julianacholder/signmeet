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
  const isActiveRef = useRef(false); // ✅ NEW: Track if recognition is actually active

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
        isActiveRef.current = true; // ✅ Mark as active
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
        isActiveRef.current = false; // ✅ Mark as inactive
        
        if (isMountedRef.current) {
          setIsListening(false);
        }

        // Don't auto-restart on these errors
        if (
          event.error === 'network' || 
          event.error === 'not-allowed' || 
          event.error === 'service-not-allowed' ||
          event.error === 'aborted'
        ) {
          console.error('Speech recognition blocked:', event.error);
          isStoppingRef.current = true; // Prevent restart
          return;
        }

        // For "no-speech" errors, don't restart immediately
        if (event.error === 'no-speech') {
          console.log('⏸️ No speech detected, waiting...');
          return;
        }

        // For other errors, restart after a delay if not manually stopped
        if (!isStoppingRef.current) {
          setTimeout(() => {
            if (isMountedRef.current && recognitionRef.current && !isStartingRef.current && !isActiveRef.current) {
              try {
                isStartingRef.current = true;
                recognitionRef.current.start();
              } catch (e) {
                console.log('Error restarting recognition:', e);
                isStartingRef.current = false;
              }
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        isStartingRef.current = false;
        isActiveRef.current = false; // ✅ Mark as inactive
        
        if (isMountedRef.current) {
          setIsListening(false);
        }
        
        // Only auto-restart if not manually stopped and was expected to be active
        if (isMountedRef.current && recognitionRef.current && !isStoppingRef.current && !isActiveRef.current) {
          setTimeout(() => {
            if (isMountedRef.current && recognitionRef.current && !isStoppingRef.current && !isStartingRef.current && !isActiveRef.current) {
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
    // ✅ Check if already active before starting
    if (recognitionRef.current && !isActiveRef.current && isSupported && !isStartingRef.current) {
      try {
        isStoppingRef.current = false;
        isStartingRef.current = true;
        recognitionRef.current.start();
        console.log('🎤 Manually starting speech recognition');
      } catch (e) {
        console.log('Recognition start failed:', e);
        isStartingRef.current = false;
      }
    } else if (isActiveRef.current) {
      console.log('🎤 Recognition already active, skipping start');
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && (isListening || isActiveRef.current)) {
      try {
        isStoppingRef.current = true;
        isActiveRef.current = false; // ✅ Mark as inactive
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