
import { getSettings } from '@/lib/db';
import { SiteSettingsForm } from './_components/site-settings-form';

export default async function AdminSiteSettingsPage() {
    const settings = await getSettings();

    return <SiteSettingsForm settings={settings} />;
}
