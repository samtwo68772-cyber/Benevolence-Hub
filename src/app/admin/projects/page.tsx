
'use client';

import * as React from 'react';
import { projects as initialProjects } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Project } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';


type ProjectFormData = Omit<Project, 'id' | 'imageId'> & { image?: File | null };

function ProjectForm({ project, onSave }: { project?: Project, onSave: (projectData: Project) => void }) {
    const [formData, setFormData] = React.useState<ProjectFormData>(
        project ? 
        {...project, details: project.details.join('\\n') } : 
        { title: '', description: '', startDate: format(new Date(), 'yyyy-MM-dd'), status: 'Planning', details: [], peopleHelped: 0, category: 'General Aid' }
    );
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(project ? new Date(project.startDate) : new Date());

    const handleSave = () => {
        const newProjectData: Project = {
            ...formData,
            id: project ? project.id : `proj-${Date.now()}`,
            imageId: project ? project.imageId : 'project-new',
            startDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            details: Array.isArray(formData.details) ? formData.details : (formData.details as string).split('\\n').filter(d => d.trim() !== ''),
            peopleHelped: Number(formData.peopleHelped) || 0
        };
        onSave(newProjectData);
    };
    

    return (
        <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                Title
                </Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Project Title" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                    Start Date
                </Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-[280px] justify-start text-left font-normal col-span-3",
                            !selectedDate && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                Status
                </Label>
                 <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as "Active" | "Completed" | "Planning"})}>
                    <SelectTrigger className="col-span-3 sm:col-span-2">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Planning">Planning</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                Category
                </Label>
                 <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as Project['category']})}>
                    <SelectTrigger className="col-span-3 sm:col-span-2">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Water">Water</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Shelter">Shelter</SelectItem>
                        <SelectItem value="General Aid">General Aid</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="peopleHelped" className="text-right">
                    People Helped
                </Label>
                <Input id="peopleHelped" type="number" value={formData.peopleHelped} onChange={e => setFormData({...formData, peopleHelped: Number(e.target.value)})} placeholder="0" className="col-span-3 sm:col-span-2" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                Image
                </Label>
                <Input id="image" type="file" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                Description
                </Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Project Description" className="col-span-3" rows={4} />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="details" className="text-right mt-2">
                Key Achievements
                </Label>
                <Textarea id="details" value={Array.isArray(formData.details) ? formData.details.join('\\n') : formData.details} onChange={e => setFormData({...formData, details: e.target.value})} placeholder="Enter each achievement on a new line." className="col-span-3" rows={4} />
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" onClick={handleSave}>Save Project</Button>
                </DialogClose>
            </DialogFooter>
        </div>
    )
}

function ProjectDialog({ children, project, onSave }: { children: React.ReactNode, project?: Project, onSave: (projectData: Project) => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                    <DialogDescription>
                        {project ? 'Update the details for this project.' : 'Fill in the details below to add a new project.'}
                    </DialogDescription>
                </DialogHeader>
                <ProjectForm project={project} onSave={onSave} />
            </DialogContent>
        </Dialog>
    );
}

function DeleteProjectDialog({ children, onConfirm }: { children: React.ReactNode, onConfirm: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


export default function AdminProjectsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = React.useState<Project[]>(initialProjects);

    const [statusFilter, setStatusFilter] = React.useState('all');
    const [categoryFilter, setCategoryFilter] = React.useState('all');

    const handleAddProject = (newProject: Project) => {
        setProjects(prev => [newProject, ...prev]);
        toast({ title: "Project Added", description: `"${newProject.title}" has been successfully added.` });
    };

    const handleEditProject = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        toast({ title: "Project Updated", description: `"${updatedProject.title}" has been successfully updated.` });
    };

    const handleDeleteProject = (projectId: string) => {
        const projectToDelete = projects.find(p => p.id === projectId);
        if (projectToDelete) {
             setProjects(prev => prev.filter(p => p.id !== projectId));
             toast({ title: "Project Deleted", description: `"${projectToDelete.title}" has been deleted.` });
        }
    };

    const filteredProjects = projects.filter(project => {
        const statusMatch = statusFilter === 'all' || project.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || project.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6">
      <div className="flex justify-end items-center">
        <ProjectDialog onSave={handleAddProject}>
             <Button><PlusCircle className="mr-2" />Add Project</Button>
        </ProjectDialog>
      </div>

       <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="status-filter">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Planning">Planning</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="category-filter">Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger id="category-filter">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Water">Water</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Medical">Medical</SelectItem>
                            <SelectItem value="Shelter">Shelter</SelectItem>
                            <SelectItem value="General Aid">General Aid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
       </Card>

      <div className="rounded-lg border flex-1 relative">
        <ScrollArea className="absolute inset-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className='hidden sm:table-cell'>Status</TableHead>
              <TableHead className='hidden md:table-cell'>Category</TableHead>
              <TableHead className='hidden lg:table-cell'>People Helped</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <Badge variant={project.status === 'Active' ? 'default' : project.status === 'Completed' ? 'secondary' : 'outline'}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                    <Badge variant="outline">{project.category}</Badge>
                </TableCell>
                <TableCell className='hidden lg:table-cell'>{project.peopleHelped.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <ProjectDialog project={project} onSave={handleEditProject}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Edit
                                </DropdownMenuItem>
                            </ProjectDialog>
                            <DropdownMenuSeparator />
                             <DeleteProjectDialog onConfirm={() => handleDeleteProject(project.id)}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    Delete
                                </DropdownMenuItem>
                            </DeleteProjectDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
