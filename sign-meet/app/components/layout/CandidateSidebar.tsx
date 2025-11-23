'use client';

import { useTranslations } from 'next-intl';
import { Video, Calendar, User, Clock, Home, Ban, CalendarDays, SearchCheck } from 'lucide-react';
import Sidebar from './Sidebar';
import { signOut } from '@/lib/client-auth';
import { useStats } from '@/app/hooks/useStats';

export default function CandidateSidebar() {
  const t = useTranslations('navigation');
  const tStats = useTranslations('stats');
  const { stats, isLoading } = useStats();

  const navItems = [
    {
      label: t('dashboard'),
      href: '/candidate/dashboard',
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: t('practice'),
      href: '/candidate/practice',
      icon: <Video className="w-4 h-4" />,
    },
    {
      label: t('findJobs'),
      href: '/candidate/jobs',
      icon: <SearchCheck className="w-4 h-4" />,
    },
    {
      label: t('schedule'),
      href: '/candidate/schedule',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      label: t('myProfile'),
      href: '/candidate/profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  const statsDisplay = [
    {
      label: tStats('meetings'),
      value: isLoading ? '...' : stats.totalMeetings.toString(),
      subtext: tStats('thisMonth'),
      icon: <Clock className="w-4 h-4 text-gray-400" />,
    },
    {
      label: tStats('rescheduled'),
      value: isLoading ? '...' : stats.rescheduledMeetings.toString(),
      subtext: tStats('thisMonth'),
      icon: <CalendarDays className="w-4 h-4 text-gray-400" />,
    },
    {
      label: tStats('cancelled'),
      value: isLoading ? '...' : stats.cancelledMeetings.toString(),
      subtext: tStats('thisMonth'),
      icon: <Ban className="w-4.5 h-4.5 text-gray-400" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar 
      navItems={navItems} 
      stats={statsDisplay} 
      settingsHref="/candidate/settings"  
      onLogout={handleLogout} 
    />
  );
}