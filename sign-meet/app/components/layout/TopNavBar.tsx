// app/components/layout/TopNavBar.tsx
'use client';

import { Search, Settings, Bell, Globe, ChevronDown } from 'lucide-react';

interface TopNavBarProps {
  userName?: string;
  userInitials?: string;
}

export default function TopNavBar({ userName = 'User', userInitials = 'U' }: TopNavBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, collections, and users"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Globe className="w-5 h-5 text-gray-600" />
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg">
            <span className="font-medium">{userInitials}</span>
            <span>English</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}