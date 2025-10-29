'use client';

import { Video, Calendar, User, Clock, Home, Ban, CalendarDays, Search, SearchCheck } from 'lucide-react';
import Sidebar from './Sidebar';
import { signOut } from '@/lib/client-auth';

export default function CandidateSidebar() {
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
      label: 'Find Jobs',
      href: '/candidate/jobs',
      icon: <SearchCheck className="w-4 h-4" />,
    },
    {
      label: 'Schedule',
      href: '/candidate/schedule',
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
    console.log('Logout button clicked!'); // Add this
    try {
      console.log('Calling signOut...'); // Add this
      await signOut();
      console.log('SignOut completed'); // Add this
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar 
      navItems={navItems} 
      stats={stats} 
      settingsHref="/candidate/settings"  
      onLogout={handleLogout} 
    />
  );
}