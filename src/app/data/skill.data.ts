export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  skills: {
    name: string;
    level: string; // e.g. "Proficient", "Advanced", "Working Knowledge"
    detail?: string;
  }[];
}

export const SKILLS_DATA: SkillCategory[] = [
  {
    id: 'programming',
    name: 'Programming & Core Languages',
    description: 'Algorithmic problem-solving, backend application logic, and systems programming.',
    accentColor: '#38bdf8',
    skills: [
      { name: 'Python', level: 'Advanced', detail: 'Data pipelines, Pandas, NumPy, FastAPI, Flask, Scikit-Learn' },
      { name: 'SQL', level: 'Advanced', detail: 'Complex queries, Window Functions, DDL/DML, Optimization' },
      { name: 'C++', level: 'Advanced', detail: 'Competitive programming, STL, Algorithmic efficiency (O(NlogN))' },
      { name: 'C', level: 'Proficient', detail: 'Embedded systems, memory fundamentals, pointers' },
      { name: 'JavaScript / TypeScript', level: 'Proficient', detail: 'Angular 22, modern ES6+, Three.js' },
      { name: 'PHP', level: 'Working Knowledge', detail: 'Backend scripting & web fundamentals' }
    ]
  },
  {
    id: 'bi-data',
    name: 'Business Intelligence & Data Warehousing',
    description: 'Dimensional modeling, ETL pipelines, enterprise data quality, and executive reporting.',
    accentColor: '#fbbf24',
    skills: [
      { name: 'Power BI', level: 'Advanced', detail: 'DAX measures, interactive visuals, executive dashboards' },
      { name: 'Data Warehousing', level: 'Advanced', detail: 'Kimball star schema, snow-flake, dimensional modeling' },
      { name: 'ETL / ELT Pipelines', level: 'Advanced', detail: 'Automated batch pipelines, SSIS, Python data extractors' },
      { name: 'PostgreSQL', level: 'Advanced', detail: 'Analytical indexing, constraints, stored procedures' },
      { name: 'Microsoft SQL Server', level: 'Proficient', detail: 'SSMS, SSIS integration, enterprise storage' },
      { name: 'dbt (data build tool)', level: 'Proficient', detail: 'Dimensional transformations, lineage, testing' },
      { name: 'Data Quality & Quarantine', level: 'Advanced', detail: 'Automated validation checks, zero-loss routing' }
    ]
  },
  {
    id: 'development',
    name: 'Web & Mobile Development',
    description: 'Full-stack engineering, asynchronous APIs, cross-platform mobile apps.',
    accentColor: '#34d399',
    skills: [
      { name: 'Angular (v17-22+)', level: 'Proficient', detail: 'Signals, standalone components, reactive architecture' },
      { name: 'FastAPI', level: 'Proficient', detail: 'Asynchronous REST APIs, Pydantic, OpenAPI docs' },
      { name: 'Flask', level: 'Proficient', detail: 'Lightweight web microservices & file management' },
      { name: 'Flutter & Dart', level: 'Proficient', detail: 'Offline SQLite persistence, multilingual RTL/LTR' },
      { name: 'Docker & Containers', level: 'Proficient', detail: 'Multi-service containerization, compose orchestration' },
      { name: 'Apache Airflow', level: 'Working Knowledge', detail: 'DAG authoring, task dependencies, scheduling' }
    ]
  },
  {
    id: 'robotics-iot',
    name: 'Robotics & Embedded Systems',
    description: 'Microcontroller programming, sensor integration, circuit schematics, and youth mentorship.',
    accentColor: '#f97316',
    skills: [
      { name: 'Arduino (Uno / Mega)', level: 'Advanced', detail: 'Motor drivers, ultrasonic sensors, Bluetooth HC-05' },
      { name: 'ESP8266 & IoT', level: 'Proficient', detail: 'Wi-Fi telemetry, remote monitoring, microcontrollers' },
      { name: 'Circuit Design & Schematics', level: 'Proficient', detail: 'H-Bridges, voltage regulation, breadboard prototyping' },
      { name: 'Robotics Mentorship', level: 'Lead Trainer', detail: 'Instructor @ Youth Yes We Care Association since 2024' }
    ]
  },
  {
    id: 'algorithms',
    name: 'Algorithmic Problem Solving & Competitions',
    description: 'High-speed algorithmic analysis, data structures, and collegiate competitive tournaments.',
    accentColor: '#a855f7',
    skills: [
      { name: 'Codeforces Specialist', level: 'Specialist Rank', detail: '200+ solved algorithmic challenges' },
      { name: 'TCPC National Finalist', level: 'Rank 32 / 100', detail: 'Tunisian Collegiate Programming Contest (ICPC Qualifier)' },
      { name: 'Monopoly Hackathon Champion', level: '1st Place', detail: 'TBS Innovation Hackathon May 2026' },
      { name: 'Data Structures & Graph Theory', level: 'Advanced', detail: 'Trees, Graphs, BFS/DFS, DP, Greedy, Segment Trees' },
      { name: 'Head of Problem Solving', level: 'Leadership', detail: 'Led problem setter team @ ESEN HiVE Club' }
    ]
  }
];

export interface SkillPlanetItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  color: string;
  emissiveColor: string;
  textureType: 'industrial' | 'analytics' | 'logistics' | 'mlops' | 'robotics' | 'finance';
  radius: number;
  rowX: number; // horizontal placement along X axis (-50 to +50)
  skills: { name: string; level: string; detail?: string }[];
  highlight: string;
}

export const SKILL_PLANETS: SkillPlanetItem[] = [
  {
    id: 'skill-python',
    name: 'PYTHON & DATA PIPELINES',
    category: 'Data Engineering',
    tagline: 'Batch ETL, dbt Modeling, Automated Quarantine & Airflow',
    color: '#38bdf8',
    emissiveColor: '#0284c7',
    textureType: 'industrial',
    radius: 3.2,
    rowX: -50,
    highlight: 'ETL Pipelines, dbt transformations, PostgreSQL staging, and Airflow orchestration.',
    skills: [
      { name: 'Python', level: 'Advanced', detail: 'Pandas, NumPy, Scikit-Learn, Pygame' },
      { name: 'dbt Core', level: 'Proficient', detail: 'Star schema models, automated assertions' },
      { name: 'Apache Airflow', level: 'Proficient', detail: 'DAG scheduling and error retry logic' },
      { name: 'PostgreSQL', level: 'Advanced', detail: 'Analytical indexing, quarantine tables' }
    ]
  },
  {
    id: 'skill-bi',
    name: 'BUSINESS INTELLIGENCE & DWH',
    category: 'Analytics & Decision Systems',
    tagline: 'Kimball Dimensional Warehouses, Power BI & SSIS',
    color: '#fbbf24',
    emissiveColor: '#d97706',
    textureType: 'analytics',
    radius: 3.5,
    rowX: -30,
    highlight: 'Enterprise dimensional modeling, DAX performance measures, and multi-source ETL reconciliation.',
    skills: [
      { name: 'Power BI', level: 'Advanced', detail: 'DAX measures, interactive executive reports' },
      { name: 'Data Warehousing', level: 'Advanced', detail: 'Kimball star schemas, Fact/Dim design' },
      { name: 'Microsoft SQL Server', level: 'Advanced', detail: 'SSMS, SSIS data flows, T-SQL' },
      { name: 'Data Quality Zone', level: 'Advanced', detail: 'Zero-loss quarantine validation' }
    ]
  },
  {
    id: 'skill-algorithms',
    name: 'C++ & ALGORITHMIC SOLVING',
    category: 'Competitive Programming',
    tagline: 'Codeforces Specialist, TCPC National Finalist, Graph Theory',
    color: '#a855f7',
    emissiveColor: '#7e22ce',
    textureType: 'mlops',
    radius: 3.0,
    rowX: -10,
    highlight: 'High-speed algorithmic analysis, complex data structures, and ICPC tournament problem decomposition in C++.',
    skills: [
      { name: 'C++ (STL)', level: 'Advanced', detail: 'High performance O(NlogN) optimizations' },
      { name: 'Codeforces Specialist', level: 'Specialist Rank', detail: '200+ solved algorithmic challenges' },
      { name: 'TCPC Finalist', level: 'Rank 32/100', detail: 'Tunisian Collegiate Programming Contest' },
      { name: 'Monopoly Hackathon', level: '1st Place', detail: 'TBS Innovation Champion 2026' }
    ]
  },
  {
    id: 'skill-web',
    name: 'FULL-STACK & CLOUD SYSTEMS',
    category: 'Modern Web Engineering',
    tagline: 'Angular 22, FastAPI Asynchronous APIs, Flask & Docker',
    color: '#34d399',
    emissiveColor: '#059669',
    textureType: 'logistics',
    radius: 3.1,
    rowX: 10,
    highlight: 'Modern reactive frontend architectures, asynchronous microservices, and Docker containerization.',
    skills: [
      { name: 'Angular (v17-22+)', level: 'Advanced', detail: 'Standalone signals, Three.js integration' },
      { name: 'FastAPI', level: 'Proficient', detail: 'Async endpoints, Pydantic data schemas' },
      { name: 'Flask', level: 'Proficient', detail: 'Enterprise file management & microservices' },
      { name: 'Docker & Linux', level: 'Proficient', detail: 'Compose networks, Bash automation' }
    ]
  },
  {
    id: 'skill-robotics',
    name: 'ROBOTICS & EMBEDDED IoT',
    category: 'Hardware & Microcontrollers',
    tagline: 'Arduino, ESP8266, Autonomous Logic, Youth Mentorship',
    color: '#f97316',
    emissiveColor: '#ea580c',
    textureType: 'robotics',
    radius: 2.9,
    rowX: 30,
    highlight: 'Motor controllers, ultrasonic pathfinding, Bluetooth wireless protocols, and hands-on youth engineering training.',
    skills: [
      { name: 'Arduino Hardware', level: 'Advanced', detail: 'Motor drivers, sensors, PWM control' },
      { name: 'ESP8266 & IoT', level: 'Proficient', detail: 'Wireless serial & telemetry' },
      { name: 'Robotics Trainer', level: 'Lead Trainer', detail: 'Youth Yes We Care Association mentor' },
      { name: 'Circuits & Schematics', level: 'Proficient', detail: 'Breadboard prototyping, H-Bridges' }
    ]
  },
  {
    id: 'skill-mobile',
    name: 'MOBILE & OFFLINE ARCHITECTURE',
    category: 'Mobile Application',
    tagline: 'Flutter Cross-Platform, SQLite Local Storage, RTL/LTR',
    color: '#2dd4bf',
    emissiveColor: '#0d9488',
    textureType: 'finance',
    radius: 2.7,
    rowX: 50,
    highlight: 'Zero-cloud offline-first architectures, encrypted local SQLite persistence, and multilingual Arabic/English layouts.',
    skills: [
      { name: 'Flutter & Dart', level: 'Proficient', detail: 'Cross-platform reactive UI architecture' },
      { name: 'SQLite Storage', level: 'Proficient', detail: 'Zero-latency local database persistence' },
      { name: 'Multilingual i18n', level: 'Advanced', detail: 'Native Arabic RTL, French, English' }
    ]
  }
];
