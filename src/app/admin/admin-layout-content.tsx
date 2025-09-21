

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Users, DollarSign, LogOut, Home, UserCog, Cog, Settings as SettingsIcon, Grip } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { logout } from '@/lib/session';
import { Settings } from '@/lib/types';
import Image from 'next/image';

const navIconMapping: { [key: string]: React.FC<any> } = {
  Dashboard: LayoutDashboard,
  Projects: FolderKanban,
  Categories: Grip,
  Volunteers: Users,
  Donations: DollarSign,
  Admins: UserCog,
  'Site Settings': SettingsIcon,
  Account: Cog,
};

function AdminNav({ navItems }: { navItems: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <>
      <SidebarMenu>
        {navItems.map((item) => {
          const Icon = navIconMapping[item.label] || Cog;
          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href) && pathname !== '/admin'}
                tooltip={{ children: item.label }}
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </>
  );
}

function AdminLogo({ settings }: { settings: Settings }) {
    if (settings.logoType === 'image' && settings.logo) {
      return <Image src={settings.logo} alt={settings.appName} width={28} height={28} className="w-7 h-7" />;
    }
  
    const LogoIcon = LucideIcons[settings.logo as keyof typeof LucideIcons] || LucideIcons.HandHeart;
    return <LogoIcon className="w-7 h-7 text-primary" />;
}

export default function AdminLayoutContent({
  children,
  settings,
  navItems,
}: {
  children: React.ReactNode;
  settings: Settings;
  navItems: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    if (pathname === '/admin') {
      return 'Dashboard';
    }
    const currentNavItem = navItems.find((item) => item.href !== '/admin' && pathname.startsWith(item.href));
    return currentNavItem?.label || 'Dashboard';
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <AdminLogo settings={settings} />
                    <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">
                        {settings.appName} Admin
                    </span>
                </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-1">
            <AdminNav navItems={navItems} />
          </SidebarContent>
          <SidebarFooter>
             <form action={logout}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{children: "Back to Site"}}>
                            <Link href="/">
                                <Home />
                                <span>Back to Site</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton type="submit" tooltip={{children: "Logout"}}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
             </form>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <h1 className="flex-1 text-lg sm:text-xl font-semibold">{getPageTitle()}</h1>
                <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
