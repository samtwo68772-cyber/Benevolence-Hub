

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import * as LucideIcons from 'lucide-react';
import type { Settings } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DonationDialog } from "./donation-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

const navLinks = [
  { href: "#mission", label: "Our Mission" },
  { href: "#projects", label: "Projects" },
  { href: "#impact", label: "Impact" },
  { href: "#volunteer", label: "Volunteer" },
];

function Logo({ settings }: { settings: Settings }) {
    if (settings.logoType === 'image' && settings.logo) {
      return <Image src={settings.logo} alt={settings.appName || 'App Logo'} width={28} height={28} className="h-7 w-7" />;
    }
  
    const LogoIcon = (LucideIcons[settings.logo as keyof typeof LucideIcons] || LucideIcons.HandHeart) as React.ElementType;
    return <LogoIcon className="h-7 w-7 text-primary" />;
}

export default function AppHeader({ settings }: { settings: Settings }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isProjectPage = pathname.startsWith('/project') || pathname === '/projects';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-card/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo settings={settings} />
          <span className="font-headline text-2xl font-bold tracking-wide text-foreground">
            {settings.appName}
          </span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
            <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={isProjectPage ? `/${link.href}` : link.href}
                className="text-base font-medium text-foreground/80 transition-colors hover:text-primary"
                prefetch={false}
                >
                {link.label}
                </Link>
            ))}
            </nav>
            <DonationDialog />
            <ThemeToggle />
        </div>
        
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
           <DonationDialog />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex h-full flex-col p-6">
                <div className="mb-8 flex items-center justify-start">
                   <Link href="/" className="flex items-center gap-2" prefetch={false} onClick={() => setIsMenuOpen(false)}>
                      <Logo settings={settings} />
                    </Link>
                </div>
                <nav className="flex flex-1 flex-col items-start gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={isProjectPage ? `/${link.href}` : link.href}
                      className="text-xl font-medium text-foreground/80 transition-colors hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

