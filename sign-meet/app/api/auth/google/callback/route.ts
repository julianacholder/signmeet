
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createOAuth2Client } from '@/lib/google-calendar'; // CHANGED
import { google } from 'googleapis';
import { db } from '@/lib/db';
import { calendarConnections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  console.log('📥 Callback received');

  if (!code || !state) {
    return NextResponse.redirect(new URL('/candidate/schedule?error=no_code', request.url));
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== state) {
    console.log('❌ User mismatch');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    console.log('🔄 Exchanging code for tokens...');
    
    // Create a fresh OAuth client for this request
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('✅ Got tokens');

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Missing required tokens from Google');
    }

    // Set credentials on THIS client instance
    oauth2Client.setCredentials(tokens);

    console.log('🔐 Getting user info...');
    
    // Use the SAME oauth2Client instance with credentials already set
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    console.log('👤 Got Google user:', googleUser.email);

    // Save to database
    const existing = await db
      .select()
      .from(calendarConnections)
      .where(eq(calendarConnections.userId, user.id))
      .limit(1);

    if (existing.length > 0) {
      console.log('📝 Updating connection');
      await db
        .update(calendarConnections)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry: new Date(tokens.expiry_date!),
          email: googleUser.email || existing[0].email,
          connected: true,
          updatedAt: new Date(),
        })
        .where(eq(calendarConnections.userId, user.id));
    } else {
      console.log('➕ Creating connection');
      await db.insert(calendarConnections).values({
        userId: user.id,
        provider: 'google',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: new Date(tokens.expiry_date!),
        email: googleUser.email || null,
        connected: true,
      });
    }

    console.log('✅ Saved to database!');

    // Redirect based on user type
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    const redirectPath = profile?.user_type === 'deaf' 
      ? '/candidate/schedule?connected=true'
      : '/company/schedule?connected=true';

    console.log('🎉 Success! Redirecting...');
    return NextResponse.redirect(new URL(redirectPath, request.url));
    
  } catch (error: any) {
    console.error('❌ Full error:', error);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();
    
    const errorPath = profile?.user_type === 'deaf'
      ? '/candidate/schedule?error=connection_failed'
      : '/company/schedule?error=connection_failed';
    
    return NextResponse.redirect(new URL(errorPath, request.url));
  }
}