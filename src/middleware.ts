

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPath = pathname.startsWith('/admin');

  // If it's not an admin path, do nothing.
  if (!isAdminPath) {
    return NextResponse.next();
  }

  const session = await getSession();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    // If the user is logged in and tries to access the login page,
    // redirect them to the admin dashboard.
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise, allow them to see the login page.
    return NextResponse.next();
  }

  // For all other admin pages, if there's no session,
  // redirect to the login page.
  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    // Add a callbackUrl so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated, allow them to proceed.
  return NextResponse.next();
}

export const config = {
  // Only apply this middleware to the /admin routes, excluding static assets
  matcher: ['/admin/:path*'],
}
