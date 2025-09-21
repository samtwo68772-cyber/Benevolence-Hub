
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getProjects, getSettings } from '@/lib/db';

export default async function AllProjectsPage() {
  const projects = (await getProjects()).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader settings={settings} />
      <main className="flex-1">
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-headline text-5xl md:text-6xl">All Projects</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our complete portfolio of humanitarian initiatives. Your support makes this work possible.
              </p>
            </div>
            {projects.length === 0 ? (
                 <div className="text-center text-muted-foreground bg-card border rounded-lg p-12">
                    <h3 className="text-xl font-semibold">No projects to display</h3>
                    <p className="mt-2">Database not connected or no projects have been created yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => {
                    const projectImage = PlaceHolderImages.find(img => img.id === project.imageId);
                    return (
                    <Card key={project.id} className="overflow-hidden flex flex-col group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-card">
                        <CardHeader className="p-0 relative">
                        {projectImage ? (
                            <div className="relative h-56 w-full">
                            <Image
                                src={projectImage.imageUrl}
                                alt={projectImage.description}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={projectImage.imageHint}
                            />
                            </div>
                        ) : (
                            <div className='relative h-56 w-full bg-muted' />
                        )}
                        <Badge className="absolute top-4 right-4" variant={project.status === 'Active' ? 'default' : project.status === 'Completed' ? 'secondary' : 'outline'}>
                            {project.status}
                        </Badge>
                        </CardHeader>
                        <CardContent className="pt-6 flex-1">
                        <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                        <Button asChild variant="link" className="px-0 text-accent group/link">
                            <Link href={`/project/${project.id}`}>
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                            </Link>
                        </Button>
                        </CardFooter>
                    </Card>
                    );
                })}
                </div>
            )}
             <div className="text-center mt-12">
                <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <AppFooter settings={settings} />
    </div>
  );
}
