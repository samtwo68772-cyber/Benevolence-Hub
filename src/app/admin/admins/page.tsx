
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
import { AdminForm } from './_components/admin-form';
import { AdminDialog } from './_components/admin-dialog';
import { DeleteAdminDialog } from './_components/delete-admin-dialog';
import { addAdmin, deleteAdmin, updateAdmin } from './_actions/admins';
import prisma from '@/lib/prisma';

export default async function AdminAdminsPage() {
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        orderBy: { joinDate: 'desc' }
    });

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6">
      <div className="flex justify-end items-center">
        <AdminDialog onSave={addAdmin}>
             <Button><PlusCircle className="mr-2" />Add Admin</Button>
        </AdminDialog>
      </div>

       <Card>
          <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Manage administrator accounts for the dashboard.</p>
          </CardContent>
       </Card>

      <div className="rounded-lg border flex-1 relative">
        <ScrollArea className="absolute inset-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className='hidden sm:table-cell'>Email</TableHead>
              <TableHead className='hidden md:table-cell'>Role</TableHead>
              <TableHead className='hidden md:table-cell'>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell className='hidden sm:table-cell'>{admin.email}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  <Badge variant='secondary'>
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell className='hidden md:table-cell'>{format(admin.joinDate, 'yyyy-MM-dd')}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <AdminDialog 
                                admin={{...admin, joinDate: format(admin.joinDate, 'yyyy-MM-dd')}} 
                                onSave={updateAdmin}
                              >
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Edit
                                </DropdownMenuItem>
                            </AdminDialog>
                            <DropdownMenuSeparator />
                             <DeleteAdminDialog onConfirm={() => deleteAdmin(admin.id)}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    Delete
                                </DropdownMenuItem>
                            </DeleteAdminDialog>
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
