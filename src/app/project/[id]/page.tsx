
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DonationDialog } from '@/components/donation-dialog';
import { projects } from '@/lib/data';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);
  const projectImage = PlaceHolderImages.find(img => img.id === project?.imageId);

  if (!project || !projectImage) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-card">
      <AppHeader />
      <main className="flex-1">
        <section className="relative h-64 md:h-96 w-full text-white">
            <Image
              src={projectImage.imageUrl}
              alt={projectImage.description}
              fill
              className="object-cover"
              data-ai-hint={projectImage.imageHint}
            />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="relative z-10 container mx-auto h-full flex flex-col justify-end pb-12">
            <h1 className="font-headline text-5xl md:text-7xl drop-shadow-2xl">
              {project.title}
            </h1>
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
                    <DonationDialog />
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
