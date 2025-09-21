

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
    if (jsonData.projects) jsonData.projects.forEach((p: Project) => p.startDate = new Date(p.startDate));
    if (jsonData.volunteers) jsonData.volunteers.forEach((v: Volunteer) => v.signupDate = new Date(v.signupDate));
    if (jsonData.donations) jsonData.donations.forEach((d: Donation) => d.date = new Date(d.date));
    if (jsonData.users) jsonData.users.forEach((u: User) => u.joinDate = new Date(u.joinDate));
    return jsonData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // If the file doesn't exist, return a default structure
        return { projects: [], volunteers: [], donations: [], users: [], settings: { appName: 'Benevolence Hub', logo: 'HandHeart', logoType: 'icon' } };
    }
    console.error("Could not read db.json", error);
    // For other errors, return a default structure
    return { projects: [], volunteers: [], donations: [], users: [], settings: { appName: 'Benevolence Hub', logo: 'HandHeart', logoType: 'icon' } };
  }
}

async function writeDb(data: DbData) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getProjects() {
    const db = await readDb();
    return db.projects || [];
}

export async function getProjectById(id: string) {
    const db = await readDb();
    return (db.projects || []).find(p => p.id === id);
}

export async function createProject(project: Omit<Project, 'id' | 'peopleHelped'>) {
    const db = await readDb();
    const newProject: Project = {
        ...project,
        id: `proj-${Date.now()}`,
        peopleHelped: 0,
    };
    db.projects = [...(db.projects || []), newProject];
    await writeDb(db);
    return newProject;
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id'>>) {
    const db = await readDb();
    if (!db.projects) db.projects = [];
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    db.projects[index] = { ...db.projects[index], ...data };
    await writeDb(db);
    return db.projects[index];
}

export async function deleteProject(id: string) {
    const db = await readDb();
    const initialLength = (db.projects || []).length;
    db.projects = (db.projects || []).filter(p => p.id !== id);
    if (db.projects.length === initialLength) throw new Error('Project not found');
    await writeDb(db);
}

export async function getVolunteers() {
    const db = await readDb();
    return db.volunteers || [];
}

export async function createVolunteer(volunteer: Omit<Volunteer, 'id' | 'status' | 'signupDate'>) {
    const db = await readDb();
    const newVolunteer: Volunteer = {
        ...volunteer,
        id: `vol-${Date.now()}`,
        status: 'Pending',
        signupDate: new Date(),
    };
    db.volunteers = [...(db.volunteers || []), newVolunteer];
    await writeDb(db);
    return newVolunteer;
}

export async function updateVolunteer(id: string, data: Partial<Omit<Volunteer, 'id'>>) {
    const db = await readDb();
    if (!db.volunteers) db.volunteers = [];
    const index = db.volunteers.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Volunteer not found');
    db.volunteers[index] = { ...db.volunteers[index], ...data };
    await writeDb(db);
    return db.volunteers[index];
}

export async function deleteVolunteer(id: string) {
    const db = await readDb();
    db.volunteers = (db.volunteers || []).filter(v => v.id !== id);
    await writeDb(db);
}

export async function getDonations() {
    const db = await readDb();
    return db.donations || [];
}

export async function createDonation(donation: Omit<Donation, 'id' | 'date'>) {
    const db = await readDb();
    const newDonation: Donation = {
        ...donation,
        id: `don-${Date.now()}`,
        date: new Date(),
    };
    db.donations = [...(db.donations || []), newDonation];
    await writeDb(db);
    return newDonation;
}

export async function getUsers() {
    const db = await readDb();
    return db.users || [];
}

export async function getUserByEmail(email: string) {
    const db = await readDb();
    return (db.users || []).find(u => u.email === email);
}

export async function getUserById(id: string) {
    const db = await readDb();
    return (db.users || []).find(u => u.id === id);
}

export async function createUser(user: Omit<User, 'id' | 'joinDate' | 'role'>) {
    const db = await readDb();
    const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        joinDate: new Date(),
        role: 'ADMIN',
    };
    db.users = [...(db.users || []), newUser];
    await writeDb(db);
    return newUser;
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>) {
    const db = await readDb();
    if (!db.users) db.users = [];
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    db.users[index] = { ...db.users[index], ...data };
    await writeDb(db);
    return db.users[index];
}

export async function deleteUser(id: string) {
    const db = await readDb();
    db.users = (db.users || []).filter(u => u.id !== id);
    await writeDb(db);
}
  
export async function getSettings() {
    const db = await readDb();
    return db.settings || { appName: 'Benevolence Hub', logo: 'HandHeart', logoType: 'icon' };
}

export async function updateSettings(settings: Partial<Settings>) {
    const dbData = await readDb();
    dbData.settings = { ...dbData.settings, ...settings };
    await writeDb(dbData);
    return dbData.settings;
}

