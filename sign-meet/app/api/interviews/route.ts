import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { interviews, meetingParticipants } from '@/lib/db/schema';
import { eq, or, and } from 'drizzle-orm';

// In-memory cache
// Key: userId, Value: { data, timestamp }
const interviewsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (shorter than jobs since interviews change more often)

export async function GET() {
  const supabase = createRouteHandlerClient({ 
    cookies: () => cookies() 
  });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check cache first
    const cached = interviewsCache.get(user.id);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('✅ Returning cached interviews for user:', user.id);
      return NextResponse.json({ 
        ...cached.data,
        cached: true,
        cacheAge: Math.floor((now - cached.timestamp) / 1000) + 's'
      });
    }

    console.log('🔄 Fetching fresh interviews from database...');

    // Get user's profile to determine their role
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type, full_name')
      .eq('id', user.id)
      .single();

    console.log('👤 User profile:', profile);

    // ✅ UPDATED: Fetch interviews where user is either:
    // 1. The creator (candidateId or interviewerId)
    // 2. A participant
    // AND status is 'scheduled' (not cancelled)
    const userInterviews = await db
      .select({
        id: interviews.id,
        title: interviews.title,
        description: interviews.description,
        startTime: interviews.startTime,
        endTime: interviews.endTime,
        meetingLink: interviews.meetingLink,
        meetingId: interviews.meetingId,
        passcode: interviews.passcode,
        type: interviews.type,
        status: interviews.status,
        candidateId: interviews.candidateId,
        interviewerId: interviews.interviewerId,
      })
      .from(interviews)
      .leftJoin(meetingParticipants, eq(meetingParticipants.interviewId, interviews.id))
      .where(
        and(
          or(
            eq(interviews.candidateId, user.id),
            eq(interviews.interviewerId, user.id),
            eq(meetingParticipants.userId, user.id)
          ),
          eq(interviews.status, 'scheduled') // ✅ Only show scheduled interviews
        )
      )
      .groupBy(interviews.id);

    console.log('📅 Found interviews:', userInterviews.length);

    // For each interview, get all participants
    const interviewsWithParticipants = await Promise.all(
      userInterviews.map(async (interview) => {
        const participants = await db
          .select({
            id: meetingParticipants.id,
            userId: meetingParticipants.userId,
            guestEmail: meetingParticipants.guestEmail,
            guestName: meetingParticipants.guestName,
            role: meetingParticipants.role,
            status: meetingParticipants.status,
          })
          .from(meetingParticipants)
          .where(eq(meetingParticipants.interviewId, interview.id));

        console.log(`👥 Interview "${interview.title}" has ${participants.length} participants`);

        // Get user details for registered participants
        const participantsWithDetails = await Promise.all(
          participants.map(async (p) => {
            if (p.userId) {
              const { data: userProfile } = await supabase
                .from('profiles')
                .select('full_name, email, user_type')
                .eq('id', p.userId)
                .single();

              return {
                ...p,
                name: userProfile?.full_name || 'Unknown',
                email: userProfile?.email || '',
                userType: userProfile?.user_type,
              };
            }
            return {
              ...p,
              name: p.guestEmail || 'Guest',
              email: p.guestEmail || '',
              userType: null,
            };
          })
        );

        console.log('✅ Participants with details:', participantsWithDetails);

        // Determine who to show based on current user's role
        let displayName = '';
        let displayRole = '';

        if (profile?.user_type === 'deaf') {
          // Candidate view: show all participants EXCEPT yourself
          const interviewers = participantsWithDetails.filter(
            p => p.userId !== user.id
          );
          
          console.log('🎯 Filtered interviewers:', interviewers);
          
          if (interviewers.length === 1) {
            displayName = interviewers[0].name;
            displayRole = 'Interviewer';
          } else if (interviewers.length > 1) {
            displayName = interviewers.map(i => i.name).join(', ');
            displayRole = 'Interviewers';
          } else {
            displayName = 'TBD';
            displayRole = 'Interviewer';
          }
        } else {
          // Company view: show all participants EXCEPT yourself
          const candidates = participantsWithDetails.filter(
            p => p.userId !== user.id
          );
          
          console.log('🎯 Filtered candidates:', candidates);
          
          if (candidates.length === 1) {
            displayName = candidates[0].name;
            displayRole = 'Candidate';
          } else if (candidates.length > 1) {
            displayName = candidates.map(c => c.name).join(', ');
            displayRole = 'Candidates';
          } else {
            displayName = 'TBD';
            displayRole = 'Candidate';
          }
        }

        console.log(`📝 Final display: ${displayRole}: ${displayName}`);

        return {
          ...interview,
          participants: participantsWithDetails,
          displayName,
          displayRole,
        };
      })
    );

    const responseData = { 
      interviews: interviewsWithParticipants,
      userType: profile?.user_type,
      cached: false
    };

    // Cache the results
    interviewsCache.set(user.id, {
      data: responseData,
      timestamp: now
    });

    console.log('✅ Cached interviews for user:', user.id);
    console.log('🎉 Returning', interviewsWithParticipants.length, 'interviews');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Error fetching interviews:', error);
    
    // If we have stale cache, return it
    const staleCache = interviewsCache.get(user!.id);
    if (staleCache) {
      console.log('⚠️ Returning stale cache due to error');
      return NextResponse.json({ 
        ...staleCache.data,
        cached: true,
        stale: true
      });
    }
    
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// Optional: Clear cache for a specific user (useful after creating/updating interviews)
export async function POST(request: Request) {
  const body = await request.json();
  const { userId: bodyUserId, action } = body || {};

  if (action === 'clearCache') {
    let targetUserId = bodyUserId;

    // If no userId provided, attempt to resolve current user from auth cookies
    if (!targetUserId) {
      try {
        const supabase = createRouteHandlerClient({ cookies: () => cookies() });
        const { data: { user } } = await supabase.auth.getUser();
        targetUserId = user?.id;
      } catch (err) {
        console.error('Error resolving user for cache clear:', err);
      }
    }

    if (targetUserId) {
      interviewsCache.delete(targetUserId);
      console.log('✅ Cleared cache for user:', targetUserId);
      return NextResponse.json({ success: true });
    }

    console.log('⚠️ clearCache called but no userId resolved');
    return NextResponse.json({ error: 'No userId provided or resolved' }, { status: 400 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}