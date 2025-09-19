
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import HeroSection from '@/components/hero-section';
import MissionSection from '@/components/mission-section';
import ProjectsSection from '@/components/projects-section';
import ImpactSection from '@/components/impact-section';
import VolunteerSection from '@/components/volunteer-section';
// import prisma from '@/lib/prisma';
import { db } from '@/lib/db';

export default async function Home() {
  const projects = await db.project.findMany();
  const volunteers = await db.volunteer.findMany();
  
  const totalPeopleHelped = projects.reduce((sum, project) => sum + project.peopleHelped, 0);
  
  const featuredProjects = await db.project.findMany({ orderBy: { startDate: 'desc' }, take: 3 });

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <HeroSection />
        <MissionSection />
        <ProjectsSection projects={featuredProjects} />
        <ImpactSection 
            projects={projects} 
            volunteers={volunteers}
            totalPeopleHelped={totalPeopleHelped || 0}
        />
        <VolunteerSection />
      </main>
      <AppFooter />
    </div>
  );
}
