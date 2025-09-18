
'use client';

import * as React from 'react';
import { volunteers as initialVolunteers } from '@/lib/data';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Volunteer } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

function ViewVolunteerDialog({ children, volunteer }: { children: React.ReactNode; volunteer: Volunteer }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{volunteer.name}</DialogTitle>
                    <DialogDescription>Volunteer Application Details</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Email</Label>
                        <span className="col-span-3">{volunteer.email}</span>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Signup Date</Label>
                        <span className="col-span-3">{volunteer.signupDate}</span>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right font-semibold">Status</Label>
                        <span className="col-span-3">
                             <Badge variant={
                                volunteer.status === 'Approved' ? 'default' :
                                volunteer.status === 'Rejected' ? 'destructive' : 'outline'
                            }>
                                {volunteer.status}
                            </Badge>
                        </span>
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right font-semibold mt-1">Skills/Message</Label>
                        <p className="col-span-3 text-sm text-muted-foreground bg-muted p-3 rounded-md">{volunteer.skills}</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function DeleteVolunteerDialog({ children, onConfirm }: { children: React.ReactNode, onConfirm: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this volunteer submission.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function AdminVolunteersPage() {
    const { toast } = useToast();
    const [volunteers, setVolunteers] = React.useState<Volunteer[]>(initialVolunteers);

    const handleDeleteVolunteer = (volunteerId: string) => {
        const volunteerToDelete = volunteers.find(v => v.id === volunteerId);
        if(volunteerToDelete) {
            setVolunteers(prev => prev.filter(v => v.id !== volunteerId));
            toast({ title: "Submission Deleted", description: `The submission from "${volunteerToDelete.name}" has been deleted.` });
        }
    };

    const handleStatusChange = (volunteerId: string, status: 'Approved' | 'Rejected') => {
        const volunteerToUpdate = volunteers.find(v => v.id === volunteerId);
        if(volunteerToUpdate) {
            setVolunteers(prev => prev.map(v => v.id === volunteerId ? {...v, status} : v));
            toast({ title: `Application ${status}`, description: `The submission from "${volunteerToUpdate.name}" has been ${status.toLowerCase()}.` });
        }
    };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Volunteer Submissions</h1>
      </div>
       <div className="rounded-lg border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {volunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                <TableCell className="font-medium">{volunteer.name}</TableCell>
                <TableCell>{volunteer.email}</TableCell>
                <TableCell>{volunteer.signupDate}</TableCell>
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
                             <ViewVolunteerDialog volunteer={volunteer}>
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
                            <DeleteVolunteerDialog onConfirm={() => handleDeleteVolunteer(volunteer.id)}>
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
        </div>
    </div>
  );
}
