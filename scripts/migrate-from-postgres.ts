/**
 * This script helps migrate data from PostgreSQL back to db.json
 * It reads the data from PostgreSQL using Prisma and writes it to db.json
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface JsonDb {
  users: any[];
  projects: any[];
  volunteers: any[];
  donations: any[];
}

async function writeJsonDb(data: JsonDb) {
  const dbPath = path.join(process.cwd(), 'db.json');
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

async function migrateData() {
  try {
    console.log('Starting migration from PostgreSQL to db.json...');
    
    // Fetch data from PostgreSQL
    console.log('Fetching data from PostgreSQL...');
    const users = await prisma.user.findMany();
    const projects = await prisma.project.findMany();
    const volunteers = await prisma.volunteer.findMany();
    const donations = await prisma.donation.findMany();
    
    // Convert dates to strings for JSON storage
    const jsonData: JsonDb = {
      users: users.map(user => ({
        ...user,
        joinDate: user.joinDate.toISOString(),
      })),
      projects: projects.map(project => ({
        ...project,
        startDate: project.startDate.toISOString(),
      })),
      volunteers: volunteers.map(volunteer => ({
        ...volunteer,
        signupDate: volunteer.signupDate.toISOString(),
      })),
      donations: donations.map(donation => ({
        ...donation,
        date: donation.date.toISOString(),
      })),
    };
    
    // Write data to db.json
    console.log('Writing data to db.json...');
    await writeJsonDb(jsonData);
    
    console.log('Migration completed successfully!');
    console.log(`Migrated ${users.length} users, ${projects.length} projects, ${volunteers.length} volunteers, and ${donations.length} donations.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();