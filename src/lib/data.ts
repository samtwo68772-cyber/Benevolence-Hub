



export type Project = {
    id: string;
    title: string;
    description: string;
    imageId: string;
    details: string[];
    status: 'Active' | 'Completed' | 'Planning';
    startDate: string;
    peopleHelped: number;
}

export const projects: Project[] = [
  {
    id: "water-for-villages",
    title: "Water for Villages",
    description: "Bringing clean and safe drinking water to remote communities by building wells and implementing filtration systems. This project has already impacted thousands of lives, providing not just hydration but also improved sanitation and health. We work with local partners to ensure the sustainability of each well.",
    imageId: "project-water",
    details: [
        "Constructed 50+ wells in the last 2 years.",
        "Implemented 3 large-scale water filtration plants.",
        "Trained 100+ community members on well maintenance.",
        "Reduced waterborne diseases by 60% in target areas."
    ],
    status: 'Active',
    startDate: '2022-01-15',
    peopleHelped: 7500
  },
  {
    id: "education-for-all",
    title: "Education for All",
    description: "Providing access to quality education for children in underserved regions, including school supplies and teacher training. Our goal is to break the cycle of poverty by empowering the next generation through learning. We build schools, provide books, and support teachers.",
    imageId: "project-education",
    details: [
        "Built and renovated 15 schools.",
        "Distributed over 100,000 school supply kits.",
        "Sponsored 500+ teacher training programs.",
        "Increased literacy rates by 40% in project zones."
    ],
    status: 'Active',
    startDate: '2021-08-20',
    peopleHelped: 5000
  },
  {
    id: "emergency-medical-aid",
    title: "Emergency Medical Aid",
    description: "Deploying mobile medical clinics to disaster-stricken areas, offering urgent care and essential health services. Our rapid-response teams are equipped to handle a wide range of medical needs, from treating injuries to preventing the spread of disease.",
    imageId: "project-medical",
    details: [
        "Responded to 12 major natural disasters.",
        "Provided medical care to over 50,000 people.",
        "Delivered 20 tons of medical supplies.",
        "Conducted vaccination campaigns for 25,000 children."
    ],
    status: 'Completed',
    startDate: '2020-05-10',
    peopleHelped: 50000
  },
];

export type Volunteer = {
    id: string;
    name: string;
    email: string;
    signupDate: string;
    skills: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export const volunteers: Volunteer[] = [
    { id: 'VOL-001', name: 'Alice Johnson', email: 'alice.j@example.com', signupDate: '2023-10-22', skills: 'Medical background, speaks Spanish', status: 'Pending' },
    { id: 'VOL-002', name: 'Bob Williams', email: 'bob.w@example.com', signupDate: '2023-11-05', skills: 'Construction, project management', status: 'Approved' },
    { id: 'VOL-003', name: 'Charlie Brown', email: 'charlie.b@example.com', signupDate: '2023-11-15', skills: 'Teaching, childcare', status: 'Pending' },
    { id: 'VOL-004', name: 'Diana Prince', email: 'diana.p@example.com', signupDate: '2023-12-01', skills: 'Logistics and coordination', status: 'Rejected' },
    { id: 'VOL-005', name: 'Ethan Hunt', email: 'ethan.h@example.com', signupDate: '2024-01-10', skills: 'IT Support, communications', status: 'Approved' },
];

export const donations = [
    { id: 'DON-001', donorName: 'John Smith', email: 'john.s@example.com', amount: 100, date: '2024-02-01', type: 'One-time', project: 'Water for Villages' },
    { id: 'DON-002', donorName: 'Jane Doe', email: 'jane.d@example.com', amount: 50, date: '2024-02-05', type: 'Monthly', project: 'Education for All' },
    { id: 'DON-003', donorName: 'Peter Jones', email: 'peter.j@example.com', amount: 250, date: '2024-02-10', type: 'One-time', project: 'Emergency Medical Aid' },
    { id: 'DON-004', donorName: 'Mary Miller', email: 'mary.m@example.com', amount: 25, date: '2024-02-12', type: 'Monthly', project: 'General Fund' },
    { id: 'DON-005', donorName: 'David Garcia', email: 'david.g@example.com', amount: 500, date: '2024-02-15', type: 'One-time', project: 'Water for Villages' },
];

  
