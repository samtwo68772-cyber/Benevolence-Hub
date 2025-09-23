
'use server';

import prisma from './prisma';
import { Project, Volunteer, Donation, User, Settings, Category, SocialLink } from './types';
import { defaultSettings } from './default-settings';

// Categories
export async function getCategories(): Promise<Category[]> {
    return await prisma.category.findMany();
}

export async function createCategory(name: string): Promise<Category> {
    return await prisma.category.create({
        data: { name }
    });
}

export async function updateCategory(id: string, name: string): Promise<Category> {
    return await prisma.category.update({
        where: { id },
        data: { name },
    });
}

export async function deleteCategory(id: string): Promise<void> {
    await prisma.project.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
    });
    await prisma.donation.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
    });
    await prisma.category.delete({ where: { id } });
}

// Projects
export async function getProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({ include: { category: true } });
    return projects.map(p => ({ 
        ...p, 
        category: p.category?.name || 'Uncategorized',
        details: Array.isArray(p.details) ? p.details : [],
    }));
}

export async function getProjectById(id: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({ where: { id }, include: { category: true } });
    if (!project) return null;
    return { 
        ...project, 
        category: project.category?.name || 'Uncategorized',
        details: Array.isArray(project.details) ? project.details : [],
    };
}

export async function createProject(project: Omit<Project, 'id' | 'peopleHelped' | 'category'> & { category: string, imageUrl?: string }) {
    return await prisma.project.create({
        data: {
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            details: project.details,
            status: project.status,
            startDate: project.startDate,
            peopleHelped: 0,
            category: {
                connectOrCreate: {
                    where: { name: project.category },
                    create: { name: project.category }
                }
            }
        }
    });
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'category'>> & { category?: string, imageUrl?: string }) {
    const { category, ...projectData } = data;
    
    return await prisma.project.update({
        where: { id },
        data: {
            ...projectData,
            ...(category && {
                category: {
                    connectOrCreate: {
                        where: { name: category },
                        create: { name: category }
                    }
                }
            })
        },
    });
}

export async function deleteProject(id: string): Promise<void> {
    await prisma.donation.updateMany({
        where: { projectId: id },
        data: { projectId: null }
    });
    await prisma.project.delete({ where: { id } });
}

// Volunteers
export async function getVolunteers(): Promise<Volunteer[]> {
    const volunteers = await prisma.volunteer.findMany();
    return volunteers.map(v => ({
        ...v,
        interests: Array.isArray(v.interests) ? v.interests : [],
        availability: Array.isArray(v.availability) ? v.availability : [],
    }))
}

export async function getVolunteerByEmail(email: string): Promise<Volunteer | null> {
    return await prisma.volunteer.findUnique({ where: { email } });
}

export async function getVolunteerByPhone(phone: string): Promise<Volunteer | null> {
    return await prisma.volunteer.findFirst({ where: { phone } });
}


export async function createVolunteer(volunteer: Omit<Volunteer, 'id' | 'status' | 'signupDate'>) {
    const existingByEmail = await getVolunteerByEmail(volunteer.email);
    if (existingByEmail) {
        throw new Error('A volunteer with this email already exists.');
    }

    if (volunteer.phone) {
        const existingByPhone = await getVolunteerByPhone(volunteer.phone);
        if (existingByPhone) {
            throw new Error('A volunteer with this phone number already exists.');
        }
    }

    return await prisma.volunteer.create({
        data: {
            ...volunteer,
            status: 'Pending',
            signupDate: new Date(),
        }
    });
}


export async function updateVolunteer(id: string, data: Partial<Omit<Volunteer, 'id'>>) {
    return await prisma.volunteer.update({
        where: { id },
        data: data,
    });
}

export async function deleteVolunteer(id: string): Promise<void> {
    await prisma.volunteer.delete({ where: { id } });
}

// Users
export async function getUsers(): Promise<User[]> {
    return (await prisma.user.findMany()).map(u => ({ ...u, password: u.password || undefined }));
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return { ...user, password: user.password || undefined };
}

export async function getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return { ...user, password: user.password || undefined };
}

export async function createUser(user: Omit<User, 'id' | 'joinDate' | 'role'>) {
    return await prisma.user.create({
        data: {
            ...user,
            role: 'ADMIN',
        }
    });
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>) {
    return await prisma.user.update({
        where: { id },
        data,
    });
}

export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
}
  
// Donations
export async function getDonations(): Promise<Donation[]> {
  const donations = await prisma.donation.findMany({ include: { project: true, category: true } });
  return donations.map(d => ({
    ...d,
    amount: typeof d.amount === 'number' ? d.amount : d.amount,
    project: d.project ? { ...d.project, details: [], category: d.project.category?.name || 'Uncategorized' } : null,
  }));
}

export async function createDonation(donation: Omit<Donation, 'id' | 'date'>) {
    const { projectId, categoryId, ...donationData } = donation;

    return await prisma.donation.create({
        data: {
            ...donationData,
            ...(projectId && { project: { connect: { id: projectId } } }),
            ...(categoryId && { category: { connect: { id: categoryId } } }),
        }
    });
}

// Settings
export async function getSettings(): Promise<Settings> {
    const dbSettings = await prisma.settings.findFirst();
    
    if (!dbSettings) {
        return defaultSettings;
    }

    return {
        id: dbSettings.id,
        appName: dbSettings.appName || defaultSettings.appName,
        logo: dbSettings.logo || defaultSettings.logo,
        logoType: (dbSettings.logoType as 'icon' | 'image') || defaultSettings.logoType,
        volunteerIcon: dbSettings.volunteerIcon || defaultSettings.volunteerIcon,
        heroTitle: dbSettings.heroTitle || defaultSettings.heroTitle,
        heroDescription: dbSettings.heroDescription || defaultSettings.heroDescription,
        heroImage: dbSettings.heroImage,
        missionIntroTitle: dbSettings.missionIntroTitle || defaultSettings.missionIntroTitle,
        missionIntroDescription: dbSettings.missionIntroDescription || defaultSettings.missionIntroDescription,
        missionImage: dbSettings.missionImage,
        missionTitle: dbSettings.missionTitle || defaultSettings.missionTitle,
        missionDescription: dbSettings.missionDescription || defaultSettings.missionDescription,
        visionTitle: dbSettings.visionTitle || defaultSettings.visionTitle,
        visionDescription: dbSettings.visionDescription || defaultSettings.visionDescription,
        valuesTitle: dbSettings.valuesTitle || defaultSettings.valuesTitle,
        valuesDescription: dbSettings.valuesDescription || defaultSettings.valuesDescription,
        volunteerIntroTitle: dbSettings.volunteerIntroTitle || defaultSettings.volunteerIntroTitle,
        volunteerIntroDescription1: dbSettings.volunteerIntroDescription1 || defaultSettings.volunteerIntroDescription1,
        volunteerIntroDescription2: dbSettings.volunteerIntroDescription2 || defaultSettings.volunteerIntroDescription2,
        socialLinks: [
            { icon: 'Twitter', href: dbSettings.socialLinksTwitter || '#' },
            { icon: 'Facebook', href: dbSettings.socialLinksFacebook || '#' },
            { icon: 'Instagram', href: dbSettings.socialLinksInstagram || '#' },
        ] as SocialLink[],
    };
}


export async function updateSettings(settings: Partial<Settings>) {
    const currentSettings = await prisma.settings.findFirst();

    if (currentSettings) {
        return await prisma.settings.update({
            where: { id: currentSettings.id },
            data: {
                appName: settings.appName,
                logo: settings.logo,
                logoType: settings.logoType,
                volunteerIcon: settings.volunteerIcon,
                heroTitle: settings.heroTitle,
                heroDescription: settings.heroDescription,
                missionIntroTitle: settings.missionIntroTitle,
                missionIntroDescription: settings.missionIntroDescription,
                missionImage: settings.missionImage,
                missionTitle: settings.missionTitle,
                missionDescription: settings.missionDescription,
                visionTitle: settings.visionTitle,
                visionDescription: settings.visionDescription,
                valuesTitle: settings.valuesTitle,
                valuesDescription: settings.valuesDescription,
                volunteerIntroTitle: settings.volunteerIntroTitle,
                volunteerIntroDescription1: settings.volunteerIntroDescription1,
                volunteerIntroDescription2: settings.volunteerIntroDescription2,
                socialLinksTwitter: settings.socialLinks?.find(s => s.icon === 'Twitter')?.href,
                socialLinksFacebook: settings.socialLinks?.find(s => s.icon === 'Facebook')?.href,
                socialLinksInstagram: settings.socialLinks?.find(s => s.icon === 'Instagram')?.href,
            }
        });
    } else {
        return await prisma.settings.create({
            data: {
                appName: settings.appName!,
                logo: settings.logo,
                logoType: settings.logoType,
                volunteerIcon: settings.volunteerIcon,
                heroTitle: settings.heroTitle,
                heroDescription: settings.heroDescription,
                missionIntroTitle: settings.missionIntroTitle,
                missionIntroDescription: settings.missionIntroDescription,
                missionImage: settings.missionImage,
                missionTitle: settings.missionTitle,
                missionDescription: settings.missionDescription,
                visionTitle: settings.visionTitle,
                visionDescription: settings.visionDescription,
                valuesTitle: settings.valuesTitle,
                valuesDescription: settings.valuesDescription,
                volunteerIntroTitle: settings.volunteerIntroTitle,
                volunteerIntroDescription1: settings.volunteerIntroDescription1,
                volunteerIntroDescription2: settings.volunteerIntroDescription2,
                socialLinksTwitter: settings.socialLinks?.find(s => s.icon === 'Twitter')?.href,
                socialLinksFacebook: settings.socialLinks?.find(s => s.icon === 'Facebook')?.href,
                socialLinksInstagram: settings.socialLinks?.find(s => s.icon === 'Instagram')?.href,
            }
        });
    }
}
