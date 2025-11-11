'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import PreviewScreen from '@/app/components/video/PreviewScreen';
import GuestNameModal from '@/app/components/video/GuestNameModal';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface MeetingPreviewPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function MeetingPreviewPage({ params }: MeetingPreviewPageProps) {
  const { meetingId } = use(params);
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [userName, setUserName] = useState('');

  // Verify access and load meeting details
  useEffect(() => {
    if (authLoading) return;

    const loadMeeting = async () => {
      setIsLoading(true);

      try {
        // Get user name
        const savedGuestName = localStorage.getItem('guestName');
        const preferences = localStorage.getItem('meetingPreferences');
        let guestNameFromModal = '';
        
        if (preferences) {
          const { guestName } = JSON.parse(preferences);
          guestNameFromModal = guestName || '';
        }

        let verifyData: any = { meetingId };

        if (user && profile) {
          verifyData.userId = user.id;
          verifyData.userEmail = user.email;
          setUserName(profile.full_name || user.email?.split('@')[0] || 'User');
        } else if (user && !profile) {
          verifyData.userId = user.id;
          verifyData.userEmail = user.email;
          setUserName(user.email?.split('@')[0] || 'User');
        } else if (guestNameFromModal) {
          setUserName(guestNameFromModal);
        } else if (savedGuestName) {
          setUserName(savedGuestName);
        } else {
          // New guest - show modal
          setShowGuestModal(true);
          setIsLoading(false);
          return;
        }

        // ✅ Load meeting info (no blocking!)
        const response = await fetch(`/api/meeting/${meetingId}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verifyData)
        });

        const data = await response.json();

        if (!response.ok) {
          // Only redirect if meeting doesn't exist at all
          if (response.status === 404) {
            toast.error('Meeting not found');
            router.push('/dashboard');
            return;
          }
          // For other errors, still show what we can
          toast.error('Could not load meeting details');
        }

        console.log('📊 Preview page - Active participants:', data.activeParticipants);

        // ✅ Always set meeting data - no blocking!
        setMeetingData(data);

      } catch (error: any) {
        console.error('Error loading meeting:', error);
        toast.error('Failed to load meeting');
        // Don't redirect - stay on page
      } finally {
        setIsLoading(false);
      }
    };

    loadMeeting();
  }, [meetingId, user, profile, authLoading, router]);

  // Handle guest name submission
  const handleGuestNameSubmit = (name: string) => {
    setUserName(name);
    setShowGuestModal(false);
    window.location.reload();
  };

  // Handle sign in
  const handleSignIn = () => {
    localStorage.setItem('redirectAfterAuth', `/meeting/${meetingId}`);
    router.push('/signin');
  };

  // Handle sign up
  const handleSignUp = () => {
    localStorage.setItem('redirectAfterAuth', `/meeting/${meetingId}`);
    router.push('/signup');
  };

  // Handle join call
  const handleJoinCall = () => {
    router.push(`/video/${meetingId}`);
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-6">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-12 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  // Guest modal
  if (showGuestModal) {
    return (
      <GuestNameModal
        isOpen={showGuestModal}
        onContinue={handleGuestNameSubmit}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    );
  }

  // ✅ Always show preview - just add status banner
  if (meetingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Status Banner (Informational Only) */}
        {meetingData.meetingStatus && (
          <div className={`py-3 px-4 ${
            meetingData.meetingStatus === 'live' 
              ? 'bg-green-50 border-b border-green-200' 
              : meetingData.meetingStatus === 'early'
              ? 'bg-blue-50 border-b border-blue-200'
              : 'bg-gray-50 border-b border-gray-200'
          }`}>
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
              {meetingData.meetingStatus === 'live' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">{meetingData.statusMessage}</span>
                </>
              )}
              {meetingData.meetingStatus === 'early' && (
                <>
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">{meetingData.statusMessage}</span>
                  <span className="text-blue-600 ml-2">• You can join now and wait</span>
                </>
              )}
              {meetingData.meetingStatus === 'ended' && (
                <>
                  <AlertCircle className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-800">{meetingData.statusMessage}</span>
                  <span className="text-gray-600 ml-2">• You can still join if others are there</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Preview Screen - Always Shown */}
        <PreviewScreen
          userName={userName}
          onJoin={handleJoinCall}
          meetingTitle={meetingData.meeting?.title}
          participantCount={meetingData.activeParticipants || 0} // ✅ Use active count
          isFirstToJoin={(meetingData.activeParticipants || 0) === 0} // ✅ First if no active participants
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Loading meeting...</p>
      </div>
    </div>
  );
}