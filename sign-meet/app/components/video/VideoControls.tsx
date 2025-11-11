'use client';

import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, MoreVertical } from 'lucide-react';

interface VideoControlsProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat?: () => void;
  callDuration?: number;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoControls({
  audioEnabled,
  videoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onToggleChat,
  callDuration = 0
}: VideoControlsProps) {
  return (
    <div className="flex items-center justify-center px-6">
      
      {/* Center - Main Controls */}
      <div className="flex items-center gap-3">
        {/* Microphone */}
        <button
          onClick={onToggleAudio}
          className={`p-3 rounded-full transition-all ${
            audioEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          title={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {audioEnabled ? (
            <Mic className="w-5 h-5 text-white" />
          ) : (
            <MicOff className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Camera */}
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-full transition-all ${
            videoEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {videoEnabled ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <VideoOff className="w-5 h-5 text-white" />
          )}
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all"
          title="End call"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </button>

        {/* Chat */}
        {onToggleChat && (
          <button
            onClick={onToggleChat}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
            title="Toggle chat"
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </button>
        )}

        {/* More Options */}
        <button
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
          title="More options"
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Right side - Spacer */}
      <div className="min-w-[100px]"></div>
    </div>
  );
}