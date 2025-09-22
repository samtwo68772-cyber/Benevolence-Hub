
'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { headers } from 'next/headers';

const secretKey = process.env.SESSION_SECRET || 'default-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);
const cookieName = 'session';

export type SessionPayload = {
  id: string;
  email: string;
  role: string;
};

async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
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
    const cookieStore = cookies();
    const cookie = cookieStore.get(cookieName);
    if (!cookie?.value) return null;
    
    const session = await decrypt(cookie.value);
    return session as SessionPayload | null;
}


export async function clearSession() {
  cookies().delete(cookieName);
}
