
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import HeroSection from '@/components/hero-section';
import MissionSection from '@/components/mission-section';
import ProjectsSection from '@/components/projects-section';
import ImpactSection from '@/components/impact-section';
import VolunteerSection from '@/components/volunteer-section';
import { db } from '@/lib/db';

export default async function Home() {
  const projects = await db.getProjects();
  const allVolunteers = await db.getVolunteers();
  const approvedVolunteers = allVolunteers.filter(v => v.status === 'Approved');
  const allDonations = await db.getDonations();
  
  const totalDonations = allDonations.reduce((sum, d) => sum + d.amount, 0);
  
  const featuredProjects = [...projects].sort((a, b) => b.startDate.getTime() - a.startDate.getTime()).slice(0, 3);
  const settings = await db.getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader settings={settings}/>
      <main className="flex-1">
        <HeroSection />
        <MissionSection />
        <ProjectsSection projects={featuredProjects} />
        <ImpactSection 
            projects={projects} 
            volunteers={allVolunteers}
            totalDonations={totalDonations}
        />
        <VolunteerSection />
      </main>
      <AppFooter settings={settings}/>
    </div>
  );
}
