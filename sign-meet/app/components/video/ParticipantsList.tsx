'use client';

import { User, Mic, MicOff, Crown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Participant {
  peerId: string;
  userId?: string;
  userName: string;
  userRole: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isLocal?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  currentUserId?: string;
}

export default function ParticipantsList({ participants, currentUserId }: ParticipantsListProps) {
  // ✅ Remove duplicates based on peerId (keep the most recent one)
  const uniqueParticipants = participants.reduce((acc, participant) => {
    const existingIndex = acc.findIndex(p => p.peerId === participant.peerId);
    
    if (existingIndex === -1) {
      // Not found, add it
      acc.push(participant);
    } else {
      // Already exists, keep the local one if available
      if (participant.isLocal && !acc[existingIndex].isLocal) {
        acc[existingIndex] = participant;
      }
    }
    
    return acc;
  }, [] as Participant[]);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Participants</h3>
        <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {uniqueParticipants.length}
        </span>
      </div>

      <ScrollArea className="h-[calc(100%-3rem)]">
        <div className="space-y-2">
          {uniqueParticipants.map((participant, index) => {
            const isCurrentUser = participant.userId === currentUserId || participant.isLocal;
            const roleColor = 
              participant.userRole === 'interviewer' ? 'text-blue-400' :
              participant.userRole === 'candidate' ? 'text-green-400' :
              'text-gray-400';

            // ✅ Create unique key using peerId + index (or use peerId + isLocal flag)
            const uniqueKey = `${participant.peerId}-${isCurrentUser ? 'local' : 'remote'}-${index}`;

            return (
              <div
                key={uniqueKey}
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {participant.userName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {participant.userName}
                      {isCurrentUser && ' (You)'}
                    </p>
                    {participant.userRole === 'interviewer' && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                  <p className={`text-xs ${roleColor} capitalize`}>
                    {participant.userRole}
                  </p>
                </div>

                {/* Audio Status */}
                <div>
                  {participant.audioEnabled === false ? (
                    <MicOff className="w-4 h-4 text-red-400" />
                  ) : (
                    <Mic className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}

          {uniqueParticipants.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No participants yet</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}