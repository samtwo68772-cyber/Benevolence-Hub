
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings } from '@/lib/types';
import * as LucideIcons from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateSiteSettings } from '../_actions/settings';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function SettingsSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save All Settings'}
        </Button>
    )
}

export function SiteSettingsForm({ settings }: { settings: Settings }) {
    const { toast } = useToast();
    const [logoPreview, setLogoPreview] = React.useState<string | null>(settings.logoType === 'image' ? settings.logo : null);
    const defaultMissionImage = PlaceHolderImages.find(img => img.id === 'mission-image')?.imageUrl;
    const [missionImagePreview, setMissionImagePreview] = React.useState<string | null>(settings.missionImage || defaultMissionImage || null);
    
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;
        const formData = new FormData(formRef.current);
        
        try {
            const result = await updateSiteSettings(formData);
            toast({ title: "Settings Updated", description: result.message });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
    };

    const LogoPreview = () => {
        if (logoPreview) {
          return <Image src={logoPreview} alt="Logo preview" width={40} height={40} className="rounded-md object-contain" />;
        }
        if (settings.logoType === 'icon') {
            const Icon = LucideIcons[settings.logo as keyof typeof LucideIcons] || LucideIcons.HandHeart;
            return <Icon className="w-10 h-10 text-primary" />;
        }
        return null;
    }

    const MissionImagePreview = () => {
      if (missionImagePreview) {
        return <Image src={missionImagePreview} alt="Mission section image preview" width={160} height={90} className="rounded-md object-cover" />;
      }
      return null;
    }
    
    return (
        <div className="grid h-full gap-6 p-4 sm:p-6 w-full max-w-full overflow-x-auto">
            <Card className="w-full">
                <form onSubmit={handleFormSubmit} ref={formRef} encType="multipart/form-data">
                    <CardHeader>
                        <CardTitle>Site & Content Settings</CardTitle>
                        <CardDescription>Update your site name, logo, homepage content, and other global settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4 rounded-md border p-4">
                            <h4 className="font-semibold">General</h4>
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
                                    <Input id="logo" name="logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleImageChange(e, setLogoPreview)} />
                                </div>
                                <p className="text-sm text-muted-foreground">Upload a new logo. Recommended size: 128x128px. Max 1MB.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="volunteerIcon">Volunteer Section Icon</Label>
                                <Input id="volunteerIcon" name="volunteerIcon" defaultValue={settings.volunteerIcon} />
                                <p className="text-sm text-muted-foreground">Enter any icon name from the <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline">Lucide icon library</a>.</p>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-md border p-4">
                            <h4 className="font-semibold">Homepage: Hero Section</h4>
                            <div className="space-y-2">
                                <Label htmlFor="heroTitle">Title</Label>
                                <Input id="heroTitle" name="heroTitle" defaultValue={settings.hero.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="heroDescription">Description</Label>
                                <Textarea id="heroDescription" name="heroDescription" defaultValue={settings.hero.description} rows={3} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="heroImages">Hero Background Images</Label>
                                <Textarea id="heroImages" name="heroImages" defaultValue={settings.heroImages?.join(', ')} rows={3} />
                                <p className="text-sm text-muted-foreground">Enter a comma-separated list of image IDs from placeholder-images.json.</p>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-md border p-4">
                            <h4 className="font-semibold">Homepage: Mission Intro</h4>
                            <div className="space-y-2">
                                <Label htmlFor="missionIntroTitle">Title</Label>
                                <Input id="missionIntroTitle" name="missionIntroTitle" defaultValue={settings.missionIntro.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="missionIntroDescription">Description</Label>
                                <Textarea id="missionIntroDescription" name="missionIntroDescription" defaultValue={settings.missionIntro.description} rows={3} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="missionImage">Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-40 h-auto flex items-center justify-center">
                                        <MissionImagePreview />
                                    </div>
                                    <Input id="missionImage" name="missionImage" type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageChange(e, setMissionImagePreview)} />
                                </div>
                                <p className="text-sm text-muted-foreground">Upload an image for the mission section. Max 1MB.</p>
                            </div>
                        </div>

                         <div className="space-y-4 rounded-md border p-4">
                            <h4 className="font-semibold">Homepage: Volunteer Section</h4>
                            <div className="space-y-2">
                                <Label htmlFor="volunteerIntroTitle">Title</Label>
                                <Input id="volunteerIntroTitle" name="volunteerIntroTitle" defaultValue={settings.volunteerIntro?.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="volunteerIntroDescription1">Description Paragraph 1</Label>
                                <Textarea id="volunteerIntroDescription1" name="volunteerIntroDescription1" defaultValue={settings.volunteerIntro?.description1} rows={3} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="volunteerIntroDescription2">Description Paragraph 2</Label>
                                <Textarea id="volunteerIntroDescription2" name="volunteerIntroDescription2" defaultValue={settings.volunteerIntro?.description2} rows={3} />
                            </div>
                        </div>
                        
                        <div className="space-y-4 rounded-md border p-4">
                            <h4 className="font-semibold">Homepage: Content Sections</h4>
                             <div className="space-y-2">
                                <Label htmlFor="missionTitle">Mission Title</Label>
                                <Input id="missionTitle" name="missionTitle" defaultValue={settings.mission.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="missionDescription">Mission Description</Label>
                                <Textarea id="missionDescription" name="missionDescription" defaultValue={settings.mission.description} rows={3} />
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label htmlFor="visionTitle">Vision Title</Label>
                                <Input id="visionTitle" name="visionTitle" defaultValue={settings.vision.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="visionDescription">Vision Description</Label>
                                <Textarea id="visionDescription" name="visionDescription" defaultValue={settings.vision.description} rows={3} />
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label htmlFor="valuesTitle">Values Title</Label>
                                <Input id="valuesTitle" name="valuesTitle" defaultValue={settings.values.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="valuesDescription">Values Description</Label>
                                <Textarea id="valuesDescription" name="valuesDescription" defaultValue={settings.values.description} rows={3} />
                            </div>
                        </div>

                        <div className="space-y-4 rounded-md border p-4">
                            <h4 className="font-semibold">Footer: Social Links</h4>
                             <div className="space-y-2">
                                <Label htmlFor="socialTwitter">Twitter URL</Label>
                                <Input id="socialTwitter" name="socialTwitter" defaultValue={settings.socialLinksTwitter} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="socialFacebook">Facebook URL</Label>
                                <Input id="socialFacebook" name="socialFacebook" defaultValue={settings.socialLinksFacebook} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="socialInstagram">Instagram URL</Label>
                                <Input id="socialInstagram" name="socialInstagram" defaultValue={settings.socialLinksInstagram} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SettingsSubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
