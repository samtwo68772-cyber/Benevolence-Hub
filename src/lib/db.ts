
'use server';

import prisma from './prisma';
import { Project, Volunteer, Donation, User, Settings, Category, SocialLink } from './types';

// We are now using Prisma, so we don't need to read/write from a JSON file.
// The functions below are updated to use Prisma Client.

const defaultSettings: Settings = {
    appName: 'Benevolence Hub',
    logo: 'HandHeart',
    logoType: 'icon',
    volunteerIcon: 'HeartHandshake',
    hero: {
        title: "Compassion in Action",
        description: "Join Benevolence Hub in our mission to bring hope and support to communities in need through impactful humanitarian projects."
    },
    heroImages: [],
    missionIntro: {
        title: "Empowering Change, One Life at a Time",
        description: "At Benevolence Hub, we believe in the power of collective action to create a better world. Our work is driven by a deep commitment to humanity and a vision for a more equitable future."
    },
    mission: {
        title: "Our Mission",
        description: "To provide immediate relief and long-term solutions to communities affected by poverty and disaster, fostering resilience and self-sufficiency."
    },
    vision: {
        title: "Our Vision",
        description: "A world where every individual has the opportunity to live a life of dignity, health, and well-being, free from hardship."
    },
    values: {
        title: "Our Values",
        description: "We operate with compassion, integrity, and transparency, ensuring that every contribution makes a tangible and lasting impact."
    },
    volunteerIntro: {
        title: "Become a Volunteer",
        description1: "Your time and skills are invaluable. Join our team of dedicated volunteers and make a direct impact on the ground. Together, we can build stronger communities.",
        description2: "Whether you have 
experience in healthcare, education, construction, or administration, there's a place for you at Benevolence Hub. Fill out the form to get started."
    },
     socialLinks: [
        { icon: 'Twitter', href: '#' },
        { icon: 'Facebook', href: '#' },
        { icon: 'Instagram', href: '#' }
    ]
};

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
        details: p.details ? (p.details as string).split('\n') : [],
        category: p.category?.name || 'Uncategorized' 
    }));
}

export async function getProjectById(id: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({ where: { id }, include: { category: true } });
    if (!project) return null;
    return { 
        ...project, 
        details: project.details ? (project.details as string).split('\n') : [],
        category: project.category?.name || 'Uncategorized' 
    };
}

export async function createProject(project: Omit<Project, 'id' | 'peopleHelped' | 'category'> & { category: string, imageUrl?: string }) {
    return await prisma.project.create({
        data: {
            title: project.title,
            description: project.description,
            imageUrl: project.imageUrl,
            details: project.details.join('\n'),
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
    const { category, details, ...projectData } = data;
    return await prisma.project.update({
        where: { id },
        data: {
            ...projectData,
            ...(details && { details: (details as string[]).join('\n') }),
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
        interests: v.interests ? (v.interests as string).split(',') : [],
        availability: v.availability ? (v.availability as string).split(',') : [] 
    }));
}

export async function createVolunteer(volunteer: Omit<Volunteer, 'id' | 'status' | 'signupDate'>) {
    return await prisma.volunteer.create({
        data: {
            ...volunteer,
            interests: volunteer.interests.join(','),
            availability: volunteer.availability.join(','),
            status: 'Pending',
        }
    });
}

export async function updateVolunteer(id: string, data: Partial<Omit<Volunteer, 'id'>>) {
    const updateData: any = { ...data };
    if (data.interests) {
        updateData.interests = data.interests.join(',');
    }
    if (data.availability) {
        updateData.availability = data.availability.join(',');
    }
    return await prisma.volunteer.update({
        where: { id },
        data: updateData,
    });
}

export async function deleteVolunteer(id: string): Promise<void> {
    await prisma.volunteer.delete({ where: { id } });
}

// Donations
export async function getDonations(): Promise<Donation[]> {
    return await prisma.donation.findMany({ include: { project: true } });
}

export async function createDonation(donation: Omit<Donation, 'id' | 'date'>) {
    return await prisma.donation.create({
        data: {
            donorName: donation.donorName,
            email: donation.email,
            amount: donation.amount,
            type: donation.type,
            ...(donation.projectId && { project: { connect: { id: donation.projectId } } }),
            ...(donation.categoryId && { category: { connect: { id: donation.categoryId }}})
        }
    });
}

// Users
export async function getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
}

export async function getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
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
  
// Settings
export async function getSettings(): Promise<Settings> {
    const dbSettings = await prisma.settings.findFirst();
    if (!dbSettings) return defaultSettings;

    return {
        id: dbSettings.id,
        appName: dbSettings.appName || defaultSettings.appName,
        logo: dbSettings.logo || defaultSettings.logo,
        logoType: (dbSettings.logoType as 'icon' | 'image') || defaultSettings.logoType,
        volunteerIcon: dbSettings.volunteerIcon || defaultSettings.volunteerIcon,
        hero: {
            title: dbSettings.heroTitle || defaultSettings.hero.title,
            description: dbSettings.heroDescription || defaultSettings.hero.description,
        },
        heroImages: dbSettings.heroImages ? (dbSettings.heroImages as string).split(',') : defaultSettings.heroImages,
        missionIntro: {
            title: dbSettings.missionIntroTitle || defaultSettings.missionIntro.title,
            description: dbSettings.missionIntroDescription || defaultSettings.missionIntro.description,
        },
        missionImage: dbSettings.missionImage,
        mission: {
            title: dbSettings.missionTitle || defaultSettings.mission.title,
            description: dbSettings.missionDescription || defaultSettings.mission.description,
        },
        vision: {
            title: dbSettings.visionTitle || defaultSettings.vision.title,
            description: dbSettings.visionDescription || defaultSettings.vision.description,
        },
        values: {
            title: dbSettings.valuesTitle || defaultSettings.values.title,
            description: dbSettings.valuesDescription || defaultSettings.values.description,
        },
        volunteerIntro: {
            title: dbSettings.volunteerIntroTitle || defaultSettings.volunteerIntro.title,
            description1: dbSettings.volunteerIntroDescription1 || defaultSettings.volunteerIntro.description1,
            description2: dbSettings.volunteerIntroDescription2 || defaultSettings.volunteerIntro.description2,
        },
        socialLinks: [
            { icon: 'Twitter', href: dbSettings.socialLinksTwitter || '#' },
            { icon: 'Facebook', href: dbSettings.socialLinksFacebook || '#' },
            { icon: 'Instagram', href: dbSettings.socialLinksInstagram || '#' },
        ] as SocialLink[],
    };
}

export async function updateSettings(settings: Partial<Omit<Settings, 'id' | 'socialLinks' | 'hero' | 'missionIntro' | 'mission' | 'vision' | 'values' | 'volunteerIntro'>>) {
    const currentSettings = await prisma.settings.findFirst();
    const { heroImages, ...restOfSettings } = settings;

    const dataToUpdate: any = {
        ...restOfSettings,
        ...(heroImages && { heroImages: heroImages.join(',') }),
    };
    
    if (currentSettings) {
        return await prisma.settings.update({
            where: { id: currentSettings.id },
            data: dataToUpdate,
        });
    } else {
        return await prisma.settings.create({
            data: dataToUpdate,
        });
    }
}
