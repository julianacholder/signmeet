import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callSessions } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    // ✅ Await params in Next.js 15
    const { meetingId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // ✅ Skip database check for guest users
    // Guest users don't have UUIDs, so checking them will cause UUID validation errors
    if (!userId || userId === 'guest' || userId.startsWith('guest-')) {
      return NextResponse.json({
        hasActiveSession: false,
        sessionId: null
      });
    }

    // ✅ Only check database for authenticated users with valid UUIDs
    try {
      const activeSessions = await db
        .select()
        .from(callSessions)
        .where(
          and(
            eq(callSessions.meetingId, meetingId),
            eq(callSessions.userId, userId),
            isNull(callSessions.leftAt)
          )
        )
        .limit(1);

      if (activeSessions.length > 0) {
        return NextResponse.json({
          hasActiveSession: true,
          sessionId: activeSessions[0].id
        });
      }

      return NextResponse.json({
        hasActiveSession: false,
        sessionId: null
      });

    } catch (dbError: any) {
      // ✅ If UUID validation fails, treat as guest user
      if (dbError.code === '22P02') {
        console.log('Invalid UUID format, treating as guest user');
        return NextResponse.json({
          hasActiveSession: false,
          sessionId: null
        });
      }
      throw dbError;
    }

  } catch (error: any) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { error: 'Failed to check session', details: error.message },
      { status: 500 }
    );
  }
}