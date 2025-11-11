import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { calendarConnections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// In-memory cache for calendar status
const calendarStatusCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (calendar connection status doesn't change often)

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
    const cached = calendarStatusCache.get(user.id);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('✅ Returning cached calendar status for user:', user.id);
      return NextResponse.json({ 
        ...cached.data,
        cached: true,
        cacheAge: Math.floor((now - cached.timestamp) / 1000) + 's'
      });
    }

    console.log('🔄 Fetching fresh calendar status from database...');

    const connection = await db
      .select()
      .from(calendarConnections)
      .where(eq(calendarConnections.userId, user.id))
      .limit(1);

    const responseData = connection.length === 0
      ? { connected: false, cached: false }
      : { 
          connected: connection[0].connected,
          email: connection[0].email,
          cached: false
        };

    // Cache the result
    calendarStatusCache.set(user.id, {
      data: responseData,
      timestamp: now
    });

    console.log(' Cached calendar status for user:', user.id);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(' Error checking calendar status:', error);
    
    // Return stale cache if available
    const staleCache = calendarStatusCache.get(user.id);
    if (staleCache) {
      console.log(' Returning stale cache due to error');
      return NextResponse.json({ 
        ...staleCache.data,
        cached: true,
        stale: true
      });
    }
    
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}

// Clear cache when user connects/disconnects calendar
export async function POST(request: Request) {
  const { userId, action } = await request.json();
  
  if (action === 'clearCache' && userId) {
    calendarStatusCache.delete(userId);
    console.log(' Cleared calendar status cache for user:', userId);
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}