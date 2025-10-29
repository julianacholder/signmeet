'use client';

import { useState, useEffect } from 'react';
import InterviewSchedule from '@components/schedule/InterviewSchedule';
import { SchedulePageSkeleton } from '@components/skeletons/ScheduleSkeleton';
import { toast } from 'sonner';

export default function CandidateSchedulePage() {
  const [interviews, setInterviews] = useState([]);
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
      onJoinMeeting={(link) => window.open(link, '_blank')}
    />
  );
}