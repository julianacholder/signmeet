// app/components/layout/CompanySidebar.tsx
'use client';

import { BarChart, Calendar, Users, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CompanySidebar() {
  const router = useRouter();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/company/dashboard',
      icon: (
        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      ),
    },
    {
      label: 'Schedule',
      href: '/company/schedule',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'DEI Metrics',
      href: '/company/dei-metrics',
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      label: 'My profile',
      href: '/company/profile',
      icon: <Users className="w-5 h-5" />,
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
      icon: <Clock className="w-4 h-4 text-gray-400" />,
    },
    {
      label: 'Cancelled meetings',
      value: '21',
      subtext: 'This Month',
      icon: <Clock className="w-4 h-4 text-gray-400" />,
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