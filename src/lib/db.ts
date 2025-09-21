import fs from 'fs/promises';
import path from 'path';
import { Project, Volunteer, Donation, User } from './types';

type DbData = {
  projects: Project[];
  volunteers: Volunteer[];
  donations: Donation[];
  users: User[];
};

class JsonDatabase {
  private filePath: string;
  private data: DbData | null = null;

  constructor() {
    this.filePath = path.join(process.cwd(), 'db.json');
  }

  private async readData(): Promise<DbData> {
    if (this.data) {
      // In-memory cache for subsequent requests in the same server process
      // return this.data;
    }
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent) as DbData;
      
      // Convert date strings to Date objects
      jsonData.projects.forEach(p => p.startDate = new Date(p.startDate));
      jsonData.volunteers.forEach(v => v.signupDate = new Date(v.signupDate));
      jsonData.donations.forEach(d => d.date = new Date(d.date));
      jsonData.users.forEach(u => u.joinDate = new Date(u.joinDate));

      this.data = jsonData;
      return jsonData;
    } catch (error) {
      console.error('Error reading database file:', error);
      // Return empty structure if file not found or invalid
      return { projects: [], volunteers: [], donations: [], users: [] };
    }
  }

  private async writeData(data: DbData): Promise<void> {
    // In-memory cache
    this.data = data;
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
  
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  project = {
    findMany: async ({ where, orderBy, take, skip }: { where?: any, orderBy?: any, take?: number, skip?: number } = {}) => {
        let { projects } = await this.readData();

        if (where) {
            if (where.status) {
                projects = projects.filter(p => p.status === where.status);
            }
            if (where.category) {
                const category = where.category.replace('_', ' ');
                projects = projects.filter(p => p.category === category);
            }
        }
        
        if (orderBy && orderBy.startDate === 'desc') {
            projects.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
        }

        if (skip !== undefined && take !== undefined) {
            return projects.slice(skip, skip + take);
        }

        return projects;
    },
    findUnique: async ({ where: { id } }: { where: { id: string }}) => {
        const { projects } = await this.readData();
        return projects.find(p => p.id === id) || null;
    },
    count: async ({ where }: { where?: any } = {}) => {
        let { projects } = await this.readData();
         if (where) {
            if (where.status) {
                projects = projects.filter(p => p.status === where.status);
            }
            if (where.category) {
                const category = where.category.replace('_', ' ');
                projects = projects.filter(p => p.category === category);
            }
        }
        return projects.length;
    },
    create: async ({ data }: { data: Omit<Project, 'id' | 'peopleHelped'> }) => {
        const dbData = await this.readData();
        const newProject: Project = {
            ...data,
            id: data.title.toLowerCase().replace(/ /g, '-'),
            peopleHelped: 0,
        };
        dbData.projects.push(newProject);
        await this.writeData(dbData);
        return newProject;
    },
    update: async ({ where: { id }, data }: { where: { id: string }, data: Partial<Project>}) => {
        const dbData = await this.readData();
        const index = dbData.projects.findIndex(p => p.id === id);
        if (index > -1) {
            dbData.projects[index] = { ...dbData.projects[index], ...data };
            await this.writeData(dbData);
            return dbData.projects[index];
        }
        return null;
    },
    delete: async ({ where: { id } }: { where: { id: string } }) => {
        const dbData = await this.readData();
        const initialLength = dbData.projects.length;
        dbData.projects = dbData.projects.filter(p => p.id !== id);
        if (dbData.projects.length < initialLength) {
             await this.writeData(dbData);
             return { id };
        }
        return null;
    },
  };

  volunteer = {
    findMany: async ({ where, orderBy, take, skip }: { where?: any, orderBy?: any, take?: number, skip?: number } = {}) => {
        let { volunteers } = await this.readData();

         if (where) {
            if (where.status) {
                volunteers = volunteers.filter(v => v.status === where.status);
            }
            if (where.interests?.has) {
                volunteers = volunteers.filter(v => v.interests.includes(where.interests.has));
            }
        }

        if (orderBy && orderBy.signupDate === 'desc') {
            volunteers.sort((a, b) => b.signupDate.getTime() - a.signupDate.getTime());
        }

        if (skip !== undefined && take !== undefined) {
            return volunteers.slice(skip, skip + take);
        }
        
        return volunteers;
    },
    count: async ({ where }: { where?: any } = {}) => {
        let { volunteers } = await this.readData();
        if (where) {
            if (where.status) {
                volunteers = volunteers.filter(v => v.status === where.status);
            }
            if (where.interests?.has) {
                volunteers = volunteers.filter(v => v.interests.includes(where.interests.has));
            }
        }
        return volunteers.length;
    },
    create: async ({ data }: { data: Omit<Volunteer, 'id' | 'status' | 'signupDate'> }) => {
        const dbData = await this.readData();
        const newVolunteer: Volunteer = {
            ...data,
            id: this.generateId('VOL'),
            status: 'Pending',
            signupDate: new Date(),
        };
        dbData.volunteers.push(newVolunteer);
        await this.writeData(dbData);
        return newVolunteer;
    },
    update: async ({ where: { id }, data }: { where: { id: string }, data: { status: 'Approved' | 'Rejected' } }) => {
        const dbData = await this.readData();
        const index = dbData.volunteers.findIndex(v => v.id === id);
        if (index > -1) {
            dbData.volunteers[index].status = data.status;
            await this.writeData(dbData);
            return dbData.volunteers[index];
        }
        return null;
    },
    delete: async ({ where: { id } }: { where: { id: string } }) => {
        const dbData = await this.readData();
        const initialLength = dbData.volunteers.length;
        dbData.volunteers = dbData.volunteers.filter(v => v.id !== id);
        if (dbData.volunteers.length < initialLength) {
             await this.writeData(dbData);
             return { id };
        }
        return null;
    },
  };
  
  donation = {
      findMany: async ({ where, include, orderBy, take, skip }: { where?: any, include?: any, orderBy?: any_mutated, take?: number, skip?: number } = {}) => {
        let { donations, projects } = await this.readData();

        if (where) {
            if (where.type) {
                donations = donations.filter(d => d.type === where.type);
            }
            if (where.project?.title) {
                const projectTitle = where.project.title;
                donations = donations.filter(d => {
                    if (!d.projectId) return projectTitle === 'General Fund';
                    const project = projects.find(p => p.id === d.projectId);
                    return project?.title === projectTitle;
                });
            }
        }
        
        if (orderBy && orderBy.date === 'desc') {
            donations.sort((a, b) => b.date.getTime() - a.date.getTime());
        }

        if (include?.project) {
            donations.forEach(d => {
                d.project = projects.find(p => p.id === d.projectId) || null;
            });
        }
        
        if (skip !== undefined && take !== undefined) {
            return donations.slice(skip, skip + take);
        }

        return donations;
    },
    count: async ({ where }: { where?: any } = {}) => {
        let { donations, projects } = await this.readData();
        if (where) {
             if (where.type) {
                donations = donations.filter(d => d.type === where.type);
            }
            if (where.project?.title) {
                const projectTitle = where.project.title;
                donations = donations.filter(d => {
                    if (!d.projectId) return projectTitle === 'General Fund';
                    const project = projects.find(p => p.id === d.projectId);
                    return project?.title === projectTitle;
                });
            }
        }
        return donations.length;
    },
     aggregate: async ({ _sum }: { _sum: { amount: boolean }}) => {
        const { donations } = await this.readData();
        if (_sum.amount) {
            return {
                _sum: {
                    amount: donations.reduce((acc, d) => acc + d.amount, 0)
                }
            }
        }
        return { _sum: { amount: 0 } };
    },
    create: async ({ data }: { data: Omit<Donation, 'id' | 'date'> }) => {
        const dbData = await this.readData();
        const newDonation: Donation = {
            ...data,
            id: this.generateId('DON'),
            date: new Date(),
        };
        dbData.donations.push(newDonation);
        await this.writeData(dbData);
        return newDonation;
    }
  };

  user = {
      findMany: async ({ where, orderBy, take, skip }: { where?: any, orderBy?: any, take?: number, skip?: number } = {}) => {
        let { users } = await this.readData();

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
    findUnique: async ({ where: { email } }: { where: { email: string }}) => {
        const { users } = await this.readData();
        return users.find(u => u.email === email) || null;
    },
    count: async ({ where }: { where?: any } = {}) => {
        let { users } = await this.readData();
        if (where?.role) {
            users = users.filter(u => u.role === where.role);
        }
        return users.length;
    },
     create: async ({ data }: { data: Omit<User, 'id' | 'joinDate'> }) => {
        const dbData = await this.readData();
        const newUser: User = {
            ...data,
            id: this.generateId('ADM'),
            joinDate: new Date(),
        };
        dbData.users.push(newUser);
        await this.writeData(dbData);
        return newUser;
    },
     update: async ({ where: { id }, data }: { where: { id: string }, data: Partial<User>}) => {
        const dbData = await this.readData();
        const index = dbData.users.findIndex(u => u.id === id);
        if (index > -1) {
            dbData.users[index] = { ...dbData.users[index], ...data };
            await this.writeData(dbData);
            return dbData.users[index];
        }
        return null;
    },
    delete: async ({ where: { id } }: { where: { id: string } }) => {
        const dbData = await this.readData();
        const initialLength = dbData.users.length;
        dbData.users = dbData.users.filter(u => u.id !== id);
        if (dbData.users.length < initialLength) {
             await this.writeData(dbData);
             return { id };
        }
        return null;
    },
  }
}

export const db = new JsonDatabase();
