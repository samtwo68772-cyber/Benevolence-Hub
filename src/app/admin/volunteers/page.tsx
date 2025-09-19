
import * as React from 'react';
// import prisma from '@/lib/prisma';
import { db } from '@/lib/db';
import { VolunteerList } from './_components/volunteer-list';

export default async function AdminVolunteersPage() {
  const volunteers = await db.volunteer.findMany({
    orderBy: {
      signupDate: 'desc',
    },
  });

  return <VolunteerList initialVolunteers={volunteers} />;
}
