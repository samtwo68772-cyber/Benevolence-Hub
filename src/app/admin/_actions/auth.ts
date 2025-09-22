
'use server';

import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createAuthToken, setCookie } from '@/lib/cookies';

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
      // Create JWT token
      const token = await createAuthToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Set auth cookie
      const headers = setCookie('session', token, {
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      // Create response with headers and redirect
      const response = new Response(null, {
        status: 302,
        headers: {
          Location: '/admin',
          ...Object.fromEntries(headers.entries())
        }
      });

      return response;
    } else {
      return 'Invalid credentials.';
    }
  } catch (error) {
    if ((error as Error).message.includes('NEXT_REDIRECT')) {
        throw error;
    }
    console.error('Authentication error:', error);
    return 'Something went wrong. Please try again.';
  }
}
