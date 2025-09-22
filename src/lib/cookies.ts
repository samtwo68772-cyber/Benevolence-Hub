'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'default-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);

export const setCookie = (name: string, value: string, options: any = {}) => {
  const cookieStore = cookies();
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };

  const cookieValue = `${name}=${value}; Path=${options.path || defaultOptions.path}; ${
    options.httpOnly ? 'HttpOnly;' : ''
  } ${options.secure ? 'Secure;' : ''} SameSite=${
    options.sameSite || defaultOptions.sameSite
  }${options.maxAge ? `; Max-Age=${options.maxAge}` : ''}`;

  const headers = new Headers();
  headers.append('Set-Cookie', cookieValue);

  return headers;
};

export const getCookie = (name: string) => {
  const cookieStore = cookies();
  return cookieStore.get(name)?.value;
};

export const deleteCookie = (name: string) => {
  return setCookie(name, '', { maxAge: 0 });
};

export async function createAuthToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(key);
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}