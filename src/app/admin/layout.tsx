
import { db } from '@/lib/db';
import AdminLayoutContent from './admin-layout-content';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/volunteers', label: 'Volunteers' },
  { href: '/admin/donations', label: 'Donations' },
  { href: '/admin/admins', label: 'Admins' },
  { href: '/admin/settings', label: 'Settings' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await db.getSettings();

  return (
    <AdminLayoutContent settings={settings} navItems={navItems}>
      {children}
    </AdminLayoutContent>
  );
}
