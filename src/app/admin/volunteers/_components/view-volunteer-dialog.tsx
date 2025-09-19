
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Volunteer } from '@prisma/client';

type ViewVolunteerDialogProps = {
  children: React.ReactNode;
  volunteer: Volunteer & { signupDate: string };
};

export function ViewVolunteerDialog({ children, volunteer }: ViewVolunteerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{volunteer.name}</DialogTitle>
          <DialogDescription>
            Volunteer Application Details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="col-span-2 text-sm">{volunteer.email}</p>
            </div>
            {volunteer.phone && (
                <div className="grid grid-cols-3 items-center gap-4">
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="col-span-2 text-sm">{volunteer.phone}</p>
                </div>
            )}
            <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Signup Date</p>
                <p className="col-span-2 text-sm">{volunteer.signupDate}</p>
            </div>
             <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                 <div className="col-span-2">
                    <Badge variant={
                        volunteer.status === 'Approved' ? 'default' :
                        volunteer.status === 'Rejected' ? 'destructive' : 'outline'
                    } className="capitalize">
                        {volunteer.status}
                    </Badge>
                 </div>
            </div>
             <div className="grid grid-cols-3 items-start gap-4">
                <p className="text-sm font-medium text-muted-foreground pt-1">Availability</p>
                <div className="col-span-2 flex flex-wrap gap-2">
                    {volunteer.availability.map(item => (
                        <Badge key={item} variant="secondary">{item}</Badge>
                    ))}
                </div>
            </div>
             <div className="grid grid-cols-3 items-start gap-4">
                <p className="text-sm font-medium text-muted-foreground pt-1">Interests</p>
                <div className="col-span-2 flex flex-wrap gap-2">
                    {volunteer.interests.map(item => (
                        <Badge key={item} variant="secondary">{item}</Badge>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
                <p className="text-sm font-medium text-muted-foreground">Skills & Message</p>
                <p className="col-span-2 text-sm bg-muted/50 p-3 rounded-md border">{volunteer.skills}</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
