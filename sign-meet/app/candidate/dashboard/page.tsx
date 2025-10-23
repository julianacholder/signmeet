'use client';

import { useState } from 'react';
import { Video, Plus, Clock, Users, CalendarClock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NewMeetingModal from '@/app/components/modals/NewMeetingModal';
import JoinMeetingModal from '@/app/components/modals/JoinMeetingModal';
import ScheduleMeetingModal from '@/app/components/modals/ScheduleMeeting';

export default function CandidateDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState('weekly');
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isJoinMeetingOpen, setIsJoinMeetingOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);

  const interviews = [
    {
      id: 1,
      title: 'Software Developer Position',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      interviewer: 'Sarah Johnson',
      status: 'active'
    },
    {
      id: 2,
      title: 'Marketing Coordinator Interview',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      interviewer: 'Sarah Johnson',
      status: 'active'
    },
    {
      id: 3,
      title: 'Virtual Assistant',
      date: 'Jan 04, 2024',
      time: '12:00AM',
      interviewer: 'Sarah Johnson',
      status: 'active'
    }
  ];

  const jobListings = [
    {
      id: 1,
      instructorName: 'Google LLC',
      date: '25/2/2023',
      courseType: 'FRONTEND',
      courseTitle: 'Software Engineer Role'
    },
    {
      id: 2,
      instructorName: 'Amazon Inc',
      date: '25/2/2023',
      courseType: 'TECHNOLOGY',
      courseTitle: 'Product Manager Role'
    }
  ];

  return (
    <div className="p-8 pr-5">
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex-1">
          {/* Welcome Section */}
         
          <div className="mb-8 mt-20 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome, Juliana</h1>
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
          
          {/* Find Jobs Section */}
          <Card className='gap-4s'>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Find Jobs</CardTitle>
                <Button variant="link" className="text-primary">
                  See All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted rounded-lg mb-3 text-xs font-semibold text-muted-foreground">
                <div>COMPANY NAME</div>
                <div>COMPANY TYPE</div>
                <div>JOB TITLE</div>
                <div>ACTIONS</div>
              </div>

              {/* Job Listings */}
              <div className="space-y-3">
                {jobListings.map((job) => (
                  <div 
                    key={job.id} 
                    className="grid grid-cols-4 gap-4 px-4 py-4 border rounded-lg items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {job.instructorName.split(' ').map(n => n[0]).join('')}
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
                    </div>
                    
                    <div>
                      <p className="text-sm">{job.courseTitle}</p>
                    </div>
                    
                    <div>
                      <Button variant="secondary" size="sm" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        SHOW DETAILS
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-90">
          {/* Calendar Widget */}
          <Card className="mb-6 py-4 gap-3">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="multiple"
                className="rounded-md w-full [&_.rdp-day_selected]:bg-primary/30 [&_.rdp-day_selected:hover]:bg-primary/40"
              />
            </CardContent>
          </Card>

          {/* Scheduled Interviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scheduled Interviews</CardTitle>
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger className="w-26">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviews.map((interview, index) => (
                  <div key={interview.id}>
                    <div className="border-l-4 border-l-[#1745C1] ">
                      <CardHeader className="gap-1 px-3">
                        <CardTitle className="text-base">{interview.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5 px-3">
                        <div className="flex items-center gap-5 text-xs bg-gray-50 rounded-sm border px-2 py-0.5 w-fit">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{interview.time}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Interviewer: {interview.interviewer}
                        </p>
                        
                        <p className="text-xs text-[#00BFFF] bg-[#E5F9FF] w-fit p-1 rounded-sm">
                          RSL Translation Active
                        </p>
                      </CardContent>
                    </div>
                    
                    {index < interviews.length - 1 && (
                      <div className="border-b border-gray-200 my-4"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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