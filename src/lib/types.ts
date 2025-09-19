
import type { Project as P, Volunteer as V, Donation as D, User as U, ProjectStatus, ProjectCategory, VolunteerStatus, DonationType } from '@prisma/client';

export type { ProjectStatus, ProjectCategory, VolunteerStatus, DonationType };

export type Project = P;
export type Volunteer = V;
export type Donation = D & { project?: Project | null };
export type User = U;
