
'use client';

import * as React from 'react';
import { donations as initialDonations, projects } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function AdminDonationsPage() {
    const [typeFilter, setTypeFilter] = React.useState('all');
    const [projectFilter, setProjectFilter] = React.useState('all');

    const projectNames = ['General Fund', ...projects.map(p => p.title)];

    const filteredDonations = initialDonations.filter(donation => {
        const typeMatch = typeFilter === 'all' || donation.type === typeFilter;
        const projectMatch = projectFilter === 'all' || donation.project === projectFilter;
        return typeMatch && projectMatch;
    });

  return (
    <div className="flex flex-col h-full gap-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Donations</h1>
        </div>

        <Card>
            <CardHeader className="p-4">
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="type-filter">Donation Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger id="type-filter">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="One-time">One-time</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="project-filter">Project</Label>
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                        <SelectTrigger id="project-filter">
                            <SelectValue placeholder="Filter by project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projectNames.map(name => (
                                <SelectItem key={name} value={name}>{name}</SelectItem>
                            ))}
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
                        <TableHead>Donor Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredDonations.map((donation) => (
                        <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.donorName}</TableCell>
                        <TableCell>${donation.amount.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge variant={donation.type === 'Monthly' ? 'outline' : 'default'}>{donation.type}</Badge>
                        </TableCell>
                        <TableCell>{donation.project}</TableCell>
                        <TableCell>{donation.date}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
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

    