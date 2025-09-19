
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HandHeart, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DonationDialog } from "./donation-dialog";

const navLinks = [
  { href: "#mission", label: "Our Mission" },
  { href: "#projects", label: "Projects" },
  { href: "#impact", label: "Impact" },
  { href: "#volunteer", label: "Volunteer" },
];

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  const isProjectPage = pathname.startsWith('/project') || pathname === '/projects';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-card/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <HandHeart className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-wide text-foreground">
            Benevolence Hub
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-foreground/80 transition-colors hover:text-primary"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <DonationDialog />
        </div>
        {!isProjectPage && (
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex h-full flex-col p-6">
                  <div className="mb-8 flex items-center justify-start">
                     <Link href="/" className="flex items-center gap-2" prefetch={false}>
                        <HandHeart className="h-7 w-7 text-primary" />
                      </Link>
                  </div>
                  <nav className="flex flex-1 flex-col items-start gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-xl font-medium text-foreground/80 transition-colors hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                        prefetch={false}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-8">
                    <DonationDialog />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
