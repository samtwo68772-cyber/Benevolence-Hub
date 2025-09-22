
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

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

export async function addVolunteer(data: VolunteerFormValues) {
    const validatedFields = volunteerSchema.safeParse(data);

    if (!validatedFields.success) {
        // This can be more granular if needed
        throw new Error('Invalid volunteer data.');
    }
    
    try {
        await createVolunteer({
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone || null,
            skills: validatedFields.data.skills,
            availability: validatedFields.data.availability,
            interests: validatedFields.data.interests,
        });

        revalidatePath('/admin/volunteers');
    } catch (error: any) {
        // Re-throw the specific error from the DB layer
        throw error;
    }
}

    
