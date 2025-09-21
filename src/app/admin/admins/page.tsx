

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
import { AdminDialog } from './_components/admin-dialog';
import { addAdmin } from './_actions/admins';
import { getUsers } from '@/lib/db';
import { AdminActions } from './_components/admin-actions';
import { PaginationControls } from '@/components/ui/pagination';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 7;

export default async function AdminAdminsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
    const page = Number(searchParams.page || '1');
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const allAdmins = (await getUsers()).filter(u => u.role === 'ADMIN');
    
    const admins = allAdmins
        .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
        .slice(skip, skip + ITEMS_PER_PAGE);
    
    const totalAdmins = allAdmins.length;
    const totalPages = Math.ceil(totalAdmins / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full gap-6 p-4 sm:p-6 w-full max-w-full overflow-x-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h1 className="text-2xl font-semibold"></h1>
            <AdminDialog onSave={addAdmin}>
                <Button><PlusCircle className="mr-2" />Add Admin</Button>
            </AdminDialog>
        </div>


       <Card className="w-full">
          <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Manage administrator accounts for the dashboard.</p>
          </CardContent>
       </Card>

      <div className="rounded-lg border flex-1 flex flex-col w-full overflow-x-auto">
        <div className="relative flex-grow w-full">
          <ScrollArea className="absolute inset-0 w-full">
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
                    <TableCell className='hidden md:table-cell'>{format(new Date(admin.joinDate), 'yyyy-MM-dd')}</TableCell>
                    <TableCell className="text-right">
                        <AdminActions admin={admin} />
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
