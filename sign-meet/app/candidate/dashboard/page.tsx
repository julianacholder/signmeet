'use client';

import { useState } from 'react';
import { Video, Plus, Clock, Users, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function CandidateDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState('weekly');

  // Sample data
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
      instructorName: 'Prashant Kumar Singh',
      date: '25/2/2023',
      courseType: 'FRONTEND',
      courseTitle: 'Understanding Concept Of React'
    },
    {
      id: 2,
      instructorName: 'Ravi Kumar',
      date: '25/2/2023',
      courseType: 'FRONTEND',
      courseTitle: 'Understanding Concept Of React'
    }
  ];

  return (
    <div className="p-8">
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex-1">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, Juliana</h1>
            <p className="text-gray-600">
              Your career journey just got clearer. Use RSL-Connect to<br />
              effortlessly manage join real-time sign language interviews.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <ActionButton icon={<Video className="w-6 h-6" />} label="New Meeting" />
            <ActionButton icon={<Plus className="w-6 h-6" />} label="Join Meeting" />
            <ActionButton icon={<Clock className="w-6 h-6" />} label="Schedule" />
            <ActionButton icon={<Users className="w-6 h-6" />} label="People" />
          </div>

          {/* Find Jobs Section */}
          <Card>
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
                <div>INSTRUCTOR NAME & DATE</div>
                <div>COURSE TYPE</div>
                <div>COURSE TITLE</div>
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
        <div className="w-96">
          {/* Calendar Widget */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Scheduled Interviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Scheduled Interviews</CardTitle>
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger className="w-24">
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
                {interviews.map((interview) => (
                  <Card key={interview.id} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{interview.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{interview.time}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Interviewer: {interview.interviewer}
                      </p>
                      
                      <Button className="w-full" size="sm">
                        RSL Translation Active
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Button 
      className="flex flex-col items-center gap-3 h-auto py-6 bg-primary hover:bg-primary/90 text-white"
    >
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </Button>
  );
}