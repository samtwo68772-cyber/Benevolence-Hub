
'use server';

import fs from 'fs/promises';
import path from 'path';
import { Project, Volunteer, Donation, User, Settings } from './types';

const dbPath = path.join(process.cwd(), 'db.json');

type DbData = {
  projects: Project[];
  volunteers: Volunteer[];
  donations: Donation[];
  users: User[];
  settings: Settings;
};

async function readDb(): Promise<DbData> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const jsonData = JSON.parse(data);
    // Dates are stored as strings in JSON, so we need to convert them back to Date objects
    jsonData.projects.forEach((p: Project) => p.startDate = new Date(p.startDate));
    jsonData.volunteers.forEach((v: Volunteer) => v.signupDate = new Date(v.signupDate));
    jsonData.donations.forEach((d: Donation) => d.date = new Date(d.date));
    jsonData.users.forEach((u: User) => u.joinDate = new Date(u.joinDate));
    return jsonData;
  } catch (error) {
    console.error("Could not read db.json", error);
    // If the file doesn't exist or is empty, return a default structure
    return { projects: [], volunteers: [], donations: [], users: [], settings: { appName: 'Benevolence Hub', logo: 'HandHeart' } };
  }
}

async function writeDb(data: DbData) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getProjects: async () => (await readDb()).projects,
  getProjectById: async (id: string) => (await readDb()).projects.find(p => p.id === id),
  createProject: async (project: Omit<Project, 'id' | 'peopleHelped'>) => {
    const db = await readDb();
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      peopleHelped: 0,
    };
    db.projects.push(newProject);
    await writeDb(db);
    return newProject;
  },
  updateProject: async (id: string, data: Partial<Omit<Project, 'id'>>) => {
    const db = await readDb();
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    db.projects[index] = { ...db.projects[index], ...data };
    await writeDb(db);
    return db.projects[index];
  },
  deleteProject: async (id: string) => {
    const db = await readDb();
    const initialLength = db.projects.length;
    db.projects = db.projects.filter(p => p.id !== id);
    if (db.projects.length === initialLength) throw new Error('Project not found');
    await writeDb(db);
  },

  getVolunteers: async () => (await readDb()).volunteers,
  createVolunteer: async (volunteer: Omit<Volunteer, 'id' | 'status' | 'signupDate'>) => {
    const db = await readDb();
    const newVolunteer: Volunteer = {
      ...volunteer,
      id: `vol-${Date.now()}`,
      status: 'Pending',
      signupDate: new Date(),
    };
    db.volunteers.push(newVolunteer);
    await writeDb(db);
    return newVolunteer;
  },
  updateVolunteer: async (id: string, data: Partial<Omit<Volunteer, 'id'>>) => {
    const db = await readDb();
    const index = db.volunteers.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Volunteer not found');
    db.volunteers[index] = { ...db.volunteers[index], ...data };
    await writeDb(db);
    return db.volunteers[index];
  },
  deleteVolunteer: async (id: string) => {
    const db = await readDb();
    db.volunteers = db.volunteers.filter(v => v.id !== id);
    await writeDb(db);
  },

  getDonations: async () => (await readDb()).donations,
  createDonation: async (donation: Omit<Donation, 'id' | 'date'>) => {
    const db = await readDb();
    const newDonation: Donation = {
      ...donation,
      id: `don-${Date.now()}`,
      date: new Date(),
    };
    db.donations.push(newDonation);
    await writeDb(db);
    return newDonation;
  },

  getUsers: async () => (await readDb()).users,
  getUserByEmail: async (email: string) => (await readDb()).users.find(u => u.email === email),
  getUserById: async (id: string) => (await readDb()).users.find(u => u.id === id),
  createUser: async (user: Omit<User, 'id' | 'joinDate' | 'role'>) => {
    const db = await readDb();
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      joinDate: new Date(),
      role: 'ADMIN',
    };
    db.users.push(newUser);
    await writeDb(db);
    return newUser;
  },
  updateUser: async (id: string, data: Partial<Omit<User, 'id'>>) => {
    const db = await readDb();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    db.users[index] = { ...db.users[index], ...data };
    await writeDb(db);
    return db.users[index];
  },
  deleteUser: async (id: string) => {
    const db = await readDb();
    db.users = db.users.filter(u => u.id !== id);
    await writeDb(db);
  },
  
  getSettings: async () => (await readDb()).settings,
  updateSettings: async (settings: Partial<Settings>) => {
    const dbData = await readDb();
    dbData.settings = { ...dbData.settings, ...settings };
    await writeDb(dbData);
    return dbData.settings;
  }
};
