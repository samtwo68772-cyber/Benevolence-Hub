
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HandHeart, LayoutDashboard, FolderKanban, Users, DollarSign, LogOut, Home } from 'lucide-react';
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
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/admin/volunteers', icon: Users, label: 'Volunteers' },
  { href: '/admin/donations', icon: DollarSign, label: 'Donations' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/admin') {
      return 'Dashboard';
    }
    const currentNavItem = navItems.find((item) => item.href !== '/admin' && pathname.startsWith(item.href));
    return currentNavItem?.label || 'Dashboard';
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <HandHeart className="w-7 h-7 text-primary" />
                    <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">
                        Benevolence Admin
                    </span>
                </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href) && pathname !== '/admin'}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
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
                    <SidebarMenuButton tooltip={{children: "Logout"}}>
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card">
            <div className="flex items-center gap-4 px-6 w-full">
                <SidebarTrigger className="md:hidden" />
                <h1 className="flex-1 text-xl font-semibold">{getPageTitle()}</h1>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
