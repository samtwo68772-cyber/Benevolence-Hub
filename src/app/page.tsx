
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import HeroSection from '@/components/hero-section';
import MissionSection from '@/components/mission-section';
import ProjectsSection from '@/components/projects-section';
import ImpactSection from '@/components/impact-section';
import VolunteerSection from '@/components/volunteer-section';
import prisma from '@/lib/prisma';

export default async function Home() {
  // const projects = await prisma.project.findMany();
  // const volunteers = await prisma.volunteer.findMany();
  // const totalPeopleHelped = await prisma.project.aggregate({
  //   _sum: { peopleHelped: true }
  // });

  const projects = [];
  const volunteers = [];
  const totalPeopleHelped = { _sum: { peopleHelped: 0 } };


  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <HeroSection />
        <MissionSection />
        <ProjectsSection projects={[]} />
        <ImpactSection 
            projects={projects} 
            volunteers={volunteers}
            totalPeopleHelped={totalPeopleHelped._sum.peopleHelped || 0}
        />
        <VolunteerSection />
      </main>
      <AppFooter />
    </div>
  );
}
