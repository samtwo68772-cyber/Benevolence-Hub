
'use client';

import * as React from 'react';
import { admins as initialAdmins } from '@/lib/data';
import type { Admin } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type AdminFormData = Omit<Admin, 'id' | 'joinDate'>;

function AdminForm({ admin, onSave }: { admin?: Admin, onSave: (adminData: Admin) => void }) {
    const [formData, setFormData] = React.useState<AdminFormData>(
        admin ? { ...admin } : { name: '', email: '', role: 'Admin' }
    );

    const handleSave = () => {
        const newAdminData: Admin = {
            ...formData,
            id: admin ? admin.id : `adm-${Date.now()}`,
            joinDate: admin ? admin.joinDate : format(new Date(), 'yyyy-MM-dd'),
        };
        onSave(newAdminData);
    };

    return (
        <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Admin Name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="admin@example.com" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                 <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as Admin['role']})}>
                    <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" onClick={handleSave}>Save Admin</Button>
                </DialogClose>
            </DialogFooter>
        </div>
    )
}

function AdminDialog({ children, admin, onSave }: { children: React.ReactNode, admin?: Admin, onSave: (adminData: Admin) => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{admin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
                    <DialogDescription>
                        {admin ? 'Update the details for this administrator.' : 'Fill in the details below to add a new admin.'}
                    </DialogDescription>
                </DialogHeader>
                <AdminForm admin={admin} onSave={onSave} />
            </DialogContent>
        </Dialog>
    );
}

function DeleteAdminDialog({ children, onConfirm }: { children: React.ReactNode, onConfirm: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the administrator account. This action cannot be undone.
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


export default function AdminAdminsPage() {
    const { toast } = useToast();
    const [admins, setAdmins] = React.useState<Admin[]>(initialAdmins);
    const [roleFilter, setRoleFilter] = React.useState('all');

    const handleAddAdmin = (newAdmin: Admin) => {
        setAdmins(prev => [newAdmin, ...prev]);
        toast({ title: "Admin Added", description: `"${newAdmin.name}" has been successfully added.` });
    };

    const handleEditAdmin = (updatedAdmin: Admin) => {
        setAdmins(prev => prev.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
        toast({ title: "Admin Updated", description: `"${updatedAdmin.name}" has been successfully updated.` });
    };

    const handleDeleteAdmin = (adminId: string) => {
        const adminToDelete = admins.find(a => a.id === adminId);
        if (adminToDelete) {
             setAdmins(prev => prev.filter(a => a.id !== adminId));
             toast({ title: "Admin Deleted", description: `"${adminToDelete.name}" has been deleted.` });
        }
    };

    const filteredAdmins = admins.filter(admin => {
        return roleFilter === 'all' || admin.role === roleFilter;
    });

  return (
    <div className="flex flex-col h-full gap-6 px-6 py-6">
      <div className="flex justify-end items-center">
        <AdminDialog onSave={handleAddAdmin}>
             <Button><PlusCircle className="mr-2" />Add Admin</Button>
        </AdminDialog>
      </div>

       <Card>
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="role-filter">Role</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger id="role-filter">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Super Admin">Super Admin</SelectItem>
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge variant={admin.role === 'Super Admin' ? 'default' : 'secondary'}>
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell>{admin.joinDate}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <AdminDialog admin={admin} onSave={handleEditAdmin}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    Edit
                                </DropdownMenuItem>
                            </AdminDialog>
                            <DropdownMenuSeparator />
                             <DeleteAdminDialog onConfirm={() => handleDeleteAdmin(admin.id)}>
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
