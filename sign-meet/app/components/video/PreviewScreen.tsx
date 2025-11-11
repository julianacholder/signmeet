'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, Mic, MicOff, VideoOff, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMediaDevices } from '@/app/hooks/useMediaDevices';

interface PreviewScreenProps {
  userName: string;
  onJoin: () => void;
  meetingTitle?: string;
  participantCount?: number;
  isFirstToJoin?: boolean;
}

export default function PreviewScreen({
  userName,
  onJoin,
  meetingTitle,
  participantCount = 0,
  isFirstToJoin = true
}: PreviewScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    stream,
    audioEnabled,
    videoEnabled,
    devices,
    selectedDevices,
    isLoading,
    error,
    startMedia,
    toggleAudio,
    toggleVideo,
    switchDevice,
    refreshDevices
  } = useMediaDevices();

  // Start media on mount
  useEffect(() => {
    const initialize = async () => {
      // Check for saved preferences
      const preferences = localStorage.getItem('meetingPreferences');
      if (preferences) {
        const { audioEnabled: savedAudio, videoEnabled: savedVideo } = JSON.parse(preferences);
        await startMedia(savedAudio !== false, savedVideo !== false);
      } else {
        await startMedia(true, true);
      }
      
      // Refresh device list
      await refreshDevices();
    };

    initialize();
  }, []);

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
<div className="text-center mb-8">
  <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
  <p className="text-gray-600">Setup your audio and video before joining</p>
  
  {/* Styled Badge with Border */}
  {isFirstToJoin ? (
    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 border-1 border-gray-400 rounded-full">
      <User className="w-4 h-4" />
      <p className="text-sm font-medium">You are the first to join</p>
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2  border-1 border-gray-400 rounded-full">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <p className="text-sm font-medium ">
        {participantCount} {participantCount === 1 ? 'person' : 'people'} in the call
      </p>
    </div>
  )}
</div>

        {/* Video Preview */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-6 relative aspect-video max-w-3xl mx-auto">
          {/* Video Element */}
          {videoEnabled && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <p className="text-white text-lg">{userName}</p>
                <p className="text-gray-400 text-sm mt-2">Camera is off</p>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-4">
              {/* Microphone Toggle */}
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-all ${
                  audioEnabled
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={audioEnabled ? 'Mute' : 'Unmute'}
              >
                {audioEnabled ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-all ${
                  videoEnabled
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {videoEnabled ? (
                  <Camera className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
                title="Settings"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Starting camera...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center">
              <div className="text-white text-center max-w-md p-6">
                <p className="text-lg font-semibold mb-2">Camera/Microphone Error</p>
                <p className="text-sm">{error}</p>
                <Button
                  onClick={() => startMedia(true, true)}
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Device Settings */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Device Settings</h3>
            
            <div className="space-y-4">
              {/* Microphone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microphone
                </label>
                <Select
                  value={selectedDevices.audioInput}
                  onValueChange={(value) => switchDevice('audioinput', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.audioInputs.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Camera Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Camera
                </label>
                <Select
                  value={selectedDevices.videoInput}
                  onValueChange={(value) => switchDevice('videoinput', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.videoInputs.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speaker Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker
                </label>
                <Select
                  value={selectedDevices.audioOutput}
                  onValueChange={(value) => switchDevice('audiooutput', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select speaker" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.audioOutputs.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Join Button */}
        <div className="text-center">
          <Button
            onClick={onJoin}
            size="lg"
            className="px-12 py-6 text-lg font-semibold"
            disabled={isLoading || !!error}
          >
            Join Now
          </Button>
          {meetingTitle && (
            <p className="text-sm text-gray-500 mt-4">
              Joining: <span className="font-medium">{meetingTitle}</span>
            </p>
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