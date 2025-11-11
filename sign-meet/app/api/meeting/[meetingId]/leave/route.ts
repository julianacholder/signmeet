import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callSessions } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    // Await params
    const { meetingId } = await params;
    const body = await request.json();
    const { sessionId, disconnectReason = 'left_intentionally' } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('🛑 Ending session:', sessionId, 'Reason:', disconnectReason);

    //  Find the active session
    const sessions = await db
      .select()
      .from(callSessions)
      .where(
        and(
          eq(callSessions.id, sessionId),
          eq(callSessions.meetingId, meetingId),
          isNull(callSessions.leftAt)
        )
      )
      .limit(1);

    //  If no active session found, return success anyway (idempotent)
    if (sessions.length === 0) {
      console.log(' No active session found for:', sessionId);
      return NextResponse.json({
        success: true,
        message: 'Session already ended or not found',
        duration: 0
      });
    }

    const session = sessions[0];

    // Calculate duration
    const joinedAt = new Date(session.joinedAt);
    const leftAt = new Date();
    const duration = Math.floor((leftAt.getTime() - joinedAt.getTime()) / 1000);

    //  Update the session (use Date object, not ISO string)
    await db
      .update(callSessions)
      .set({
        leftAt: leftAt, // Use Date object directly
        duration,
        disconnectReason
      })
      .where(eq(callSessions.id, sessionId));

    console.log('✅ Session ended successfully:', sessionId, 'Duration:', duration, 'seconds');

    return NextResponse.json({
      success: true,
      duration,
      leftAt: leftAt.toISOString()
    });

  } catch (error: any) {
    console.error('❌ Error ending session:', error);
    return NextResponse.json(
      { error: 'Failed to end session', details: error.message },
      { status: 500 }
    );
  }
}