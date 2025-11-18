'use client';

import { Calendar, User, Clock, Home, CalendarDays, Ban, ChartNoAxesCombined, Users } from 'lucide-react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStats } from '@/app/hooks/useStats';

export default function CompanySidebar() {
  const router = useRouter();
  const { stats, isLoading } = useStats();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/company/dashboard',
      icon: <Home className="w-4 h-4" strokeWidth={2.5} />
    },
    {
      label: 'Schedule',
      href: '/company/schedule',
      icon: <Calendar className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Team',
      href: '/company/team',
      icon: <Users className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'DEI Metrics',
      href: '/company/dei-metrics',
      icon: <ChartNoAxesCombined className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'My profile',
      href: '/company/profile',
      icon: <User className="w-5 h-5" strokeWidth={2.5} />,
    },
  ];

  const statsDisplay = [
    {
      label: 'No. of meetings',
      value: isLoading ? '...' : stats.totalMeetings.toString(),
      subtext: 'This Month',
      icon: <Clock className="w-4 h-4 text-gray-400" />,
    },
    {
      label: 'Rescheduled meetings',
      value: isLoading ? '...' : stats.rescheduledMeetings.toString(),
      subtext: 'This Month',
      icon: <CalendarDays className="w-4 h-4 text-gray-400" />,
    },
    {
      label: 'Cancelled meetings',
      value: isLoading ? '...' : stats.cancelledMeetings.toString(),
      subtext: 'This Month',
      icon: <Ban className="w-4.5 h-4.5 text-gray-400" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar 
      navItems={navItems} 
      stats={statsDisplay} 
      settingsHref="/company/settings"  
      onLogout={handleLogout} 
    />
  );
}