
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ProjectForm } from './project-form';
import { useToast } from '@/hooks/use-toast';
import { Project, Category } from '@/lib/types';

type ProjectDialogProps = {
  children: React.ReactNode;
  project?: Project;
  onSave: (data: FormData) => Promise<void>;
  categories: Category[];
};

export function ProjectDialog({ children, project, onSave, categories }: ProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleFormSubmit = async () => {
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    const title = formData.get('title') as string;

    try {
        await onSave(formData);
        toast({
            title: `Project ${project ? 'Updated' : 'Added'}`,
            description: `The project "${title}" has been successfully ${project ? 'updated' : 'added'}.`
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
        <ProjectForm 
            ref={formRef}
            project={project}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
