'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Video, Copy, Plus, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import ScheduleMeetingModal from '@components/modals/ScheduleMeeting'; 
import InteractiveCalendar from '@components/schedule/InteractiveCalendar';
import MoreOptionsMenu from '@components/schedule/MoreOptionsMenu';
import CancelMeetingDialog from '@components/schedule/CancelMeetingDialog';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export interface Interview {
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
  displayName: string;
  displayRole: string;
  type: string;
  meetingId: string;
  meetingLink: string;
  passcode: string;
  description?: string;
  participants?: any[];
}

interface InterviewScheduleProps {
  userRole: 'candidate' | 'company';
  interviews: Interview[];
  onJoinMeeting?: (meetingLink: string) => void;
  onRefresh?: () => void;
  onAddInterview?: (interview: Interview) => void;
}

export default function InterviewSchedule({ 
  userRole, 
  interviews,
  onJoinMeeting,
  onRefresh,
  onAddInterview
}: InterviewScheduleProps) {
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calendar connection state
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const interviewsPerPage = 4;

  // ✅ NEW: Cancel meeting state
  const [interviewToCancel, setInterviewToCancel] = useState<Interview | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // ✅ NEW: Reschedule meeting state
  const [interviewToReschedule, setInterviewToReschedule] = useState<Interview | null>(null);

  // Calculate pagination
  const totalPages = Math.ceil(interviews.length / interviewsPerPage);
  const startIndex = (currentPage - 1) * interviewsPerPage;
  const endIndex = startIndex + interviewsPerPage;
  const currentInterviews = interviews.slice(startIndex, endIndex);

  // Reset to page 1 when interviews change
  useEffect(() => {
    setCurrentPage(1);
  }, [interviews.length]);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const res = await fetch('/api/calendar/status');
      const data = await res.json();
      setIsConnected(data.connected);
      setConnectedEmail(data.email);
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnectCalendar = async () => {
    setIsConnecting(true);
    try {
      const res = await fetch('/api/calendar/connect');
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting calendar:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    try {
      await fetch('/api/calendar/disconnect', { method: 'POST' });
      setIsConnected(false);
      setConnectedEmail(null);
      toast.success('Calendar disconnected');
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast.error('Failed to disconnect calendar');
    }
  };

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label || 'Text'} copied to clipboard!`);
  };

  const handleViewMeetingDetails = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowMeetingDetails(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsScheduleModalOpen(true);
  };

  // ✅ NEW: Handle reschedule
  const handleReschedule = (interview: Interview) => {
    setInterviewToReschedule(interview);
    setIsScheduleModalOpen(true);
  };

  // ✅ NEW: Handle cancel - show confirmation dialog
  const handleCancelClick = (interview: Interview) => {
    setInterviewToCancel(interview);
    setShowCancelDialog(true);
  };

  // ✅ NEW: Confirm cancellation - actually delete the interview
  const handleConfirmCancel = async () => {
    if (!interviewToCancel) return;

    setIsCancelling(true);

    try {
      const response = await fetch(`/api/interviews/${interviewToCancel.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel interview');
      }

      toast.success('Meeting cancelled', {
        description: `"${interviewToCancel.title}" has been cancelled successfully`
      });

      // Close dialog and refresh
      setShowCancelDialog(false);
      setInterviewToCancel(null);
      onRefresh?.();

    } catch (error: any) {
      console.error('Error cancelling interview:', error);
      toast.error('Failed to cancel meeting', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDateTime = (interview: Interview) => {
    const startTime = typeof interview.startTime === 'string' 
      ? parseISO(interview.startTime) 
      : interview.startTime;
    
    return {
      date: format(startTime, 'MMM dd, yyyy'),
      time: format(startTime, 'h:mm a'),
    };
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="flex gap-8">
        {/* Left Section - Interview List or Empty State */}
        <div className="flex-1 p-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold">
                {userRole === 'candidate' ? 'Interview Scheduled' : 'Scheduled Interviews'}
              </h1>
            </div>
            <Button 
              className="bg-primary hover:bg-hoverPrimary cursor-pointer"
              onClick={() => {
                setSelectedDate(null);
                setIsScheduleModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          {/* Empty State - Show when no interviews */}
          {interviews.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 px-8">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                      <div className="relative bg-primary/5 p-6 rounded-full">
                        <CalendarDays className="w-16 h-16 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Heading */}
                  <div>
                    <h2 className="text-2xl font-bold mb-3">
                      Ready to simplify scheduling with SignMeet?
                    </h2>
                    <p className="text-gray-600 text-lg">
                      {userRole === 'candidate' 
                        ? 'Start scheduling interviews with potential employers and showcase your skills with confidence.'
                        : 'Begin scheduling interviews with talented candidates and build an inclusive team.'
                      }
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        Easily share your availability through a single link
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        Set up schedules for individual or group meetings
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        Real-time RSL translation for seamless communication
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        Automated confirmations and calendar sync with Google
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button 
                      size="lg"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Schedule Your First Interview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Interview Cards - Show when interviews exist */
            <>
              <div className="space-y-4">
                {currentInterviews.map((interview, index) => {
                  const { date, time } = formatDateTime(interview);
                  
                  return (
                    <div key={interview.id}>
                      <Card className="border-l-4 border-l-primary gap-2 py-6">
                        <CardHeader className="gap-0">
                          <CardTitle className="text-base">{interview.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 px-4 pb-3">
                          <div className="flex items-center gap-5 text-xs bg-gray-50 rounded-sm border px-2 py-1 w-fit">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{time}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            {interview.displayRole}: {interview.displayName}
                          </p>

                          {/* Participants preview */}
                          {interview.participants && interview.participants.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {interview.participants.slice(0, 3).map((p, i) => {
                                const name = (p && (p.name || p.guestName || p.guestEmail || p.email)) || String(p);
                                return (
                                  <div key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    {name}
                                  </div>
                                );
                              })}
                              {interview.participants.length > 3 && (
                                <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">+{interview.participants.length - 3} more</div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[#00BFFF] bg-[#E5F9FF] w-fit px-2 py-1 rounded-sm">
                              {interview.type}
                            </p>
                            
                            {/* ✅ UPDATED: Added MoreOptionsMenu */}
                            <div className="flex gap-2 items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewMeetingDetails(interview)}
                              >
                                Meeting Info
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => {
                                  window.location.href = `/meeting/${interview.meetingId}`;
                                }}
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join
                              </Button>
                              <MoreOptionsMenu
                                onReschedule={() => handleReschedule(interview)}
                                onCancel={() => handleCancelClick(interview)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {index < currentInterviews.length - 1 && (
                        <div className="border-b border-gray-200 my-4"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageClick(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Section - Calendar (ALWAYS VISIBLE) */}
        <div className="w-96">
          {/* Connect Google Calendar */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Connect Your Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isConnected ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="truncate">Connected to {connectedEmail}</span>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={handleDisconnectCalendar}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Sync your interviews with Google Calendar to never miss a meeting
                  </p>
                  <Button 
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 gap-2"
                    onClick={handleConnectCalendar}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <span>Connecting...</span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Connect to Google Calendar
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <InteractiveCalendar 
            interviews={interviews}
            onDateSelect={handleDateSelect}
          />
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
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Topic</label>
                <p className="mt-1 font-medium">{selectedInterview.title}</p>
              </div>

              {selectedInterview.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="mt-1 text-sm text-gray-700">{selectedInterview.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">When</label>
                <p className="mt-1">{formatDateTime(selectedInterview).date} at {formatDateTime(selectedInterview).time}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">{selectedInterview.displayRole}</label>
                <p className="mt-1">{selectedInterview.displayName}</p>
              </div>

              

              <div>
                <label className="text-sm font-medium text-gray-600">Meeting ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{selectedInterview.meetingId}</code>
                  <button
                    onClick={() => copyToClipboard(selectedInterview.meetingId, 'Meeting ID')}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Passcode</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{selectedInterview.passcode}</code>
                  <button
                    onClick={() => copyToClipboard(selectedInterview.passcode, 'Passcode')}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Meeting Link</label>
                <div className="flex items-center gap-2 mt-1 p-3 bg-gray-50 rounded border">
                  <p className="text-sm flex-1 truncate text-blue-600 font-mono">
                    {selectedInterview.meetingLink}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedInterview.meetingLink, 'Meeting link')}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `/meeting/${selectedInterview.meetingId}`;
                  }}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Meeting
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    const invitation = `Join ${selectedInterview.title}

When: ${formatDateTime(selectedInterview).date} at ${formatDateTime(selectedInterview).time}
${selectedInterview.displayRole}: ${selectedInterview.displayName}

Meeting ID: ${selectedInterview.meetingId}
Passcode: ${selectedInterview.passcode}

Join Link: ${selectedInterview.meetingLink}`;
                    copyToClipboard(invitation, 'Invitation');
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Copy Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ✅ UPDATED: Schedule Meeting Modal with reschedule support */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedDate(null);
          setInterviewToReschedule(null);
        }}
        onSuccess={(newInterview) => {
          setIsScheduleModalOpen(false);
          setSelectedDate(null);
          setInterviewToReschedule(null);
          // If parent provided an append callback, use it for immediate UI update
          if (newInterview) {
            onAddInterview?.(newInterview as Interview);
          } else {
            onRefresh?.();
          }
        }}
        prefilledDate={selectedDate}
        // Note: Add these props to your ScheduleMeetingModal when implementing reschedule
        editMode={!!interviewToReschedule}
        interviewToEdit={interviewToReschedule ? {
          id: interviewToReschedule.id,
          title: interviewToReschedule.title,
          description: interviewToReschedule.description,
          startTime: interviewToReschedule.startTime,
          endTime: interviewToReschedule.endTime,
          participants: interviewToReschedule.participants?.map(p => p.email || p.guestEmail).filter(Boolean) || []
        } : undefined}
      />

      {/* ✅ NEW: Cancel Meeting Confirmation Dialog */}
      <CancelMeetingDialog
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setInterviewToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        meetingTitle={interviewToCancel?.title || ''}
        isLoading={isCancelling}
      />
    </div>
  );
}