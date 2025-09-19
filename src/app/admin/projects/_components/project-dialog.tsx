
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  const formRef = React.useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  
  const handleFormSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    if (project?.id) {
        (data as any).id = project.id;
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
           <DialogDescription>
            {project ? 'Update the details for this project.' : 'Fill in the form to create a new project.'}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm ref={formRef} project={project} onSubmit={handleFormSubmit} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
