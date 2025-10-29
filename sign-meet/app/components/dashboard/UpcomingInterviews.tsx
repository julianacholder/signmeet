'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface Interview {
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
  displayName: string;
  displayRole: string;
  type: string;
  meetingLink: string;
}

interface UpcomingInterviewsProps {
  interviews: Interview[];
  onJoinMeeting?: (link: string) => void;
}

export default function UpcomingInterviews({ 
  interviews,
  onJoinMeeting 
}: UpcomingInterviewsProps) {
  const [selectedView, setSelectedView] = useState<'weekly' | 'monthly'>('weekly');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  // Filter interviews based on selected view
  const filteredInterviews = interviews.filter(interview => {
    const interviewDate = typeof interview.startTime === 'string'
      ? parseISO(interview.startTime)
      : interview.startTime;
    
    const now = new Date();

    if (selectedView === 'weekly') {
      return isWithinInterval(interviewDate, {
        start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(now, { weekStartsOn: 1 })
      });
    } else {
      return isWithinInterval(interviewDate, {
        start: startOfMonth(now),
        end: endOfMonth(now)
      });
    }
  });

  // Paginate interviews
  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const paginatedInterviews = filteredInterviews.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // Reset page when view changes
  const handleViewChange = (value: 'weekly' | 'monthly') => {
    setSelectedView(value);
    setCurrentPage(0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Scheduled Interviews</CardTitle>
          <Select value={selectedView} onValueChange={handleViewChange}>
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
        {paginatedInterviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No interviews scheduled for this {selectedView === 'weekly' ? 'week' : 'month'}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedInterviews.map((interview, index) => {
                const startTime = typeof interview.startTime === 'string'
                  ? parseISO(interview.startTime)
                  : interview.startTime;

                return (
                  <div key={interview.id}>
                    <div className="border-l-4 border-l-[#1745C1]">
                      <CardHeader className="gap-1 px-3">
                        <CardTitle className="text-base">{interview.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1.5 px-3">
                        <div className="flex items-center gap-5 text-xs bg-gray-50 rounded-sm border px-2 py-0.5 w-fit">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{format(startTime, 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{format(startTime, 'h:mm a')}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {interview.displayRole}: {interview.displayName}
                        </p>
                        
                        <p className="text-xs text-[#00BFFF] bg-[#E5F9FF] w-fit px-2 py-1 rounded-sm">
                          {interview.type}
                        </p>
                      </CardContent>
                    </div>
                    
                    {index < paginatedInterviews.length - 1 && (
                      <div className="border-b border-gray-200 my-4"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <span className="text-xs text-gray-500">
                  Page {currentPage + 1} of {totalPages}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}