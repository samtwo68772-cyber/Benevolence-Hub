
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

export function AdminActions({ admin, currentUserId }: { admin: User, currentUserId?: string }) {
  const isSelf = admin.id === currentUserId;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isSelf}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <AdminDialog admin={admin} onSave={updateAdmin}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isSelf}>
            Edit
          </DropdownMenuItem>
        </AdminDialog>
        <DropdownMenuSeparator />
        <DeleteAdminDialog onConfirm={() => deleteAdmin(admin.id)}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-destructive"
            disabled={isSelf}
          >
            Delete
          </DropdownMenuItem>
        </DeleteAdminDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
