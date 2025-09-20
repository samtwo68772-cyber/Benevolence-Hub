/**
 * This script helps migrate data from db.json to PostgreSQL database
 * It reads the data from db.json and inserts it into the PostgreSQL database using Prisma
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface JsonDb {
  users: any[];
  projects: any[];
  volunteers: any[];
  donations: any[];
}

async function readJsonDb(): Promise<JsonDb> {
  const dbPath = path.join(process.cwd(), 'db.json');
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function migrateData() {
  try {
    console.log('Starting migration from db.json to PostgreSQL...');
    
    // Read data from db.json
    const jsonData = await readJsonDb();
    console.log('Read data from db.json successfully');
    
    // Clear existing data in PostgreSQL
    console.log('Clearing existing data in PostgreSQL...');
    await prisma.donation.deleteMany();
    await prisma.volunteer.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data in PostgreSQL');
    
    // Migrate projects
    console.log('Migrating projects...');
    for (const project of jsonData.projects) {
      await prisma.project.create({
        data: {
          id: project.id,
          title: project.title,
          description: project.description,
          imageId: project.imageId,
          details: project.details,
          status: project.status,
          startDate: new Date(project.startDate),
          peopleHelped: project.peopleHelped,
          category: project.category,
        },
      });
    }
    console.log(`Migrated ${jsonData.projects.length} projects`);
    
    // Migrate users
    console.log('Migrating users...');
    for (const user of jsonData.users) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password, // Password is already hashed in db.json
          role: user.role,
          joinDate: new Date(user.joinDate),
        },
      });
    }
    console.log(`Migrated ${jsonData.users.length} users`);
    
    // Migrate volunteers
    console.log('Migrating volunteers...');
    for (const volunteer of jsonData.volunteers) {
      await prisma.volunteer.create({
        data: {
          id: volunteer.id,
          name: volunteer.name,
          email: volunteer.email,
          phone: volunteer.phone,
          signupDate: new Date(volunteer.signupDate),
          skills: volunteer.skills,
          interests: volunteer.interests,
          availability: volunteer.availability,
          status: volunteer.status,
        },
      });
    }
    console.log(`Migrated ${jsonData.volunteers.length} volunteers`);
    
    // Migrate donations
    console.log('Migrating donations...');
    for (const donation of jsonData.donations) {
      await prisma.donation.create({
        data: {
          id: donation.id,
          donorName: donation.donorName,
          email: donation.email,
          amount: donation.amount,
          date: new Date(donation.date),
          type: donation.type,
          projectId: donation.projectId,
        },
      });
    }
    console.log(`Migrated ${jsonData.donations.length} donations`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();