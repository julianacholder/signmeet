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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, Copy } from 'lucide-react';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewMeetingModal({ isOpen, onClose }: NewMeetingModalProps) {
  const [meetingData, setMeetingData] = useState({
    title: '',
    startTime: '9:00',
    endTime: '13:00',
    timezone: 'Bangkok',
    repeat: 'Never',
    date: 'August 28, 2025',
    meetingIdType: 'auto',
    passcode: true,
    passcodeValue: 'UY67BCE',
    waitingRoom: false,
    reminderNotification: true
  });

  const handleSave = () => {
    console.log('Meeting data:', meetingData);
    // Add your save logic here
    onClose();
  };

  const copyPasscode = () => {
    navigator.clipboard.writeText(meetingData.passcodeValue);
    alert('Passcode copied!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            New Meeting
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Design System Discussion"
              value={meetingData.title}
              onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Time and Timezone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Time</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="time"
                  value={meetingData.startTime}
                  onChange={(e) => setMeetingData({ ...meetingData, startTime: e.target.value })}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">to</span>
                <Input
                  type="time"
                  value={meetingData.endTime}
                  onChange={(e) => setMeetingData({ ...meetingData, endTime: e.target.value })}
                  className="w-24"
                />
              </div>
            </div>

            <div>
              <Label>Timezone</Label>
              <Select
                value={meetingData.timezone}
                onValueChange={(value) => setMeetingData({ ...meetingData, timezone: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bangkok">(GMT +7:00) Bangkok</SelectItem>
                  <SelectItem value="Tokyo">(GMT +9:00) Tokyo</SelectItem>
                  <SelectItem value="London">(GMT +0:00) London</SelectItem>
                  <SelectItem value="NewYork">(GMT -5:00) New York</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Repeat and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Repeat</Label>
              <Select
                value={meetingData.repeat}
                onValueChange={(value) => setMeetingData({ ...meetingData, repeat: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Input
                type="text"
                value={meetingData.date}
                onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          {/* Meeting ID */}
          <div>
            <Label className="mb-3 block">Meeting ID</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="auto"
                  checked={meetingData.meetingIdType === 'auto'}
                  onChange={() => setMeetingData({ ...meetingData, meetingIdType: 'auto' })}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="auto" className="text-sm">Generate Automatically</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="personal"
                  checked={meetingData.meetingIdType === 'personal'}
                  onChange={() => setMeetingData({ ...meetingData, meetingIdType: 'personal' })}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="personal" className="text-sm">Personal meeting ID</label>
              </div>
            </div>
          </div>

          {/* Meeting Security */}
          <div>
            <Label className="mb-3 block">Meeting Security</Label>
            
            {/* Passcode */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="passcode"
                  checked={meetingData.passcode}
                  onCheckedChange={(checked) => 
                    setMeetingData({ ...meetingData, passcode: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <label htmlFor="passcode" className="text-sm font-medium cursor-pointer">
                    Passcode
                  </label>
                  <p className="text-xs text-gray-500">
                    Only users who have the invite link or passcode can join the meeting
                  </p>
                  {meetingData.passcode && (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={meetingData.passcodeValue}
                        onChange={(e) => setMeetingData({ ...meetingData, passcodeValue: e.target.value })}
                        className="w-32"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyPasscode}
                        className="h-8"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Waiting Room */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="waitingRoom"
                  checked={meetingData.waitingRoom}
                  onCheckedChange={(checked) => 
                    setMeetingData({ ...meetingData, waitingRoom: checked as boolean })
                  }
                />
                <div className="flex-1">
                  <label htmlFor="waitingRoom" className="text-sm font-medium cursor-pointer">
                    Waiting Room
                  </label>
                  <p className="text-xs text-gray-500">
                    Only users admitted by the host can join the meeting
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reminder Notification */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Label htmlFor="reminder">Reminder Notification</Label>
            <Switch
              id="reminder"
              checked={meetingData.reminderNotification}
              onCheckedChange={(checked) => 
                setMeetingData({ ...meetingData, reminderNotification: checked })
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
            >
              Save Change
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}