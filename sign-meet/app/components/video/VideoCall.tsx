'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useMediaDevices } from '@/app/hooks/useMediaDevices';
import { usePeerConnection } from '@/app/hooks/usePeerConnection';
import { useCallSession } from '@/app/hooks/useCallSession';
import VideoControls from './VideoControls';
import ParticipantsList from './ParticipantsList';
import ChatPanel from './ChatPanel';
import ModelMetrics from './ModelMetrics';
import SignDetector from '@/app/components/sign-language/SignDetector';
import LiveTranscription from '@/app/components/video/LiveTranscription';
import { useVoiceTranscription } from '@/app/hooks/useVoiceTranscription';
import { useAuth } from '@/app/context/AuthContext';

interface VideoCallProps {
  meetingId: string;
  userId?: string;
  userName: string;
  userRole: string;
  meetingTitle?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isLocal?: boolean;
}

interface CurrentTranscription {
  text: string;
  speaker: string;
  speakerRole: string;
  isLocal: boolean;
}

// Helper function for consistent female voice - OUTSIDE component
const speakWithFemaleVoice = (text: string) => {
  console.log('🔊 speakWithFemaleVoice called with:', text);
  
  if (!('speechSynthesis' in window)) {
    console.error('❌ speechSynthesis not available');
    return;
  }
  
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  // Wait for voices to load
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log('🔊 Available voices:', voices.length);
    
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && (
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('zira')
      )
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log('🔊 Using voice on remote device:', femaleVoice.name);
    } else {
      console.log('⚠️ No specific female voice found, using default');
    }
    
    window.speechSynthesis.speak(utterance);
    console.log('✅ Speech synthesis started');
  };
  
  // Voices might not be loaded immediately
  if (window.speechSynthesis.getVoices().length > 0) {
    setVoice();
  } else {
    console.log('⏳ Waiting for voices to load...');
    window.speechSynthesis.onvoiceschanged = setVoice;
  }
};

export default function VideoCall({
  meetingId,
  userId,
  userName,
  userRole,
  meetingTitle
}: VideoCallProps) {
  const router = useRouter();
  const { profile } = useAuth();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const calledPeersRef = useRef<Set<string>>(new Set());
  const initializingRef = useRef(false);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Single current transcription state
  const [currentTranscription, setCurrentTranscription] = useState<CurrentTranscription>({
    text: '',
    speaker: '',
    speakerRole: '',
    isLocal: false
  });

  const [signConfidence, setSignConfidence] = useState<number>(0);
  const [remoteTranscriptForCandidate, setRemoteTranscriptForCandidate] = useState<string>('');
  
  // ✅ NEW: Model prediction state
  const [modelPrediction, setModelPrediction] = useState<{
    sign: string;
    confidence: number;
    english: string;
  } | null>(null);

  // Determine user type
  const isCandidate = profile?.user_type === 'deaf' || userRole === 'candidate';
  const isCompanyOrGuest = profile?.user_type === 'company' || userRole === 'company' || userRole === 'interviewer' || userRole === 'guest' || !userId;

  const {
    stream: localStream,
    audioEnabled,
    videoEnabled,
    startMedia,
    stopMedia,
    toggleAudio,
    toggleVideo
  } = useMediaDevices();

  // Handle received transcriptions from remote peer
  const handleTranscriptionReceived = useCallback((message: any) => {
    console.log('📨 RAW MESSAGE RECEIVED:', JSON.stringify(message, null, 2));
    
    const shouldSpeak = message.shouldSpeak === true || message.shouldSpeak === 'true';
    
    console.log('📨 Received transcription:', message.text, 'shouldSpeak:', shouldSpeak, '(raw:', message.shouldSpeak, ')');
    console.log('🔍 Current user type check - isCompanyOrGuest:', isCompanyOrGuest, 'isCandidate:', isCandidate);
    
    setCurrentTranscription({
      text: message.text,
      speaker: message.sender,
      speakerRole: message.senderRole,
      isLocal: false
    });

    // ✅ If candidate, feed to SignDetector
    if (isCandidate) {
      console.log('📝 Feeding to SignDetector (candidate mode)');
      setRemoteTranscriptForCandidate(message.text);
    }

    // ✅ If this is from a candidate and should be spoken, speak it
    if (shouldSpeak) {
      console.log('🔊 shouldSpeak is TRUE, checking if we should speak...');
      console.log('🔊 isCompanyOrGuest:', isCompanyOrGuest);
      
      if (isCompanyOrGuest && 'speechSynthesis' in window) {
        console.log('✅ SPEAKING on remote device:', message.text);
        speakWithFemaleVoice(message.text);
      } else {
        console.log('❌ NOT speaking - isCompanyOrGuest:', isCompanyOrGuest, 'speechSynthesis available:', 'speechSynthesis' in window);
      }
    } else {
      console.log('⏭️ Skipping speech - shouldSpeak is false');
    }
  }, [isCandidate, isCompanyOrGuest]);

  const {
    peer,
    myPeerId,
    remotePeers,
    isConnected: peerConnected,
    initializePeer,
    callPeer,
    answerCall,
    disconnectPeer,
    sendTranscription
  } = usePeerConnection(handleTranscriptionReceived);

  const {
    sessionId,
    callDuration,
    startSession,
    endSession
  } = useCallSession();

  const [fullProfile, setFullProfile] = useState<any>(null);
  const [videoReady, setVideoReady] = useState(false);

  // ✅ Voice transcription ONLY for company/guest users
  const handlePhraseComplete = useCallback((text: string) => {
    console.log('🎤 Voice phrase complete:', text);
    
    // Update local display
    setCurrentTranscription({
      text,
      speaker: userName,
      speakerRole: userRole,
      isLocal: true
    });

    // Send to remote peer WITHOUT shouldSpeak (voice is already transmitted via audio stream)
    sendTranscription(text, {
      sender: userName,
      senderRole: userRole
      // No shouldSpeak here - voice is already transmitted via audio stream
    });
  }, [userName, userRole, sendTranscription]);

  const voiceTranscription = isCompanyOrGuest 
    ? useVoiceTranscription(handlePhraseComplete)
    : {
        isListening: false,
        currentTranscript: '',
        isSupported: false,
        startListening: () => {},
        stopListening: () => {}
      };

  const {
    isListening,
    currentTranscript: liveVoiceTranscript,
    isSupported: voiceSupported,
    startListening,
    stopListening
  } = voiceTranscription;

  // Show live voice transcript while speaking (before phrase completes)
  useEffect(() => {
    if (isCompanyOrGuest && liveVoiceTranscript && liveVoiceTranscript.length > 0) {
      setCurrentTranscription({
        text: liveVoiceTranscript,
        speaker: userName,
        speakerRole: userRole,
        isLocal: true
      });
    }
  }, [liveVoiceTranscript, isCompanyOrGuest, userName, userRole]);

  // Start/stop voice recognition based on audio state
  useEffect(() => {
    if (isCompanyOrGuest && voiceSupported) {
      if (audioEnabled && !isListening) {
        console.log('🎤 Starting voice recognition');
        startListening();
      } else if (!audioEnabled && isListening) {
        console.log('🎤 Stopping voice recognition');
        stopListening();
      }
    }
  }, [audioEnabled, isCompanyOrGuest, voiceSupported, isListening, startListening, stopListening]);

  const handleSignDetected = useCallback((sign: string, text: string, confidence: number) => {
    console.log('👋 Sign detected:', text);
    
    setSignConfidence(confidence);
    
    // Update local display immediately
    setCurrentTranscription({
      text,
      speaker: userName,
      speakerRole: userRole,
      isLocal: true
    });

    // ✅ SPEAK THE TEXT ALOUD locally with FEMALE VOICE
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Wait for voices to load and select female voice
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.lang.startsWith('en') && (
            voice.name.toLowerCase().includes('female') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria') ||
            voice.name.toLowerCase().includes('zira')
          )
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
          console.log('🔊 Using voice on signer device:', femaleVoice.name);
        }
        
        window.speechSynthesis.speak(utterance);
      };
      
      // Voices might not be loaded immediately
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    }

    // ✅ Send to remote IMMEDIATELY with forced boolean
    sendTranscription(text, {
      sender: userName,
      senderRole: userRole,
      shouldSpeak: true // 👈 Remote will also speak this
    });

  }, [userName, userRole, sendTranscription]);

  // ✅ NEW: Handle model predictions from SignDetector
  const handleModelPrediction = useCallback((prediction: { sign: string; confidence: number; english: string }) => {
    console.log('🤖 Model prediction received:', prediction);
    setModelPrediction(prediction);
    
    // Clear after 5 seconds
    setTimeout(() => setModelPrediction(null), 5000);
  }, []);

  // Initialize video call
  useEffect(() => {
    if (initializingRef.current) {
      console.log('⚠️ Already initializing, skipping...');
      return;
    }

    initializingRef.current = true;

    const initialize = async () => {
      try {
        console.log('🚀 Initializing video call...');
        await startMedia(true, true);
        const peerId = await initializePeer(userId);
        
        if (!peerId) {
          toast.error('Failed to initialize connection');
          return;
        }

        await startSession({
          meetingId,
          userId,
          userName,
          userRole,
          peerId
        });

        setIsInitialized(true);
        console.log('✅ Video call initialized successfully');
      } catch (error: any) {
        console.error('Error initializing video call:', error);
        toast.error('Failed to start video call');
      }
    };

    initialize();

    return () => {
      console.log('🧹 Cleaning up video call...');
      stopMedia();
      disconnectPeer();
      stopListening();
      if (sessionId) {
        endSession('component_unmounted');
      }
    };
  }, [meetingId, userId, userName, userRole, startMedia, initializePeer, startSession, stopMedia, disconnectPeer, stopListening, endSession, sessionId]);

  useEffect(() => {
    if (!myPeerId || !localStream || !isInitialized) return;

    console.log('👀 Starting to look for other participants...');

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/meeting/${meetingId}/participants`);
        
        if (!response.ok) {
          console.error('Failed to fetch participants');
          return;
        }

        const data = await response.json();
        const { participants } = data;
        
        console.log('📋 Found participants:', participants.length);

        participants.forEach((participant: any) => {
          if (participant.peerId && participant.peerId !== myPeerId) {
            if (calledPeersRef.current.has(participant.peerId)) {
              return;
            }

            const alreadyConnected = remotePeers.some(p => p.peerId === participant.peerId);
            
            if (!alreadyConnected) {
              console.log('🔄 Found new peer, calling:', participant.peerId);
              
              calledPeersRef.current.add(participant.peerId);
              
              callPeer(participant.peerId, localStream, {
                userName,
                userRole
              });
            }
          }
        });
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [myPeerId, localStream, isInitialized, remotePeers, meetingId, callPeer, userName, userRole]);

  useEffect(() => {
    const connectedPeerIds = remotePeers.map(p => p.peerId);
    
    const calledPeers = Array.from(calledPeersRef.current);
    calledPeers.forEach(peerId => {
      if (!connectedPeerIds.includes(peerId)) {
        console.log('🧹 Removing disconnected peer from called list:', peerId);
        calledPeersRef.current.delete(peerId);
      }
    });
  }, [remotePeers]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remotePeers.length > 0) {
      remoteVideoRef.current.srcObject = remotePeers[0].stream;
    }
  }, [remotePeers]);

  useEffect(() => {
    if (!peer || !localStream) return;

    const handleIncomingCall = (call: any) => {
      console.log('📞 Receiving call from:', call.peer);
      answerCall(call, localStream);
    };

    peer.on('call', handleIncomingCall);

    return () => {
      peer.off('call', handleIncomingCall);
    };
  }, [peer, localStream, answerCall]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      const video = localVideoRef.current;
      
      const handleLoadedMetadata = () => {
        console.log('🎥 Video metadata loaded:', video.videoWidth, 'x', video.videoHeight);
        setVideoReady(true);
      };
      
      const handleCanPlay = () => {
        console.log('🎥 Video can play');
        setVideoReady(true);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [localStream]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFullProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEndCall = async () => {
    console.log('📞 Ending call...');
    await endSession('left_intentionally');
    stopMedia();
    disconnectPeer();
    stopListening();
    router.push(`/meeting/${meetingId}`);
    toast.success('Call ended');
  };

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: userId || 'guest',
      senderName: userName,
      message,
      timestamp: new Date(),
      isLocal: true
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    toast.success('Meeting link copied!');
  };

  return (
    <div className="h-screen bg-[#0f1419] flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1a1f2e] border-b border-gray-800 text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold">{meetingTitle || 'test meeting'}</h1>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>
        
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 rounded-lg transition-colors"
        >
          <LinkIcon className="w-4 h-4" />
          <span className="text-sm">Copy Join Link</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* LEFT: Video Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Video Container */}
          <div className="flex-1 p-6 py-3 relative min-h-0 overflow-hidden">
            <div className="h-full grid gap-2" style={{
              gridTemplateColumns: remotePeers.length > 0 ? 'repeat(2, 1fr)' : '1fr',
              gridTemplateRows: '1fr'
            }}>

              {/* Local Video */}
              <div className="bg-[#1e2936] rounded-2xl overflow-hidden relative" style={{ minHeight: '300px' }}>
                <div className="relative w-full h-full">
                  {videoEnabled && localStream ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-primary/70 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold">
                            {userName.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm mt-2">{userName}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* SignDetector ONLY for candidates */}
                  {isCandidate && isInitialized && localStream && videoReady && (
                    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                      <SignDetector
                        videoStream={localStream}
                        userId={userId}
                        userName={userName}
                        userProfile={fullProfile}
                        onSignDetected={handleSignDetected}
                        onTranscriptionUpdate={(text) => {
                          // Optional: show interim sign detection
                        }}
                        onModelPrediction={handleModelPrediction}
                        remoteTranscript={remoteTranscriptForCandidate}
                      />
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-sm text-white font-medium z-20">
                  {userName} (You)
                </div>

                <div className="absolute top-4 right-4 z-20">
                  {!audioEnabled && (
                    <div className="bg-red-600 p-2 rounded-full">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Remote Video */}
              {remotePeers.length > 0 ? (
                <div className="bg-[#1e2936] rounded-2xl overflow-hidden relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-sm text-white font-medium">
                    {remotePeers[0].userName || 'Remote User'}
                  </div>

                  <div className="absolute top-4 right-4 bg-red-600 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">
                      {Math.floor(callDuration / 60)}:{String(callDuration % 60).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1e2936] rounded-2xl overflow-hidden relative hidden"></div>
              )}
            </div>
          </div>

          {/* Live Transcription Box */}
          <div className="mx-6 mb-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 flex-shrink-0" style={{ minHeight: '100px' }}>
            <LiveTranscription
              currentText={currentTranscription.text}
              currentSpeaker={currentTranscription.speaker}
              currentSpeakerRole={currentTranscription.speakerRole}
              isCurrentUserSpeaking={currentTranscription.isLocal}
            />
          </div>

          {/* Controls Bar */}
          <div className="bg-[#161929] py-3 border-t border-gray-800 flex-shrink-0">
            <VideoControls
              audioEnabled={audioEnabled}
              videoEnabled={videoEnabled}
              onToggleAudio={toggleAudio}
              onToggleVideo={toggleVideo}
              onEndCall={handleEndCall}
              onToggleChat={() => setShowChat(!showChat)}
            />
          </div>
        </div>

        {/* Toggle Button for Sidebar */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1a1f2e] border border-gray-800 rounded-l-lg p-2 hover:bg-gray-800 transition-colors z-10"
            title="Show sidebar"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* RIGHT: Sidebar */}
        <div 
          className={`bg-[#1a1f2e] border-l border-gray-800 flex flex-col transition-all duration-300 ease-in-out min-h-0 ${
            sidebarOpen ? 'w-96' : 'w-0'
          }`}
          style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
        >
          {sidebarOpen && (
            <>
              <div className="flex items-center justify-between border-b border-gray-800 flex-shrink-0">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-gray-800 rounded transition-colors"
                  title="Hide sidebar"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-3 border-b border-gray-800 flex-shrink-0 max-h-[200px] overflow-y-auto">
                <ParticipantsList
                  participants={[
                    {
                      peerId: myPeerId || '',
                      userId,
                      userName,
                      userRole,
                      audioEnabled,
                      videoEnabled: videoEnabled,
                      isLocal: true
                    },
                    ...remotePeers.map(p => ({
                      peerId: p.peerId,
                      userName: p.userName || 'Remote User',
                      userRole: p.userRole || 'participant',
                      audioEnabled: true,
                      videoEnabled: true
                    }))
                  ]}
                  currentUserId={userId}
                />
              </div>

              {/* Model Metrics - ONLY for candidates */}
              {isCandidate && (
                <div className="p-3 border-b border-gray-800 flex-shrink-0">
                  <ModelMetrics
                    confidence={signConfidence * 100}
                    templateResponses={79}
                  />
                  
                  {/* ✅ ML Model Prediction Display */}
                  {/* {modelPrediction && (
                    <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                      <div className="text-xs font-semibold text-blue-400 mb-2">
                        🤖 ML Model Prediction
                      </div>
                      <div className="text-sm text-white">
                        Sign: <span className="font-mono">{modelPrediction.sign}</span>
                      </div>
                      <div className="text-sm text-white">
                        English: {modelPrediction.english}
                      </div>
                      <div className="text-sm text-white">
                        Confidence: {(modelPrediction.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  )} */}
                </div>
              )}

              {/* Chat Section */}
              {showChat ? (
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  <ChatPanel
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    currentUserName={userName}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 min-h-0">
                  <div className="text-center text-gray-500">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Click 💬 to start chatting</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}