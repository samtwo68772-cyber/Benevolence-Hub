'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import type { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const secretKey = process.env.SESSION_SECRET || 'default-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);
const cookieName = 'session';

export type SessionPayload = {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN';
};

async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSession(data: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt(data);

  cookies().set(cookieName, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookie = cookies().get(cookieName)?.value;
    if (!cookie) return null;
    
    const session = await decrypt(cookie);
    return session as SessionPayload | null;
}

export async function clearSession() {
  cookies().delete(cookieName);
}

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
    });

    if (!user) {
      return 'Invalid credentials.';
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      await createSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'ADMIN',
      });
      return redirect('/admin');
    }

    return 'Invalid credentials.';
  } catch (error) {
    if ((error as Error).message.includes('credentialssignin') || (error as Error).message.includes('NEXT_REDIRECT')) {
        // The redirect error is expected on success, so we don't treat it as a server error.
        // Re-throw to let Next.js handle the redirect.
        throw error;
    }
    console.error('Authentication error:', error);
    return 'An unexpected error occurred. Please try again.';
  }
}

export async function logout() {
  await clearSession();
  redirect('/admin/login');
}
