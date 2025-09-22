
'use server';

import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';

export async function POST() {
    await clearSession();
    return new NextResponse('Logged out successfully');
}
