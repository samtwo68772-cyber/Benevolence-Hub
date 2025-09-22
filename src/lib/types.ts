

export type ProjectStatus = 'Active' | 'Completed' | 'Planning';
export type VolunteerStatus = 'Pending' | 'Approved' | 'Rejected';
export type DonationType = 'ONE_TIME' | 'MONTHLY';
export type Role = 'ADMIN';

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  details: string[];
  status: ProjectStatus;
  startDate: Date;
  peopleHelped: number;
  category: string | null;
  categoryId?: string | null;
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
  categoryId?: string | null;
  project?: Partial<Project> | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  role: Role;
  joinDate: Date;
};

export type Goal = {
    title: string;
    description: string;
};

export type VolunteerIntro = {
    title: string;
    description1: string;
    description2: string;
}

export type SocialLink = {
    icon: 'Twitter' | 'Facebook' | 'Instagram';
    href: string;
};

export type Settings = {
  id?: string;
  appName?: string;
  logo?: string;
  logoType?: 'icon' | 'image';
  volunteerIcon?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string | null;
  missionIntroTitle?: string;
  missionIntroDescription?: string;
  missionImage?: string | null;
  missionTitle?: string;
  missionDescription?: string;
  visionTitle?: string;
  visionDescription?: string;
  valuesTitle?: string;
  valuesDescription?: string;
  volunteerIntroTitle?: string;
  volunteerIntroDescription1?: string;
  volunteerIntroDescription2?: string;
  socialLinks?: SocialLink[];
};
