
import * as React from 'react';
import { db } from '@/lib/db';
import { VolunteerList } from './_components/volunteer-list';
import { VolunteerStatus } from '@/lib/types';

export default async function AdminVolunteersPage({ searchParams }: { searchParams: { status?: VolunteerStatus, interest?: string } }) {
  const statusFilter = searchParams.status;
  const interestFilter = searchParams.interest;

  let volunteers = await db.volunteer.findMany({
    orderBy: {
      signupDate: 'desc',
    },
  });

  if (statusFilter && statusFilter !== 'all') {
    volunteers = volunteers.filter(v => v.status === statusFilter);
  }

  if (interestFilter && interestFilter !== 'all') {
    volunteers = volunteers.filter(v => v.interests.includes(interestFilter));
  }

  return <VolunteerList initialVolunteers={volunteers} />;
}
