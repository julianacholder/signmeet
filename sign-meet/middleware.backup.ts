import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Protect candidate & company routes - require authentication
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Check if user is accessing the correct dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', session.user.id)
    .single();

  if (profile) {
    // Deaf users should only access /candidate routes
    if (profile.user_type === 'deaf' && pathname.startsWith('/company')) {
      return NextResponse.redirect(new URL('/candidate/dashboard', req.url));
    }
    
    // Company users should only access /company routes
    if (profile.user_type === 'company' && pathname.startsWith('/candidate')) {
      return NextResponse.redirect(new URL('/company/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  // Exclude the callback route from middleware
  matcher: ['/candidate/:path*', '/company/:path*'],
};