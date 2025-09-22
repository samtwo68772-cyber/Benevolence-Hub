
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';

  // For non-admin routes, proceed normally
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Get session cookie
  const session = request.cookies.get('session')?.value;

  // Handle admin login route
  if (isLoginRoute) {
    // If we have a valid session, redirect to admin dashboard
    if (session) {
      try {
        // Import needs to be dynamic in middleware
        const { jwtVerify } = await import('jose');
        const secretKey = process.env.SESSION_SECRET || 'default-secret-key-for-development';
        const key = new TextEncoder().encode(secretKey);
        
        const { payload } = await jwtVerify(session, key, {
          algorithms: ['HS256'],
        });
        if ((payload as any).role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      } catch (error) {
        // Invalid session, let them proceed to login
      }
    }
    return NextResponse.next();
  }

  // For all other admin routes, require authentication
  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Import needs to be dynamic in middleware
    const { jwtVerify } = await import('jose');
    const secretKey = process.env.SESSION_SECRET || 'default-secret-key-for-development';
    const key = new TextEncoder().encode(secretKey);
    
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });

    if ((payload as any).role !== 'ADMIN') {
      throw new Error('Not authorized');
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth error:', error);
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
