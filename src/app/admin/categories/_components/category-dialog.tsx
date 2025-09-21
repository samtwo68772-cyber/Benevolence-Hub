
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { CategoryForm } from './category-form';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/lib/types';

type CategoryDialogProps = {
  children: React.ReactNode;
  category?: Category;
  onSave: (data: any) => Promise<void>;
};

export function CategoryDialog({ children, category, onSave }: CategoryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: any) => {
    if (category?.id) {
        data.id = category.id;
    }
    
    try {
        await onSave(data);
        toast({
            title: `Category ${category ? 'Updated' : 'Added'}`,
            description: `The category "${data.name}" has been successfully ${category ? 'updated' : 'added'}.`
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
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
           <DialogDescription>
            {category ? 'Update the category name.' : 'Create a new category for projects.'}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onSubmit={handleFormSubmit} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
