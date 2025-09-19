
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import HeroSection from '@/components/hero-section';
import MissionSection from '@/components/mission-section';
import ProjectsSection from '@/components/projects-section';
import ImpactSection from '@/components/impact-section';
import VolunteerSection from '@/components/volunteer-section';
import { db } from '@/lib/db';

export default async function Home() {
  const projects = await db.project.findMany();
  const volunteers = await db.volunteer.findMany();
  
  const totalDonations = await db.donation.aggregate({_sum: { amount: true}});
  
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
            totalDonations={totalDonations._sum.amount || 0}
        />
        <VolunteerSection />
      </main>
      <AppFooter />
    </div>
  );
}
