
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
  status: z.enum(['Active', 'Completed', 'Planning']),
  category: z.enum(['Water', 'Education', 'Medical', 'Community Development', 'Disaster Relief']),
});

function assignImageId(category: ProjectCategory): string {
    switch (category) {
        case 'Water': return 'project-water';
        case 'Education': return 'project-education';
        case 'Medical': return 'project-medical';
        case 'Community_Development': return 'project-community-development';
        case 'Disaster_Relief': return 'project-disaster-relief';
        default: return `project-${category.toLowerCase().replace('_', '-')}`;
    }
}

export async function addProject(data: z.infer<typeof projectSchema>) {
    const validatedFields = projectSchema.safeParse(data);

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        throw new Error('Invalid project data.');
    }

    const { category, ...rest } = validatedFields.data;
    const prismaCategory = category.replace(/ /g, '_') as ProjectCategory;

    const imageId = assignImageId(prismaCategory);
    
    await prisma.project.create({
        data: {
            ...rest,
            category: prismaCategory,
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
    
    const { id, category, ...updateData } = validatedFields.data;
    const prismaCategory = category.replace(/ /g, '_') as ProjectCategory;
    const imageId = assignImageId(prismaCategory);
    
    await prisma.project.update({
        where: { id: id! },
        data: {
            ...updateData,
            category: prismaCategory,
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
