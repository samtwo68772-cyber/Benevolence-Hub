
'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const statusItems = ['all', 'Pending', 'Approved', 'Rejected'];
export const interestItems = ['all', 'Education', 'Medical', 'Community Development', 'Disaster Relief', 'General Support'];

type VolunteerFilterProps = {
    statusFilter: string;
    interestFilter: string;
    onStatusChange: (value: string) => void;
    onInterestChange: (value: string) => void;
    interestItems: string[];
}

export function VolunteerFilter({ statusFilter, interestFilter, onStatusChange, onInterestChange, interestItems: dynamicInterestItems }: VolunteerFilterProps) {
    
    return (
        <>
            <div className='space-y-2'>
                <Label>Filter by Status</Label>
                <Select value={statusFilter} onValueChange={onStatusChange}>
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
                 <Select value={interestFilter} onValueChange={onInterestChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                        {dynamicInterestItems.map((interest) => (
                            <SelectItem key={interest} value={interest} className="capitalize">{interest}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
