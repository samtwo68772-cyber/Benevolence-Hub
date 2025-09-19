
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdminForm } from './admin-form';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';

type AdminDialogProps = {
  children: React.ReactNode;
  admin?: User;
  onSave: (data: any) => Promise<void>;
};

export function AdminDialog({ children, admin, onSave }: AdminDialogProps) {
  const [open, setOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    if (formRef.current) {
      // Programmatically submit the form
      formRef.current.requestSubmit();
    }
  };
  
  const handleFormSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    if (admin?.id) {
        (data as any).id = admin.id;
    }
    
    try {
        await onSave(data);
        toast({
            title: `Admin ${admin ? 'Updated' : 'Added'}`,
            description: `The admin account for "${data.name}" has been successfully ${admin ? 'updated' : 'added'}.`
        });
        setOpen(false);
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: (error as Error).message,
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{admin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
           <DialogDescription>
            {admin ? 'Update the details for the administrator account.' : 'Fill in the form to create a new administrator account.'}
          </DialogDescription>
        </DialogHeader>
        <AdminForm ref={formRef} admin={admin} onSubmit={handleFormSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
