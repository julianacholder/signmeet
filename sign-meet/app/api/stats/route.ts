import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { interviews } from '@/lib/db/schema';
import { eq, and, gte, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get all interviews where user is either candidate OR interviewer
    const userInterviews = await db
      .select()
      .from(interviews)
      .where(
        and(
          or(
            eq(interviews.candidateId, user.id),
            eq(interviews.interviewerId, user.id)
          ),
          gte(interviews.createdAt, startOfMonth)
        )
      );

    // Calculate statistics
    const totalMeetings = userInterviews.length;
    
    // Count cancelled meetings
    const cancelledMeetings = userInterviews.filter(
      interview => interview.status === 'cancelled'
    ).length;

    // Count rescheduled meetings (updatedAt is significantly different from createdAt)
    // A meeting is considered rescheduled if it was updated more than 1 minute after creation
    const rescheduledMeetings = userInterviews.filter(interview => {
      if (!interview.updatedAt || !interview.createdAt) return false;
      
      const timeDiff = interview.updatedAt.getTime() - interview.createdAt.getTime();
      const oneMinute = 60 * 1000;
      
      // Must be updated after creation and not cancelled
      return timeDiff > oneMinute && interview.status !== 'cancelled';
    }).length;

    return NextResponse.json({
      totalMeetings,
      rescheduledMeetings,
      cancelledMeetings,
    });

  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}