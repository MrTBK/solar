export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  field: string;
  description: string;
  keyTopics: string[];
  isCurrent?: boolean;
}

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'esen-licence',
    degree: 'Licence en Informatique de Gestion',
    institution: 'École Supérieure d’Économie Numérique (ESEN)',
    location: 'La Manouba, Tunisia',
    period: '2024 – Present',
    field: 'Specialization: Business Intelligence (BI)',
    description:
      'Rigorous curriculum focusing on enterprise data systems, dimensional modeling, decision-support architecture, software engineering, and applied business analytics.',
    keyTopics: [
      'Business Intelligence & Data Warehousing (Kimball / Inmon)',
      'Relational Databases & SQL Optimization',
      'Advanced Algorithms & Data Structures',
      'Information Systems & Business Strategy',
      'Statistical Analysis & Data Mining'
    ],
    isCurrent: true
  },
  {
    id: 'bac-info',
    degree: 'Baccalauréat — Sciences de l’Informatique',
    institution: 'Lycée Mohamed Arbi Chammari',
    location: 'Tunisia',
    period: '2024',
    field: 'Spécialité : Sciences de l’Informatique',
    description:
      'National high school diploma in computer science, establishing strong fundamentals in algorithms, logic, discrete mathematics, and database principles.',
    keyTopics: [
      'Algorithmic Logic & Python / Pascal Programming',
      'Relational Database Modeling & SQL',
      'Discrete Mathematics & Linear Algebra',
      'Computer Architecture & Digital Logic'
    ],
    isCurrent: false
  }
];

export const CERTIFICATIONS_DATA = [
  {
    id: 'ibm-data',
    title: 'IBM Data Fundamentals',
    issuer: 'IBM SkillsBuild',
    date: '2024',
    description: 'Relational Databases, SQL data structures, and Watson Knowledge Studio AI tooling.',
    badge: 'Certified'
  },
  {
    id: 'codeforces-specialist',
    title: 'Codeforces Specialist',
    issuer: 'Codeforces Platform',
    date: 'Active',
    description: 'Achieved Specialist rank with over 200 competitive algorithmic problems solved.',
    badge: 'Specialist'
  }
];
