
'use server';

import { z } from 'zod';
// import prisma from '@/lib/prisma';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ProjectCategory, ProjectStatus } from '@/lib/types';


const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  details: z.string().transform(val => val.split('\n').filter(line => line.trim() !== '')),
  imageId: z.string().min(1, "Image ID is required."),
  startDate: z.string().transform(val => new Date(val)),
  status: z.enum(['Active', 'Completed', 'Planning']),
  category: z.enum(['Water', 'Education', 'Medical', 'Community Development', 'Disaster Relief']),
  peopleHelped: z.string().transform(val => parseInt(val, 10)),
});

export async function addProject(data: z.infer<typeof projectSchema>) {
    const validatedFields = projectSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('Invalid project data.');
    }
    
    await db.project.create({
        data: validatedFields.data,
    });

    revalidatePath('/admin/projects');
}

export async function updateProject(data: z.infer<typeof projectSchema>) {
    const validatedFields = projectSchema.safeParse(data);

    if (!validatedFields.success || !validatedFields.data.id) {
        throw new Error('Invalid project data for update.');
    }
    
    const { id, ...updateData } = validatedFields.data;
    
    await db.project.update({
        where: { id: id! },
        data: updateData,
    });

    revalidatePath('/admin/projects');
}

export async function deleteProject(projectId: string) {
    await db.project.delete({
        where: { id: projectId },
    });
    revalidatePath('/admin/projects');
}
