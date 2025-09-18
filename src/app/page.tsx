import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import HeroSection from '@/components/hero-section';
import MissionSection from '@/components/mission-section';
import ProjectsSection from '@/components/projects-section';
import ImpactSection from '@/components/impact-section';
import VolunteerSection from '@/components/volunteer-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <HeroSection />
        <MissionSection />
        <ProjectsSection />
        <ImpactSection />
        <VolunteerSection />
      </main>
      <AppFooter />
    </div>
  );
}
