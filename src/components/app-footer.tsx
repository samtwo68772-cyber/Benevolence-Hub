

'use client';

import { Twitter, Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import * as LucideIcons from 'lucide-react';
import type { Settings } from "@/lib/types";
import Image from "next/image";

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
]

const footerLinks = [
  { href: "#mission", label: "Our Mission" },
  { href: "#projects", label: "Projects" },
  { href: "#impact", label: "Impact" },
  { href: "#volunteer", label: "Volunteer" },
  { href: "/admin/login", label: "Admin" },
]

function Logo({ settings }: { settings: Settings }) {
    if (settings.logoType === 'image' && settings.logo) {
      return <Image src={settings.logo} alt={settings.appName} width={28} height={28} className="h-7 w-7" />;
    }
  
    const LogoIcon = LucideIcons[settings.logo as keyof typeof LucideIcons] || LucideIcons.HandHeart;
    return <LogoIcon className="h-7 w-7 text-primary" />;
}

export default function AppFooter({ settings }: { settings: Settings }) {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith('/project') || pathname === '/projects';

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto section-padding !py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <Logo settings={settings} />
              <span className="font-headline text-2xl font-bold tracking-wide">
                {settings.appName}
              </span>
            </Link>
            <p className="text-muted-foreground">Compassion in Action.</p>
          </div>
          {!isProjectPage && (
            <div>
              <h3 className="font-headline text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footerLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
           <div>
            <h3 className="font-headline text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} className="text-muted-foreground hover:text-primary transition-colors" prefetch={false}>
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {settings.appName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

