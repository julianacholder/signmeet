'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  stats?: Array<{
    label: string;
    value: string;
    subtext: string;
    icon?: React.ReactNode;
  }>;
  onLogout?: () => void;
}

export default function Sidebar({ navItems, stats = [], onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-58 bg-white flex flex-col">
      {/* Logo */}
      <div className="p-5 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
           <Image 
                        src="/logo.png" 
                        alt="SignMeet Logo" 
                        width={120} 
                        height={120}
                        className="rounded-lg"
                      />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-600 mb-3 px-3">OVERVIEW</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {/* Icon with circle background when active */}
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                      isActive ? 'bg-primary' : ''
                    }`}>
                      <div className={`[&>svg]:w-4 [&>svg]:h-4 ${isActive ? 'text-white [&>svg]:text-white' : ''}`}>
                        {item.icon}
                      </div>
                    </div>
                    <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="space-y-5 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className=" flex gap-4 border   px-3 py-1 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {stat.icon}
                  
                </div>
                <div>
                <span className="text-xs text-gray-600">{stat.label}</span>
                <div className='flex items-center gap-2'>
                <p className="text-xl text-gray-800 font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 mb-3 px-3">SETTINGS</p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}