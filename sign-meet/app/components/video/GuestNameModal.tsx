'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface GuestNameModalProps {
  isOpen: boolean;
  onContinue: (name: string) => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function GuestNameModal({
  isOpen,
  onContinue,
  onSignIn,
  onSignUp
}: GuestNameModalProps) {
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');

  const handleContinueAsGuest = () => {
    if (!guestName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (guestName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Save to localStorage for future visits
    localStorage.setItem('guestName', guestName.trim());
    onContinue(guestName.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-6 h-6 text-primary" />
            Join Meeting
          </DialogTitle>
          <DialogDescription className="text-base">
            Sign in for full access or continue as a guest
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sign In / Sign Up Options */}
          <div className="space-y-3">
            <Button
              onClick={onSignIn}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
            <Button
              onClick={onSignUp}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Sign Up
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue as guest</span>
            </div>
          </div>

          {/* Guest Name Input */}
          <div className="space-y-2">
            <Label htmlFor="guestName">Your Name</Label>
            <Input
              id="guestName"
              placeholder="Enter your name"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleContinueAsGuest();
                }
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <p className="text-xs text-gray-500">
              As a guest, you can join this meeting but won't have access to other features.
            </p>
          </div>

          {/* Continue as Guest Button */}
          <Button
            onClick={handleContinueAsGuest}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            Continue as Guest
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500">
            By joining, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}