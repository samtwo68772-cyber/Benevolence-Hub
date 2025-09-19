
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type AdminFormData = Omit<Admin, 'id' | 'joinDate'> & { password?: string; confirmPassword?: string };

function AdminForm({ admin, onSave }: { admin?: Admin, onSave: (adminData: Admin) => void }) {
    const [formData, setFormData] = React.useState<AdminFormData>(
        admin ? { ...admin, role: 'Admin' } : { name: '', email: '', role: 'Admin', password: '', confirmPassword: '' }
    );
    const [error, setError] = React.useState('');

    const handleSave = () => {
        if (!admin && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!admin && (!formData.password || formData.password.length < 8)) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        setError('');
        
        const newAdminData: Admin = {
            ...formData,
            id: admin ? admin.id : `adm-${Date.now()}`,
            joinDate: admin ? admin.joinDate : format(new Date(), 'yyyy-MM-dd'),
            role: 'Admin', // Always 'Admin'
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
                <Input id="role" value="Admin" disabled className="col-span-3 bg-muted" />
            </div>
            {!admin && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Password</Label>
                        <Input id="password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirmPassword" className="text-right">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="••••••••" className="col-span-3" />
                    </div>
                </>
            )}
            {error && <p className="text-destructive text-sm text-center col-span-4">{error}</p>}
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>Save Admin</Button>
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

  return (
    <div className="flex flex-col h-full gap-6 px-6 py-6">
      <div className="flex justify-end items-center">
        <AdminDialog onSave={handleAddAdmin}>
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
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge variant='secondary'>
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
