'use client';

import { Video, Calendar, User, Clock, Home, Ban, CalendarDays } from 'lucide-react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CandidateSidebar() {
  const router = useRouter();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/candidate/dashboard',
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: 'Practice',
      href: '/candidate/practice',
      icon: <Video className="w-4 h-4" />,
    },
    {
      label: 'Interview',
      href: '/candidate/interview',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      label: 'My profile',
      href: '/candidate/profile',
      icon: <User className="w-4 h-4" />,
    },
  ];

  const stats = [
    {
      label: 'No. of meetings',
      value: '36',
      subtext: 'This Month',
      icon: <Clock className="w-4 h-4 text-gray-400" />,
    },
    {
      label: 'Rescheduled meetings',
      value: '15',
      subtext: 'This Month',
      icon: <CalendarDays className="w-4 h-4 text-gray-400" />,
    },
    {
      label: 'Cancelled meetings',
      value: '21',
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

  return <Sidebar navItems={navItems} stats={stats} onLogout={handleLogout} />;
}