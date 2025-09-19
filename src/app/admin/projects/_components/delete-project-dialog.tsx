
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

type DeleteProjectDialogProps = {
  children: React.ReactNode;
  projectId: string;
};

import { deleteProject } from '../_actions/projects';

export function DeleteProjectDialog({ children, projectId }: DeleteProjectDialogProps) {
    const { toast } = useToast();

    const handleConfirm = async () => {
        try {
            await deleteProject(projectId);
            toast({
                title: 'Project Deleted',
                description: 'The project has been successfully deleted.',
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
            This action cannot be undone. This will permanently delete the project and all associated data from the server.
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
