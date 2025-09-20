
import * as React from 'react';
import prisma from '@/lib/prisma';
import { VolunteerList } from './_components/volunteer-list';
import { VolunteerStatus } from '@prisma/client';
import { PaginationControls } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 7;

export default async function AdminVolunteersPage({ searchParams }: { searchParams: { page?: string, status?: VolunteerStatus, interest?: string } }) {
  const page = Number(searchParams.page || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const statusFilter = searchParams.status && searchParams.status !== 'all' ? searchParams.status : undefined;
  const interestFilter = searchParams.interest && searchParams.interest !== 'all' ? searchParams.interest : undefined;

  const whereClause: any = {};
  if (statusFilter) {
    whereClause.status = statusFilter;
  }
  if (interestFilter) {
    whereClause.interests = { has: interestFilter };
  }

  const volunteers = await prisma.volunteer.findMany({
    orderBy: {
      signupDate: 'desc',
    },
    where: whereClause,
    skip: skip,
    take: ITEMS_PER_PAGE,
  });

  const totalVolunteers = await prisma.volunteer.count({ where: whereClause });
  const totalPages = Math.ceil(totalVolunteers / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-auto">
        <VolunteerList initialVolunteers={volunteers} />
         {totalPages > 1 && (
            <div className="p-4 border-t bg-card w-full">
                <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                />
            </div>
         )}
    </div>
  )
}
