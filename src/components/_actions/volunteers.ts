
'use server';

import { z } from 'zod';
// import prisma from '@/lib/prisma';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const volunteerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    skills: z.string().min(10, "Please provide more details."),
    availability: z.array(z.string()).nonempty(),
    interests: z.array(z.string()).nonempty(),
});

export async function addVolunteer(data: z.infer<typeof volunteerSchema>) {
    const validatedFields = volunteerSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('Invalid volunteer data.');
    }
    
    await db.volunteer.create({
        data: {
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            skills: validatedFields.data.skills,
            availability: validatedFields.data.availability,
            interests: validatedFields.data.interests,
        }
    });

    revalidatePath('/admin/volunteers');
}
