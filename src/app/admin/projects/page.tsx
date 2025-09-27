

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
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ProjectDialog } from './_components/project-dialog';
import { addProject } from './_actions/projects';
import { ProjectFilter } from './_components/project-filter';
import { getProjects, getCategories } from '@/lib/db';
import { ProjectCategory, ProjectStatus, Category } from '@/lib/types';
import { ProjectActions } from './_components/project-actions';
import { PaginationControls } from '@/components/ui/pagination';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 7;

export default async function AdminProjectsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    // Ensure searchParams is properly typed and awaited
    const params = await searchParams;
    const page = Number(params?.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    const statusFilter = params?.status as ProjectStatus | undefined;
    const categoryFilter = params?.category as string | undefined;

    const allProjects = await getProjects();
    const allCategories = await getCategories();

    const filteredProjects = allProjects.filter(project => {
        const statusMatch = !statusFilter || statusFilter === 'all' || project.status === statusFilter;
        const categoryMatch = !categoryFilter || categoryFilter === 'all' || project.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    const projects = filteredProjects
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(skip, skip + ITEMS_PER_PAGE);

    const totalProjects = filteredProjects.length;
    const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6 w-full max-w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h1 className="text-2xl font-semibold"></h1>
            <ProjectDialog onSave={addProject} categories={allCategories}>
                <Button><PlusCircle className="mr-2" />Add Project</Button>
            </ProjectDialog>
        </div>

       <Card className="w-full">
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
               <ProjectFilter categories={allCategories} />
            </CardContent>
       </Card>

      <div className="rounded-lg border flex-1 flex flex-col w-full overflow-x-auto">
        <div className="relative flex-grow w-full">
          <ScrollArea className="absolute inset-0 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className='hidden sm:table-cell'>Status</TableHead>
                <TableHead className='hidden md:table-cell'>Category</TableHead>
                <TableHead className='hidden lg:table-cell'>Start Date</TableHead>
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
                   <TableCell className='hidden lg:table-cell'>{format(new Date(project.startDate), 'yyyy-MM-dd')}</TableCell>
                  <TableCell className="text-right">
                      <ProjectActions project={project} categories={allCategories} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </ScrollArea>
        </div>
        {totalPages > 1 && (
            <div className="p-4 border-t">
                <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                />
            </div>
        )}
      </div>
    </div>
  );
}
