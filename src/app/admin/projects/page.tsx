
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
import { db } from '@/lib/db';
import { ProjectCategory, ProjectStatus } from '@/lib/types';
import { ProjectActions } from './_components/project-actions';
import { PaginationControls } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 7;

export default async function AdminProjectsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    const page = Number(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;
    
    const statusFilter = searchParams.status as ProjectStatus | undefined;
    const categoryFilter = searchParams.category as ProjectCategory | undefined;

    const allProjects = await db.getProjects();

    const filteredProjects = allProjects.filter(project => {
        const statusMatch = !statusFilter || statusFilter === 'all' || project.status === statusFilter;
        const categoryMatch = !categoryFilter || categoryFilter === 'all' || project.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    const projects = filteredProjects
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(skip, skip + ITEMS_PER_PAGE);

    const totalProjects = filteredProjects.length;
    const totalPages = Math.ceil(totalProjects / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6 w-full max-w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h1 className="text-2xl font-semibold"></h1>
            <ProjectDialog onSave={addProject}>
                <Button><PlusCircle className="mr-2" />Add Project</Button>
            </ProjectDialog>
        </div>

       <Card className="w-full">
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
               <ProjectFilter />
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
                      <Badge variant="outline">{project.category.replace('_', ' ')}</Badge>
                  </TableCell>
                   <TableCell className='hidden lg:table-cell'>{format(project.startDate, 'yyyy-MM-dd')}</TableCell>
                  <TableCell className="text-right">
                      <ProjectActions project={project} />
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
