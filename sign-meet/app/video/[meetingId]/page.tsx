'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import VideoCall from '@/app/components/video/VideoCall';
import { toast } from 'sonner';

interface VideoCallPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function VideoCallPage({ params }: VideoCallPageProps) {
  const { meetingId } = use(params);
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('participant');

  useEffect(() => {
    if (authLoading) return;

    const loadMeeting = async () => {
      setIsLoading(true);

      try {
        let verifyData: any = { meetingId };
        let displayName = '';

        if (user && profile) {
          verifyData.userId = user.id;
          verifyData.userEmail = user.email;
          displayName = profile.full_name || user.email?.split('@')[0] || 'User';
        } else if (user) {
          verifyData.userId = user.id;
          verifyData.userEmail = user.email;
          displayName = user.email?.split('@')[0] || 'User';
        } else {
          const savedGuestName = localStorage.getItem('guestName');
          const preferences = localStorage.getItem('meetingPreferences');
          
          if (preferences) {
            const { guestName } = JSON.parse(preferences);
            displayName = guestName || savedGuestName || 'Guest';
          } else if (savedGuestName) {
            displayName = savedGuestName;
          } else {
            // No name - go back to preview
            router.push(`/meeting/${meetingId}`);
            return;
          }
        }

        setUserName(displayName);

        //  Load meeting (no blocking!)
        const response = await fetch(`/api/meeting/${meetingId}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verifyData)
        });

        const data = await response.json();

        if (!response.ok) {
          // Only redirect if meeting doesn't exist
          if (response.status === 404) {
            toast.error('Meeting not found');
            router.push('/dashboard');
            return;
          }
        }

        //  Always set meeting data - no blocking!
        setMeetingData(data);
        setUserRole(data.userRole || 'participant');

        // Optional: Show informational toast about meeting status
        if (data.meetingStatus === 'early') {
          toast.info(data.statusMessage + ' - You can wait in the room', {
            duration: 5000
          });
        } else if (data.meetingStatus === 'ended') {
          toast.info(data.statusMessage + ' - You can still join if others are present', {
            duration: 5000
          });
        }

      } catch (error: any) {
        console.error('Error loading meeting:', error);
        toast.error('Failed to load meeting');
        // Don't redirect - let them try to join anyway
      } finally {
        setIsLoading(false);
      }
    };

    loadMeeting();
  }, [meetingId, user, profile, authLoading, router]);

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  // ✅ Always show video call - no restrictions!
  if (meetingData) {
    return (
      <VideoCall
        meetingId={meetingId}
        userId={user?.id}
        userName={userName}
        userRole={userRole}
        meetingTitle={meetingData.meeting?.title}
      />
    );
  }

  // Fallback
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-white">Loading video call...</p>
      </div>
    </div>
  );
}