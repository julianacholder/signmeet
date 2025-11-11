import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { interviews, meetingParticipants, callSessions } from '@/lib/db/schema';
import { eq, isNull, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params;
    const body = await request.json();
    const { userId, userEmail } = body;

    // Get meeting details
    const [meeting] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.meetingId, meetingId))
      .limit(1);

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found', canJoin: false },
        { status: 404 }
      );
    }

    // ✅ ALWAYS ALLOW ACCESS - No time restrictions!
    // Just calculate the status for informational purposes

    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(meeting.endTime);

    let meetingStatus: 'early' | 'live' | 'ended';
    let statusMessage = '';

    if (now < startTime) {
      meetingStatus = 'early';
      const minutesUntilStart = Math.floor((startTime.getTime() - now.getTime()) / 60000);
      if (minutesUntilStart > 60) {
        const hoursUntilStart = Math.floor(minutesUntilStart / 60);
        statusMessage = `Meeting starts in ${hoursUntilStart} hour${hoursUntilStart > 1 ? 's' : ''}`;
      } else if (minutesUntilStart > 0) {
        statusMessage = `Meeting starts in ${minutesUntilStart} minute${minutesUntilStart > 1 ? 's' : ''}`;
      } else {
        statusMessage = 'Meeting starts soon';
      }
    } else if (now > endTime) {
      meetingStatus = 'ended';
      const minutesSinceEnd = Math.floor((now.getTime() - endTime.getTime()) / 60000);
      if (minutesSinceEnd > 60) {
        const hoursSinceEnd = Math.floor(minutesSinceEnd / 60);
        statusMessage = `Meeting ended ${hoursSinceEnd} hour${hoursSinceEnd > 1 ? 's' : ''} ago`;
      } else {
        statusMessage = `Meeting ended ${minutesSinceEnd} minute${minutesSinceEnd > 1 ? 's' : ''} ago`;
      }
    } else {
      meetingStatus = 'live';
      statusMessage = 'Meeting is live';
    }

    // ✅ Get ACTIVE participants (people currently in the call)
    // Count sessions where leftAt is NULL (they haven't left yet)
    const activeSessions = await db
      .select()
      .from(callSessions)
      .where(
        and(
          eq(callSessions.meetingId, meetingId),
          isNull(callSessions.leftAt) // Still in the call
        )
      );

    console.log(`📊 Active participants in meeting ${meetingId}:`, activeSessions.length);

    // Get invited participants (for display purposes)
    const invitedParticipants = await db
      .select()
      .from(meetingParticipants)
      .where(eq(meetingParticipants.interviewId, meeting.id));

    // Determine user's role
    let userRole = 'participant';
    if (userId) {
      if (meeting.candidateId === userId) {
        userRole = 'candidate';
      } else if (meeting.interviewerId === userId) {
        userRole = 'interviewer';
      } else {
        const participant = invitedParticipants.find(p => p.userId === userId);
        if (participant) {
          userRole = participant.role || 'participant';
        }
      }
    }

    // ✅ ALWAYS return canJoin: true
    return NextResponse.json({
      canJoin: true, // ← Always true!
      meetingStatus, // ← Just for informational display
      statusMessage, // ← Just for informational display
      meeting: {
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        meetingId: meeting.meetingId,
        type: meeting.type,
      },
      userRole,
      activeParticipants: activeSessions.length, // ✅ Count of people ACTUALLY in the call
      totalInvited: invitedParticipants.length, // Total invited (for reference)
    });

  } catch (error) {
    console.error('Error verifying meeting access:', error);
    return NextResponse.json(
      { error: 'Failed to verify access', canJoin: false },
      { status: 500 }
    );
  }
}