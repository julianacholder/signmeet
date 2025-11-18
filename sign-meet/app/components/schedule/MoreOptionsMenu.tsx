'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

interface MoreOptionsMenuProps {
  onReschedule: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function MoreOptionsMenu({ 
  onReschedule, 
  onCancel,
  disabled = false 
}: MoreOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleReschedule = () => {
    setIsOpen(false);
    onReschedule();
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel();
  };

  return (
    <div className="relative">
      {/* Three-dot button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="More options"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        >
          {/* Reschedule option */}
          <button
            onClick={handleReschedule}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Reschedule</span>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Cancel option */}
          <button
            onClick={handleCancel}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <span className="text-red-600">Cancel Meeting</span>
          </button>
        </div>
      )}
    </div>
  );
}