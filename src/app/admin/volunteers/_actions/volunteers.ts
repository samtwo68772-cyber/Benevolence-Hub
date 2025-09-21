
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateVolunteerStatus(volunteerId: string, status: 'Approved' | 'Rejected') {
  await db.volunteer.update({
    where: { id: volunteerId },
    data: { status },
  });
  revalidatePath('/admin/volunteers');
}

export async function deleteVolunteer(volunteerId: string) {
  await db.volunteer.delete({
    where: { id: volunteerId },
  });
  revalidatePath('/admin/volunteers');
}
