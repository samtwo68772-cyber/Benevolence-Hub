
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
import { AdminDialog } from './admin-dialog';
import { DeleteAdminDialog } from './delete-admin-dialog';
import { updateAdmin, deleteAdmin } from '../_actions/admins';
import { User } from '@/lib/types';

export function AdminActions({ admin }: { admin: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <AdminDialog admin={admin} onSave={updateAdmin}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>
        </AdminDialog>
        <DropdownMenuSeparator />
        <DeleteAdminDialog onConfirm={() => deleteAdmin(admin.id)}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DeleteAdminDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
