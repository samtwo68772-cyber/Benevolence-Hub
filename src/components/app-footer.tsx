
'use client';

import { Twitter, Facebook, Instagram, Youtube, Send, Linkedin, Mail, Smartphone, HandHeart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import * as LucideIcons from 'lucide-react';
import type { Settings, SocialLink } from "@/lib/types";
import Image from "next/image";

const footerLinks = [
  { href: "#mission", label: "Our Mission" },
  { href: "#projects", label: "Projects" },
  { href: "#impact", label: "Impact" },
  { href: "#volunteer", label: "Volunteer" },
  { href: "/admin/login", label: "Admin" },
]

function Logo({ settings }: { settings: Settings }) {
    if (settings.logoType === 'image' && settings.logo) {
      return <Image src={settings.logo} alt={settings.appName || 'Logo'} width={28} height={28} className="h-7 w-7" />;
    }
  
    const LogoIcon = LucideIcons[settings.logo as keyof typeof LucideIcons] || LucideIcons.HandHeart;
    return <LogoIcon className="h-7 w-7 text-primary" />;
}

const socialIconMap: { [key: string]: React.FC<any> } = {
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Telegram: Send,
    WhatsApp: Smartphone,
    Email: Mail,
    Linkedin,
    TikTok: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a4 4 0 1 0-4-4v12a5 5 0 1 0 5-5"/></svg>,
    Mail,
    Smartphone
};


function SocialLinks({ links }: { links: SocialLink[] }) {
    const formatUrl = (url: string, icon: string) => {
        if (!url) return '#';
        if (icon === 'Email') {
            return `mailto:${url}`;
        }
         if (icon === 'WhatsApp') {
            return `https://wa.me/${url.replace(/[^0-9]/g, '')}`;
        }
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };
    
    return (
        <div className="flex flex-wrap items-center gap-4">
        {links.map((social) => {
            const Icon = socialIconMap[social.icon];
            if (!social.href || social.href === '#' || !Icon) return null;

            return (
            <Link key={social.icon} href={formatUrl(social.href, social.icon)} className="text-muted-foreground hover:text-primary transition-colors" prefetch={false} target="_blank" rel="noopener noreferrer">
                <Icon className="h-6 w-6" />
            </Link>
            )
        })}
        </div>
    )
}

export default function AppFooter({ settings }: { settings: Settings }) {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith('/project') || pathname === '/projects';
  
  const socialLinks = settings.socialLinks || [];

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
            <SocialLinks links={socialLinks} />
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {settings.appName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
