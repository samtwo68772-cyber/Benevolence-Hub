
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { DonationFilter } from './_components/donation-filter';
import { PaginationControls } from '@/components/ui/pagination';
import { DonationType } from '@prisma/client';

const ITEMS_PER_PAGE = 7;

export default async function AdminDonationsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    const page = Number(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    const typeFilter = searchParams.type as string | undefined;
    const projectFilter = searchParams.project as string | undefined;

    const whereClause: any = {
        type: typeFilter && typeFilter !== 'all' ? (typeFilter === 'One-time' ? 'ONE_TIME' : 'MONTHLY') as DonationType : undefined,
        project: {
            title: projectFilter && projectFilter !== 'all' ? projectFilter : undefined
        },
    };

    const projects = await prisma.project.findMany({ select: { title: true } });
    const projectNames = ['General Fund', ...projects.map(p => p.title)];

    const donations = await prisma.donation.findMany({
        where: whereClause,
        include: {
            project: true
        },
        orderBy: {
            date: 'desc'
        },
        skip: skip,
        take: ITEMS_PER_PAGE,
    });

    const totalDonations = await prisma.donation.count({ where: whereClause });
    const totalPages = Math.ceil(totalDonations / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6">
        <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
                <DonationFilter projectNames={projectNames} />
            </CardContent>
        </Card>

         <div className="rounded-lg border flex-1 flex flex-col">
            <div className="relative flex-grow">
                <ScrollArea className="absolute inset-0">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Donor Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className='hidden sm:table-cell'>Type</TableHead>
                            <TableHead className='hidden md:table-cell'>Project</TableHead>
                            <TableHead className='hidden lg:table-cell'>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {donations.map((donation) => (
                            <TableRow key={donation.id}>
                            <TableCell className="font-medium">{donation.donorName}</TableCell>
                            <TableCell>${donation.amount.toFixed(2)}</TableCell>
                            <TableCell className='hidden sm:table-cell'>
                                <Badge variant={donation.type === 'MONTHLY' ? 'outline' : 'default'}>
                                    {donation.type === 'ONE_TIME' ? 'One-time' : 'Monthly'}
                                </Badge>
                            </TableCell>
                            <TableCell className='hidden md:table-cell'>{donation.project?.title || 'General Fund'}</TableCell>
                            <TableCell className='hidden lg:table-cell'>{format(donation.date, 'yyyy-MM-dd')}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
             {totalPages > 1 && (
                <div className="p-4 border-t">
                    <PaginationControls
                        currentPage={page}
                        totalPages={totalPages}
                    />
                </div>
             )}
        </div>
    </div>
  );
}
