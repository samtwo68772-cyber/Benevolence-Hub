
'use server';

import { revalidatePath } from 'next/cache';
import { createProject, updateProject as dbUpdateProject, deleteProject as dbDeleteProject } from '@/lib/db';

async function fileToDataURI(file: File) {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${file.type};base64,${base64}`;
}

export async function addProject(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const details = (formData.get('details') as string).split('\n').filter(line => line.trim() !== '');
    const startDate = new Date(formData.get('startDate') as string);
    const status = formData.get('status') as "Active" | "Completed" | "Planning";
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;
    
    let imageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
        if (imageFile.size > 2 * 1024 * 1024) { // 2MB limit
            throw new Error("Project image must be less than 2MB.");
        }
        imageUrl = await fileToDataURI(imageFile);
    }

    await createProject({
        title,
        description,
        details,
        startDate,
        status,
        category,
        imageUrl,
    });

    revalidatePath('/admin/projects');
    revalidatePath('/');
}

export async function updateProject(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) {
        throw new Error('Project ID is missing.');
    }
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const details = (formData.get('details') as string).split('\n').filter(line => line.trim() !== '');
    const startDate = new Date(formData.get('startDate') as string);
    const status = formData.get('status') as "Active" | "Completed" | "Planning";
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;
    
    const updateData: any = {
        title,
        description,
        details,
        startDate,
        status,
        category,
    };

    if (imageFile && imageFile.size > 0) {
         if (imageFile.size > 2 * 1024 * 1024) { // 2MB limit
            throw new Error("Project image must be less than 2MB.");
        }
        updateData.imageUrl = await fileToDataURI(imageFile);
    }
    
    await dbUpdateProject(id, updateData);

    revalidatePath('/admin/projects');
    revalidatePath('/');
    revalidatePath(`/project/${id}`);
}

export async function deleteProject(projectId: string) {
    await dbDeleteProject(projectId);
    revalidatePath('/admin/projects');
    revalidatePath('/');
}
