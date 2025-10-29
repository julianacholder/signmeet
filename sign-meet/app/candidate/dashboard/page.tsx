'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import InteractiveCalendar from '@components/schedule/InteractiveCalendar';
import { Video, Plus, Users, Calendar as CalendarDays, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UpcomingInterviews from '@/app/components/dashboard/UpcomingInterviews';
import NewMeetingModal from '@/app/components/modals/NewMeetingModal';
import JoinMeetingModal from '@/app/components/modals/JoinMeetingModal';
import ScheduleMeetingModal from '@/app/components/modals/ScheduleMeeting';
import { JobsSectionSkeleton } from '@components/skeletons/JobsSkeleton';

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState('weekly');
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isJoinMeetingOpen, setIsJoinMeetingOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  
  // Job search states
  const [jobListings, setJobListings] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Fetch interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('/api/interviews');
        const data = await response.json();
        if (response.ok) {
          setInterviews(data.interviews);
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    if (user) {
      fetchInterviews();
    }
  }, [user]);

  // Fetch jobs on mount
  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      // Always fetch diverse jobs for dashboard (no search)
      const response = await fetch('/api/jobs/diverse');
      const data = await response.json();
      
      if (data.success) {
        setJobListings(data.jobs.slice(0, 3)); // Only show 3 jobs on dashboard
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  // Redirect if not authenticated or wrong user type
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (profile && profile.user_type !== 'deaf') {
        router.push('/company/dashboard');
      }
    }
  }, [user, profile, loading, router]);

  // Show loading state for AUTH (entire page)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user or profile
  if (!user || !profile) {
    return null;
  }

  return (
    <div className="p-8 pr-5">
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex-1">
          {/* Welcome Section */}
          <div className="mb-8 mt-20 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {profile?.full_name || 'User'}
            </h1>
            <p className="text-gray-600">
              Your career journey just got clearer. Use RSL-Connect to<br />
              effortlessly manage join real-time sign language interviews.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-y-6 mb-8 max-w-3xs mx-auto">
            <ActionButton 
              icon={<Video className="w-9.5 h-9.5" fill="currentColor" />} 
              label="New Meeting"
              onClick={() => setIsNewMeetingOpen(true)}
            />
            <ActionButton 
              icon={<Plus className="w-9.5 h-9.5" strokeWidth={3} />} 
              label="Join Meeting"
              onClick={() => setIsJoinMeetingOpen(true)}
            />
            <ActionButton 
              icon={<CalendarDays className="w-9 h-9" strokeWidth={3}/>} 
              label="Schedule"
              onClick={() => setIsScheduleMeetingOpen(true)}
            />
            <ActionButton 
              icon={<Users className="w-9 h-9" fill="currentColor" />} 
              label="People"
              onClick={() => {/* Add people action */}}
            />
          </div>
          
          {/* Find Jobs Section - WITH SKELETON */}
          {jobsLoading ? (
            <JobsSectionSkeleton count={3} />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Find Jobs</CardTitle>
                  <Button 
                    variant="link" 
                    className="text-primary"
                    onClick={() => router.push('/candidate/jobs')}
                  >
                    See All
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {jobListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No jobs available right now. Check back later!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted rounded-lg mb-3 text-xs font-semibold text-muted-foreground">
                      <div>COMPANY NAME</div>
                      <div>JOB TYPE</div>
                      <div>JOB TITLE</div>
                      <div>ACTIONS</div>
                    </div>

                    {/* Job Listings */}
                    <div className="space-y-3">
                      {jobListings.map((job: any) => (
                        <div 
                          key={job.id} 
                          className="grid grid-cols-4 gap-4 px-4 py-4 border rounded-lg items-center hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              {job.companyLogo ? (
                                <AvatarImage src={job.companyLogo} alt={job.instructorName} />
                              ) : null}
                              <AvatarFallback>
                                {job.instructorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{job.instructorName}</p>
                              <p className="text-xs text-muted-foreground">{job.date}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              {job.courseType}
                            </Badge>
                            {job.isRemote && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 ml-1">
                                REMOTE
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">{job.courseTitle}</p>
                            <p className="text-xs text-muted-foreground">{job.location}</p>
                          </div>
                          
                          <div>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                              onClick={() => window.open(job.applyLink, '_blank')}
                            >
                              APPLY NOW
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="w-90 flex flex-col gap-4">
          {/* Interactive Calendar */}
          <InteractiveCalendar 
            interviews={interviews}
            onDateSelect={(date) => {
              setDate(date);
              setIsScheduleMeetingOpen(true);
            }}
          />

          {/* Scheduled Interviews */}
          <UpcomingInterviews 
            interviews={interviews}
            onJoinMeeting={(link) => window.open(link, '_blank')}
          />
        </div>
      </div>

      {/* Modals */}
      <NewMeetingModal
        isOpen={isNewMeetingOpen}
        onClose={() => setIsNewMeetingOpen(false)}
      />
      
      <JoinMeetingModal
        isOpen={isJoinMeetingOpen}
        onClose={() => setIsJoinMeetingOpen(false)}
      />
      
      <ScheduleMeetingModal
        isOpen={isScheduleMeetingOpen}
        onClose={() => setIsScheduleMeetingOpen(false)}
      />
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <div className='flex flex-col items-center text-center gap-2'>
      <button 
        onClick={onClick}
        className="cursor-pointer flex items-center justify-center h-20 w-20 bg-primary hover:bg-primary/90 text-white rounded-3xl transition-colors"
      >
        {icon}
      </button>
      <span className="text-sm">{label}</span>
    </div>
  );
}