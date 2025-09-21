
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ProjectForm } from './project-form';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/lib/types';

type ProjectDialogProps = {
  children: React.ReactNode;
  project?: Project;
  onSave: (data: any) => Promise<void>;
};

export function ProjectDialog({ children, project, onSave }: ProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: any) => {
    const data = {
        ...values,
        startDate: values.startDate.toISOString(),
    }
    if (project?.id) {
        data.id = project.id;
    }
    
    try {
        await onSave(data);
        toast({
            title: `Project ${project ? 'Updated' : 'Added'}`,
            description: `The project "${data.title}" has been successfully ${project ? 'updated' : 'added'}.`
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
           <DialogDescription>
            {project ? 'Update the details for this project.' : 'Fill in the form to create a new project.'}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} onSubmit={handleFormSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
