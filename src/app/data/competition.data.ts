export interface CompetitionItem {
  id: string;
  title: string;
  organizer: string;
  date: string;
  rank: string;
  category: 'Competitive Programming' | 'Hackathon' | 'Problem Setting' | 'Tournament';
  description: string;
  image: string;
  badge: string;
  tags: string[];
}

export const COMPETITIONS_DATA: CompetitionItem[] = [
  {
    id: 'monopoly-hackathon',
    title: 'Monopoly Hackathon — TBS',
    organizer: 'Tunis Business School (TBS)',
    date: 'May 2026',
    rank: '1st Place Winner 🏆',
    category: 'Hackathon',
    description:
      'Ranked 1st place among all participating university teams in an intensive technological innovation hackathon, building an end-to-end strategic technological solution under strict time constraints.',
    image: '/competitions/monopoly-hackathon.jpg',
    badge: '1st Place Lauréat',
    tags: ['Innovation', 'System Design', 'Rapid Prototyping', 'Pitch & Demo']
  },
  {
    id: 'tcpc-2026',
    title: 'TCPC — Tunisian Collegiate Programming Contest',
    organizer: 'ICPC Global / ACPC Regional',
    date: 'March 2026',
    rank: 'Rank 32 / 100 University Teams',
    category: 'Competitive Programming',
    description:
      'The prestigious official national collegiate programming contest in Tunisia qualifying for the Arab & Africa Collegiate Programming Championship (ACPC) and ICPC World Finals. Solved advanced algorithmic challenges in C++ under real-time ICPC contest rules.',
    image: '/competitions/tcpc-2026.jpg',
    badge: 'National Finalist',
    tags: ['C++', 'ICPC Qualifier', 'Graph Algorithms', 'Dynamic Programming']
  },
  {
    id: 'bee-battle',
    title: 'Bee Battle Algorithmic Contest',
    organizer: 'ESEN HiVE Club',
    date: '2025 – 2026',
    rank: 'Lead Problem Setter & Organizer',
    category: 'Problem Setting',
    description:
      'Engineered and calibrated competitive algorithmic problems, formulated test suite corner-cases, and coordinated live tournament contest operations for university participants.',
    image: '/competitions/bee-battle.jpg',
    badge: 'Problem Setter',
    tags: ['Problem Setting', 'Testcase Validation', 'C++', 'Tournament Ops']
  },
  {
    id: 'esen-hive-contest',
    title: 'ESEN HiVE Internal Coding Contests',
    organizer: 'ESEN HiVE Club',
    date: '2025 – 2026',
    rank: 'Contest Coordinator',
    category: 'Tournament',
    description:
      'Structured ongoing problem-solving workshops and Codeforces contest simulations for university members, training competitors in speed, memory bounds, and algorithmic decomposition.',
    image: '/competitions/esen-hive-contest.jpg',
    badge: 'Coordinator',
    tags: ['Codeforces', 'Mentorship', 'Algorithms', 'Speed Coding']
  },
  {
    id: 'winter-cup',
    title: 'Winter Cup Algorithmic Tournament',
    organizer: 'Competitive Programming Community',
    date: '2025',
    rank: 'Competitive Finalist',
    category: 'Competitive Programming',
    description:
      'Intensive winter seasonal programming championship solving combinatorial and graph optimization problems under speed constraints.',
    image: '/competitions/winter-cup.jpg',
    badge: 'Finalist',
    tags: ['C++', 'Combinatorics', 'Data Structures']
  },
  {
    id: 'codex-cp',
    title: 'CodeX Competitive Programming Series',
    organizer: 'University Tech League',
    date: '2025',
    rank: 'Top Tier Performer',
    category: 'Competitive Programming',
    description:
      'Multi-round competitive programming tournament tackling advanced number theory, segment trees, and shortest-path graph formulations.',
    image: '/competitions/codex-cp.jpg',
    badge: 'Top Tier',
    tags: ['C++', 'Number Theory', 'Segment Trees']
  }
];
