
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getSession, createSession, SessionPayload } from '@/lib/session';
import { db } from '@/lib/db';

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ["confirmPassword"],
});

const settingsSchema = z.object({
    appName: z.string().min(2, "App name must be at least 2 characters."),
    logo: z.string().min(2, "Logo name must be at least 2 characters."),
});

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    const session = await getSession();
    if (!session) {
        throw new Error('Not authenticated.');
    }

    const validatedFields = profileSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Invalid data.');
    }

    const { name, email } = validatedFields.data;

    const existingUser = await db.getUserByEmail(email);
    if (existingUser && existingUser.id !== session.userId) {
        throw new Error('Email is already in use by another account.');
    }

    await db.updateUser(session.userId, { name, email });
    
    const updatedSession: SessionPayload = {
        userId: session.userId,
        name,
        email,
        role: session.role
    };
    
    await createSession(updatedSession);

    revalidatePath('/admin/settings');
    return { message: 'Profile updated successfully.' };
}

export async function changePassword(data: z.infer<typeof passwordSchema>) {
    const session = await getSession();
    if (!session) {
        throw new Error('Not authenticated.');
    }
    
    const validatedFields = passwordSchema.safeParse(data);
    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0];
        throw new Error(firstError || 'Invalid data.');
    }

    const { currentPassword, newPassword } = validatedFields.data;

    const user = await db.getUserById(session.userId);
    if (!user || !user.password) {
        throw new Error('User not found.');
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
        throw new Error('Current password does not match.');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.updateUser(session.userId, { password: hashedNewPassword });

    return { message: 'Password updated successfully.' };
}

export async function updateSettings(data: z.infer<typeof settingsSchema>) {
    const validatedFields = settingsSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Invalid settings data.');
    }

    await db.updateSettings(validatedFields.data);

    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { message: 'Site settings updated successfully.' };
}
