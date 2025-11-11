import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callSessions, interviews, profiles } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }  
) {
  try {
    //  Await params 
    const { meetingId } = await params;
    const body = await request.json();
    const { userId, userName, userRole, peerId } = body;

    // Validate required fields
    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      );
    }

    if (!peerId) {
      return NextResponse.json(
        { error: 'Peer ID is required' },
        { status: 400 }
      );
    }

    // Get interview details
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.meetingId, meetingId))
      .limit(1);

    if (!interview) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    // Get user name if userId provided
    let finalUserName = userName;
    if (userId && !userName) {
      const [user] = await db
        .select({ fullName: profiles.fullName })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);
      
      finalUserName = user?.fullName || 'Unknown User';
    }

    // Check if user has an active session (shouldn't happen, but safety check)
    const [existingSession] = await db
      .select()
      .from(callSessions)
      .where(
        and(
          eq(callSessions.meetingId, meetingId),
          userId ? eq(callSessions.userId, userId) : eq(callSessions.peerId, peerId),
          isNull(callSessions.leftAt)
        )
      )
      .limit(1);

    if (existingSession) {
      // User already has an active session, return it
      return NextResponse.json({
        success: true,
        session: existingSession,
        message: 'Active session already exists'
      });
    }

    // Create new session
    const [newSession] = await db
      .insert(callSessions)
      .values({
        meetingId,
        interviewId: interview.id,
        userId: userId || null,
        userName: finalUserName,
        userRole: userRole || 'participant',
        peerId,
        joinedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      session: newSession,
      message: 'Session started successfully'
    });

  } catch (error: any) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start session' },
      { status: 500 }
    );
  }
}