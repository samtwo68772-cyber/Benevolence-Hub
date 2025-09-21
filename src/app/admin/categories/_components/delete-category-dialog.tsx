
'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type DeleteCategoryDialogProps = {
  children: React.ReactNode;
  onConfirm: () => Promise<void>;
};

export function DeleteCategoryDialog({ children, onConfirm }: DeleteCategoryDialogProps) {
    const { toast } = useToast();

    const handleConfirm = async () => {
        try {
            await onConfirm();
            toast({
                title: 'Category Deleted',
                description: 'The category has been successfully deleted.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'An error occurred',
                description: (error as Error).message,
            });
        }
    };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category. Projects using this category will be updated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
