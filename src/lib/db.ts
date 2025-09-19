
import path from 'path';
import fs from 'fs/promises';
import { User, Project, Volunteer, Donation, ProjectStatus, ProjectCategory, DonationType } from './types';

interface Db {
  users: User[];
  projects: Project[];
  volunteers: Volunteer[];
  donations: Donation[];
}

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb(): Promise<Db> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(data);
    // Convert date strings back to Date objects
    db.users.forEach((user: User) => user.joinDate = new Date(user.joinDate));
    db.projects.forEach((project: Project) => project.startDate = new Date(project.startDate));
    db.volunteers.forEach((volunteer: Volunteer) => volunteer.signupDate = new Date(volunteer.signupDate));
    db.donations.forEach((donation: Donation) => donation.date = new Date(donation.date));
    return db;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // If the file doesn't exist, return an empty structure.
      return { users: [], projects: [], volunteers: [], donations: [] };
    }
    throw error;
  }
}

async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export const db = {
  user: {
    findMany: async ({ where, orderBy, skip, take }: { where?: { role?: 'ADMIN' }, orderBy?: { joinDate: 'desc' }, skip?: number, take?: number } = {}) => {
      const data = await readDb();
      let users = data.users;
      if (where?.role) {
        users = users.filter(u => u.role === where.role);
      }
      if (orderBy?.joinDate === 'desc') {
        users.sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime());
      }
      if (skip !== undefined && take !== undefined) {
        return users.slice(skip, skip + take);
      }
      return users;
    },
    findUnique: async ({ where }: { where: { email?: string, id?: string } }) => {
      const data = await readDb();
      if (where.email) {
        return data.users.find(u => u.email === where.email) || null;
      }
      if (where.id) {
        return data.users.find(u => u.id === where.id) || null;
      }
      return null;
    },
    create: async ({ data }: { data: Omit<User, 'id' | 'joinDate'> & {id?: string, joinDate?: Date} }) => {
        const db = await readDb();
        const newUser: User = {
            id: data.id || `ADM-${Date.now()}`,
            joinDate: data.joinDate || new Date(),
            ...data
        };
        db.users.push(newUser);
        await writeDb(db);
        return newUser;
    },
    update: async ({ where, data }: { where: { id: string }, data: Partial<Omit<User, 'id'>> }) => {
        const db = await readDb();
        const userIndex = db.users.findIndex(u => u.id === where.id);
        if (userIndex === -1) throw new Error('User not found');
        db.users[userIndex] = { ...db.users[userIndex], ...data };
        await writeDb(db);
        return db.users[userIndex];
    },
    delete: async ({ where }: { where: { id: string } }) => {
        const db = await readDb();
        const initialLength = db.users.length;
        db.users = db.users.filter(u => u.id !== where.id);
        if (db.users.length === initialLength) throw new Error('User not found');
        await writeDb(db);
    },
    count: async({ where }: { where?: { role?: 'ADMIN' } } = {}) => {
        const data = await readDb();
        let users = data.users;
        if (where?.role) {
            users = users.filter(u => u.role === where.role);
        }
        return users.length;
    }
  },
  project: {
    findMany: async ({ where, orderBy, take, skip }: { where?: { status?: ProjectStatus, category?: ProjectCategory }, orderBy?: { startDate: 'desc' }, take?: number, skip?: number } = {}) => {
        const data = await readDb();
        let projects = data.projects;
        if (where?.status) {
            projects = projects.filter(p => p.status === where.status);
        }
        if (where?.category) {
            projects = projects.filter(p => p.category === where.category);
        }
        if (orderBy?.startDate === 'desc') {
            projects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        }
        if (skip !== undefined && take !== undefined) {
            return projects.slice(skip, skip + take);
        }
        if(take) {
            return projects.slice(0, take);
        }
        return projects;
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
        const data = await readDb();
        return data.projects.find(p => p.id === where.id) || null;
    },
    create: async ({ data }: { data: Omit<Project, 'id'> & {id?: string} }) => {
        const db = await readDb();
        const newProject: Project = {
            id: data.id || `PROJ-${Date.now()}`,
            ...data
        };
        db.projects.push(newProject);
        await writeDb(db);
        return newProject;
    },
    update: async ({ where, data }: { where: { id: string }, data: Partial<Omit<Project, 'id'>> }) => {
        const db = await readDb();
        const projectIndex = db.projects.findIndex(p => p.id === where.id);
        if (projectIndex === -1) throw new Error('Project not found');
        db.projects[projectIndex] = { ...db.projects[projectIndex], ...data };
        await writeDb(db);
        return db.projects[projectIndex];
    },
    delete: async ({ where }: { where: { id: string } }) => {
        const db = await readDb();
        db.projects = db.projects.filter(p => p.id !== where.id);
        await writeDb(db);
    },
    count: async({ where }: { where?: { status?: ProjectStatus, category?: ProjectCategory } } = {}) => {
        const data = await readDb();
        let projects = data.projects;
         if (where?.status) {
            projects = projects.filter(p => p.status === where.status);
        }
        if (where?.category) {
            projects = projects.filter(p => p.category === where.category);
        }
        return projects.length;
    }
  },
  volunteer: {
    findMany: async ({orderBy, skip, take}: {orderBy?: {signupDate: 'desc'}, skip?: number, take?: number} = {}) => {
        const data = await readDb();
        let volunteers = data.volunteers;
         if (orderBy?.signupDate === 'desc') {
            volunteers.sort((a, b) => new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime());
        }
        if (skip !== undefined && take !== undefined) {
            return volunteers.slice(skip, skip + take);
        }
        return volunteers;
    },
    create: async ({ data }: { data: Omit<Volunteer, 'id' | 'status' | 'signupDate'> & {id?: string, status?: 'Pending' | 'Approved' | 'Rejected', signupDate?: Date} }) => {
        const db = await readDb();
        const newVolunteer: Volunteer = {
            id: data.id || `VOL-${Date.now()}`,
            status: data.status || 'Pending',
            signupDate: data.signupDate || new Date(),
            ...data
        };
        db.volunteers.push(newVolunteer);
        await writeDb(db);
        return newVolunteer;
    },
    update: async ({ where, data }: { where: { id: string }, data: Partial<Omit<Volunteer, 'id'>> }) => {
        const db = await readDb();
        const volunteerIndex = db.volunteers.findIndex(v => v.id === where.id);
        if (volunteerIndex === -1) throw new Error('Volunteer not found');
        db.volunteers[volunteerIndex] = { ...db.volunteers[volunteerIndex], ...data };
        await writeDb(db);
        return db.volunteers[volunteerIndex];
    },
    delete: async ({ where }: { where: { id: string } }) => {
        const db = await readDb();
        db.volunteers = db.volunteers.filter(v => v.id !== where.id);
        await writeDb(db);
    },
     count: async({ where }: { where?: { status?: VolunteerStatus, interests?: { has: string } } } = {}) => {
        const data = await readDb();
        let volunteers = data.volunteers;
        if (where?.status) {
            volunteers = volunteers.filter(v => v.status === where.status);
        }
        if (where?.interests?.has) {
            volunteers = volunteers.filter(v => v.interests.includes(where.interests!.has));
        }
        return volunteers.length;
    }
  },
  donation: {
    findMany: async ({ where, include, orderBy, skip, take }: { where?: { type?: DonationType, project?: { title?: string } }, include?: { project?: boolean }, orderBy?: { date: 'desc' }, skip?: number, take?: number } = {}) => {
        const data = await readDb();
        let donations = data.donations.map(d => ({
            ...d,
            project: data.projects.find(p => p.id === d.projectId) || null
        }));

        if (where?.type) {
            donations = donations.filter(d => d.type === where.type);
        }
        if (where?.project?.title) {
            if (where.project.title === 'General Fund') {
                donations = donations.filter(d => d.projectId === null);
            } else {
                donations = donations.filter(d => d.project?.title === where.project.title);
            }
        }
        if (orderBy?.date === 'desc') {
            donations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        if (skip !== undefined && take !== undefined) {
            donations = donations.slice(skip, skip + take);
        }

        if (!include?.project) {
            return donations.map(({ project, ...d }) => d);
        }

        return donations;
    },
    create: async ({ data }: { data: Omit<Donation, 'id' | 'date'> & {id?: string, date?: Date} }) => {
        const db = await readDb();
        const newDonation: Donation = {
            id: data.id || `DON-${Date.now()}`,
            date: data.date || new Date(),
            ...data
        };
        db.donations.push(newDonation);
        await writeDb(db);
        return newDonation;
    },
    aggregate: async({_sum}: {_sum: {amount: boolean}}) => {
        const data = await readDb();
        if (_sum.amount) {
            const total = data.donations.reduce((sum, d) => sum + d.amount, 0);
            return { _sum: { amount: total } };
        }
        return { _sum: { amount: 0 } };
    },
    count: async({ where }: { where?: { type?: DonationType, project?: { title?: string } } } = {}) => {
        const data = await readDb();
        let donations = data.donations;

        if (where?.type) {
            donations = donations.filter(d => d.type === where.type);
        }
        if (where?.project?.title) {
            if (where.project.title === 'General Fund') {
                donations = donations.filter(d => d.projectId === null);
            } else {
                const project = data.projects.find(p => p.title === where.project?.title);
                if (project) {
                    donations = donations.filter(d => d.projectId === project.id);
                } else {
                    donations = [];
                }
            }
        }
        return donations.length;
    }
  }
};

    