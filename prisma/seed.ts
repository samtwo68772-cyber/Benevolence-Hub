// This file is not used when using db.json
// To switch to Prisma, you would uncomment this file
// and update all the data access files to use prisma instead of db.
/*
import { PrismaClient, ProjectCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const dbPath = path.join(process.cwd(), 'db.json');
  const data = await fs.readFile(dbPath, 'utf-8');
  const db = JSON.parse(data);
  const { projects, volunteers, donations, users } = db;

  // Clear existing data
  await prisma.donation.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing data.');

  // Seed Projects
  const createdProjects = await Promise.all(
    projects.map(async (project: any) => {
      const created = await prisma.project.create({
        data: {
          id: project.id,
          title: project.title,
          description: project.description,
          imageId: project.imageId,
          details: project.details,
          status: project.status,
          startDate: new Date(project.startDate),
          peopleHelped: project.peopleHelped,
          category: project.category.replace(' ', '_') as ProjectCategory,
        },
      });
      return created;
    })
  );
  console.log(`Seeded ${createdProjects.length} projects.`);

  // Seed Admins as Users
  const createdUsers = await Promise.all(
    users.map(async (admin: any) => {
      const hashedPassword = await bcrypt.hash(admin.password.startsWith('$2a$') ? 'password123' : admin.password, 10);
      const user = await prisma.user.create({
        data: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
          role: 'ADMIN',
          joinDate: new Date(admin.joinDate),
        },
      });
      return user;
    })
  );
  console.log(`Seeded ${createdUsers.length} users (admins).`);

  // Seed Volunteers
  await prisma.volunteer.createMany({
    data: volunteers.map((v: any) => ({
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        signupDate: new Date(v.signupDate),
        skills: v.skills,
        interests: v.interests,
        availability: v.availability,
        status: v.status,
    })),
  });
  console.log(`Seeded ${volunteers.length} volunteers.`);
  
  // Seed Donations
  await prisma.donation.createMany({
    data: donations.map((d: any) => ({
        id: d.id,
        donorName: d.donorName,
        email: d.email,
        amount: d.amount,
        date: new Date(d.date),
        type: d.type,
        projectId: d.projectId,
    })),
  });
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
*/
