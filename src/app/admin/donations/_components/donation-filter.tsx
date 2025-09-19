
'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const donationTypes = ['all', 'One-time', 'Monthly'];

export function DonationFilter({ projectNames }: { projectNames: string[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const typeFilter = searchParams.get('type') || 'all';
    const projectFilter = searchParams.get('project') || 'all';

    const handleFilterChange = (type: 'type' | 'project', value: string) => {
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
                <Label>Filter by Type</Label>
                <Select value={typeFilter} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {donationTypes.map((type) => (
                            <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-2'>
                 <Label>Filter by Project</Label>
                 <Select value={projectFilter} onValueChange={(value) => handleFilterChange('project', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">All Projects</SelectItem>
                        {projectNames.map((name) => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
