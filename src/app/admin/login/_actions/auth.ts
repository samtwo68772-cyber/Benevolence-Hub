
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return 'Please provide both email and password.';
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true
      }
    });

    if (!user || user.role !== 'ADMIN') {
      return 'Invalid credentials.';
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      // Create JWT token and set cookie
      const token = await new SignJWT({
        id: user.id,
        email: user.email,
        role: user.role
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(new TextEncoder().encode(process.env.SESSION_SECRET || 'default-secret-key-for-development'));

      // Return response with Set-Cookie header and redirect
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/admin',
          'Set-Cookie': `session=${token}; Path=/; HttpOnly; ${
            process.env.NODE_ENV === 'production' ? 'Secure;' : ''
          } SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
        }
      });
    } else {
      return 'Invalid credentials.';
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return 'Something went wrong. Please try again.';
  }
}

export async function logout() {
  // Return response that clears cookie and redirects
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/login',
      'Set-Cookie': 'session=; Path=/; HttpOnly; Max-Age=0'
    }
  });
}
