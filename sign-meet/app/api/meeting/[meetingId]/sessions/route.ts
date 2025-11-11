import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callSessions } from '@/lib/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> } 
) {
  try {
    // Await params 
    const { meetingId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Meeting ID is required' },
        { status: 400 }
      );
    }

    // Build query conditions
    let whereConditions = [eq(callSessions.meetingId, meetingId)];
    
    if (userId) {
      whereConditions.push(eq(callSessions.userId, userId));
    }

    // Get all sessions for the meeting (or specific user)
    const sessions = await db
      .select()
      .from(callSessions)
      .where(and(...whereConditions))
      .orderBy(desc(callSessions.joinedAt));

    // Calculate analytics
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.leftAt !== null);
    const activeSessions = sessions.filter(s => s.leftAt === null);
    
    // Calculate total duration (only completed sessions)
    const totalDuration = completedSessions.reduce((sum, session) => {
      return sum + (session.duration || 0);
    }, 0);

    // Count reconnections (sessions after the first one)
    const reconnections = totalSessions > 0 ? totalSessions - 1 : 0;

    // Get unique participants
    const uniqueParticipants = [...new Set(sessions.map(s => s.userId || s.peerId))].length;

    // Disconnect reasons breakdown
    const disconnectReasons = completedSessions.reduce((acc, session) => {
      const reason = session.disconnectReason || 'unknown';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        analytics: {
          totalSessions,
          completedSessions: completedSessions.length,
          activeSessions: activeSessions.length,
          totalDuration, // in seconds
          totalDurationMinutes: Math.floor(totalDuration / 60),
          reconnections,
          uniqueParticipants,
          disconnectReasons,
          averageSessionDuration: completedSessions.length > 0 
            ? Math.floor(totalDuration / completedSessions.length)
            : 0
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}