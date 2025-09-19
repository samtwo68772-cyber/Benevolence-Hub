
import * as React from 'react';
import { db } from '@/lib/db';
import { VolunteerList } from './_components/volunteer-list';
import { VolunteerStatus } from '@/lib/types';
import { PaginationControls } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 5;

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

  const volunteers = await db.volunteer.findMany({
    orderBy: {
      signupDate: 'desc',
    },
    where: whereClause,
    skip: skip,
    take: ITEMS_PER_PAGE,
  });

  const totalVolunteers = await db.volunteer.count({ where: whereClause });
  const totalPages = Math.ceil(totalVolunteers / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full">
        <VolunteerList initialVolunteers={volunteers} />
         {totalPages > 1 && (
            <div className="p-4 border-t bg-card">
                <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                />
            </div>
         )}
    </div>
  )
}

    
