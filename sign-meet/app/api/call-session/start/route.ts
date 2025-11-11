import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callSessions } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meetingId, userId, userName, userRole, peerId } = body;

    console.log('🚀 Creating new call session:', { meetingId, userId, userName, peerId });

    // ✅ Handle guest users - don't pass userId if it's a guest
    // This prevents UUID validation errors in the database
    const sessionData: any = {
      meetingId,
      userName,
      userRole,
      peerId,
      joinedAt: new Date(),
      leftAt: null
    };

    // Only include userId if it's a valid UUID (not a guest)
    if (userId && userId !== 'guest' && !userId.startsWith('guest-')) {
      sessionData.userId = userId;
    }
    // If userId is null/undefined/guest, it will be stored as NULL in database

    // Insert new session
    const [newSession] = await db
      .insert(callSessions)
      .values(sessionData)
      .returning();

    console.log('✅ Session created:', newSession.id);

    return NextResponse.json({
      success: true,
      sessionId: newSession.id,
      session: newSession
    });

  } catch (error: any) {
    console.error('❌ Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session', details: error.message },
      { status: 500 }
    );
  }
}