'use client';

import { User, Briefcase } from 'lucide-react';

interface LiveTranscriptionProps {
  currentText: string;
  currentSpeaker: string;
  currentSpeakerRole: string;
  isCurrentUserSpeaking: boolean;
}

export default function LiveTranscription({
  currentText,
  currentSpeaker,
  currentSpeakerRole,
  isCurrentUserSpeaking
}: LiveTranscriptionProps) {
  const getRoleIcon = (role: string) => {
    if (role === 'candidate' || role === 'deaf_professional') {
      return <User className="w-4 h-4" />;
    }
    return <Briefcase className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    if (role === 'candidate' || role === 'deaf_professional') {
      return 'text-blue-400';
    }
    return 'text-green-400';
  };

  if (!currentText || currentText.trim().length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center mb-2">
            <div className="w-1 h-4 bg-gray-600 rounded-full animate-pulse"></div>
            <div className="w-1 h-6 bg-gray-600 rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
            <div className="w-1 h-5 bg-gray-600 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
            <div className="w-1 h-7 bg-gray-600 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
          </div>
          <p className="text-sm">Waiting for speech or sign...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4">
      {/* Speaker Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isCurrentUserSpeaking 
          ? 'bg-blue-500/20 text-blue-400'
          : 'bg-green-500/20 text-green-400'
      }`}>
        {getRoleIcon(currentSpeakerRole)}
      </div>

      {/* Transcription Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-semibold ${getRoleColor(currentSpeakerRole)}`}>
            {isCurrentUserSpeaking ? 'You' : currentSpeaker}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-2 bg-current rounded-full animate-pulse"></div>
            <div className="w-1 h-3 bg-current rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
            <div className="w-1 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
        
        <p className="text-base text-gray-200 leading-relaxed">
          {currentText}
        </p>
      </div>
    </div>
  );
}