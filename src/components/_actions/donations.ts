
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createDonation } from '@/lib/db';
import { DonationType } from '@/lib/types';

const donationSchema = z.object({
    donorName: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    amount: z.number().min(1, "Amount must be greater than 0."),
    type: z.enum(['ONE_TIME', 'MONTHLY']),
    projectId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
});

export async function addDonation(data: z.infer<typeof donationSchema>) {
    const validatedFields = donationSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error('Invalid donation data.');
    }
    
    await createDonation(validatedFields.data);

    revalidatePath('/admin/donations');
}
