
'use server';

import { z } from 'zod';
// import prisma from '@/lib/prisma';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

const adminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),
});

const addAdminSchema = adminSchema.extend({
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function addAdmin(data: z.infer<typeof addAdminSchema>) {
    const validatedFields = addAdminSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('Invalid admin data.');
    }
    
    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

    await db.user.create({
        data: {
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    revalidatePath('/admin/admins');
}

export async function updateAdmin(data: z.infer<typeof adminSchema>) {
    const validatedFields = adminSchema.safeParse(data);

    if (!validatedFields.success || !validatedFields.data.id) {
        throw new Error('Invalid admin data for update.');
    }
    
    const { id, password, ...updateData } = validatedFields.data;

    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }
    
    await db.user.update({
        where: { id },
        data: {
            ...updateData,
            ...(hashedPassword && { password: hashedPassword })
        },
    });

    revalidatePath('/admin/admins');
}

export async function deleteAdmin(adminId: string) {
    await db.user.delete({
        where: { id: adminId },
    });
    revalidatePath('/admin/admins');
}
