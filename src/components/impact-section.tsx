
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Users, HandHeart, Users2, CheckCircle, DollarSign } from "lucide-react";
import { projects, donations } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const chartConfig = {
  "peopleHelped": {
    label: "People Reached",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function ImpactSection() {

  const totalPeopleHelped = projects.reduce((acc, project) => acc + project.peopleHelped, 0);
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalDonations = donations.reduce((acc, donation) => acc + donation.amount, 0);
  const recentDonations = donations.slice(0, 5);


  const projectByCategory = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = { category: project.category, peopleHelped: 0 };
    }
    acc[project.category].peopleHelped += project.peopleHelped;
    return acc;
  }, {} as Record<string, { category: string; peopleHelped: number }>);

  const chartData = Object.values(projectByCategory);

  const stats = [
    { icon: Users2, value: totalPeopleHelped.toLocaleString(), label: 'People Helped' },
    { icon: HandHeart, value: totalProjects, label: 'Total Projects' },
    { icon: CheckCircle, value: completedProjects, label: 'Projects Completed' },
    { icon: DollarSign, value: `$${totalDonations.toLocaleString()}`, label: 'Total Donations' },
  ]

  return (
    <section id="impact" className="section-padding bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl text-primary">Our Tangible Impact</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in transparency. Here’s a look at the lives we’ve touched and the progress we’ve made together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                   <CardHeader className="flex items-center justify-center">
                     <div className="p-4 bg-accent/10 rounded-full">
                       <stat.icon className="h-8 w-8 text-accent"/>
                     </div>
                   </CardHeader>
                   <CardContent>
                    <p className="text-4xl font-bold font-headline">{stat.value}</p>
                    <p className="text-muted-foreground mt-1">{stat.label}</p>
                   </CardContent>
                </Card>
            ))}
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <Card className="shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Community Reach by Sector</CardTitle>
                     <CardDescription>Number of individuals helped across different project categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${Number(value) / 1000}k`}
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" labelKey="peopleHelped" />}
                        />
                        <Bar dataKey="peopleHelped" name="People Reached" fill="var(--color-peopleHelped)" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card className="shadow-lg h-full">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Recent Donations</CardTitle>
                        <CardDescription>A look at the latest contributions from our generous supporters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Donor</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentDonations.map(donation => (
                                    <TableRow key={donation.id}>
                                        <TableCell className="font-medium">{donation.donorName}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary">${donation.amount.toFixed(2)}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}

    