
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createVolunteer } from '@/lib/db';

const volunteerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    skills: z.string().min(10, "Please provide more details."),
    availability: z.array(z.string()).nonempty({ message: "You have to select at least one availability option." }),
    interests: z.array(z.string()).nonempty({ message: "Please select at least one area of interest." }),
});

export async function addVolunteer(data: z.infer<typeof volunteerSchema>) {
    const validatedFields = volunteerSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('Invalid volunteer data.');
    }
    
    try {
        await createVolunteer({
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            skills: validatedFields.data.skills,
            availability: validatedFields.data.availability,
            interests: validatedFields.data.interests,
        });
    } catch (error: any) {
        if (error.message.includes('A volunteer with this email already exists.') ||
            error.message.includes('A volunteer with this phone number already exists.')) {
            throw error; // Re-throw the specific error from createVolunteer
        }
        throw new Error('An unexpected error occurred. Please try again.');
    }


    revalidatePath('/admin/volunteers');
}



