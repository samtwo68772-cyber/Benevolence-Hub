
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { ProjectCategory, ProjectStatus } from '@/lib/types';

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
        case 'Community Development': return 'project-community-development';
        case 'Disaster Relief': return 'project-disaster-relief';
        default: return `project-${category.toLowerCase().replace(' ', '-')}`;
    }
}

export async function addProject(data: z.infer<typeof projectSchema>) {
    const validatedFields = projectSchema.safeParse(data);

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        throw new Error('Invalid project data.');
    }

    const { category, ...rest } = validatedFields.data;
    const imageId = assignImageId(category);
    
    await db.createProject({
        ...rest,
        category,
        imageId,
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
    const imageId = assignImageId(category);
    
    await db.updateProject(id, {
        ...updateData,
        category,
        imageId,
    });

    revalidatePath('/admin/projects');
    revalidatePath('/');
    revalidatePath(`/project/${id}`);
}

export async function deleteProject(projectId: string) {
    await db.deleteProject(projectId);
    revalidatePath('/admin/projects');
    revalidatePath('/');
}
