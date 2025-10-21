'use client';
import React, { useState, useEffect, useRef } from 'react';
import { User, Mic, MicOff, Video, VideoOff, Settings } from 'lucide-react';

interface DeviceList {
  audio: MediaDeviceInfo[];
  video: MediaDeviceInfo[];
}

export default function VideoSetupModal() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [devices, setDevices] = useState<DeviceList>({ audio: [], video: [] });
  const [selectedAudio, setSelectedAudio] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get available devices
  useEffect(() => {
    async function getDevices() {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = deviceList.filter(device => device.kind === 'audioinput');
        const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
        
        setDevices({ audio: audioDevices, video: videoDevices });
        
        if (audioDevices.length > 0) setSelectedAudio(audioDevices[0].deviceId);
        if (videoDevices.length > 0) setSelectedVideo(videoDevices[0].deviceId);
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    }
    getDevices();
  }, []);

  // Initialize media stream
  useEffect(() => {
    async function setupMedia() {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: selectedVideo ? { deviceId: selectedVideo } : true,
          audio: selectedAudio ? { deviceId: selectedAudio } : true
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media:', error);
      }
    }

    if (selectedAudio && selectedVideo) {
      setupMedia();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedAudio, selectedVideo]);

  // Toggle mute
  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Get Started</h1>
          <p className="text-gray-600">Setup your audio and video before joining</p>
          <div className="inline-block mt-3 px-4 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
            You are the first to join
          </div>
        </div>

        {/* Video Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
          <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            />
            
            {/* User Icon when video is off */}
            {isVideoOff && (
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2.5 bg-gray-800/90 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>

              <button className="p-1 bg-gray-800/90 hover:bg-gray-700 rounded transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="1.5"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="18" r="1.5"/>
                </svg>
              </button>

              <button
                onClick={toggleVideo}
                className="p-2.5 bg-gray-800/90 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isVideoOff ? (
                  <VideoOff className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </button>

              <button className="p-1 bg-gray-800/90 hover:bg-gray-700 rounded transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="1.5"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="18" r="1.5"/>
                </svg>
              </button>

              <button className="p-2.5 bg-gray-800/90 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="absolute top-4 right-4 p-2.5 bg-gray-800/90 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute right-4 top-16 bg-gray-900 rounded-lg shadow-xl p-2 w-64 z-10">
              <div className="space-y-1">
                {devices.audio.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => {
                      setSelectedAudio(device.deviceId);
                      setShowSettings(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      selectedAudio === device.deviceId
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                    {selectedAudio === device.deviceId && (
                      <span className="float-right">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="space-y-1">
                {devices.video.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => {
                      setSelectedVideo(device.deviceId);
                      setShowSettings(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      selectedVideo === device.deviceId
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                    {selectedVideo === device.deviceId && (
                      <span className="float-right">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Device Selection Display */}
          <div className="bg-gray-800 text-white px-4 py-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {devices.audio.find(d => d.deviceId === selectedAudio)?.label || 'Default Microphone'}
              </span>
              <button className="text-xs text-gray-400 hover:text-white">✓</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {devices.video.find(d => d.deviceId === selectedVideo)?.label || 'Default Camera'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bose Microphone</span>
            </div>
          </div>

          {/* Join Button */}
          <div className="p-4 bg-white">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}