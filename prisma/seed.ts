
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...');
  
  const dbPath = path.join(process.cwd(), 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Seed Users
  const hashedPassword = await bcrypt.hash('password', 10);
  for (const user of dbData.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        joinDate: new Date(user.joinDate),
      },
    })
  }

  // Seed Categories
  const allProjectCategories = [...new Set(dbData.projects.map((p: any) => p.category))];
  const allInterestCategories = [...new Set(dbData.volunteers.flatMap((v: any) => v.interests))];
  const allDonationCategories = [...new Set(dbData.donations.map((d: any) => d.categoryId).filter(Boolean))];
  
  const uniqueCategoryNames = [...new Set([...allProjectCategories, ...allInterestCategories, ...allDonationCategories])];

  for (const name of uniqueCategoryNames) {
    if (typeof name === 'string' && name.trim() !== '') {
        const existingCategory = await prisma.category.findUnique({ where: { name: name } });
        if (!existingCategory) {
            await prisma.category.create({
                data: { name: name }
            });
        }
    }
  }

  // Seed Projects
  for (const project of dbData.projects) {
    const category = await prisma.category.findUnique({ where: { name: project.category } });
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: {
        id: project.id,
        title: project.title,
        description: project.description,
        imageUrl: project.imageId ? `https://picsum.photos/seed/${project.imageId}/600/400` : null,
        details: project.details,
        status: project.status,
        startDate: new Date(project.startDate),
        peopleHelped: project.peopleHelped,
        ...(category && { categoryId: category.id }),
      },
    })
  }
  
  // Seed Volunteers - ensuring unique emails and phone numbers
  const uniqueVolunteers = dbData.volunteers.reduce((acc: any[], current: any) => {
    if (!acc.find((item) => item.email === current.email || item.phone === current.phone)) {
      acc.push(current);
    }
    return acc;
  }, []);

  for (const volunteer of uniqueVolunteers) {
      if (volunteer.id && volunteer.name && volunteer.email) {
            await prisma.volunteer.upsert({
            where: { email: volunteer.email },
            update: {
                name: volunteer.name,
                phone: volunteer.phone,
                signupDate: new Date(volunteer.signupDate),
                skills: volunteer.skills,
                interests: volunteer.interests,
                availability: volunteer.availability,
                status: volunteer.status || 'Pending',
            },
            create: {
                id: volunteer.id,
                name: volunteer.name,
                email: volunteer.email,
                phone: volunteer.phone,
                signupDate: new Date(volunteer.signupDate),
                skills: volunteer.skills,
                interests: volunteer.interests,
                availability: volunteer.availability,
                status: volunteer.status || 'Pending',
            },
            });
      }
  }

  // Seed Donations
  for (const donation of dbData.donations) {
      let category = null;
      if (donation.categoryId) {
        category = await prisma.category.findUnique({ where: { name: donation.categoryId } });
      }

      await prisma.donation.upsert({
          where: { id: donation.id },
          update: {},
          create: {
              id: donation.id,
              donorName: donation.donorName || donation.name,
              email: donation.email,
              amount: donation.amount,
              date: new Date(donation.date),
              type: donation.type,
              ...(donation.projectId && { projectId: donation.projectId }),
              ...(category && { categoryId: category.id }),
          }
      })
  }

  // Seed Settings
  const settings = dbData.settings;
    const settingsData = {
    appName: settings.appName,
    logo: settings.logo,
    logoType: settings.logoType,
    volunteerIcon: settings.volunteerIcon,
    heroTitle: settings.hero?.title,
    heroDescription: settings.hero?.description,
    heroImage1: settings.heroImages?.[0],
    heroImage2: settings.heroImages?.[1],
    heroImage3: settings.heroImages?.[2],
    heroImage4: settings.heroImages?.[3],
    missionIntroTitle: settings.missionIntro?.title,
    missionIntroDescription: settings.missionIntro?.description,
    missionImage: settings.heroImage,
    missionTitle: settings.mission?.title,
    missionDescription: settings.mission?.description,
    visionTitle: settings.vision?.title,
    visionDescription: settings.vision?.description,
    valuesTitle: settings.values?.title,
    valuesDescription: settings.values?.description,
    volunteerIntroTitle: settings.volunteerIntro?.title,
    volunteerIntroDescription1: settings.volunteerIntro?.description1,
    volunteerIntroDescription2: settings.volunteerIntro?.description2,
    socialLinksTwitter: settings.socialLinks?.find((s:any) => s.icon === 'Twitter')?.href || '#',
    socialLinksFacebook: settings.socialLinks?.find((s:any) => s.icon === 'Facebook')?.href || '#',
    socialLinksInstagram: settings.socialLinks?.find((s:any) => s.icon === 'Instagram')?.href || '#',
    socialLinksYoutube: settings.socialLinks?.find((s:any) => s.icon === 'Youtube')?.href || '#',
    socialLinksTelegram: settings.socialLinks?.find((s:any) => s.icon === 'Telegram')?.href || '#',
    socialLinksWhatsApp: settings.socialLinks?.find((s:any) => s.icon === 'WhatsApp')?.href || '#',
    socialLinksEmail: settings.socialLinks?.find((s:any) => s.icon === 'Email')?.href || '#',
    socialLinksLinkedin: settings.socialLinks?.find((s:any) => s.icon === 'Linkedin')?.href || '#',
    socialLinksTikTok: settings.socialLinks?.find((s:any) => s.icon === 'TikTok')?.href || '#',
  };  const existingSettings = await prisma.settings.findFirst();
  if (existingSettings) {
      await prisma.settings.update({
          where: { id: existingSettings.id },
          data: settingsData
      });
  } else {
       await prisma.settings.create({
          data: settingsData
       });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
