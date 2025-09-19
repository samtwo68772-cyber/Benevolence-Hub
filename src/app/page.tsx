
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import HeroSection from '@/components/hero-section';
import MissionSection from '@/components/mission-section';
import ProjectsSection from '@/components/projects-section';
import ImpactSection from '@/components/impact-section';
import VolunteerSection from '@/components/volunteer-section';
import { projects as allProjects, volunteers as allVolunteers } from '@/lib/data';
import type { Project, Volunteer } from '@prisma/client';

export default async function Home() {
  const projects: Project[] = allProjects;
  
  const volunteers: Volunteer[] = allVolunteers.filter(v => v.status === 'Approved');
  
  const totalPeopleHelped = projects.reduce((sum, project) => sum + project.peopleHelped, 0);

  const featuredProjects = projects.slice(0, 3);
  const heroProject = projects.length > 0 ? projects[0] : null;


  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <HeroSection heroImage={heroProject?.imageId} />
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
