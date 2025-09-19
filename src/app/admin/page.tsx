
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FolderKanban, Users, UserCog } from 'lucide-react';
import Link from 'next/link';
// import prisma from '@/lib/prisma';
import { db } from '@/lib/db';

export default async function AdminDashboardPage() {
    const projectCount = await db.project.count();
    const volunteerCount = await db.volunteer.count();
    const adminCount = await db.user.count({ where: { role: 'ADMIN' } });
    const totalDonations = await db.donation.aggregate({
        _sum: {
            amount: true,
        },
    });

    const stats = [
        { title: 'Projects', value: projectCount.toString(), icon: FolderKanban, href: '/admin/projects' },
        { title: 'Volunteers', value: volunteerCount.toString(), icon: Users, href: '/admin/volunteers' },
        { title: 'Total Donations', value: `$${totalDonations._sum.amount?.toLocaleString() || '0'}`, icon: DollarSign, href: '/admin/donations' },
        { title: 'Admins', value: adminCount.toString(), icon: UserCog, href: '/admin/admins' },
    ]

  return (
    <div className="grid gap-6 p-4 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
            <Card key={stat.title} className="hover:bg-muted/50 transition-colors">
                 <Link href={stat.href}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">View Details</p>
                    </CardContent>
                </Link>
            </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Welcome to the Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                From here you can manage your organization's projects, view volunteer applications, and track donations. Use the navigation on the left to get started.
            </p>
        </CardContent>
      </Card>
    </div>
  )
}
