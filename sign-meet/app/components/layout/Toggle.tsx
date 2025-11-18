'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggleAlt() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Check initial theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // ✅ Save preference
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // ✅ Save preference
    }
  };

  // ✅ Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="relative w-24 h-10 bg-white rounded-full p-1.5 transition-colors duration-300"
        aria-label="Toggle theme"
      >
        <div className="absolute top-1 w-8 h-8 bg-indigo-100 rounded-full shadow-lg flex items-center justify-center">
          <Sun className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 flex items-center px-3">
          <Moon className="w-5 h-5 text-gray-400 ml-auto mr-1" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-24 h-10 bg-white dark:bg-gray-800 rounded-full p-1.5 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {/* Sliding circle with icon */}
      <div
        className={`absolute top-1 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ease-in-out ${
          isDark ? 'translate-x-12' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-gray-200" fill="currentColor" />
        ) : (
          <Sun className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        )}
      </div>

      {/* Static background icon (opposite of active) */}
      <div className="absolute inset-0 flex items-center px-3">
        {isDark ? (
          <Sun className="w-5 h-5 text-gray-400 ml-1" strokeWidth={2} />
        ) : (
          <Moon className="w-5 h-5 text-gray-400 ml-auto mr-1" />
        )}
      </div>
    </button>
  );
}