// app/api/interviews/[interviewId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { interviews, meetingParticipants, callSessions, calendarConnections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCalendarClient } from '@/lib/google-calendar';

// PUT handler for updating/rescheduling interviews
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const { interviewId } = await params;
    
    // Get authenticated user
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookies() 
    });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📝 Attempting to update interview:', interviewId);

    // Get the existing interview
    const [existingInterview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1);

    if (!existingInterview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (existingInterview.candidateId !== user.id && existingInterview.interviewerId !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to update this interview' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, description, startTime, endTime, attendees } = body;

    console.log('📅 Update data:', { title, startTime, endTime, attendees });

    // Update in Google Calendar if synced
    if (existingInterview.googleEventId && existingInterview.syncedToCalendar) {
      try {
        console.log('📅 Updating Google Calendar event:', existingInterview.googleEventId);
        
        // Get user's calendar connection
        const [connection] = await db
          .select()
          .from(calendarConnections)
          .where(eq(calendarConnections.userId, user.id))
          .limit(1);

        if (connection) {
          const calendar = await getCalendarClient(
            connection.accessToken, 
            connection.refreshToken
          );

          // Prepare attendees for Google Calendar
          const googleAttendees = attendees?.map((email: string) => ({ email })) || [];

          // Update the event
          await calendar.events.patch({
            calendarId: 'primary',
            eventId: existingInterview.googleEventId,
            sendUpdates: 'all', // Notify all attendees about the update
            requestBody: {
              summary: title,
              description: description || existingInterview.description,
              start: {
                dateTime: new Date(startTime).toISOString(),
                timeZone: 'Africa/Kigali',
              },
              end: {
                dateTime: new Date(endTime).toISOString(),
                timeZone: 'Africa/Kigali',
              },
              attendees: googleAttendees,
            },
          });

          console.log('✅ Google Calendar event updated successfully');
        } else {
          console.warn('⚠️ No calendar connection found, skipping Google Calendar update');
        }
      } catch (calendarError: any) {
        console.error('⚠️ Failed to update Google Calendar event:', calendarError.message);
        // Don't fail the whole operation if calendar update fails
      }
    }

    // Update interview in database
    await db
      .update(interviews)
      .set({
        title,
        description: description || existingInterview.description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        updatedAt: new Date(),
      })
      .where(eq(interviews.id, interviewId));

    console.log('✅ Interview updated in database');

    // Update participants if provided
    if (attendees && attendees.length > 0) {
      // Delete existing participants
      await db
        .delete(meetingParticipants)
        .where(eq(meetingParticipants.interviewId, interviewId));

      // Add new participants
      const participantsToInsert = attendees.map((email: string) => ({
        interviewId,
        guestEmail: email,
        role: 'attendee' as const,
      }));

      await db.insert(meetingParticipants).values(participantsToInsert);
      console.log('✅ Participants updated');
    }

    // Get updated interview
    const [updatedInterview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: 'Interview updated successfully',
      interview: updatedInterview,
    });

  } catch (error: any) {
    console.error('❌ Error updating interview:', error);
    return NextResponse.json(
      { error: 'Failed to update interview', details: error.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATED DELETE handler - now does soft delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const { interviewId } = await params;
    
    // Get authenticated user
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookies() 
    });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🗑️ Attempting to cancel interview:', interviewId);

    // Get the interview to verify ownership
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1);

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to cancel (must be creator)
    if (interview.candidateId !== user.id && interview.interviewerId !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to cancel this interview' },
        { status: 403 }
      );
    }

    // Delete from Google Calendar FIRST (before database update)
    if (interview.googleEventId && interview.syncedToCalendar) {
      try {
        console.log('📅 Deleting Google Calendar event:', interview.googleEventId);
        
        // Get user's calendar connection
        const [connection] = await db
          .select()
          .from(calendarConnections)
          .where(eq(calendarConnections.userId, user.id))
          .limit(1);

        if (connection) {
          // Get calendar client
          const calendar = await getCalendarClient(
            connection.accessToken, 
            connection.refreshToken
          );

          // Delete the event and notify attendees
          await calendar.events.delete({
            calendarId: 'primary',
            eventId: interview.googleEventId,
            sendUpdates: 'all', // Notify all attendees about cancellation
          });

          console.log('✅ Google Calendar event deleted and attendees notified');
        } else {
          console.warn('⚠️ No calendar connection found, skipping Google Calendar delete');
        }
      } catch (calendarError: any) {
        console.error('⚠️ Failed to delete Google Calendar event:', calendarError.message);
        // Don't fail the whole operation if calendar delete fails
      }
    }

    // ✅ CHANGED: Mark interview as cancelled instead of deleting
    await db
      .update(interviews)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(interviews.id, interviewId));
    
    console.log('✅ Interview marked as cancelled in database');

    return NextResponse.json({
      success: true,
      message: 'Interview cancelled successfully. All attendees have been notified.',
      deletedFromCalendar: !!interview.googleEventId
    });

  } catch (error: any) {
    console.error('❌ Error cancelling interview:', error);
    return NextResponse.json(
      { error: 'Failed to cancel interview', details: error.message },
      { status: 500 }
    );
  }
}