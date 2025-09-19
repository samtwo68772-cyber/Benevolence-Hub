"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Users, HandHeart, Users2 } from "lucide-react";
import { projects } from "@/lib/data";
import type { Project } from "@/lib/data";

const chartConfig = {
  "peopleHelped": {
    label: "People Reached",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function ImpactSection() {

  const totalPeopleHelped = projects.reduce((acc, project) => acc + project.peopleHelped, 0);
  const totalProjects = projects.length;

  const projectByCategory = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = { category: project.category, peopleHelped: 0 };
    }
    acc[project.category].peopleHelped += project.peopleHelped;
    return acc;
  }, {} as Record<string, { category: string; peopleHelped: number }>);

  const chartData = Object.values(projectByCategory);

  const stats = [
    { icon: Users2, value: totalPeopleHelped.toLocaleString(), label: 'Total People Helped' },
    { icon: HandHeart, value: totalProjects, label: 'Active Projects' },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16 text-center max-w-2xl mx-auto">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-background rounded-lg border">
                    <stat.icon className="h-12 w-12 text-accent mb-3"/>
                    <p className="text-4xl font-bold font-headline">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Community Reach by Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
    </section>
  );
}
