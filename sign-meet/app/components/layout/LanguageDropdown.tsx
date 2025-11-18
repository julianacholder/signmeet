'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageDropdown() {
  const [language, setLanguage] = useState('English');

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

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Add your language change logic here
    // localStorage.setItem('language', lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
  <div className="flex items-center cursor-pointer p-2 text-black dark:text-white rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
    <span className="font-medium">{language}</span>
    <ChevronDown className="w-4 h-4 ml-1" />
  </div>
</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.name)}
            className="cursor-pointer flex items-center gap-2"
          >
            <img
              src={lang.flag}
              alt={`${lang.name} flag`}
              className="w-5 h-5 rounded-sm"
            />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}