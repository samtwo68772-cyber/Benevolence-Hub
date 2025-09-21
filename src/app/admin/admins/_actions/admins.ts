
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser, updateUser, deleteUser } from '@/lib/db';

const adminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
});

const addAdminSchema = adminSchema.extend({
    password: z.string().min(8, "Password must be at least 8 characters."),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export async function addAdmin(data: z.infer<typeof addAdminSchema>) {
    const validatedFields = addAdminSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('Invalid admin data.');
    }

    const existingUser = await getUserByEmail(validatedFields.data.email);

    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }
    
    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

    await createUser({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: hashedPassword,
    });

    revalidatePath('/admin/admins');
}

export async function updateAdmin(data: z.infer<typeof adminSchema>) {
    const validatedFields = adminSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('Invalid admin data for update.');
    }
    
    if (!validatedFields.data.id) {
        throw new Error('Invalid update id.');
    }
    
    const { id, password, confirmPassword, ...updateData } = validatedFields.data;
    
    if (password && password !== confirmPassword) {
        throw new Error("Passwords don't match");
    }

    const existingUserByEmail = await getUserByEmail(updateData.email);

    if (existingUserByEmail && existingUserByEmail.id !== id) {
        throw new Error('An account with this email already exists.');
    }

    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }
    
    await updateUser(id, {
        ...updateData,
        ...(hashedPassword && { password: hashedPassword })
    });

    revalidatePath('/admin/admins');
}

export async function deleteAdmin(adminId: string) {
    await deleteUser(adminId);
    revalidatePath('/admin/admins');
}
