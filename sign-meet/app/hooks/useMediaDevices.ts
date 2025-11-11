import { useState, useEffect, useRef, useCallback } from 'react';

interface MediaDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput' | 'audiooutput';
}

interface UseMediaDevicesReturn {
  // State
  stream: MediaStream | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  devices: {
    audioInputs: MediaDevice[];
    videoInputs: MediaDevice[];
    audioOutputs: MediaDevice[];
  };
  selectedDevices: {
    audioInput: string;
    videoInput: string;
    audioOutput: string;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startMedia: (audio?: boolean, video?: boolean) => Promise<void>;
  stopMedia: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  switchDevice: (kind: 'audioinput' | 'videoinput' | 'audiooutput', deviceId: string) => Promise<void>;
  refreshDevices: () => Promise<void>;
}

export function useMediaDevices(): UseMediaDevicesReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [devices, setDevices] = useState<{
    audioInputs: MediaDevice[];
    videoInputs: MediaDevice[];
    audioOutputs: MediaDevice[];
  }>({
    audioInputs: [],
    videoInputs: [],
    audioOutputs: []
  });
  const [selectedDevices, setSelectedDevices] = useState({
    audioInput: 'default',
    videoInput: 'default',
    audioOutput: 'default'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  // Enumerate available devices
  const refreshDevices = useCallback(async () => {
    // ✅ Add this check
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      return;
    }
    
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      
      const audioInputs: MediaDevice[] = [];
      const videoInputs: MediaDevice[] = [];
      const audioOutputs: MediaDevice[] = [];

      deviceList.forEach((device) => {
        const mediaDevice: MediaDevice = {
          deviceId: device.deviceId,
          label: device.label || `${device.kind} ${audioInputs.length + videoInputs.length + 1}`,
          kind: device.kind as 'audioinput' | 'videoinput' | 'audiooutput'
        };

        if (device.kind === 'audioinput') {
          audioInputs.push(mediaDevice);
        } else if (device.kind === 'videoinput') {
          videoInputs.push(mediaDevice);
        } else if (device.kind === 'audiooutput') {
          audioOutputs.push(mediaDevice);
        }
      });

      setDevices({ audioInputs, videoInputs, audioOutputs });
    } catch (err: any) {
      console.error('Error enumerating devices:', err);
      setError(err.message || 'Failed to enumerate devices');
    }
  }, []);

  // Start media stream
  const startMedia = useCallback(async (audio = true, video = true) => {
    // ✅ Add this check
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      console.error('Media devices not available');
      setError('Media devices not available. Please use a browser that supports WebRTC.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // ✅ OPTIMIZED: Lower video quality for better performance
      const constraints: MediaStreamConstraints = {
        audio: audio ? {
          deviceId: selectedDevices.audioInput !== 'default' 
            ? { exact: selectedDevices.audioInput }
            : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false,
        video: video ? {
          deviceId: selectedDevices.videoInput !== 'default'
            ? { exact: selectedDevices.videoInput }
            : undefined,
          width: { ideal: 640 },      // ✅ Changed from 1280 to 640 (480p width)
          height: { ideal: 480 },     // ✅ Changed from 720 to 480 (480p height)
          frameRate: { ideal: 24 }    // ✅ Changed from 30 to 24fps
        } : false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      streamRef.current = newStream;
      setStream(newStream);
      setAudioEnabled(audio);
      setVideoEnabled(video);
      
      console.log('✅ Media started with optimized settings: 640x480 @ 24fps');
      
      // Refresh device list after getting permissions
      await refreshDevices();
      
    } catch (err: any) {
      console.error('Error accessing media devices:', err);
      
      let errorMessage = 'Failed to access camera/microphone';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Permission denied. Please allow access to camera and microphone.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera or microphone is already in use.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDevices, refreshDevices]);

  // Stop media stream
  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(prev => !prev);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(prev => !prev);
    }
  }, []);

  // Switch device
  const switchDevice = useCallback(async (
    kind: 'audioinput' | 'videoinput' | 'audiooutput',
    deviceId: string
  ) => {
    if (kind === 'audiooutput') {
      // Audio output switching is handled differently (not in stream)
      setSelectedDevices(prev => ({ ...prev, audioOutput: deviceId }));
      return;
    }

    // Update selected device
    setSelectedDevices(prev => ({
      ...prev,
      [kind === 'audioinput' ? 'audioInput' : 'videoInput']: deviceId
    }));

    // Restart stream with new device
    if (streamRef.current) {
      const hasAudio = streamRef.current.getAudioTracks().length > 0;
      const hasVideo = streamRef.current.getVideoTracks().length > 0;
      await startMedia(hasAudio, hasVideo);
    }
  }, [startMedia]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

  // Listen for device changes
  useEffect(() => {
    // ✅ Add this check
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', refreshDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
      };
    }
  }, [refreshDevices]);

  return {
    stream,
    audioEnabled,
    videoEnabled,
    devices,
    selectedDevices,
    isLoading,
    error,
    startMedia,
    stopMedia,
    toggleAudio,
    toggleVideo,
    switchDevice,
    refreshDevices
  };
}