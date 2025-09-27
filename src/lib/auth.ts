
'use server';

import { redirect } from 'next/navigation';
import type { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, clearSession } from './session';
import React from 'react';

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

    if (!passwordsMatch) {
      return 'Invalid credentials.';
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN',
    });

  } catch (error) {
    if ((error as Error).message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Authentication error:', error);
    return 'An unexpected error occurred. Please try again.';
  }
  redirect('/admin');
}

export async function logout() {
  await clearSession();
  redirect('/admin/login');
}
