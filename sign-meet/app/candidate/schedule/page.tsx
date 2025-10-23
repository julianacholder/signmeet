'use client';

import InterviewSchedule from '@components/schedule/InterviewSchedule';

export default function CandidateSchedulePage() {
  const candidateInterviews = [
    {
      id: 1,
      title: 'Software Developer Position',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      interviewer: 'Sarah Johnson', // Candidate sees interviewer
      type: 'RSL Translation Active' as const,
      meetingId: '370 387 8549',
      meetingLink: 'https://zoom.us/j/3703878549',
      passcode: 'abc123'
    },
     {
      id: 2,
      title: 'Software Developer Position',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      interviewer: 'Sarah Johnson', // Candidate sees interviewer
      type: 'RSL Translation Active' as const,
      meetingId: '370 387 8549',
      meetingLink: 'https://zoom.us/j/3703878549',
      passcode: 'abc123'
    },
     {
      id: 3,
      title: 'Software Developer Position',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      interviewer: 'Sarah Johnson', // Candidate sees interviewer
      type: 'RSL Translation Active' as const,
      meetingId: '370 387 8549',
      meetingLink: 'https://zoom.us/j/3703878549',
      passcode: 'abc123'
    },
  ];

  return (
    <InterviewSchedule
      userRole="candidate"
      interviews={candidateInterviews}
      
      onJoinMeeting={(link) => window.open(link, '_blank')}
    />
  );
}