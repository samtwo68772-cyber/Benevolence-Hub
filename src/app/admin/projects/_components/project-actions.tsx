
'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ProjectDialog } from './project-dialog';
import { DeleteProjectDialog } from './delete-project-dialog';
import { updateProject, deleteProject } from '../_actions/projects';
import { Project } from '@/lib/types';

export function ProjectActions({ project }: { project: Project }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <ProjectDialog project={project} onSave={updateProject}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>
        </ProjectDialog>
        <DropdownMenuSeparator />
        <DeleteProjectDialog onConfirm={() => deleteProject(project.id)}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DeleteProjectDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
