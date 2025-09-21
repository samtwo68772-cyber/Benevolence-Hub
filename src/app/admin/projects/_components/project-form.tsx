

'use client';

import * as React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Project, Category } from '@/lib/types';
import Image from 'next/image';

type ProjectFormProps = {
  project?: Project;
  categories: Category[];
  onSubmit: () => void;
  onCancel: () => void;
};

export const ProjectForm = React.forwardRef<HTMLFormElement, ProjectFormProps>(({ project, categories, onSubmit, onCancel }, ref) => {
    const [imagePreview, setImagePreview] = React.useState<string | null>(project?.imageUrl || null);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit();
    }

  return (
      <form ref={ref} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="hidden" name="id" defaultValue={project?.id} />
        <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title || ''} required />
        </div>
        
        <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={project?.description || ''} required rows={3} />
        </div>
        
        <div className="md:col-span-2 space-y-2">
            <Label htmlFor="details">Key Achievements (one per line)</Label>
            <Textarea id="details" name="details" defaultValue={project?.details.join('\n') || ''} required rows={5} />
        </div>
        
        <div className="md:col-span-2 space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <div className="flex items-center gap-4">
                {imagePreview && (
                    <div className="w-40 h-auto flex items-center justify-center">
                        <Image src={imagePreview} alt="Project image preview" width={160} height={90} className="rounded-md object-cover" />
                    </div>
                )}
                <Input id="image" name="image" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
            </div>
            <p className="text-sm text-muted-foreground">Upload an image for the project. Max 2MB.</p>
        </div>
        
        <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" name="startDate" defaultValue={project ? format(new Date(project.startDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')} required />
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={project?.status || 'Planning'}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
         <div className="md:col-span-2 space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={project?.category || ''}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
            </Select>
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </div>
      </form>
  );
});

ProjectForm.displayName = 'ProjectForm';
