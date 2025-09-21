
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function updateVolunteerStatus(volunteerId: string, status: 'Approved' | 'Rejected') {
  await db.updateVolunteer(volunteerId, { status });
  revalidatePath('/admin/volunteers');
}

export async function deleteVolunteer(volunteerId: string) {
  await db.deleteVolunteer(volunteerId);
  revalidatePath('/admin/volunteers');
}
