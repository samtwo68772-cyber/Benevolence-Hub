
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowDown } from 'lucide-react';
import { Settings } from '@/lib/types';

export default function HeroSection({ settings }: { settings: Settings }) {
  const defaultHeroImage = PlaceHolderImages.find(img => img.id === 'hero-background');
  const heroImageSrc = settings.heroImage || defaultHeroImage?.imageUrl;

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full text-white flex items-center justify-center">
      {heroImageSrc && (
        <Image
          src={heroImageSrc}
          alt={defaultHeroImage?.description || 'Hero background image'}
          fill
          className="object-cover"
          priority
          data-ai-hint={defaultHeroImage?.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6">
        <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl leading-tight drop-shadow-2xl">
          {settings.hero?.title}
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto font-light drop-shadow-lg">
          {settings.hero?.description}
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
      <div className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-white/80 animate-bounce">
        <span className="text-sm">Scroll Down</span>
        <ArrowDown className="h-5 w-5" />
      </div>
    </section>
  );
}
