
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectForm } from './project-form';
import type { Project } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { addProject, updateProject } from '../_actions/projects';

type ProjectDialogProps = {
  children: React.ReactNode;
  project?: Project & { startDate: string };
  actionType: 'add' | 'update';
};

export function ProjectDialog({ children, project, actionType }: ProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
  
  const handleFormSubmit = async (formData: FormData) => {
    // Add project ID for updates
    if (project?.id) {
        formData.append('id', project.id);
    }
    
    try {
        const action = actionType === 'add' ? addProject : updateProject;
        await action(formData);
        
        toast({
            title: `Project ${actionType === 'add' ? 'Added' : 'Updated'}`,
            description: `The project "${formData.get('title')}" has been successfully ${actionType === 'add' ? 'added' : 'updated'}.`
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
      <DialogContent className="max-w-2xl data-[state=open]:h-auto data-[state=open]:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
           <DialogDescription>
            {project ? 'Update the details for this project.' : 'Fill in the form to create a new project.'}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-4">
            <ProjectForm ref={formRef} project={project} onSubmit={handleFormSubmit} />
        </div>
        <DialogFooter className="mt-auto pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
