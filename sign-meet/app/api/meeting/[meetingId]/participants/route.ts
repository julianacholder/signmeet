import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callSessions } from '@/lib/db/schema';
import { eq, isNull } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }  
) {
  try {
    // Await params
    const { meetingId } = await params;
    
    console.log('📋 Fetching active participants for meeting:', meetingId);

    // Get all active sessions (where leftAt is NULL)
    const activeSessions = await db
      .select()
      .from(callSessions)
      .where(
        eq(callSessions.meetingId, meetingId)
      );

    // Filter for active sessions (leftAt is null)
    const activeParticipants = activeSessions.filter(session => session.leftAt === null);

    console.log('✅ Found active participants:', activeParticipants.length);

    return NextResponse.json({
      success: true,
      participants: activeParticipants.map(session => ({
        id: session.id,
        userId: session.userId,
        userName: session.userName,
        userRole: session.userRole,
        peerId: session.peerId,
        joinedAt: session.joinedAt,
      }))
    });

  } catch (error: any) {
    console.error('❌ Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants', details: error.message },
      { status: 500 }
    );
  }
}