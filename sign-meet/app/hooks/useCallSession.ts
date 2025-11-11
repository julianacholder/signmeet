import { useState, useCallback, useRef, useEffect } from 'react';

interface CallSession {
  id: string;
  meetingId: string;
  peerId: string;
  joinedAt: string;
  leftAt?: string;
  duration?: number;
}

interface UseCallSessionReturn {
  // State
  sessionId: string | null;
  isInCall: boolean;
  callDuration: number; // in seconds
  error: string | null;
  
  // Actions
  startSession: (params: {
    meetingId: string;
    userId?: string;
    userName: string;
    userRole: string;
    peerId: string;
  }) => Promise<boolean>;
  endSession: (disconnectReason?: string) => Promise<boolean>;
  getSessionHistory: (meetingId: string, userId?: string) => Promise<any>;
}

export function useCallSession(): UseCallSessionReturn {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string | null>(null);
  const meetingIdRef = useRef<string | null>(null); // ✅ Store meetingId for cleanup
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const joinTimeRef = useRef<number | null>(null);
  const isEndingRef = useRef(false); // ✅ Prevent duplicate end calls
  const isStartingRef = useRef(false); // ✅ Prevent duplicate start calls

  // Start call session
  const startSession = useCallback(async (params: {
    meetingId: string;
    userId?: string;
    userName: string;
    userRole: string;
    peerId: string;
  }): Promise<boolean> => {
    // ✅ CRITICAL: Prevent duplicate session creation
    if (isStartingRef.current || sessionIdRef.current) {
      console.log('⚠️ Session already starting or exists, skipping...');
      return false;
    }

    isStartingRef.current = true;
    setError(null);

    try {
      console.log('🚀 Starting call session...');

      // ✅ Store meetingId for later use
      meetingIdRef.current = params.meetingId;

      // ✅ ONLY check for active session if user is authenticated (has UUID)
      // Skip check for guest users to avoid UUID validation errors
      if (params.userId && params.userId !== 'guest' && !params.userId.startsWith('guest-')) {
        const checkResponse = await fetch(
          `/api/meeting/${params.meetingId}/check-session?userId=${params.userId}`
        );

        if (checkResponse.ok) {
          const { hasActiveSession, sessionId: existingSessionId } = await checkResponse.json();
          
          if (hasActiveSession) {
            console.log('✅ Already have active session, reusing:', existingSessionId);
            sessionIdRef.current = existingSessionId;
            setSessionId(existingSessionId);
            setIsInCall(true);
            
            // Start duration tracking
            joinTimeRef.current = Date.now();
            durationIntervalRef.current = setInterval(() => {
              if (joinTimeRef.current) {
                const duration = Math.floor((Date.now() - joinTimeRef.current) / 1000);
                setCallDuration(duration);
              }
            }, 1000);
            
            return true;
          }
        }
      }

      // ✅ Create new session
      const response = await fetch('/api/call-session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start session');
      }

      const data = await response.json();
      const newSessionId = data.sessionId;

      sessionIdRef.current = newSessionId;
      setSessionId(newSessionId);
      setIsInCall(true);

      // Start duration tracking
      joinTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        if (joinTimeRef.current) {
          const duration = Math.floor((Date.now() - joinTimeRef.current) / 1000);
          setCallDuration(duration);
        }
      }, 1000);

      console.log('✅ Call session started:', newSessionId);
      return true;

    } catch (error: any) {
      console.error('❌ Error starting session:', error);
      setError(error.message || 'Failed to start call session');
      return false;
    } finally {
      isStartingRef.current = false; // ✅ Reset flag
    }
  }, []);

  // End call session
  const endSession = useCallback(async (
    disconnectReason: string = 'left_intentionally'
  ): Promise<boolean> => {
    // ✅ Prevent duplicate end calls
    if (isEndingRef.current) {
      console.log('⚠️ Already ending session, skipping...');
      return false;
    }

    if (!sessionIdRef.current) {
      console.warn('⚠️ No active session to end');
      return false;
    }

    // ✅ Use stored meetingId instead of trying to extract from sessionId
    if (!meetingIdRef.current) {
      console.warn('⚠️ No meetingId available');
      return false;
    }

    isEndingRef.current = true;
    setError(null);

    try {
      console.log('🛑 Ending session:', sessionIdRef.current);
      
      const response = await fetch(`/api/meeting/${meetingIdRef.current}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          disconnectReason
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // ✅ Don't throw error if session not found - it may have already ended
        if (data.error === 'No active session found') {
          console.log('ℹ️ Session was already ended');
        } else {
          throw new Error(data.error || 'Failed to end session');
        }
      }

      // Clear duration interval
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      sessionIdRef.current = null;
      meetingIdRef.current = null;
      setSessionId(null);
      setIsInCall(false);
      joinTimeRef.current = null;

      console.log('✅ Session ended successfully');
      return true;

    } catch (err: any) {
      console.error('❌ Error ending session:', err);
      setError(err.message || 'Failed to end session');
      return false;
    } finally {
      isEndingRef.current = false;
    }
  }, []);

  // Get session history
  const getSessionHistory = useCallback(async (
    meetingId: string,
    userId?: string
  ): Promise<any> => {
    setError(null);

    try {
      const url = userId
        ? `/api/meeting/${meetingId}/sessions?userId=${userId}`
        : `/api/meeting/${meetingId}/sessions`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch session history');
      }

      return data.data;

    } catch (err: any) {
      console.error('Error fetching session history:', err);
      setError(err.message || 'Failed to fetch session history');
      return null;
    }
  }, []);

  // Handle page unload (user closes tab/browser)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionIdRef.current && meetingIdRef.current) {
        // Use sendBeacon for reliable tracking even when page closes
        const blob = new Blob([JSON.stringify({
          sessionId: sessionIdRef.current,
          disconnectReason: 'tab_closed'
        })], { type: 'application/json' });
        
        navigator.sendBeacon(
          `/api/meeting/${meetingIdRef.current}/leave`,
          blob
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Cleanup duration interval
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionIdRef.current && !isEndingRef.current) {
        endSession('component_unmounted');
      }
    };
  }, [endSession]);

  return {
    sessionId,
    isInCall,
    callDuration,
    error,
    startSession,
    endSession,
    getSessionHistory
  };
}