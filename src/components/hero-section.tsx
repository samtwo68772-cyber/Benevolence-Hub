
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowDown } from 'lucide-react';
import { Settings } from '@/lib/types';

export default function HeroSection({ settings }: { settings: Settings }) {
  // Array of background images for the slideshow
  const backgroundImages = [
    'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&q=80', // Helping hands
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80', // Community event
    'https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&q=80', // Volunteering
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80', // Education
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80', // Environmental work
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Effect for automatic slideshow
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full text-white flex items-center justify-center overflow-hidden">
      {backgroundImages.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt={`Hero background ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6">
        <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl leading-tight drop-shadow-2xl">
          {settings.heroTitle || "Empowering Communities Through Compassion"}
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto font-light drop-shadow-lg">
          {settings.heroDescription || "Join us in making a lasting difference in the lives of those who need it most."}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#projects">
            <Button size="lg" variant="secondary" className="bg-card/90 text-foreground hover:bg-card text-base w-48 transition-transform duration-300 ease-in-out hover:scale-105">
              Our Projects
            </Button>
          </Link>
          <Link href="#mission">
            <Button size="lg" variant="secondary" className="bg-transparent text-white hover:bg-white/10 border-white/50 border text-base w-48 transition-transform duration-300 ease-in-out hover:scale-105">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      {/* Slide indicators */}
      <div className="absolute bottom-20 z-10 flex gap-2 justify-center w-full">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-white/80 animate-bounce">
        <span className="text-sm">Scroll Down</span>
        <ArrowDown className="h-5 w-5" />
      </div>
    </section>
  );
}
