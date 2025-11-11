import { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';

interface RemotePeer {
  peerId: string;
  stream: MediaStream;
  userName?: string;
  userRole?: string;
  connection?: MediaConnection;
}

interface UsePeerConnectionReturn {
  // State
  peer: Peer | null;
  myPeerId: string | null;
  remotePeers: RemotePeer[];
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // Actions
  initializePeer: (userId?: string) => Promise<string | null>;
  callPeer: (peerId: string, stream: MediaStream, metadata?: any) => void;
  answerCall: (call: MediaConnection, stream: MediaStream) => void;
  disconnectPeer: () => void;
  removePeer: (peerId: string) => void;
}

export function usePeerConnection(): UsePeerConnectionReturn {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const callsRef = useRef<Map<string, MediaConnection>>(new Map());

  // Initialize PeerJS connection
  const initializePeer = useCallback(async (userId?: string): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);

    try {
      // Clean up existing peer
      if (peerRef.current) {
        peerRef.current.destroy();
      }

      // Create unique peer ID
      const peerId = userId 
        ? `peer-${userId}-${Date.now()}`
        : `peer-guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log('🔄 Initializing peer with ID:', peerId);

      // ✅ FIXED: Use correct PeerJS server
      const newPeer = new Peer(peerId, {
        host: '0.peerjs.com',  // ✅ Changed from 'peerjs.com' to '0.peerjs.com'
        port: 443,
        path: '/',
        secure: true,
        debug: 2,  // ✅ Added: Show debug logs
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        }
      });

      // Handle peer open event
      newPeer.on('open', (id) => {
        console.log('✅ Peer connected with ID:', id);
        setMyPeerId(id);
        setIsConnected(true);
        setIsConnecting(false);
        peerRef.current = newPeer;
        setPeer(newPeer);
      });

      // Handle incoming calls
      newPeer.on('call', (call) => {
        console.log('📞 Incoming call from:', call.peer);
        
        // Store the call
        callsRef.current.set(call.peer, call);

        // You'll need to answer this call with your stream
        // This is typically done in the component using the hook
      });

      // Handle peer errors
     newPeer.on('disconnected', () => {
  console.log('⚠️ Peer disconnected');
  setIsConnected(false);
  
  // Only try to reconnect if peer is actually disconnected
  if (peerRef.current && !peerRef.current.destroyed && peerRef.current.disconnected) {
    console.log('🔄 Attempting to reconnect...');
    setTimeout(() => {
      if (peerRef.current && !peerRef.current.destroyed) {
        peerRef.current.reconnect();
      }
    }, 1000); // Wait 1 second before reconnecting
  }
});

      // Handle peer disconnection
      newPeer.on('disconnected', () => {
        console.log('⚠️ Peer disconnected');
        setIsConnected(false);
        
        // Try to reconnect
        if (peerRef.current && !peerRef.current.destroyed) {
          console.log('🔄 Attempting to reconnect...');
          peerRef.current.reconnect();
        }
      });

      // Handle peer close
      newPeer.on('close', () => {
        console.log('🔴 Peer connection closed');
        setIsConnected(false);
      });

      return peerId;

    } catch (err: any) {
      console.error('❌ Error initializing peer:', err);
      setError(err.message || 'Failed to initialize peer connection');
      setIsConnecting(false);
      return null;
    }
  }, []);

  // Call another peer
  const callPeer = useCallback((
    peerId: string, 
    stream: MediaStream,
    metadata?: any
  ) => {
    if (!peerRef.current) {
      console.error('❌ Peer not initialized');
      return;
    }

    try {
      console.log('📞 Calling peer:', peerId);
      
      const call = peerRef.current.call(peerId, stream, {
        metadata: metadata || {}
      });

      // Store the call
      callsRef.current.set(peerId, call);

      // Handle when call is answered
      call.on('stream', (remoteStream) => {
        console.log('✅ Received stream from:', peerId);
        
        setRemotePeers(prev => {
          // Check if peer already exists
          const existingIndex = prev.findIndex(p => p.peerId === peerId);
          
          const newPeer: RemotePeer = {
            peerId,
            stream: remoteStream,
            userName: metadata?.userName,
            userRole: metadata?.userRole,
            connection: call
          };

          if (existingIndex >= 0) {
            // Update existing peer
            const updated = [...prev];
            updated[existingIndex] = newPeer;
            return updated;
          } else {
            // Add new peer
            return [...prev, newPeer];
          }
        });
      });

      // Handle call close
      call.on('close', () => {
        console.log('🔴 Call closed with:', peerId);
        setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
        callsRef.current.delete(peerId);
      });

      // Handle call errors
      call.on('error', (err) => {
        console.error('❌ Call error with', peerId, ':', err);
        setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
        callsRef.current.delete(peerId);
      });

    } catch (err: any) {
      console.error('❌ Error calling peer:', err);
      setError(err.message || 'Failed to call peer');
    }
  }, []);

  // Answer incoming call
  const answerCall = useCallback((call: MediaConnection, stream: MediaStream) => {
    console.log('📞 Answering call from:', call.peer);
    
    // Answer the call with your stream
    call.answer(stream);

    // Store the call
    callsRef.current.set(call.peer, call);

    // Handle when remote stream is received
    call.on('stream', (remoteStream) => {
      console.log('✅ Received stream from:', call.peer);
      
      setRemotePeers(prev => {
        const existingIndex = prev.findIndex(p => p.peerId === call.peer);
        
        const newPeer: RemotePeer = {
          peerId: call.peer,
          stream: remoteStream,
          userName: call.metadata?.userName,
          userRole: call.metadata?.userRole,
          connection: call
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newPeer;
          return updated;
        } else {
          return [...prev, newPeer];
        }
      });
    });

    // Handle call close
    call.on('close', () => {
      console.log('🔴 Call closed with:', call.peer);
      setRemotePeers(prev => prev.filter(p => p.peerId !== call.peer));
      callsRef.current.delete(call.peer);
    });

  }, []);

  // Remove a specific peer
  const removePeer = useCallback((peerId: string) => {
    const call = callsRef.current.get(peerId);
    if (call) {
      call.close();
      callsRef.current.delete(peerId);
    }
    setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
  }, []);

  // Disconnect peer
  const disconnectPeer = useCallback(() => {
    // Close all active calls
    callsRef.current.forEach(call => call.close());
    callsRef.current.clear();

    // Destroy peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    setPeer(null);
    setMyPeerId(null);
    setRemotePeers([]);
    setIsConnected(false);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectPeer();
    };
  }, [disconnectPeer]);

  return {
    peer,
    myPeerId,
    remotePeers,
    isConnected,
    isConnecting,
    error,
    initializePeer,
    callPeer,
    answerCall,
    disconnectPeer,
    removePeer
  };
}