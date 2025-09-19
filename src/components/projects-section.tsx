
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProjectsSection({ projects: featuredProjects }: { projects: Project[] }) {

  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl">Our Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our ongoing initiatives that are making a real difference in people's lives across the globe.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => {
            const placeholder = PlaceHolderImages.find(p => p.id === project.imageId);
            const projectImage = placeholder?.imageUrl;
            const isLocalImage = project.imageId.startsWith('/');
            return (
              <Card key={project.id} className="overflow-hidden flex flex-col group transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <CardHeader className="p-0">
                   {projectImage ? (
                    <div className="relative h-56 w-full">
                      <Image
                        src={projectImage}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized={isLocalImage}
                      />
                    </div>
                  ): (
                    <div className="relative h-56 w-full bg-muted" />
                  )}
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
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
