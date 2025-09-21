
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateSettings as dbUpdateSettings } from '@/lib/db';
import { Settings } from '@/lib/types';

async function fileToDataURI(file: File) {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${file.type};base64,${base64}`;
}

export async function updateSiteSettings(formData: FormData) {
    const appName = formData.get('appName') as string;
    const logoFile = formData.get('logo') as File;
    const volunteerIcon = formData.get('volunteerIcon') as string;
    
    const heroTitle = formData.get('heroTitle') as string;
    const heroDescription = formData.get('heroDescription') as string;
    
    const missionIntroTitle = formData.get('missionIntroTitle') as string;
    const missionIntroDescription = formData.get('missionIntroDescription') as string;
    const missionImageFile = formData.get('missionImage') as File;
    const missionTitle = formData.get('missionTitle') as string;
    const missionDescription = formData.get('missionDescription') as string;
    const visionTitle = formData.get('visionTitle') as string;
    const visionDescription = formData.get('visionDescription') as string;
    const valuesTitle = formData.get('valuesTitle') as string;
    const valuesDescription = formData.get('valuesDescription') as string;
    const volunteerIntroTitle = formData.get('volunteerIntroTitle') as string;
    const volunteerIntroDescription1 = formData.get('volunteerIntroDescription1') as string;
    const volunteerIntroDescription2 = formData.get('volunteerIntroDescription2') as string;

    const socialTwitter = formData.get('socialTwitter') as string;
    const socialFacebook = formData.get('socialFacebook') as string;
    const socialInstagram = formData.get('socialInstagram') as string;

    const validatedAppName = z.string().min(2).safeParse(appName);
    if(!validatedAppName.success) {
        throw new Error("App name must be at least 2 characters.");
    }

    let logoData: string | undefined;
    let logoType: 'icon' | 'image' = 'icon';

    if (logoFile && logoFile.size > 0) {
        if (logoFile.size > 1024 * 1024) { // 1MB limit
            throw new Error("Logo image must be less than 1MB.");
        }
        logoData = await fileToDataURI(logoFile);
        logoType = 'image';
    }

    let missionImageData: string | undefined;
    if (missionImageFile && missionImageFile.size > 0) {
        if (missionImageFile.size > 1024 * 1024) { // 1MB limit
            throw new Error("Mission image must be less than 1MB.");
        }
        missionImageData = await fileToDataURI(missionImageFile);
    }
    
    const heroImagesString = formData.get('heroImages') as string;
    const heroImages = heroImagesString ? heroImagesString.split(',').map(s => s.trim()) : [];


    const newSettings: Partial<Omit<Settings, 'id' | 'socialLinks' | 'hero' | 'missionIntro' | 'mission' | 'vision' | 'values' | 'volunteerIntro'>> = {
        appName: validatedAppName.data,
        heroTitle,
        heroDescription,
        heroImages,
        missionIntroTitle,
        missionIntroDescription,
        missionTitle,
        missionDescription,
        visionTitle,
        visionDescription,
        valuesTitle,
        valuesDescription,
        volunteerIntroTitle,
        volunteerIntroDescription1,
        volunteerIntroDescription2,
        socialLinksTwitter: socialTwitter,
        socialLinksFacebook: socialFacebook,
        socialLinksInstagram: socialInstagram,
    };

    if (logoData) {
        newSettings.logo = logoData;
        newSettings.logoType = logoType;
    }

    if (missionImageData) {
        newSettings.missionImage = missionImageData;
    }
    
    if (volunteerIcon) {
        newSettings.volunteerIcon = volunteerIcon;
    }

    await dbUpdateSettings(newSettings as any);

    revalidatePath('/admin/site-settings');
    revalidatePath('/');
    return { message: 'Site settings updated successfully.' };
}
