
'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ProjectCategory, ProjectStatus } from '@prisma/client';

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  details: z.string().transform(val => val.split('\n').filter(line => line.trim() !== '')),
  startDate: z.string().transform(val => new Date(val)),
  status: z.nativeEnum(ProjectStatus),
  category: z.nativeEnum(ProjectCategory),
});

function assignImageId(category: ProjectCategory): string {
    switch (category) {
        case 'Water': return 'project-water';
        case 'Education': return 'project-education';
        case 'Medical': return 'project-medical';
        case 'Community_Development': return 'project-community-development';
        case 'Disaster_Relief': return 'project-disaster-relief';
        default: return `project-${category.toLowerCase().replace(/_/g, '-')}`;
    }
}

export async function addProject(data: z.infer<typeof projectSchema>) {
    const validatedFields = projectSchema.safeParse(data);

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        throw new Error('Invalid project data.');
    }

    const imageId = assignImageId(validatedFields.data.category);
    
    await prisma.project.create({
        data: {
            ...validatedFields.data,
            imageId,
            peopleHelped: 0, // Default value
        }
    });

    revalidatePath('/admin/projects');
    revalidatePath('/');
}

export async function updateProject(data: z.infer<typeof projectSchema>) {
    const validatedFields = projectSchema.safeParse(data);

    if (!validatedFields.success || !validatedFields.data.id) {
        throw new Error('Invalid project data for update.');
    }
    
    const { id, ...updateData } = validatedFields.data;
    const imageId = assignImageId(validatedFields.data.category);
    
    await prisma.project.update({
        where: { id: id! },
        data: {
            ...updateData,
            imageId,
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
