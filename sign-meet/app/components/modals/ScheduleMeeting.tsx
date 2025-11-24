'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, X, Plus, Mail, Copy, Video, Loader2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

// ✅ UPDATED: Added editMode and interviewToEdit props
interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newInterview?: any) => void;
  prefilledDate?: Date | null;
  editMode?: boolean;
  interviewToEdit?: {
    id: string;
    title: string;
    description?: string;
    startTime: Date | string;
    endTime: Date | string;
    participants: string[];
  };
}

export default function ScheduleMeetingModal({ 
  isOpen, 
  onClose,
  onSuccess,
  prefilledDate,
  editMode = false, 
  interviewToEdit 
}: ScheduleMeetingModalProps) {
  const [meetingData, setMeetingData] = useState({
    title: '',
    startDate: '',
    startTime: '09:00',
    endTime: '10:00',
    timezone: 'CAT',
    description: '',
    meetingType: 'video',
    sendInviteEmail: true,
    enableRSLTranslation: true,
    passcode: '',
    waitingRoom: false,
    recordMeeting: false
  });

  const [participants, setParticipants] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill date when modal opens
  useEffect(() => {
    if (prefilledDate && isOpen) {
      setMeetingData(prev => ({
        ...prev,
        startDate: format(prefilledDate, 'yyyy-MM-dd')
      }));
    }
  }, [prefilledDate, isOpen]);

  // ✅ NEW: Prefill form when editing an interview
  useEffect(() => {
    if (interviewToEdit && isOpen && editMode) {
      const startDate = typeof interviewToEdit.startTime === 'string' 
        ? parseISO(interviewToEdit.startTime)
        : interviewToEdit.startTime;
      
      const endDate = typeof interviewToEdit.endTime === 'string'
        ? parseISO(interviewToEdit.endTime)
        : interviewToEdit.endTime;

      setMeetingData({
        title: interviewToEdit.title,
        description: interviewToEdit.description || '',
        startDate: format(startDate, 'yyyy-MM-dd'),
        startTime: format(startDate, 'HH:mm'),
        endTime: format(endDate, 'HH:mm'),
        timezone: 'CAT',
        meetingType: 'video',
        sendInviteEmail: true,
        enableRSLTranslation: true,
        passcode: '',
        waitingRoom: false,
        recordMeeting: false
      });
      
      setParticipants(interviewToEdit.participants || []);
    }
  }, [interviewToEdit, isOpen, editMode]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMeetingData({
        title: '',
        startDate: '',
        startTime: '09:00',
        endTime: '10:00',
        timezone: 'CAT',
        description: '',
        meetingType: 'video',
        sendInviteEmail: true,
        enableRSLTranslation: true,
        passcode: '',
        waitingRoom: false,
        recordMeeting: false
      });
      setParticipants([]);
      setEmailInput('');
    }
  }, [isOpen]);

  const handleAddParticipant = () => {
    if (emailInput && emailInput.includes('@')) {
      if (participants.includes(emailInput)) {
        toast.error('Email already added', {
          description: 'This participant is already in the list'
        });
        return;
      }
      setParticipants([...participants, emailInput]);
      setEmailInput('');
      toast.success('Participant added', {
        description: emailInput
      });
    } else {
      toast.error('Invalid email', {
        description: 'Please enter a valid email address'
      });
    }
  };

  const handleRemoveParticipant = (email: string) => {
    setParticipants(participants.filter(p => p !== email));
    toast.info('Participant removed', {
      description: email
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      description: `${label} copied`
    });
  };

  const handleSchedule = async () => {
    // Validation
    if (!meetingData.title) {
      toast.error('Missing meeting title', {
        description: 'Please enter a meeting title'
      });
      return;
    }

    if (!meetingData.startDate) {
      toast.error('Missing date', {
        description: 'Please select a meeting date'
      });
      return;
    }

    if (participants.length === 0) {
      toast.error('No participants', {
        description: 'Please add at least one participant'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time into ISO strings
      const startDateTime = new Date(`${meetingData.startDate}T${meetingData.startTime}`);
      const endDateTime = new Date(`${meetingData.startDate}T${meetingData.endTime}`);

      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        toast.error('Invalid time range', {
          description: 'End time must be after start time'
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ NEW: Different API calls for create vs update
      const method = editMode ? 'PUT' : 'POST';
      const url = editMode 
        ? `/api/interviews/${interviewToEdit!.id}`
        : '/api/calendar/events';

      // Show loading toast
      const loadingToast = toast.loading(
        editMode ? 'Updating meeting...' : 'Creating meeting...', 
        {
          description: editMode 
            ? 'Updating your calendar event' 
            : 'Setting up your calendar event'
        }
      );

      // Create/Update event via API
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: meetingData.title,
          description: meetingData.description || `RSL-enabled interview via SignMeet\n\nOptions:\n- RSL Translation: ${meetingData.enableRSLTranslation ? 'Enabled' : 'Disabled'}\n- Waiting Room: ${meetingData.waitingRoom ? 'Enabled' : 'Disabled'}\n- Recording: ${meetingData.recordMeeting ? 'Enabled' : 'Disabled'}`,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          attendees: participants,
        }),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (data.needsConnection) {
          toast.error('Calendar not connected', {
            description: 'Please connect your Google Calendar first',
            action: {
              label: 'Connect',
              onClick: () => window.location.href = '/schedule'
            }
          });
        } else {
          toast.error(editMode ? 'Failed to update meeting' : 'Failed to create meeting', {
            description: data.error || 'An error occurred'
          });
        }
        setIsSubmitting(false);
        return;
      }

      // ✅ UPDATED: Different success messages for create vs update
      if (editMode) {
        toast.success('Meeting updated successfully! 🎉', {
          description: 'All participants have been notified of the changes',
          duration: 5000,
        });
      } else {
        // Success! Show detailed toast
        toast.success('Meeting scheduled successfully! 🎉', {
          description: (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold">Meeting ID:</span>
                <code className="bg-gray-100 px-1.5 py-0.5 rounded">{data.interview.meetingId}</code>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(data.interview.meetingId, 'Meeting ID');
                  }}
                  className="hover:bg-gray-100 p-0.5 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold">Passcode:</span>
                <code className="bg-gray-100 px-1.5 py-0.5 rounded">{data.interview.passcode}</code>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(data.interview.passcode, 'Passcode');
                  }}
                  className="hover:bg-gray-100 p-0.5 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                📧 Calendar invites sent to {participants.length} participant{participants.length > 1 ? 's' : ''}
              </div>
            </div>
          ),
          duration: 8000,
          action: {
            label: 'Copy Link',
            onClick: () => copyToClipboard(data.meetingLink, 'Meeting link')
          }
        });
      }
      
      // Try to clear server-side interviews cache so the new meeting appears immediately
      try {
        await fetch('/api/interviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'clearCache' }),
        });
      } catch (err) {
        console.warn('Failed to clear interviews cache:', err);
      }

      // Call success callback AFTER cache clear so the refreshed data is fresh
      if (onSuccess) {
        try {
          // Build a normalized interview object for optimistic UI update.
          // Use the server response where available, but fall back to the form data
          const serverInterview = data?.interview || {};

          const createdInterview = {
            id: serverInterview.id || serverInterview.meetingId || serverInterview.interviewId || (serverInterview.meetingId ?? '') || (serverInterview.meetingId ? String(serverInterview.meetingId) : ''),
            title: serverInterview.title || meetingData.title,
            startTime: serverInterview.startTime || startDateTime.toISOString(),
            endTime: serverInterview.endTime || endDateTime.toISOString(),
            // Show the first participant email as the display name (best-effort)
            displayName: (serverInterview.participants && serverInterview.participants[0] && (serverInterview.participants[0].guestName || serverInterview.participants[0].name || serverInterview.participants[0].guestEmail)) || participants[0] || 'TBD',
            displayRole: 'Interviewer',
            type: serverInterview.type || meetingData.meetingType,
            meetingId: serverInterview.meetingId || serverInterview.meetingId || '',
            meetingLink: serverInterview.meetingLink || data?.meetingLink || '',
            passcode: serverInterview.passcode || data?.interview?.passcode || '',
            description: serverInterview.description || meetingData.description || '',
            participants: (serverInterview.participants && serverInterview.participants.length > 0)
              ? serverInterview.participants
              : participants.map((p) => ({ guestEmail: p })),
          };

          onSuccess(createdInterview);
        } catch (err) {
          // Fallback: still call onSuccess without payload
          onSuccess();
        }
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error('Unexpected error', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {/*  UPDATED: Different title for edit mode */}
            {editMode ? 'Reschedule Meeting' : 'Schedule Meeting'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Meeting Title */}
          <div>
            <Label htmlFor="title">
              Meeting Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineer Interview"
              value={meetingData.title}
              onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
              className="mt-2"
              disabled={isSubmitting}
            />
          </div>

          {/* Add Participants */}
          <div>
            <Label htmlFor="participants">
              Add Participants <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="participants"
                type="email"
                placeholder="Enter email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button 
                type="button" 
                onClick={handleAddParticipant} 
                variant="outline"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Participants List */}
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {participants.map((email, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5 text-sm">
                    <Mail className="w-3 h-3 mr-1.5" />
                    {email}
                    <button
                      onClick={() => handleRemoveParticipant(email)}
                      className="ml-2 hover:text-red-600"
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={meetingData.startDate}
                onChange={(e) => setMeetingData({ ...meetingData, startDate: e.target.value })}
                className="mt-2"
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={meetingData.startTime}
                onChange={(e) => setMeetingData({ ...meetingData, startTime: e.target.value })}
                className="mt-2"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={meetingData.endTime}
                onChange={(e) => setMeetingData({ ...meetingData, endTime: e.target.value })}
                className="mt-2"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Timezone */}
          <div>
            <Label>Timezone</Label>
            <Select
              value={meetingData.timezone}
              onValueChange={(value) => setMeetingData({ ...meetingData, timezone: value })}
              disabled={isSubmitting}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAT">(GMT +2:00) CAT - Central Africa</SelectItem>
                <SelectItem value="WAT">(GMT +1:00) WAT - West Africa</SelectItem>
                <SelectItem value="EAT">(GMT +3:00) EAT - East Africa</SelectItem>
                <SelectItem value="GMT">(GMT +0:00) GMT</SelectItem>
                <SelectItem value="GMT+1">(GMT +1:00) London</SelectItem>
                <SelectItem value="EST">(GMT -5:00) New York</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add meeting agenda, notes, or any additional information..."
              value={meetingData.description}
              onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
              className="mt-2 min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Meeting Options */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">Meeting Options</h3>

            {/* RSL Translation */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rslTranslation" className="font-medium">Enable RSL Translation</Label>
                <p className="text-xs text-gray-500">
                  Provide real-time sign language interpretation
                </p>
              </div>
              <Switch
                id="rslTranslation"
                checked={meetingData.enableRSLTranslation}
                onCheckedChange={(checked) =>
                  setMeetingData({ ...meetingData, enableRSLTranslation: checked })
                }
                disabled={isSubmitting}
              />
            </div>

            {/* Additional Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="waitingRoom"
                  checked={meetingData.waitingRoom}
                  onCheckedChange={(checked) =>
                    setMeetingData({ ...meetingData, waitingRoom: checked as boolean })
                  }
                  disabled={isSubmitting}
                />
                <label htmlFor="waitingRoom" className="text-sm font-medium cursor-pointer">
                  Enable waiting room
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recordMeeting"
                  checked={meetingData.recordMeeting}
                  onCheckedChange={(checked) =>
                    setMeetingData({ ...meetingData, recordMeeting: checked as boolean })
                  }
                  disabled={isSubmitting}
                />
                <label htmlFor="recordMeeting" className="text-sm font-medium cursor-pointer">
                  Record meeting automatically
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSchedule}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editMode ? 'Updating...' : 'Scheduling...'}
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {editMode ? 'Update Meeting' : 'Schedule & Send Invites'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}