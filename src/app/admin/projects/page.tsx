
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ProjectDialog } from './_components/project-dialog';
import { addProject, deleteProject, updateProject } from './_actions/projects';
import { DeleteProjectDialog } from './_components/delete-project-dialog';
import { ProjectFilter } from './_components/project-filter';
import prisma from '@/lib/prisma';
import type { ProjectStatus, ProjectCategory } from '@prisma/client';

export default async function AdminProjectsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    // Await searchParams to fix the "sync-dynamic-apis" error
    const params = await Promise.resolve(searchParams);
    const statusFilter = params.status as ProjectStatus | 'all' | undefined;
    const categoryFilter = params.category as ProjectCategory | 'all' | undefined;

    const projects = await prisma.project.findMany({
      where: {
        status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
      },
      orderBy: {
        startDate: 'desc'
      }
    });

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6">
      <div className="flex justify-end items-center">
        <ProjectDialog actionType="add">
             <Button><PlusCircle className="mr-2" />Add Project</Button>
        </ProjectDialog>
      </div>

       <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
               <ProjectFilter />
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
              <TableHead className='hidden lg:table-cell'>Start Date</TableHead>
              <TableHead className='hidden xl:table-cell'>People Helped</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
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
                 <TableCell className='hidden lg:table-cell'>{format(project.startDate, 'yyyy-MM-dd')}</TableCell>
                <TableCell className='hidden xl:table-cell'>{project.peopleHelped.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <ProjectDialog project={{...project, startDate: format(project.startDate, 'yyyy-MM-dd')}} actionType="update">
                                <DropdownMenuItem>
                                    Edit
                                </DropdownMenuItem>
                            </ProjectDialog>
                            <DropdownMenuSeparator />
                             <DeleteProjectDialog projectId={project.id}>
                                <DropdownMenuItem className="text-destructive">
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
