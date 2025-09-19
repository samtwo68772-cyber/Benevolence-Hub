// This file is no longer used with db.json
// import { PrismaClient } from '@prisma/client';
// import { projects, volunteers, donations, admins } from '../src/lib/data';
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Start seeding...');

//   // Clear existing data
//   await prisma.donation.deleteMany();
//   await prisma.volunteer.deleteMany();
//   await prisma.project.deleteMany();
//   await prisma.user.deleteMany();
//   console.log('Cleared existing data.');

//   // Seed Projects
//   const createdProjects = await Promise.all(
//     projects.map(async (project) => {
//       const created = await prisma.project.create({
//         data: {
//           id: project.id,
//           title: project.title,
//           description: project.description,
//           imageId: project.imageId,
//           details: project.details,
//           status: project.status,
//           startDate: new Date(project.startDate),
//           peopleHelped: project.peopleHelped,
//           category: project.category,
//         },
//       });
//       return created;
//     })
//   );
//   const projectMap = createdProjects.reduce((map, project) => {
//     map.set(project.title, project.id);
//     return map;
//   }, new Map<string, string>());
//   console.log(`Seeded ${createdProjects.length} projects.`);

//   // Seed Admins as Users
//   const createdUsers = await Promise.all(
//     admins.map(async (admin) => {
//       const hashedPassword = await bcrypt.hash('password123', 10); // Default password
//       const user = await prisma.user.create({
//         data: {
//           id: admin.id,
//           name: admin.name,
//           email: admin.email,
//           password: hashedPassword,
//           role: 'ADMIN',
//           joinDate: new Date(admin.joinDate),
//         },
//       });
//       return user;
//     })
//   );
//   console.log(`Seeded ${createdUsers.length} users (admins).`);

//   // Seed Volunteers
//   await prisma.volunteer.createMany({
//     data: volunteers.map((v) => ({
//         id: v.id,
//         name: v.name,
//         email: v.email,
//         phone: v.phone,
//         signupDate: new Date(v.signupDate),
//         skills: v.skills,
//         interests: v.interests,
//         availability: v.availability,
//         status: v.status,
//     })),
//   });
//   console.log(`Seeded ${volunteers.length} volunteers.`);
  
//   // Seed Donations
//   const donationsToCreate = donations.map(d => {
//     const projectId = d.projectTitle === 'General Fund' ? null : projectMap.get(d.projectTitle);
//     return {
//         id: d.id,
//         donorName: d.donorName,
//         email: d.email,
//         amount: d.amount,
//         date: new Date(d.date),
//         type: d.type === 'One-time' ? 'ONE_TIME' as const : 'MONTHLY' as const,
//         projectId: projectId === undefined ? null : projectId,
//     }
//   });

//   await prisma.donation.createMany({
//     data: donationsToCreate,
//   });
//   console.log(`Seeded ${donationsToCreate.length} donations.`);


//   console.log('Seeding finished.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
