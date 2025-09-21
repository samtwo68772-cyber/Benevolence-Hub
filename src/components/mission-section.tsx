import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Target, Eye, HandHeart } from "lucide-react";
import { Settings } from "@/lib/types";

export default function MissionSection({ settings }: { settings: Settings }) {
  const missionImage = PlaceHolderImages.find(img => img.id === 'mission-image');
  
  const goals = [
    {
      icon: Target,
      title: settings.mission?.title || "Our Mission",
      description: settings.mission?.description || "To provide immediate relief and long-term solutions to communities affected by poverty and disaster, fostering resilience and self-sufficiency.",
    },
    {
      icon: Eye,
      title: settings.vision?.title || "Our Vision",
      description: settings.vision?.description || "A world where every individual has the opportunity to live a life of dignity, health, and well-being, free from hardship.",
    },
    {
      icon: HandHeart,
      title: settings.values?.title || "Our Values",
      description: settings.values?.description || "We operate with compassion, integrity, and transparency, ensuring that every contribution makes a tangible and lasting impact.",
    },
  ];

  return (
    <section id="mission" className="section-padding bg-card">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="font-headline text-4xl md:text-5xl text-primary">
              {settings.missionIntro?.title || "Empowering Change, One Life at a Time"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {settings.missionIntro?.description || "At Benevolence Hub, we believe in the power of collective action to create a better world. Our work is driven by a deep commitment to humanity and a vision for a more equitable future."}
            </p>
            <div className="space-y-6">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <goal.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{goal.title}</h3>
                    <p className="text-muted-foreground mt-1">{goal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 md:h-[500px] rounded-lg overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
            {missionImage && (
              <Image
                src={missionImage.imageUrl}
                alt={missionImage.description}
                fill
                className="object-cover"
                data-ai-hint={missionImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
