import { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { MediaConnection, DataConnection } from 'peerjs';

interface RemotePeer {
  peerId: string;
  stream: MediaStream;
  userName?: string;
  userRole?: string;
  connection?: MediaConnection;
  dataConnection?: DataConnection;
}

interface TranscriptionMessage {
  type: 'transcription';
  text: string;
  sender: string;
  senderRole: string;
  timestamp: number;
  shouldSpeak?: boolean;
}

// ✅ NEW: Interface for transcription metadata
interface TranscriptionMetadata {
  sender: string;
  senderRole: string;
  shouldSpeak?: boolean;
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
  sendTranscription: (text: string, metadata: TranscriptionMetadata) => void; // ✅ UPDATED
  
  // Data channel events
  onTranscriptionReceived?: (message: TranscriptionMessage) => void;
}

export function usePeerConnection(
  onTranscriptionReceived?: (message: TranscriptionMessage) => void
): UsePeerConnectionReturn {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const callsRef = useRef<Map<string, MediaConnection>>(new Map());
  const dataConnectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const onTranscriptionReceivedRef = useRef(onTranscriptionReceived);

  // Update ref when callback changes
  useEffect(() => {
    onTranscriptionReceivedRef.current = onTranscriptionReceived;
  }, [onTranscriptionReceived]);

  // Setup data connection
  const setupDataConnection = useCallback((conn: DataConnection, peerId: string) => {
    console.log('📡 Setting up data connection with:', peerId);
    
    conn.on('open', () => {
      console.log('✅ Data connection opened with:', peerId);
      dataConnectionsRef.current.set(peerId, conn);
      
      // Update remote peer with data connection
      setRemotePeers(prev => 
        prev.map(p => 
          p.peerId === peerId 
            ? { ...p, dataConnection: conn }
            : p
        )
      );
    });

     conn.on('data', (data: any) => {
  console.log('📨 Received data from:', peerId, data);
  
  if (data.type === 'transcription' && onTranscriptionReceivedRef.current) {
    const shouldSpeak = data.shouldSpeak === true || data.shouldSpeak === 'true';
    
    const cleanMessage: TranscriptionMessage = {
      type: 'transcription',
      text: data.text,
      sender: data.sender,
      senderRole: data.senderRole,
      timestamp: data.timestamp,
      shouldSpeak: shouldSpeak
    };
    
    onTranscriptionReceivedRef.current(cleanMessage);
    // ✅ Speech synthesis is handled in VideoCall.tsx, not here
  }
});

    conn.on('close', () => {
      console.log('🔴 Data connection closed with:', peerId);
      dataConnectionsRef.current.delete(peerId);
    });

    conn.on('error', (err) => {
      console.error('❌ Data connection error with', peerId, ':', err);
      dataConnectionsRef.current.delete(peerId);
    });
  }, []);

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

      const newPeer = new Peer(peerId, {
        host: '0.peerjs.com',
        port: 443,
        path: '/',
        secure: true,
        debug: 2,
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
        callsRef.current.set(call.peer, call);
      });

      // Handle incoming data connections
      newPeer.on('connection', (conn) => {
        console.log('📡 Incoming data connection from:', conn.peer);
        setupDataConnection(conn, conn.peer);
      });

      // Handle peer errors
      newPeer.on('error', (err) => {
        console.error('❌ Peer error:', err);
        setError(err.message || 'Peer connection error');
      });

      // Handle peer disconnection
      newPeer.on('disconnected', () => {
        console.log('⚠️ Peer disconnected');
        setIsConnected(false);
        
        if (peerRef.current && !peerRef.current.destroyed && peerRef.current.disconnected) {
          console.log('🔄 Attempting to reconnect...');
          setTimeout(() => {
            if (peerRef.current && !peerRef.current.destroyed) {
              peerRef.current.reconnect();
            }
          }, 1000);
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
  }, [setupDataConnection]);

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
      
      // Create media connection
      const call = peerRef.current.call(peerId, stream, {
        metadata: metadata || {}
      });

      callsRef.current.set(peerId, call);

      // Create data connection
      const dataConn = peerRef.current.connect(peerId, {
        reliable: true
      });
      
      setupDataConnection(dataConn, peerId);

      // Handle when call is answered
      call.on('stream', (remoteStream) => {
        console.log('✅ Received stream from:', peerId);
        
        setRemotePeers(prev => {
          const existingIndex = prev.findIndex(p => p.peerId === peerId);
          
          const newPeer: RemotePeer = {
            peerId,
            stream: remoteStream,
            userName: metadata?.userName,
            userRole: metadata?.userRole,
            connection: call,
            dataConnection: dataConnectionsRef.current.get(peerId)
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
        console.log('🔴 Call closed with:', peerId);
        setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
        callsRef.current.delete(peerId);
        
        // Close data connection
        const dataConn = dataConnectionsRef.current.get(peerId);
        if (dataConn) {
          dataConn.close();
          dataConnectionsRef.current.delete(peerId);
        }
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
  }, [setupDataConnection]);

  // Answer incoming call
  const answerCall = useCallback((call: MediaConnection, stream: MediaStream) => {
    console.log('📞 Answering call from:', call.peer);
    
    call.answer(stream);
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
          connection: call,
          dataConnection: dataConnectionsRef.current.get(call.peer)
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

  const sendTranscription = useCallback((
  text: string, 
  metadata: TranscriptionMetadata
) => {
  const message: TranscriptionMessage = {
    type: 'transcription',
    text,
    sender: metadata.sender,
    senderRole: metadata.senderRole,
    timestamp: Date.now(),
    shouldSpeak: metadata.shouldSpeak // ✅ Include speech flag
  };

  console.log('📤 Sending transcription to', dataConnectionsRef.current.size, 'peers', 
    metadata.shouldSpeak ? '(with speech)' : '(text only)');
  
  // ✅ DEBUG: Log the exact message being sent
  console.log('🔍 Sending message:', JSON.stringify(message, null, 2));

  dataConnectionsRef.current.forEach((conn, peerId) => {
    if (conn.open) {
      try {
        conn.send(message);
        console.log('✅ Sent transcription to:', peerId);
      } catch (err) {
        console.error('❌ Error sending transcription to', peerId, ':', err);
      }
    }
  });
}, []);

  // Remove a specific peer
  const removePeer = useCallback((peerId: string) => {
    const call = callsRef.current.get(peerId);
    if (call) {
      call.close();
      callsRef.current.delete(peerId);
    }
    
    const dataConn = dataConnectionsRef.current.get(peerId);
    if (dataConn) {
      dataConn.close();
      dataConnectionsRef.current.delete(peerId);
    }
    
    setRemotePeers(prev => prev.filter(p => p.peerId !== peerId));
  }, []);

  // Disconnect peer
  const disconnectPeer = useCallback(() => {
    // Close all active calls
    callsRef.current.forEach(call => call.close());
    callsRef.current.clear();

    // Close all data connections
    dataConnectionsRef.current.forEach(conn => conn.close());
    dataConnectionsRef.current.clear();

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
    removePeer,
    sendTranscription,
    onTranscriptionReceived
  };
}