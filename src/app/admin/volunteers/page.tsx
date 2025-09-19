
'use client';

import * as React from 'react';
import { volunteers as initialVolunteers, projects } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, MoreHorizontal, XCircle, Clock, Phone, Mail, Calendar, Sparkles, UserCheck } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const interestItems = ["Education", "Medical", "Community Development", "Disaster Relief", "General Support"];

function ViewVolunteerDialog({ children, volunteer }: { children: React.ReactNode; volunteer: Volunteer }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{volunteer.name}</DialogTitle>
                    <DialogDescription>Volunteer Application Details</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex items-center gap-4">
                        <Badge variant={
                            volunteer.status === 'Approved' ? 'default' :
                            volunteer.status === 'Rejected' ? 'destructive' : 'outline'
                        } className="text-sm">
                            {volunteer.status}
                        </Badge>
                    </div>
                     <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                           <Mail className="w-5 h-5 text-muted-foreground"/>
                           <span>{volunteer.email}</span>
                        </div>
                        {volunteer.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-muted-foreground"/>
                                <span>{volunteer.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                           <Calendar className="w-5 h-5 text-muted-foreground"/>
                           <span>Signed up: {volunteer.signupDate}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-muted-foreground" /> Areas of Interest</h4>
                         <div className="flex flex-wrap gap-2">
                            {volunteer.interests.map(interest => <Badge key={interest} variant="secondary">{interest}</Badge>)}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><UserCheck className="w-5 h-5 text-muted-foreground" /> Availability</h4>
                         <div className="flex flex-wrap gap-2">
                            {volunteer.availability.map(avail => <Badge key={avail} variant="secondary" className="capitalize">{avail}</Badge>)}
                        </div>
                    </div>
                    
                     <div className="space-y-2">
                        <Label className="font-semibold">Skills & Message</Label>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md border">{volunteer.skills}</p>
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

    const [statusFilter, setStatusFilter] = React.useState('all');
    const [interestFilter, setInterestFilter] = React.useState('all');

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

    const filteredVolunteers = volunteers.filter(volunteer => {
        const statusMatch = statusFilter === 'all' || volunteer.status === statusFilter;
        const interestMatch = interestFilter === 'all' || volunteer.interests.includes(interestFilter);
        return statusMatch && interestMatch;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Volunteer Submissions</h1>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="status-filter">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="interest-filter">Interest</Label>
                    <Select value={interestFilter} onValueChange={setInterestFilter}>
                        <SelectTrigger id="interest-filter">
                            <SelectValue placeholder="Filter by interest" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Interests</SelectItem>
                             {interestItems.map(item => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                             ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
       </Card>

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
            {filteredVolunteers.map((volunteer) => (
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
