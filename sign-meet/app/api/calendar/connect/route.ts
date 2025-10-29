// app/api/calendar/connect/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getAuthUrl } from '@/lib/google-calendar';

export async function GET() {
 const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const authUrl = getAuthUrl(user.id);
  
  return NextResponse.json({ url: authUrl });
}