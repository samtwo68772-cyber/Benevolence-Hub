/**
 * This is an example showing how to convert a server action from using db.json to using Prisma
 * 
 * ORIGINAL VERSION (using db.json):
 */

// Original imports
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Original function using db.json
export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageId = formData.get('imageId') as string;
  const details = formData.get('details') as string;
  const category = formData.get('category') as string;
  
  await db.project.create({
    title,
    description,
    imageId,
    details,
    status: 'active',
    startDate: new Date(),
    peopleHelped: 0,
    category,
  });
  
  revalidatePath('/admin/projects');
}

/**
 * CONVERTED VERSION (using Prisma):
 */

// Updated imports
// import { db } from '@/lib/db'; // Comment out or remove this line
import { prisma } from '@/lib/prisma'; // Uncomment this line
import { revalidatePath } from 'next/cache';

// Converted function using Prisma
export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const imageId = formData.get('imageId') as string;
  const details = formData.get('details') as string;
  const category = formData.get('category') as string;
  
  // Replace db.project.create with prisma.project.create
  await prisma.project.create({
    data: { // Note: Prisma requires a 'data' property
      title,
      description,
      imageId,
      details,
      status: 'active',
      startDate: new Date(),
      peopleHelped: 0,
      category,
    }
  });
  
  revalidatePath('/admin/projects');
}

/**
 * Key differences:
 * 1. Import prisma from @/lib/prisma instead of db from @/lib/db
 * 2. Use prisma.project.create instead of db.project.create
 * 3. Wrap the data in a 'data' property for Prisma
 * 4. The rest of the function remains the same
 */