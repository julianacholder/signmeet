import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (you'll need your credentials)
// This assumes you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in env
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Participant {
  peerId: string;
  userId?: string;
  userName: string;
  userRole: string;
  joinedAt: string;
  status: 'online' | 'offline';
}

interface UsePresenceReturn {
  // State
  participants: Participant[];
  participantCount: number;
  isConnected: boolean;
  
  // Actions
  joinChannel: (meetingId: string, participant: Omit<Participant, 'status'>) => Promise<void>;
  leaveChannel: () => Promise<void>;
  updateStatus: (status: 'online' | 'offline') => void;
}

export function usePresence(meetingId: string): UsePresenceReturn {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  const [myPresence, setMyPresence] = useState<Participant | null>(null);

  // Join presence channel
  const joinChannel = useCallback(async (
    meetingId: string,
    participant: Omit<Participant, 'status'>
  ) => {
    try {
      // Create channel for this meeting
      const presenceChannel = supabase.channel(`meeting:${meetingId}`, {
        config: {
          presence: {
            key: participant.peerId
          }
        }
      });

      // Track presence state
      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState();
          const allParticipants: Participant[] = [];

          Object.keys(state).forEach((key) => {
            const presences = state[key] as any[];
            presences.forEach((presence) => {
              allParticipants.push({
                peerId: presence.peerId,
                userId: presence.userId,
                userName: presence.userName,
                userRole: presence.userRole,
                joinedAt: presence.joinedAt,
                status: 'online'
              });
            });
          });

          setParticipants(allParticipants);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Participant joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Participant left:', leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // Send initial presence
            await presenceChannel.track({
              peerId: participant.peerId,
              userId: participant.userId,
              userName: participant.userName,
              userRole: participant.userRole,
              joinedAt: participant.joinedAt,
              online_at: new Date().toISOString()
            });

            setIsConnected(true);
            setMyPresence({ ...participant, status: 'online' });
          }
        });

      setChannel(presenceChannel);

    } catch (err) {
      console.error('Error joining presence channel:', err);
    }
  }, []);

  // Leave presence channel
  const leaveChannel = useCallback(async () => {
    if (channel) {
      await channel.untrack();
      await supabase.removeChannel(channel);
      setChannel(null);
      setIsConnected(false);
      setMyPresence(null);
      setParticipants([]);
    }
  }, [channel]);

  // Update presence status
  const updateStatus = useCallback((status: 'online' | 'offline') => {
    if (channel && myPresence) {
      channel.track({
        ...myPresence,
        status,
        updated_at: new Date().toISOString()
      });
    }
  }, [channel, myPresence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        leaveChannel();
      }
    };
  }, [channel, leaveChannel]);

  return {
    participants,
    participantCount: participants.length,
    isConnected,
    joinChannel,
    leaveChannel,
    updateStatus
  };
}