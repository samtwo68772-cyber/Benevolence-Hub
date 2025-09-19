
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.donation.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing data.');
  
  const dbPath = path.join(process.cwd(), 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const { projects, volunteers, donations, users: admins } = dbData;

  // Seed Projects
  for (const project of projects) {
    await prisma.project.create({
      data: {
        ...project,
        startDate: new Date(project.startDate),
      },
    });
  }
  console.log(`Seeded ${projects.length} projects.`);

  // Seed Admins as Users
  for (const admin of admins) {
    await prisma.user.create({
      data: {
        ...admin,
        joinDate: new Date(admin.joinDate),
      },
    });
  }
  console.log(`Seeded ${admins.length} users (admins).`);

  // Seed Volunteers
  for (const volunteer of volunteers) {
    await prisma.volunteer.create({
      data: {
        ...volunteer,
        signupDate: new Date(volunteer.signupDate),
      },
    });
  }
  console.log(`Seeded ${volunteers.length} volunteers.`);
  
  // Seed Donations
  for (const donation of donations) {
     await prisma.donation.create({
      data: {
        ...donation,
        date: new Date(donation.date),
      },
    });
  }
  console.log(`Seeded ${donations.length} donations.`);


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
