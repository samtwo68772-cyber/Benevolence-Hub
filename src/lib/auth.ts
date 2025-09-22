'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type User } from '@prisma/client';

const SESSION_COOKIE = 'admin_session';

export async function setSession(user: User) {
    // Create session data - don't include sensitive info like password
    const session = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    
    // Set session cookie with HTTP-only flag
    cookies().set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });
}

export async function getSession() {
    const session = cookies().get(SESSION_COOKIE)?.value;
    if (!session) return null;
    
    try {
        return JSON.parse(session);
    } catch {
        return null;
    }
}

export async function clearSession() {
    cookies().delete(SESSION_COOKIE);
}

export async function requireAuth() {
    const session = await getSession();
    
    if (!session || session.role !== 'ADMIN') {
        redirect('/admin/login');
    }
    
    return session;
}