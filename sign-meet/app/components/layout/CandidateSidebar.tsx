'use client';

import { Video, Calendar, User, Clock } from 'lucide-react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CandidateSidebar() {
  const router = useRouter();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/candidate/dashboard',
      icon: (
        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      ),
    },
    {
      label: 'Practice',
      href: '/candidate/practice',
      icon: <Video className="w-5 h-5" />,
    },
    {
      label: 'Interview',
      href: '/candidate/interview',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'My profile',
      href: '/candidate/profile',
      icon: <User className="w-5 h-5" />,
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