
import { getSession } from '@/lib/session';
import { SettingsForm } from './_components/settings-form';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function AdminSettingsPage() {
    const session = await getSession();

    if (!session) {
        return (
            <div className="flex flex-col h-full gap-6 p-4 sm:p-6 items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Not Authenticated</CardTitle>
                        <CardDescription>Please log in to view your settings.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return <SettingsForm session={session} />;
}
