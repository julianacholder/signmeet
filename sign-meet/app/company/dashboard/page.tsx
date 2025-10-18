'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Activity,
  Calendar,
  BarChart3,
  Globe
} from 'lucide-react';

export default function CompanyDashboardPage() {
  // Sample data based on the screenshot
  const metrics = [
    {
      label: 'Interviews',
      value: '980K',
      change: '+20%',
      subtext: 'This Month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Successful Hires',
      value: '980K',
      change: '+20%',
      subtext: 'This Month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Translation time',
      value: '980K',
      change: '+26%',
      subtext: 'This Month',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Accuracy',
      value: '980K',
      change: '+10%',
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

  const scheduledInterviews = [
    {
      title: 'Software Developer Position',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      candidate: 'Sarah Johnson',
      status: 'active'
    },
    {
      title: 'Marketing Coordinator Interview',
      date: 'Jan 04, 2024',
      time: '10:00AM',
      candidate: 'Sarah Johnson',
      status: 'active'
    },
    {
      title: 'Virtual Assistant',
      date: 'Jan 04, 2024',
      time: '12:00AM',
      candidate: 'Sarah Johnson',
      status: 'active'
    },
    {
      title: 'Social Media Manager',
      date: 'Jan 04, 2024',
      time: '12:00AM',
      candidate: 'Sarah Johnson',
      status: 'active'
    }
  ];

  const interviewTrends = [
    { month: 'Dec 18', growth: 23430, follow: 25592, unfollows: 100 },
    { month: 'Dec 19', growth: 18000, follow: 22000, unfollows: 90 },
    { month: 'Dec 20', growth: 28000, follow: 30000, unfollows: 95 },
    { month: 'Dec 21', growth: 16000, follow: 18000, unfollows: 85 },
    { month: 'Dec 22', growth: 22000, follow: 24000, unfollows: 88 },
    { month: 'Dec 23', growth: 32000, follow: 35000, unfollows: 110 },
    { month: 'Dec 24', growth: 30000, follow: 33000, unfollows: 105 }
  ];

  const topCountries = [
    { name: 'Rwanda', value: 12000, percentage: 100 },
    { name: 'Liberia', value: 10500, percentage: 87 },
    { name: 'Kenya', value: 9000, percentage: 75 },
    { name: 'Nigeria', value: 7000, percentage: 58 }
  ];

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, TechCorp Ltd</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {metric.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.subtext}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - 2 cols */}
        <div className="col-span-2 space-y-6">
          {/* Interview Trends Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interview Trends</CardTitle>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Growth</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                    <span className="text-muted-foreground">Growth</span>
                    <span className="font-semibold">23,430</span>
                    <span className="text-green-600">+12%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
                    <span className="text-muted-foreground">Follow</span>
                    <span className="font-semibold">25,592</span>
                    <span className="text-green-600">+90%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                    <span className="text-muted-foreground">Unfollows</span>
                    <span className="font-semibold">100</span>
                    <span className="text-green-600">+2%</span>
                  </div>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end gap-4 h-64">
                {interviewTrends.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1 items-center justify-end flex-1">
                      <div 
                        className="w-full bg-blue-600 rounded-t"
                        style={{ height: `${(data.growth / 35000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCountries.map((country, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{country.name}</span>
                        <span className="text-sm font-semibold">{country.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
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
                <select className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledInterviews.map((interview, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-2">{interview.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{interview.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{interview.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        Interviewer: {interview.candidate}
                      </p>
                      <Button size="sm" className="w-full">
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