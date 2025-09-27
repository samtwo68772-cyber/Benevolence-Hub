
import * as React from 'react';
import { getVolunteers, getCategories } from '@/lib/db';
import { VolunteerList } from './_components/volunteer-list';
import { VolunteerStatus } from '@/lib/types';
import { PaginationControls } from '@/components/ui/pagination';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 7;

export default async function AdminVolunteersPage({ searchParams }: { searchParams: { page?: string, status?: VolunteerStatus, interest?: string }}) {
  const params = await searchParams;
  const page = Number(params.page || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const statusFilter = params.status && params.status !== 'all' ? params.status : undefined;
  const interestFilter = params.interest && params.interest !== 'all' ? params.interest : undefined;
  
  const allVolunteers = await getVolunteers();
  const allCategories = await getCategories();

  const filteredVolunteers = allVolunteers.filter(volunteer => {
    const statusMatch = !statusFilter || volunteer.status === statusFilter;
    const volunteerInterests = Array.isArray(volunteer.interests) ? volunteer.interests : [];
    const interestMatch = !interestFilter || volunteerInterests.includes(interestFilter);
    return statusMatch && interestMatch;
  });

  const volunteers = filteredVolunteers
    .sort((a, b) => new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime())
    .slice(skip, skip + ITEMS_PER_PAGE);

  const totalVolunteers = filteredVolunteers.length;
  const totalPages = Math.ceil(totalVolunteers / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-auto">
        <VolunteerList initialVolunteers={volunteers} categories={allCategories} />
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
