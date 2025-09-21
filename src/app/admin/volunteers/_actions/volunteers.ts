
'use server';

import { revalidatePath } from 'next/cache';
import { updateVolunteer as dbUpdateVolunteer, deleteVolunteer as dbDeleteVolunteer } from '@/lib/db';

export async function updateVolunteerStatus(volunteerId: string, status: 'Approved' | 'Rejected') {
  await dbUpdateVolunteer(volunteerId, { status });
  revalidatePath('/admin/volunteers');
}

export async function deleteVolunteer(volunteerId: string) {
  await dbDeleteVolunteer(volunteerId);
  revalidatePath('/admin/volunteers');
}
