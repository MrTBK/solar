export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  badge: string;
  highlights: string[];
  skills: string[];
  iconType: 'enterprise' | 'robotics' | 'community' | 'trainer';
}

export const EXPERIENCES_DATA: ExperienceItem[] = [
  {
    id: 'coficab',
    role: 'Summer Intern — Business Intelligence & AI',
    company: 'COFICAB Group (Tunisia)',
    location: 'Tunis, Tunisia',
    period: 'August 2026',
    badge: 'Enterprise Mission',
    iconType: 'enterprise',
    highlights: [
      'Engineered an end-to-end Business Intelligence solution for data processing, validation, and analytics in automotive cable manufacturing.',
      'Automated extraction of complex Excel data sheets and structured ingestion into Microsoft SQL Server using Python and SSIS.',
      'Constructed a data quarantine quality zone for validating incoming records and preventing corrupted data from polluting production tables.',
      'Modeled dimensional star-schemas in SQL Server for rapid query aggregation and executive Power BI reporting.',
      'Developed a full-stack administrative file management interface using Flask and Angular.',
      'Integrated an enterprise AI chatbot enabling business stakeholders to query plant metrics in natural language.'
    ],
    skills: ['Python', 'SQL Server', 'SSIS', 'Power BI', 'Flask', 'Angular', 'Data Warehousing', 'ETL', 'AI / NLP']
  },
  {
    id: 'youth-yes-we-care',
    role: 'Robotics Trainer & Embedded Mentor',
    company: 'Youth Yes We Care Association',
    location: 'Tunis, Tunisia',
    period: 'June 2024 – Present',
    badge: 'Hardware Mentorship',
    iconType: 'robotics',
    highlights: [
      'Instruct young students in the fundamentals of Arduino programming, electronics, sensor integration, and automation.',
      'Lead hands-on technical labs building autonomous obstacle-avoidance vehicles, Bluetooth tele-operated cars, and Mecanum wheel robots.',
      'Mentor and prepare youth teams for local and regional educational robotics challenges and hackathons.'
    ],
    skills: ['Arduino', 'C++', 'Circuit Schematics', 'Sensors & Actuators', 'Robotics Mentorship', 'IoT']
  },
  {
    id: 'esen-hive-pm',
    role: 'Project Manager',
    company: 'ESEN HiVE Club',
    location: 'La Manouba, Tunisia',
    period: 'August 2026 – Present',
    badge: 'Leadership',
    iconType: 'community',
    highlights: [
      'Lead project execution, resource allocation, and operations for university tech initiatives, workshops, and hackathons at ESEN Manouba.',
      'Coordinate cross-functional student committees spanning competitive programming, software development, and community logistics.',
      'Drive technical infrastructure for university-wide coding contests and hackathons.'
    ],
    skills: ['Team Leadership', 'Project Management', 'Event Operations', 'Technical Coordination']
  },
  {
    id: 'ieee-insat-trainer',
    role: 'Competitive Programming Workshop Trainer',
    company: 'IEEE INSAT Computer Society Chapter',
    location: 'INSAT, Tunis',
    period: 'October 2026',
    badge: 'Invited Speaker / Trainer',
    iconType: 'trainer',
    highlights: [
      'Invited as a competitive programming trainer to lead an intensive Introduction to Competitive Programming workshop at INSAT.',
      'Trained engineering participants in analytical problem decomposition, time/space complexity optimization, and competitive C++ fundamentals.'
    ],
    skills: ['C++', 'Algorithms', 'Data Structures', 'Competitive Programming Pedagogy']
  },
  {
    id: 'esen-hive-ps',
    role: 'Head of Problem Solving Department',
    company: 'ESEN HiVE Club',
    location: 'La Manouba, Tunisia',
    period: 'September 2025 – June 2026',
    badge: 'Algorithmic Leadership',
    iconType: 'community',
    highlights: [
      'Headed the Problem Solving division of ESEN HiVE Club, designing structured training curricula in C++ for collegiate contests.',
      'Served as lead problem setter and contest organizer for the club’s flagship Bee Battle algorithmic competition.',
      'Mentored members weekly in dynamic programming, graph theory, and contest strategies.'
    ],
    skills: ['C++', 'Problem Setting', 'Graph Theory', 'Dynamic Programming', 'Codeforces Coaching']
  }
];
