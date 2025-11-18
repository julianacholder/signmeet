'use client';
import { ThemeToggleAlt } from '@components/layout/Toggle';
import LanguageDropdown from '@components/layout/LanguageDropdown';
import { Search, Bell, Globe, ChevronDown, Languages, LanguagesIcon } from 'lucide-react';

interface TopNavBarProps {
  userName?: string;
  userInitials?: string;
}

export default function TopNavBar({ userName = 'User', userInitials = 'U' }: TopNavBarProps) {
  return (
    <header className=" pt-8.5 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
       <div className="flex-1 max-w-lg">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
    <input
      type="text"
      placeholder="Search items, collections, and users"
      className="text-sm w-full pl-10 pr-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
</div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
        <ThemeToggleAlt />
          <button className="relative p-2 bg-white hover:bg-indigo-100 rounded-3xl">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
         
          <button className="flex items-center gap-2 px-3">
              <span className="p-1.5 bg-primary rounded-3xl"><LanguagesIcon className='text-white w-4 h-4'></LanguagesIcon></span>
           <LanguageDropdown />
          </button>
        </div>
      </div>
    </header>
  );
}