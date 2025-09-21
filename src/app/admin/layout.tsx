

import { getSettings } from '@/lib/db';
import AdminLayoutContent from './admin-layout-content';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/volunteers', label: 'Volunteers' },
  { href: '/admin/donations', label: 'Donations' },
  { href: '/admin/admins', label: 'Admins' },
  { href: '/admin/site-settings', label: 'Site Settings' },
  { href: '/admin/settings', label: 'Account' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <AdminLayoutContent settings={settings} navItems={navItems}>
      {children}
    </AdminLayoutContent>
  );
}
