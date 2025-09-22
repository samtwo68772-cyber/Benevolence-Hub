
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import type { User } from '@prisma/client';

const secretKey = process.env.SESSION_SECRET || 'default-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);
const cookieName = 'session';

export type SessionPayload = {
    userId: string;
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

export async function setSession(user: User) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionPayload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'ADMIN',
  };
  const session = await encrypt(sessionPayload);

  cookies().set(cookieName, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = cookies();
    const cookie = cookieStore.get(cookieName)?.value;
    const session = await decrypt(cookie);
    return session as SessionPayload | null;
}


export async function clearSession() {
  cookies().delete(cookieName);
}
