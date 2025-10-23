'use client';

import InterviewSchedule from '@components/schedule/InterviewSchedule';

export default function CompanySchedulePage() {
  const companyInterviews = [
    {
      id: 1,
      title: 'Software Developer Position',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      candidate: 'John Doe', 
      type: 'RSL Translation Active' as const,
      meetingId: '370 387 8549',
      meetingLink: 'https://zoom.us/j/3703878549',
      passcode: 'abc123'
    },
    // ... more interviews
  ];

  return (
    <InterviewSchedule
      userRole="company"
      interviews={companyInterviews}
     
      onJoinMeeting={(link) => window.open(link, '_blank')}
    />
  );
}