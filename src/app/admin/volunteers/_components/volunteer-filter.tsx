
'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Category } from '@/lib/types';

const statusItems = ['all', 'Pending', 'Approved', 'Rejected'];

export function VolunteerFilter({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const statusFilter = searchParams.get('status') || 'all';
    const interestFilter = searchParams.get('interest') || 'all';

    const handleFilterChange = (type: 'status' | 'interest', value: string) => {
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
                        {statusItems.map((status) => (
                            <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-2'>
                 <Label>Filter by Interest</Label>
                 <Select value={interestFilter} onValueChange={(value) => handleFilterChange('interest', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Interests</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
