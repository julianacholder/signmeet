'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageDropdown() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const languages = [
    {
      code: 'en',
      name: 'English',
      flag: 'https://img.icons8.com/?size=100&id=xapj7ZzAUZKI&format=png&color=000000',
    },
    {
      code: 'rw',
      name: 'Kinyarwanda',
      flag: 'https://img.icons8.com/?size=100&id=mtAkNA30WLik&format=png&color=000000',
    },
  ];

  // Get current locale from cookie on mount
  useEffect(() => {
    const locale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] || 'en';
    
    const lang = languages.find(l => l.code === locale);
    if (lang) {
      setCurrentLanguage(lang.name);
    }
  }, []);

  const handleLanguageChange = (code: string, name: string) => {
    setCurrentLanguage(name);
    
    startTransition(() => {
      // Set cookie with 1 year expiry
      document.cookie = `locale=${code}; path=/; max-age=31536000; SameSite=Lax`;
      // Refresh to apply new locale
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer p-2 text-black dark:text-white rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
          <span className="font-medium">{currentLanguage}</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code, lang.name)}
            disabled={isPending || currentLanguage === lang.name}
            className="cursor-pointer flex items-center gap-2"
          >
            <img
              src={lang.flag}
              alt={`${lang.name} flag`}
              className="w-5 h-5 rounded-sm"
            />
            <span>{lang.name}</span>
            {currentLanguage === lang.name && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}