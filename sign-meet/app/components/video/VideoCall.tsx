'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link as LinkIcon, MessageSquare, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useMediaDevices } from '@/app/hooks/useMediaDevices';
import { usePeerConnection } from '@/app/hooks/usePeerConnection';
import { useCallSession } from '@/app/hooks/useCallSession';
import VideoControls from './VideoControls';
import ParticipantsList from './ParticipantsList';
import ChatPanel from './ChatPanel';
import ModelMetrics from './ModelMetrics';

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

export default function VideoCall({
  meetingId,
  userId,
  userName,
  userRole,
  meetingTitle
}: VideoCallProps) {
  const router = useRouter();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const calledPeersRef = useRef<Set<string>>(new Set()); // ✅ Track who we've called
  const initializingRef = useRef(false); // ✅ Prevent double initialization

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    stream: localStream,
    audioEnabled,
    videoEnabled,
    startMedia,
    stopMedia,
    toggleAudio,
    toggleVideo
  } = useMediaDevices();

  const {
    peer,
    myPeerId,
    remotePeers,
    isConnected: peerConnected,
    initializePeer,
    callPeer,
    answerCall,
    disconnectPeer
  } = usePeerConnection();

  const {
    sessionId,
    callDuration,
    startSession,
    endSession
  } = useCallSession();

  // Initialize video call
  useEffect(() => {
    // ✅ Prevent double initialization (React Strict Mode causes double mount)
    if (initializingRef.current) {
      console.log('⚠️ Already initializing, skipping...');
      return;
    }

    initializingRef.current = true;

    const initialize = async () => {
      try {
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
      if (sessionId) {
        endSession('component_unmounted');
      }
      // ✅ Don't reset initializingRef here - we want it to stay true
      // This prevents re-initialization if the component remounts
    };
  }, []); // ✅ Empty dependency array - only run once

  // ✅ FIXED: Poll for other participants (with duplicate prevention)
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

        // Find other participants who aren't you
        participants.forEach((participant: any) => {
          if (participant.peerId && participant.peerId !== myPeerId) {
            // ✅ Check if we've already called this peer
            if (calledPeersRef.current.has(participant.peerId)) {
              // Already called, skip
              return;
            }

            // ✅ Check if we're already connected to this peer
            const alreadyConnected = remotePeers.some(p => p.peerId === participant.peerId);
            
            if (!alreadyConnected) {
              console.log('🔄 Found new peer, calling:', participant.peerId);
              
              // ✅ Mark as called BEFORE calling
              calledPeersRef.current.add(participant.peerId);
              
              // Call the new peer
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
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [myPeerId, localStream, isInitialized, remotePeers, meetingId, callPeer, userName, userRole]);

  // ✅ Clean up called peers when remote peers disconnect
  useEffect(() => {
    // Get list of currently connected peer IDs
    const connectedPeerIds = remotePeers.map(p => p.peerId);
    
    // Remove peers from "called" list if they're no longer connected
    // This allows us to call them again if they rejoin
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

    peer.on('call', (call) => {
      console.log('📞 Receiving call from:', call.peer);
      answerCall(call, localStream);
    });
  }, [peer, localStream, answerCall]);

  const handleEndCall = async () => {
    await endSession('left_intentionally');
    stopMedia();
    disconnectPeer();
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
          {/* Video Container with Grid Layout */}
          <div className="flex-1 p-6 py-3 relative min-h-0 overflow-hidden">
            {/* Grid Container for Videos (Google Meet Style) */}
            <div className="h-full grid gap-2" style={{
              gridTemplateColumns: remotePeers.length > 0 ? 'repeat(2, 1fr)' : '1fr',
              gridTemplateRows: '1fr'
            }}>
              {/* Local Video (Left side when both present) */}
              <div className="bg-[#1e2936] rounded-2xl overflow-hidden relative">
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
                
                {/* Name Label */}
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-sm text-white font-medium">
                  {userName} (You)
                </div>

                {/* Mic Status */}
                <div className="absolute top-4 right-4">
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

              {/* Remote Video (Right side) */}
              {remotePeers.length > 0 ? (
                <div className="bg-[#1e2936] rounded-2xl overflow-hidden relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Name Label */}
                  <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-sm text-white font-medium">
                    {remotePeers[0].userName || 'Remote User'}
                  </div>

                  {/* Timer Badge (Top Right) */}
                  <div className="absolute top-4 right-4 bg-red-600 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">
                      {Math.floor(callDuration / 60)}:{String(callDuration % 60).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1e2936] rounded-2xl overflow-hidden relative hidden">
                  {/* Hidden when no remote peers - local video takes full width */}
                </div>
              )}
            </div>
          </div>

          {/* Transcription Box - Now has flex-shrink-0 to maintain its size */}
          <div className="mx-6 mb-3 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 flex-shrink-0">
            <div className="flex items-start gap-3 max-w-3xl">
              {/* Audio Wave Icon */}
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-4 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
                <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                <div className="w-1 h-7 bg-white rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
              </div>
              
              {/* Transcription Text */}
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Live Transcription</p>
                <p className="text-sm text-gray-200">
                  Thank you everyone for joining the virtual assistant meeting. I want to know a little about you!
                </p>
              </div>
            </div>
          </div>

          {/* Controls Bar - flex-shrink-0 ensures it stays at the bottom */}
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

        {/* RIGHT: Sidebar - Collapsible */}
        <div 
          className={`bg-[#1a1f2e] border-l border-gray-800 flex flex-col transition-all duration-300 ease-in-out min-h-0 ${
            sidebarOpen ? 'w-96' : 'w-0'
          }`}
          style={{ overflow: sidebarOpen ? 'visible' : 'hidden' }}
        >
          {sidebarOpen && (
            <>
              {/* Close Button */}
              <div className="flex items-center justify-between border-b border-gray-800 flex-shrink-0">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-gray-800 rounded transition-colors"
                  title="Hide sidebar"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Participants Section */}
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

              {/* Model Metrics Section */}
              <div className="p-3 border-b border-gray-800 flex-shrink-0">
                <ModelMetrics
                  confidence={75}
                  templateResponses={79}
                />
              </div>

              {/* Chat Section - Toggleable - Takes remaining space */}
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