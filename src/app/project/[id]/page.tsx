
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DonationDialog } from '@/components/donation-dialog';
import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });
  
  if (!project) {
    notFound();
  }
  
  const projectImage = PlaceHolderImages.find(img => img.id === project.imageId);

  return (
    <div className="flex min-h-screen flex-col bg-card">
      <AppHeader />
      <main className="flex-1">
        <section className="relative h-64 md:h-96 w-full text-white">
            {projectImage ? (
                <Image
                src={projectImage.imageUrl}
                alt={projectImage.description}
                fill
                className="object-cover"
                data-ai-hint={projectImage.imageHint}
                />
            ) : (
                <div className="bg-muted w-full h-full" />
            )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="relative z-10 container mx-auto h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-12">
            <div className='flex items-center gap-4'>
                <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl drop-shadow-2xl">
                {project.title}
                </h1>
                 <Badge 
                    variant={project.status === 'Active' ? 'default' : project.status === 'Completed' ? 'secondary' : 'outline'}
                    className="text-lg sm:text-xl"
                >
                    {project.status}
                </Badge>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-headline text-3xl text-primary">Project Overview</h2>
              <p className="text-lg text-muted-foreground">{project.description}</p>
              
              <h3 className="font-headline text-2xl text-primary pt-6">Key Achievements</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground text-lg">
                {project.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
                <div className="rounded-lg bg-background p-6 shadow-lg border">
                    <h3 className="font-headline text-2xl mb-4 text-center">Support this Project</h3>
                    <p className="text-center text-muted-foreground mb-6">Your donation directly funds our efforts for {project.title}.</p>
                    <DonationDialog projectId={project.id} />
                </div>
                 <div className="text-center">
                    <Button asChild variant="outline">
                        <Link href="/#projects">Back to All Projects</Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>

      </main>
      <AppFooter />
    </div>
  );
}
