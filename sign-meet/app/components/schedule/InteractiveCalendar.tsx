'use client';

import { useState, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

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

interface InteractiveCalendarProps {
  interviews: Interview[];
  onDateSelect: (date: Date) => void;
}

export default function InteractiveCalendar({
  interviews,
  onDateSelect,
}: InteractiveCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract all meeting dates
  const meetingDates = interviews.map((interview) => {
    const date =
      typeof interview.startTime === 'string'
        ? parseISO(interview.startTime)
        : interview.startTime;
    return date;
  });

  // Get meetings for a specific date
  const getMeetingsForDate = (date: Date) => {
    return interviews.filter((interview) => {
      const meetingDate =
        typeof interview.startTime === 'string'
          ? parseISO(interview.startTime)
          : interview.startTime;
      return isSameDay(meetingDate, date);
    });
  };

  const hoveredMeetings = hoveredDate ? getMeetingsForDate(hoveredDate) : [];

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  return (
    <Card className="overflow-visible gap-2 py-4">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent ref={containerRef} className="relative">
        <div className="relative">
       <Calendar
  mode="single"
  selected={selectedDate}
  onSelect={handleDateClick}
  className="rounded-md w-full"
  modifiers={{ meeting: meetingDates }}
  modifiersClassNames={{ meeting: 'meeting-day' }}
  onDayMouseEnter={(date, modifiers, e) => {
    if (!date || !containerRef.current) return;

    const meetings = getMeetingsForDate(date);
    if (meetings.length === 0) return;

    // Find the closest day button
    const button = (e.target as HTMLElement).closest('button');
    if (!button) return;

    // Position the tooltip relative to the day button itself
    const rect = button.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setTooltipPosition({
      x: rect.left - containerRect.left + rect.width / 12,
      y: rect.top - containerRect.top - 8, // Slightly above the button
    });

    setHoveredDate(date);
  }}
  onDayMouseLeave={() => setHoveredDate(null)}
/>


          {/* Hover Tooltip */}
          {hoveredDate && hoveredMeetings.length > 0 && (
            <div
              className="absolute pointer-events-none z-50 animate-in fade-in-0 zoom-in-95 duration-200"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: 'translateX(-50%) translateY(-100%)',
              }}
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-[280px] max-w-[320px] relative">
                {/* Date Header */}
                <div className="text-xs font-semibold text-gray-500 mb-2 pb-2 border-b">
                  {format(hoveredDate, 'EEEE, MMMM d, yyyy')}
                </div>

                {/* Meetings List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {hoveredMeetings.map((meeting) => {
                    const startTime =
                      typeof meeting.startTime === 'string'
                        ? parseISO(meeting.startTime)
                        : meeting.startTime;

                    return (
                      <div key={meeting.id} className="flex gap-2 p-2 rounded">
                        <div className="flex-shrink-0 w-1 bg-primary rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {meeting.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{format(startTime, 'h:mm a')}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1 text-xs text-gray-600 truncate">
                              <Users className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">
                                {meeting.displayName}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="mt-1.5 text-xs">
                            {meeting.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tooltip Arrow */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45"
                  style={{ bottom: '-6px' }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className=" pt-4 border-t space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/30"></div>
              <span>Days with meetings (click to view)</span>
            </div>
            <p className="text-xs text-gray-500">
              Click empty dates to schedule a new meeting
            </p>
          </div>
      </CardContent>

      {/* Custom styles for meeting days */}
      <style jsx global>{`
        .meeting-day {
          position: relative;
          font-weight: 900 !important;
          color: #2E3890 !important;
          border-radius: 100%;
          width: fit-content;
          background-color: #eef2ff;
        }

        
      `}</style>

      <style jsx global>{`
        .meeting-day {
          position: relative;
          font-weight: 600;
          color: #2E3890 !important;
          cursor: pointer;
        }

        .meeting-day::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: #e0e7ff;
          border-radius: 9999px;
          z-index: 0;
        }

        .meeting-day:hover::before {
          background-color: #e0e7ff;
        }

        .meeting-day > span {
          position: relative;
          z-index: 1;
        }

        /* Dot indicator below meeting dates */
        .meeting-day::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background-color: #2E3890;
          z-index: 1;
        }
      `}</style>
    </Card>
  );
}
