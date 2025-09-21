

export type ProjectStatus = 'Active' | 'Completed' | 'Planning';
export type ProjectCategory = 'Water' | 'Education' | 'Medical' | 'Community Development' | 'Disaster Relief';
export type VolunteerStatus = 'Pending' | 'Approved' | 'Rejected';
export type DonationType = 'ONE_TIME' | 'MONTHLY';
export type Role = 'ADMIN';

export type Project = {
  id: string;
  title: string;
  description: string;
  imageId: string;
  details: string[];
  status: ProjectStatus;
  startDate: Date;
  peopleHelped: number;
  category: ProjectCategory;
};

export type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  signupDate: Date;
  skills: string;
  interests: string[];
  availability: string[];
  status: VolunteerStatus;
};

export type Donation = {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  date: Date;
  type: DonationType;
  projectId: string | null;
  project?: Project | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  joinDate: Date;
};

export type Goal = {
    title: string;
    description: string;
};

export type Settings = {
  appName: string;
  logo: string;
  logoType: 'icon' | 'image';
  volunteerIcon: string;
  hero: Goal;
  mission: Goal;
  vision: Goal;
  values: Goal;
};

