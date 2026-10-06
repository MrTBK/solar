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
