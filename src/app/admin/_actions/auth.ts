
'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

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

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== 'ADMIN' || !user.password) {
      return 'Invalid credentials.';
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      await createSession({
          userId: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
      });
      redirect('/admin');
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
