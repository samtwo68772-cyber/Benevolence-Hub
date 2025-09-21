

'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateProfile, changePassword, updateSettings } from '../_actions/settings';
import { SessionPayload } from '@/lib/session';
import { Settings } from '@/lib/types';
import * as LucideIcons from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';

const profileFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ["confirmPassword"],
});

function SettingsSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Site Settings'}
        </Button>
    )
}

function SiteSettingsForm({ settings }: { settings: Settings }) {
    const { toast } = useToast();
    const [logoPreview, setLogoPreview] = React.useState<string | null>(settings.logoType === 'image' ? settings.logo : null);
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    async function handleSettingsSave(formData: FormData) {
        try {
            const result = await updateSettings(formData);
            toast({ title: "Settings Updated", description: result.message });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
    };

    const LogoPreview = () => {
        if (logoPreview) {
          return <Image src={logoPreview} alt="Logo preview" width={40} height={40} className="rounded-md" />;
        }
        if (settings.logoType === 'icon') {
            const Icon = LucideIcons[settings.logo as keyof typeof LucideIcons] || LucideIcons.HandHeart;
            return <Icon className="w-10 h-10 text-primary" />;
        }
        return null;
    }

    return (
        <Card className="w-full lg:col-span-2">
            <form action={handleSettingsSave} ref={formRef}>
                <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                    <CardDescription>Update your site name and logo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="appName">App Name</Label>
                        <Input id="appName" name="appName" defaultValue={settings.appName} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="logo">Logo</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center">
                               <LogoPreview />
                            </div>
                            <Input id="logo" name="logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoChange} />
                        </div>
                         <p className="text-sm text-muted-foreground">Upload a new logo. Recommended size: 128x128px. Max 1MB.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <SettingsSubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}


export function SettingsForm({ session, settings }: { session: SessionPayload, settings: Settings }) {
    const { toast } = useToast();
    
    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: session?.name || '',
            email: session?.email || '',
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleProfileSave = async (values: z.infer<typeof profileFormSchema>) => {
        try {
            const result = await updateProfile(values);
            toast({ title: "Profile Updated", description: result.message });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
    };

    const handlePasswordSave = async (values: z.infer<typeof passwordFormSchema>) => {
        try {
            const result = await changePassword(values);
            toast({ title: "Password Updated", description: result.message });
            passwordForm.reset();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-6 p-4 sm:p-6 w-full max-w-full overflow-x-auto">
            <SiteSettingsForm settings={settings} />

            <Card className="w-full">
                 <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileSave)}>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                                {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="w-full">
                 <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordSave)}>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your login password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                 {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update Password'}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
