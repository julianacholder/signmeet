import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { interviews, calendarConnections, meetingParticipants } from '@/lib/db/schema'; // Combine imports
import { getCalendarClient, createOAuth2Client } from '@/lib/google-calendar';
import { eq } from 'drizzle-orm';

// Helper function to generate unique meeting ID
function generateMeetingId(): string {
  return Math.random().toString(36).substring(2, 14).toUpperCase();
}

// Helper function to generate passcode
function generatePasscode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { 
    title, 
    description, 
    startTime, 
    endTime, 
    attendees, 
    candidateId, 
    interviewerId 
  } = body;

  try {
    // Get calendar connection
    const [connection] = await db
      .select()
      .from(calendarConnections)
      .where(eq(calendarConnections.userId, user.id))
      .limit(1);

    if (!connection) {
      return NextResponse.json({ 
        error: 'Calendar not connected',
        needsConnection: true 
      }, { status: 400 });
    }

    // Check if token expired and refresh if needed
    if (new Date() > new Date(connection.tokenExpiry)) {
      const oauth2Client = createOAuth2Client();
      oauth2Client.setCredentials({
        refresh_token: connection.refreshToken,
      });
      
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      // Update tokens in database
      await db
        .update(calendarConnections)
        .set({
          accessToken: credentials.access_token!,
          tokenExpiry: new Date(credentials.expiry_date!),
          updatedAt: new Date(),
        })
        .where(eq(calendarConnections.userId, user.id));
    }

    // Generate our own meeting data FIRST
    const meetingId = generateMeetingId();
    const passcode = generatePasscode();
    const meetingLink = `https://signmeet.vercel.app/meeting/${meetingId}`;

    console.log('📅 Creating calendar event with SignMeet link:', meetingLink);

    // Create calendar event with OUR link
    const calendar = await getCalendarClient(connection.accessToken, connection.refreshToken);
    
    const event = {
      summary: title,
      description: `${description || 'RSL-enabled interview via SignMeet'}

━━━━━━━━━━━━━━━━━━━━━
🎥 Join via SignMeet
Meeting ID: ${meetingId}
Passcode: ${passcode}

Click the link below to join with real-time RSL translation:
${meetingLink}
━━━━━━━━━━━━━━━━━━━━━`,
      location: meetingLink, 
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'Africa/Kigali',
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'Africa/Kigali',
      },
      attendees: attendees?.map((email: string) => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'all', 
    });

    console.log('✅ Calendar event created:', response.data.id);

    // Save to database
    const [interview] = await db.insert(interviews).values({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      candidateId: candidateId || user.id,
      interviewerId: interviewerId || null,
      googleEventId: response.data.id!,
      meetingLink: meetingLink,
      meetingId: meetingId,
      passcode: passcode,
      syncedToCalendar: true,
      type: 'RSL Translation Active',
      status: 'scheduled',
    }).returning();

    console.log('💾 Interview saved to database:', interview.id);

    // Save host (creator) as participant
    await db.insert(meetingParticipants).values({
      interviewId: interview.id,
      userId: user.id,
      role: 'host',
      status: 'accepted',
    });

    console.log('👤 Host saved as participant');

    // Save all attendees as participants
    if (attendees && attendees.length > 0) {
      const participantRecords = attendees.map((email: string) => ({
        interviewId: interview.id,
        guestEmail: email,
        role: 'participant' as const,
        status: 'invited' as const,
      }));
      
      await db.insert(meetingParticipants).values(participantRecords);
      console.log(`✅ Saved ${attendees.length} participants`);
    }

    return NextResponse.json({ 
      success: true, 
      interview, 
      googleEvent: response.data,
      meetingLink: meetingLink,
    });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    return NextResponse.json({ 
      error: 'Failed to create event',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET: Fetch user's interviews
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.candidateId, user.id));

    return NextResponse.json({ interviews: userInterviews });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}