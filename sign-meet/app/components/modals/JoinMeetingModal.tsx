'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Video } from 'lucide-react';

interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinMeetingModal({ isOpen, onClose }: JoinMeetingModalProps) {
  const [joinData, setJoinData] = useState({
    meetingId: '',
    name: '',
    rememberName: false,
    dontConnectAudio: false,
    turnOffVideo: false,
    agreedToTerms: false
  });

  const handleJoin = () => {
    if (!joinData.meetingId || !joinData.name) {
      alert('Please enter Meeting ID and your name');
      return;
    }
    console.log('Joining meeting:', joinData);
    // Add your join logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Join Meeting
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Meeting ID */}
          <div>
            <Label htmlFor="meetingId">Meeting ID or personal link name</Label>
            <Input
              id="meetingId"
              placeholder="Enter meeting ID"
              value={joinData.meetingId}
              onChange={(e) => setJoinData({ ...joinData, meetingId: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Juliana Holder"
              value={joinData.name}
              onChange={(e) => setJoinData({ ...joinData, name: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberName"
                checked={joinData.rememberName}
                onCheckedChange={(checked) => 
                  setJoinData({ ...joinData, rememberName: checked as boolean })
                }
              />
              <label
                htmlFor="rememberName"
                className="text-sm leading-none cursor-pointer"
              >
                Remember my name for future meetings
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="dontConnectAudio"
                checked={joinData.dontConnectAudio}
                onCheckedChange={(checked) => 
                  setJoinData({ ...joinData, dontConnectAudio: checked as boolean })
                }
              />
              <label
                htmlFor="dontConnectAudio"
                className="text-sm leading-none cursor-pointer"
              >
                Don't connect to audio
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="turnOffVideo"
                checked={joinData.turnOffVideo}
                onCheckedChange={(checked) => 
                  setJoinData({ ...joinData, turnOffVideo: checked as boolean })
                }
              />
              <label
                htmlFor="turnOffVideo"
                className="text-sm leading-none cursor-pointer"
              >
                Turn off my video
              </label>
            </div>
          </div>

          {/* Terms */}
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500">
              By clicking "Join", you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Statement</a>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              onClick={handleJoin}
            >
              Join
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}