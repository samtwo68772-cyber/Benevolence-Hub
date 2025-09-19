
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateVolunteerStatus(volunteerId: string, status: 'Approved' | 'Rejected') {
  await prisma.volunteer.update({
    where: { id: volunteerId },
    data: { status },
  });
  revalidatePath('/admin/volunteers');
}

export async function deleteVolunteer(volunteerId: string) {
  await prisma.volunteer.delete({
    where: { id: volunteerId },
  });
  revalidatePath('/admin/volunteers');
}
