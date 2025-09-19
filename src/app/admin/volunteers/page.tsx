

'use client';

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
import { CheckCircle, MoreHorizontal, XCircle, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteVolunteerDialog } from './_components/delete-volunteer-dialog';
import { ViewVolunteerDialog } from './_components/view-volunteer-dialog';
import type { Volunteer } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VolunteerFilter, interestItems } from './_components/volunteer-filter';
import { deleteVolunteer, updateVolunteerStatus } from './_actions/volunteers';
import { format } from 'date-fns';

export default function AdminVolunteersPage({ volunteers: initialVolunteers }: { volunteers: Volunteer[] }) {
    const { toast } = useToast();
    const [volunteers, setVolunteers] = React.useState<Volunteer[]>(initialVolunteers);
    const [optimisticStatus, setOptimisticStatus] = React.useState<{[key: string]: 'Approved' | 'Rejected' | 'Pending'}>({});

    const [statusFilter, setStatusFilter] = React.useState('all');
    const [interestFilter, setInterestFilter] = React.useState('all');

    const handleDelete = async (volunteerId: string) => {
        const volunteerToDelete = volunteers.find(v => v.id === volunteerId);
        if(volunteerToDelete) {
            setVolunteers(prev => prev.filter(v => v.id !== volunteerId));
            await deleteVolunteer(volunteerId);
            toast({ title: "Submission Deleted", description: `The submission from "${volunteerToDelete.name}" has been deleted.` });
        }
    };

    const handleStatusChange = async (volunteerId: string, status: 'Approved' | 'Rejected') => {
        const volunteerToUpdate = volunteers.find(v => v.id === volunteerId);
        if (volunteerToUpdate) {
            setOptimisticStatus(prev => ({...prev, [volunteerId]: status}));
            setVolunteers(prev => prev.map(v => v.id === volunteerId ? {...v, status} : v));
            await updateVolunteerStatus(volunteerId, status);
            toast({ title: `Application ${status}`, description: `The submission from "${volunteerToUpdate.name}" has been ${status.toLowerCase()}.` });
        }
    };

    const filteredVolunteers = volunteers.filter(volunteer => {
        const statusMatch = statusFilter === 'all' || volunteer.status === statusFilter;
        const interestMatch = interestFilter === 'all' || volunteer.interests.includes(interestFilter);
        return statusMatch && interestMatch;
    });

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6">
       <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
                <VolunteerFilter 
                    interestItems={interestItems}
                    statusFilter={statusFilter}
                    interestFilter={interestFilter}
                    onStatusChange={setStatusFilter}
                    onInterestChange={setInterestFilter}
                />
            </CardContent>
       </Card>

       <div className="rounded-lg border flex-1 relative">
         <ScrollArea className="absolute inset-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className='hidden sm:table-cell'>Email</TableHead>
                    <TableHead className='hidden md:table-cell'>Signup Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id} className={optimisticStatus[volunteer.id] ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">{volunteer.name}</TableCell>
                    <TableCell className='hidden sm:table-cell'>{volunteer.email}</TableCell>
                    <TableCell className='hidden md:table-cell'>{format(volunteer.signupDate, 'yyyy-MM-dd')}</TableCell>
                    <TableCell>
                        <Badge variant={
                            volunteer.status === 'Approved' ? 'default' :
                            volunteer.status === 'Rejected' ? 'destructive' : 'outline'
                        } className="capitalize">
                            {volunteer.status === 'Approved' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {volunteer.status === 'Rejected' && <XCircle className="mr-1 h-3 w-3" />}
                            {volunteer.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                            {volunteer.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <ViewVolunteerDialog volunteer={{...volunteer, signupDate: format(volunteer.signupDate, 'yyyy-MM-dd')}}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        View Details
                                    </DropdownMenuItem>
                                </ViewVolunteerDialog>
                                <DropdownMenuSeparator />
                                {volunteer.status === 'Pending' && (
                                    <>
                                        <DropdownMenuItem onClick={() => handleStatusChange(volunteer.id, 'Approved')}>
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(volunteer.id, 'Rejected')} className="text-destructive">
                                            Reject
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DeleteVolunteerDialog onConfirm={() => handleDelete(volunteer.id)}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                        Delete
                                    </DropdownMenuItem>
                                </DeleteVolunteerDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </ScrollArea>
        </div>
    </div>
  );
}
