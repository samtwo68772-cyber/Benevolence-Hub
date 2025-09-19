
'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  details: z.string().transform(val => val.split('\n').filter(line => line.trim() !== '')),
  image: z.any().optional(),
  startDate: z.string().transform(val => new Date(val)),
  status: z.enum(['Active', 'Completed', 'Planning']),
  category: z.enum(['Water', 'Education', 'Medical', 'Community Development', 'Disaster Relief']),
});

async function handleImageUpload(image: File, id: string) {
    if (!image || image.size === 0) {
        return null;
    }
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${id}-${image.name}`;
    const path = join(process.cwd(), 'public', filename);
    await writeFile(path, buffer);
    return `/${filename}`;
}


export async function addProject(data: FormData) {
    const rawData = Object.fromEntries(data.entries());
    const validatedFields = projectSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        throw new Error('Invalid project data.');
    }
    
    const { image, ...projectData } = validatedFields.data;

    const newProject = await prisma.project.create({
        data: {
            ...projectData,
            imageId: 'placeholder',
            peopleHelped: 0,
        },
    });

    const imageUrl = await handleImageUpload(image as File, newProject.id);

    if (imageUrl) {
        await prisma.project.update({
            where: { id: newProject.id },
            data: { imageId: imageUrl },
        });
    }

    revalidatePath('/admin/projects');
    revalidatePath('/');
}

export async function updateProject(data: FormData) {
    const rawData = Object.fromEntries(data.entries());
    const validatedFields = projectSchema.safeParse(rawData);

    if (!validatedFields.success || !rawData.id) {
        throw new Error('Invalid project data for update.');
    }
    
    const { image, ...updateData } = validatedFields.data;
    const id = rawData.id as string;
    
    const imageUrl = await handleImageUpload(image as File, id);

    await prisma.project.update({
        where: { id },
        data: {
            ...updateData,
            ...(imageUrl && { imageId: imageUrl }),
        },
    });

    revalidatePath('/admin/projects');
    revalidatePath('/');
    revalidatePath(`/project/${id}`);
}

export async function deleteProject(projectId: string) {
    await prisma.project.delete({
        where: { id: projectId },
    });
    revalidatePath('/admin/projects');
    revalidatePath('/');
}
