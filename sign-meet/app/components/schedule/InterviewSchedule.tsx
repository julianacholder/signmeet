'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Clock, Video, Copy, Plus } from 'lucide-react';
import ScheduleMeetingModal from '@components/modals/ScheduleMeeting'; 

interface Interview {
  id: number;
  title: string;
  date: string;
  time: string;
  interviewer?: string;
  candidate?: string;
  type: 'RSL Translation Active' | 'Scheduled' | 'Completed';
  meetingId?: string;
  meetingLink?: string;
  passcode?: string;
}

interface InterviewScheduleProps {
  userRole: 'candidate' | 'company';
  interviews: Interview[];
  onJoinMeeting?: (meetingLink: string) => void;
}

export default function InterviewSchedule({ 
  userRole, 
  interviews,
  onJoinMeeting
}: InterviewScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); // Add this state

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleViewMeetingDetails = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowMeetingDetails(true);
  };

  return (
    <div className="p-4">
      <div className="flex gap-8">
        {/* Left Section - Interview List */}
        <div className="flex-1 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">
              {userRole === 'candidate' ? 'Interview Scheduled' : 'Scheduled Interviews'}
            </h1>
            <Button 
              className="bg-primary hover:bg-hoverPrimary cursor-pointer"
              onClick={() => setIsScheduleModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          {/* Interview Cards */}
          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <div key={interview.id}>
                <Card className="border-l-5 border-l-[#1745C1] gap-2 py-6">
                  <CardHeader className="gap-0">
                    <CardTitle className="text-base">{interview.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 px-4 pb-3">
                    <div className="flex items-center gap-5 text-xs bg-gray-50 rounded-sm border px-2 py-1 w-fit">
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
                      {userRole === 'candidate' 
                        ? `Interviewer: ${interview.interviewer}` 
                        : `Candidate: ${interview.candidate}`
                      }
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#00BFFF] bg-[#E5F9FF] w-fit px-2 py-1 rounded-sm">
                        {interview.type}
                      </p>
                      
                      <div className="flex gap-2">
                        {interview.meetingLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMeetingDetails(interview)}
                          >
                            Meeting Info
                          </Button>
                        )}
                        <Button 
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => onJoinMeeting?.(interview.meetingLink!)}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {index < interviews.length - 1 && (
                  <div className="border-b border-gray-200 my-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Calendar */}
        <div className="w-96">
          {/* Connect Google Calendar */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Connect Your Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sync your interviews with Google Calendar to never miss a meeting
              </p>
              <Button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Connect to Google Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Calendar Widget */}
          <Card className="py-4">
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
        </div>
      </div>

      {/* Meeting Details Modal */}
      {showMeetingDetails && selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Meeting Details</CardTitle>
                <button
                  onClick={() => setShowMeetingDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Topic</label>
                <p className="mt-1">{selectedInterview.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Meeting ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono">{selectedInterview.meetingId}</p>
                  <button
                    onClick={() => copyToClipboard(selectedInterview.meetingId!)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Security</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Passcode:</span>
                    <span className="font-mono text-sm">{selectedInterview.passcode}</span>
                    <button className="text-blue-600 text-sm hover:underline">show</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="waitingRoom" defaultChecked />
                    <label htmlFor="waitingRoom" className="text-sm">
                      Everyone goes into the waiting room
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Invite Link</label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded border">
                  <p className="text-sm flex-1 truncate text-blue-600">
                    {selectedInterview.meetingLink}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedInterview.meetingLink!)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Add to</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Google Calendar</Button>
                  <Button variant="outline" size="sm">Outlook Calendar (ics)</Button>
                  <Button variant="outline" size="sm">Yahoo Calendar</Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(selectedInterview.meetingLink, '_blank')}
                >
                  Start
                </Button>
                <Button variant="outline" className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Invitation
                </Button>
                <Button variant="outline">Edit</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}