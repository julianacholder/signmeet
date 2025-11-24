'use client';

import { useState, useEffect } from 'react';
import InterviewSchedule, { Interview } from '@components/schedule/InterviewSchedule';
import { SchedulePageSkeleton } from '@components/skeletons/ScheduleSkeleton';
import { toast } from 'sonner';

export default function CandidateSchedulePage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch interviews
  const fetchInterviews = async () => {
    try {
      const response = await fetch('/api/interviews');
      const data = await response.json();

      if (response.ok) {
        setInterviews(data.interviews);
      } else {
        toast.error('Failed to load interviews');
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Show skeleton while loading
  if (loading) {
    return <SchedulePageSkeleton />;
  }

  // InterviewSchedule now handles both empty state AND interviews list
  return (
    <InterviewSchedule
      userRole="candidate"
      interviews={interviews}
      onRefresh={fetchInterviews}
      onAddInterview={(newInterview) => {
        // Normalize the interview object before appending so UI fields like displayName/displayRole exist
        const normalized = {
          ...newInterview,
          // Ensure startTime/endTime are strings or Date objects the UI expects
          startTime: newInterview.startTime || (newInterview as any).start_time || (newInterview as any).start || new Date().toISOString(),
          endTime: newInterview.endTime || (newInterview as any).end_time || (newInterview as any).end || new Date().toISOString(),
          // Fallback displayName: use participants (guestName/guestEmail) or 'TBD'
          displayName: newInterview.displayName || (newInterview.participants && newInterview.participants[0] && (newInterview.participants[0].guestName || newInterview.participants[0].name || newInterview.participants[0].guestEmail)) || 'TBD',
          // Candidate page expects interviewer role label
          displayRole: newInterview.displayRole || 'Interviewer',
        } as any;

        // Optimistically append the new interview to state so it appears immediately
        setInterviews((prev) => [normalized, ...prev]);
      }}
      onJoinMeeting={(link) => window.open(link, '_blank')}
    />
  );
}