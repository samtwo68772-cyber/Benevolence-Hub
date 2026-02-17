
'use server';

import prisma from '@/lib/prisma';
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

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return 'Invalid credentials.';
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      return createSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'ADMIN',
      });
    }

    return 'Invalid credentials.';
  } catch (error) {
    console.error('Authentication error:', error);
    return 'An error occurred during authentication.';
  }
}
