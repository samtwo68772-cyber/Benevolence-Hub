

"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { DollarSign, HandHeart, Users } from "lucide-react";
import { Project, Volunteer, Category, Donation } from "@/lib/types";


const barChartConfig = {
  donations: {
    label: "Donations",
    color: "hsl(var(--chart-1))",
  },
  volunteers: {
    label: "Volunteers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  projects: {
    label: "Projects",
  },
  Active: {
    label: "Active",
    color: "hsl(var(--chart-1))",
  },
  Completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
  Planning: {
    label: "Planning",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const volunteerStatusConfig = {
  volunteers: {
    label: "Volunteers",
  },
  Approved: {
    label: "Approved",
    color: "hsl(var(--chart-1))",
  },
  Pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  Rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


const volunteerInterestsConfig = {
  count: {
    label: "Volunteers",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;


type ImpactSectionProps = {
    projects: Project[];
    donations: Donation[];
    volunteers: Volunteer[];
    approvedVolunteersCount: number;
    totalDonations: number;
    categories: Category[];
}

export default function ImpactSection({ projects, donations, volunteers, approvedVolunteersCount, totalDonations, categories }: ImpactSectionProps) {
  const totalProjects = projects.length;

  const engagementByCategory = categories.map(category => {
    const categoryDonations = donations
      .filter(d => (d as any).categoryId === category.id)
      .reduce((sum, d) => sum + d.amount, 0);

    const categoryVolunteers = volunteers.filter(v => 
        v.status === 'Approved' && v.interests.includes(category.name)
    ).length;

    return {
      category: category.name,
      donations: categoryDonations,
      volunteers: categoryVolunteers,
    };
  });
  
  const projectByStatus = projects.reduce((acc, project) => {
    if (!acc[project.status]) {
      acc[project.status] = { name: project.status, value: 0, fill: `var(--color-${project.status})` };
    }
    acc[project.status].value++;
    return acc;
  }, {} as Record<string, { name: string; value: number, fill: string }>);

  const pieChartData = Object.values(projectByStatus);

  const volunteerStatusData = volunteers.reduce((acc, volunteer) => {
    if (!acc[volunteer.status]) {
      acc[volunteer.status] = { name: volunteer.status, value: 0, fill: `var(--color-${volunteer.status})` };
    }
    acc[volunteer.status].value++;
    return acc;
  }, {} as Record<string, { name: string; value: number, fill: string }>);

  const volunteerStatusChartData = Object.values(volunteerStatusData);

  const volunteerInterestsData = categories.reduce((acc, category) => {
    acc[category.name] = { interest: category.name, count: 0 };
    return acc;
    }, {} as Record<string, { interest: string; count: number }>);

  volunteers.flatMap(v => v.interests).forEach(interest => {
    if (volunteerInterestsData[interest]) {
        volunteerInterestsData[interest].count++;
    }
  });

  const volunteerInterestsChartData = Object.values(volunteerInterestsData);


  const stats = [
    { icon: HandHeart, value: totalProjects, label: 'Total Projects' },
    { icon: DollarSign, value: `$${totalDonations.toLocaleString()}`, label: 'Total Donations' },
    { icon: Users, value: approvedVolunteersCount, label: 'Volunteers' },
  ];

  return (
    <section id="impact" className="section-padding bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl text-primary">Our Tangible Impact</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in transparency. Here’s a look at the lives we’ve touched and the community we've built together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Engagement by Sector</CardTitle>
                <CardDescription>Donations and approved volunteers for each category.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer>
                    <BarChart data={engagementByCategory} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                      <XAxis
                        dataKey="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${Number(value) / 1000}k`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                       />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                       <ChartLegend content={<ChartLegendContent />} />
                      <Bar yAxisId="left" dataKey="donations" fill="var(--color-donations)" radius={4} />
                      <Bar yAxisId="right" dataKey="volunteers" fill="var(--color-volunteers)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Project Status Overview</CardTitle>
                <CardDescription>Current status of all our initiatives.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
                  <ResponsiveContainer>
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel indicator="dot" nameKey="name" />}
                      />
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        strokeWidth={5}
                        >
                         {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
                        ))}
                        </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="text-center my-12">
            <h3 className="font-headline text-3xl md:text-4xl text-primary">Our Volunteer Community</h3>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                The heart of our organization is our volunteers. Here's a glimpse into our passionate community.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="shadow-lg h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Volunteer Status</CardTitle>
                    <CardDescription>Application statuses for our volunteers.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                    <ChartContainer config={volunteerStatusConfig} className="h-[250px] w-full">
                    <ResponsiveContainer>
                        <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel indicator="dot" nameKey="name" />}
                        />
                        <Pie
                            data={volunteerStatusChartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                            >
                            {volunteerStatusChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
                            ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-2">
                <Card className="shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Volunteer Interests</CardTitle>
                    <CardDescription>Top areas where our volunteers want to contribute.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={volunteerInterestsConfig} className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={volunteerInterestsChartData} layout="vertical" margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                        <XAxis
                            type="number"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            hide
                        />
                        <YAxis 
                            dataKey="interest"
                            type="category"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="count" name="Volunteers" fill="var(--color-count)" radius={5} />
                        </BarChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}
