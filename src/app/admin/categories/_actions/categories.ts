
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createCategory as dbCreateCategory, updateCategory as dbUpdateCategory, deleteCategory as dbDeleteCategory } from '@/lib/db';

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export async function addCategory(data: z.infer<typeof categorySchema>) {
    const validatedFields = categorySchema.safeParse({ name: data.name });

    if (!validatedFields.success) {
        throw new Error('Invalid category name.');
    }

    try {
        await dbCreateCategory(validatedFields.data.name);
        revalidatePath('/admin/categories');
        revalidatePath('/admin/projects');
    } catch (error: any) {
        if (error?.code === 'P2002') {
            throw new Error('A category with this name already exists.');
        }
        throw error;
    }
}

export async function updateCategory(data: z.infer<typeof categorySchema>) {
    const validatedFields = categorySchema.safeParse(data);

    if (!validatedFields.success || !validatedFields.data.id) {
        throw new Error('Invalid category data for update.');
    }
    
    const { id, name } = validatedFields.data;
    
    await dbUpdateCategory(id, name);

    revalidatePath('/admin/categories');
    revalidatePath('/admin/projects');
}

export async function deleteCategory(categoryId: string) {
    await dbDeleteCategory(categoryId);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/projects');
}
