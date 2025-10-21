'use client';

import TopCountriesMap from '@/app/components/metrics/TopCountriesMap';
import InterviewTrendsChart from '@/app/components/metrics/InterviewTrendsChart';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Activity,
  CalendarIcon,
  ArrowUpRight,
  MessagesSquare
} from 'lucide-react';
import { useState } from 'react';

const chartData = [
  { month: 'Dec 18', growth: 10000 },
  { month: 'Dec 19', growth: 35000 },
  { month: 'Dec 20', growth: 25000 },
  { month: 'Dec 21', growth: 5000 },
  { month: 'Dec 22', growth: 12000 },
  { month: 'Dec 23', growth: 28000 },
  { month: 'Dec 24', growth: 27000 },
];

const statsData = [
    {
      label: 'Growth',
      value: '23,430',
      change: '23%',
      changeValue: '+412',
      isPositive: true,
      icon: TrendingUp,
      highlighted: true
    },
    {
      label: 'Follow',
      value: '25,592',
      change: '23%',
      changeValue: '+804',
      isPositive: true,
      icon: MessagesSquare
    },
    {
      label: 'Unfollow',
      value: '100',
      change: '13%',
      changeValue: '-4',
      isPositive: false,
      icon: MessagesSquare
    }
  ];

  const handlePeriodChange = (value: string) => {
    console.log('Period changed to:', value);
    // Add your logic to fetch new data based on period
  };



export default function CompanyDashboardPage() {
 const [selectedView, setSelectedView] = useState('weekly');
  const metrics = [
    {
      label: 'Interviews',
      value: '980K',
      change: '20%',
      subtext: 'This Month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Successful Hires',
      value: '980K',
      change: '20%',
      subtext: 'This Month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Translation time',
      value: '980K',
      change: '26%',
      subtext: 'This Month',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Accuracy',
      value: '980K',
      change: '10%',
      subtext: 'This Month',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const teamMembers = [
    {
      name: 'Bryan Johnson',
      role: 'UI Manager',
      interviews: '12',
      avatar: 'BJ',
      lastActive: '2 hours ago'
    },
    {
      name: 'Daniel Prince',
      role: 'Tech Lead',
      interviews: '50',
      avatar: 'DP',
      lastActive: '3 hours ago'
    },
    {
      name: 'Sarah Ryan',
      role: 'HR Manager',
      interviews: '30',
      avatar: 'SR',
      lastActive: '2 hours ago'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      interviews: '10',
      avatar: 'MC',
      lastActive: '5 hours ago'
    }
  ];

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

  const topCountries = [
    { name: 'Rwanda', value: 12000, percentage: 100 },
    { name: 'Liberia', value: 10500, percentage: 87 },
    { name: 'Kenya', value: 9000, percentage: 75 },
    { name: 'Nigeria', value: 7000, percentage: 58 }
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, TechCorp Ltd</h1>
      </div>

      <div className="flex gap-6">
        {/* Left Column */}
        <div className="w-[65%] space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8 bg-white rounded-lg shadow p-3">
            {metrics.map((metric, index) => (
              <div className='' key={index}>
                <div className="p-2 border-r">
                  <div className="flex items-center justify-between mb-2">
                    <div className='flex items-center gap-2'>
                      <div className={`p-2 rounded-full w-fit bg-[#E6E9FF]`}>
                        <metric.icon className={`w-5 h-5 text-primary`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold mb-1">{metric.value}</p>
                    <div className='flex items-center gap-2'>
                      <p className="text-xs text-muted-foreground">{metric.subtext}</p>
                      <div className="text-sm font-medium text-lightblue">
                        <ArrowUpRight className="inline w-4 h-4 mr-1" />
                        {metric.change}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interview Trends Chart  */}
                <InterviewTrendsChart
            title="Interview Trends"
            chartData={chartData}
            stats={statsData}
            periodLabel="Growth"
            dateRange="Jun 2023 - Dec 2023"
            onPeriodChange={handlePeriodChange}
            defaultPeriod="monthly"
          />

          {/* Top Countries */}
          <TopCountriesMap />
        </div>

        {/* Right Column */}
        <div className="w-[35%] space-y-6">
          {/* Team Member Usage */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Member Usage</CardTitle>
                <Button variant="link" size="sm" className="text-primary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role} • {member.lastActive}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{member.interviews}</p>
                      <p className="text-xs text-muted-foreground">interviews</p>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
}