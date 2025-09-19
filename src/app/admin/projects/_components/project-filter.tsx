
'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ProjectCategory, ProjectStatus } from '@prisma/client';

const projectStatuses: (ProjectStatus | 'all')[] = ['all', 'Active', 'Completed', 'Planning'];
const projectCategories: (ProjectCategory | 'all')[] = ['all', 'Water', 'Education', 'Medical', 'Community_Development', 'Disaster_Relief'];

export function ProjectFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const statusFilter = searchParams.get('status') || 'all';
    const categoryFilter = searchParams.get('category') || 'all';

    const handleFilterChange = (type: 'status' | 'category', value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (value === 'all') {
            current.delete(type);
        } else {
            current.set(type, value);
        }

        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
    };

    return (
        <>
            <div className='space-y-2'>
                <Label>Filter by Status</Label>
                <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {projectStatuses.map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">{status.replace(/_/g, ' ')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-2'>
                 <Label>Filter by Category</Label>
                 <Select value={categoryFilter} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {projectCategories.map((category) => (
                            <SelectItem key={category} value={category} className="capitalize">{category.replace(/_/g, ' ')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
