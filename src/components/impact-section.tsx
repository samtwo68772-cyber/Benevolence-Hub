"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Users, Droplets, Home, Stethoscope, GraduationCap } from "lucide-react";

const chartData = [
  { area: "Health", "People Reached": 4000 },
  { area: "Water", "People Reached": 3000 },
  { area: "Education", "People Reached": 2000 },
  { area: "Shelter", "People Reached": 2780 },
  { area: "General Aid", "People Reached": 1890 },
];

const chartConfig = {
  "People Reached": {
    label: "People Reached",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const stats = [
    { icon: Droplets, value: '1M+', label: 'Gallons of Clean Water' },
    { icon: GraduationCap, value: '5,000+', label: 'Children Educated' },
    { icon: Home, value: '1,200+', label: 'Families Sheltered' },
    { icon: Stethoscope, value: '10,000+', label: 'Medical Consultations' },
]

export default function ImpactSection() {
  return (
    <section id="impact" className="section-padding bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl text-primary">Our Tangible Impact</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe in transparency. Here’s a look at the lives we’ve touched and the progress we’ve made together.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 text-center">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                    <stat.icon className="h-12 w-12 text-accent mb-3"/>
                    <p className="text-4xl font-bold font-headline">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Community Reach by Sector (Last Year)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <XAxis
                    dataKey="area"
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
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="People Reached" fill="var(--color-People Reached)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
