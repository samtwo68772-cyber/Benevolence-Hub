import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host') || '';
  const origin = request.headers.get('origin') || '';
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';

  // Check authentication for admin routes
  if (isAdminRoute && !isLoginRoute) {
    const sessionCookie = request.cookies.get('session');
    
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Import needs to be dynamic in middleware
      const { jwtVerify } = await import('jose');
      const secretKey = process.env.SESSION_SECRET || 'default-secret-key-for-development';
      const key = new TextEncoder().encode(secretKey);
      
      const { payload } = await jwtVerify(sessionCookie.value, key, {
        algorithms: ['HS256'],
      });

      // Check if user is admin
      if (payload.role !== 'ADMIN') {
        throw new Error('Not an admin');
      }
    } catch (error) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Create a new response
  const response = NextResponse.next();

  // Handle CORS for POST requests
  if (request.method === 'POST') {
    const allowedOrigins = ['github.dev', 'app.github.dev', 'localhost'];
    const isAllowedOrigin = allowedOrigins.some(domain => origin.includes(domain));
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'POST');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }
  }

  // For Server Actions in GitHub Codespaces
  if (request.headers.get('next-action') && forwardedHost.includes('github.dev')) {
    response.headers.set('x-origin', `https://${forwardedHost}`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    '/admin/:path*'
  ],
}