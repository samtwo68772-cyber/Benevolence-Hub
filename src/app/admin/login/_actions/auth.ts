
'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, clearSession } from '@/lib/session';
import { redirect } from 'next/navigation';

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
    if ((error as Error).message.includes('credentialssignin')) {
      return 'Invalid credentials.';
    }
    console.error('Authentication error:', error);
    return 'An unexpected error occurred. Please try again.';
  }
}

export async function logout() {
  await clearSession();
  redirect('/admin/login');
}
