import { ProjectData } from '../models/project.model';

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'dataforge',
    slug: 'dataforge',
    name: 'DataForge',
    category: 'Data Engineering',
    domain: 'Enterprise ETL & Data Quality',
    tagline: 'Production-Style Batch ETL Pipeline & Operations Engine',
    description:
      'A resilient batch ETL pipeline and operations console engineered with automated quarantine validation, dimensional dbt modeling, and containerized orchestration.',
    longDescription:
      'DataForge solves core enterprise data engineering pain points by ingesting raw retail transactional datasets, applying strict data-quality validation rules, routing non-compliant records to an isolated quarantine zone for auditability, transforming clean records via dbt into a star-schema analytical warehouse on PostgreSQL, and providing an operational monitoring console with Airflow and Docker.',
    technologies: ['Python', 'PostgreSQL', 'dbt', 'Airflow', 'Docker', 'SQL', 'Bash'],
    status: 'Production',
    github: 'https://github.com/MrTBK/DataForge',
    image: '/dataforge.png',
    celestialId: 'planet-dataforge',
    metrics: [
      { label: 'Data Quality Check', value: '100% Automated' },
      { label: 'Warehouse Schema', value: 'Kimball Star' },
      { label: 'Orchestration', value: 'Docker / Airflow' },
      { label: 'Quarantine Rate', value: 'Zero Data Loss' }
    ],
    highlights: [
      'Automated quarantine routing isolating erroneous records without crashing upstream ETL ingestion.',
      'Kimball star-schema dimensional modeling using dbt transformations on PostgreSQL.',
      'Comprehensive DAG scheduling with Apache Airflow for robust automated execution.',
      'Containerized execution environment ensuring reproducible local and cloud deployment.'
    ],
    features: [
      'Multi-stage data validation rules engine',
      'Fault-tolerant quarantine storage & auditing',
      'dbt dimensional model transformation',
      'Containerized Airflow task orchestration',
      'Automated data freshness & consistency assertions'
    ],
    architecture: [
      'Raw Source Data (CSV / JSON / API)',
      'Python Validation & Ingestion Engine',
      'PostgreSQL Staging & Quarantine Tables',
      'dbt Transform -> Star Schema Data Warehouse',
      'Analytical Marts & Metric Views'
    ]
  },
  {
    id: 'customer360',
    slug: 'customer360',
    name: 'Customer360',
    category: 'BI / Analytics',
    domain: 'Customer Intelligence & Cohort Retention',
    tagline: 'Full-Spectrum E-Commerce Customer Analytics Platform',
    description:
      'Deep analytical customer intelligence platform examining 95,560 customers and 99,441 orders across the Brazilian Olist e-commerce ecosystem.',
    longDescription:
      'Customer360 transforms complex multi-table transaction histories into actionable customer behavior metrics. Featuring a Kimball star schema, RFM (Recency, Frequency, Monetary) segmentation, customer lifetime value (CLV) scoring, cohort retention curves, and interactive Power BI decision-support dashboards.',
    technologies: ['SQL', 'Python', 'Power BI', 'Data Warehousing', 'ETL', 'PostgreSQL', 'Pandas'],
    status: 'Production',
    github: 'https://github.com/MrTBK/Customer360',
    image: '/catemer360.png',
    celestialId: 'planet-customer360',
    metrics: [
      { label: 'Customers Analyzed', value: '95,560' },
      { label: 'Orders Processed', value: '99,441' },
      { label: 'Segmentation', value: 'RFM & Cohorts' },
      { label: 'Reporting', value: 'Power BI Executive' }
    ],
    highlights: [
      'Comprehensive Kimball star-schema dimensional data warehouse with optimized grain.',
      'Automated RFM behavioral segmentation dividing customers into actionable clusters.',
      'Monthly cohort analysis tracking retention decay and customer churn patterns.',
      'Interactive executive dashboards delivering real-time geographical and revenue drill-downs.'
    ],
    features: [
      'Automated ETL ingestion from raw multi-table relational sources',
      'Kimball dimensional model with Fact & Dimension tables',
      'RFM scoring algorithm & loyalty tier classification',
      'Cohort retention matrix and lifetime value projection',
      'Power BI executive dashboards with DAX measures'
    ],
    architecture: [
      'Raw Olist E-Commerce Datasets',
      'Python Data Cleaning & Transformation Pipelines',
      'PostgreSQL Dimensional Warehouse (Fact_Orders, Dim_Customers, etc.)',
      'Analytical Views & RFM Scoring Engine',
      'Interactive Power BI Reporting Layer'
    ]
  },
  {
    id: 'supplychainiq',
    slug: 'supplychainiq',
    name: 'SupplyChainIQ',
    category: 'Supply Chain Intelligence',
    domain: 'Logistics Optimization & Predictive Operations',
    tagline: 'Decision-Support Platform for Inventory, Demand & Supply Risks',
    description:
      'End-to-end supply chain analytics platform delivering inventory monitoring, supplier evaluation, delivery delay risk prediction, and demand forecasting.',
    longDescription:
      'Engineered on comprehensive historical logistics and supply chain data, SupplyChainIQ bridges physical inventory movements with quantitative business intelligence. It automates reorder point calculations, detects bottleneck suppliers, flags late deliveries before arrival, and empowers managers with proactive risk mitigation tools.',
    technologies: ['Python', 'PostgreSQL', 'scikit-learn', 'SQL', 'ETL', 'Pandas', 'Streamlit'],
    status: 'Production',
    github: 'https://github.com/MrTBK/SupplyChainIQ',
    image: '/supplychainiq.png',
    celestialId: 'planet-supplychainiq',
    metrics: [
      { label: 'Delay Prediction', value: 'ML Classification' },
      { label: 'Safety Stock', value: 'Dynamic Formulas' },
      { label: 'Pipeline Speed', value: 'Sub-second ETL' },
      { label: 'Alerting', value: 'Multi-Tier Risks' }
    ],
    highlights: [
      'Machine learning model forecasting late delivery risks based on route, shipping mode, and origin.',
      'Dynamic reorder points (ROP) and safety stock optimization preventing stockouts.',
      'Supplier scorecards evaluating lead time reliability and defect frequencies.',
      'Operational decision dashboard visualizing global logistics nodes and order anomalies.'
    ],
    features: [
      'End-to-end logistics ETL data pipelines',
      'Predictive delivery delay classification engine',
      'Inventory reorder calculation and economic order quantity (EOQ)',
      'Supplier performance rating & risk matrices',
      'Automated operational warning system'
    ],
    architecture: [
      'Global Shipping & Warehouse Telemetry Data',
      'Python Data Processing & Feature Engineering Engine',
      'Analytical Data Warehouse (PostgreSQL)',
      'Scikit-Learn Predictive Model Serving',
      'Interactive Operations Console'
    ]
  },
  {
    id: 'churnlab',
    slug: 'churnlab',
    name: 'ChurnLab',
    category: 'Machine Learning / MLOps',
    domain: 'Predictive Modeling & Experiment Tracking',
    tagline: 'Production-Style Customer Churn Prediction & MLOps Platform',
    description:
      'A robust MLOps platform featuring model lifecycle tracking, automated feature pipelines, FastAPI model serving, and an Angular monitoring frontend.',
    longDescription:
      'ChurnLab provides an end-to-end machine learning operational system for customer retention. It features automated feature engineering, experiment tracking and model registry with MLflow, containerized low-latency REST API prediction endpoints built with FastAPI, PostgreSQL storage, and an Angular dashboard for model drift inspection and batch predictions.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'scikit-learn', 'MLflow', 'Angular', 'Docker'],
    status: 'Active',
    github: 'https://github.com/MrTBK',
    image: '/catemer360.png',
    celestialId: 'planet-churnlab',
    metrics: [
      { label: 'Model Accuracy', value: '89.4% ROC-AUC' },
      { label: 'Inference Latency', value: '< 25ms' },
      { label: 'Tracking', value: 'MLflow Registry' },
      { label: 'Architecture', value: 'FastAPI + Angular' }
    ],
    highlights: [
      'Systematic experiment tracking, metric comparison, and artifact versioning using MLflow.',
      'Low-latency asynchronous model inference API built with FastAPI and Pydantic validation.',
      'Model interpretability and feature importance analysis highlighting churn drivers.',
      'Containerized full-stack deployment orchestrating API, registry, database, and UI.'
    ],
    features: [
      'Automated preprocessing and feature pipeline',
      'Hyperparameter tuning and cross-validation',
      'MLflow experiment logging and model artifact registry',
      'FastAPI asynchronous REST API with Swagger documentation',
      'Angular monitoring frontend for prediction scoring'
    ],
    architecture: [
      'Customer Telemetry & Billing Data',
      'Feature Engineering & Training Pipeline',
      'MLflow Model Registry & Artifact Store',
      'FastAPI Containerized Prediction Microservice',
      'Angular Frontend Monitoring Console'
    ]
  },
  {
    id: 'masroufi',
    slug: 'masroufi',
    name: 'Masroufi (مصروفي)',
    category: 'Mobile Application',
    domain: 'Privacy-First Personal Finance',
    tagline: '100% Offline Multi-Currency Personal Budgeting App',
    description:
      'A privacy-first personal finance and expense budgeting mobile app engineered with Flutter, encrypted local SQLite storage, and multilingual RTL/LTR support.',
    longDescription:
      'Masroufi ("My Expenses") eliminates cloud privacy vulnerabilities by running 100% offline. Built in Flutter with clean local SQLite persistence, it offers intuitive daily expense tracking, categorized financial analytics, budgeting thresholds, and full native support for Arabic (RTL), French, and English.',
    technologies: ['Flutter', 'SQLite', 'Dart', 'Arabic RTL', 'French', 'English', 'Local Storage'],
    status: 'Completed',
    github: 'https://github.com/MrTBK/Masroufi',
    image: '/masroufi.png',
    celestialId: 'planet-masroufi',
    metrics: [
      { label: 'Cloud Dependencies', value: '0% (100% Offline)' },
      { label: 'Languages', value: 'Arabic, French, English' },
      { label: 'Database', value: 'SQLite Local' },
      { label: 'Design', value: 'RTL / LTR Adaptive' }
    ],
    highlights: [
      'Complete local data privacy with zero external tracking or cloud synchronization.',
      'Native Arabic RTL layout alongside English and French localization.',
      'Visual analytics: category breakdown charts, monthly savings ratios, and budget limits.',
      'Rapid instant expense logging optimized for one-hand mobile interaction.'
    ],
    features: [
      'Zero-latency offline SQLite storage engine',
      'Multilingual interface with automatic RTL/LTR orientation',
      'Expense categories, tags, and recurrence scheduling',
      'Visual financial breakdown charts & monthly budgeting goals',
      'Local data backup and JSON export capabilities'
    ],
    architecture: [
      'Flutter Cross-Platform UI Layer',
      'State Management (Provider / BLoC)',
      'Local SQLite Database Engine (CRUD & Queries)',
      'Multilingual Localization Engine (i18n)',
      'Local Charting & Statistics Aggregator'
    ]
  },
  {
    id: 'coficab',
    slug: 'coficab',
    name: 'Coficab BI & AI Platform',
    category: 'Enterprise BI / Mission',
    domain: 'Industrial Automotive Data Platform',
    tagline: 'Enterprise Automated ETL, Data Warehouse & AI Chatbot Platform',
    description:
      'Automotive manufacturing data platform engineered during summer internship at COFICAB Group. Automated Excel ETL, SQL Server warehouse, Power BI dashboards, and AI query chatbot.',
    longDescription:
      'Developed during an intensive Business Intelligence & AI internship at COFICAB Group (Tunisia) under the mentorship of senior BI leadership. The platform automated ingestion of complex, heterogeneous Excel operational sheets into Microsoft SQL Server, enforced a strict data quarantine quality zone, modeled a star-schema analytical warehouse, developed executive Power BI dashboards, built a Flask & Angular administrative web portal, and integrated an AI conversational assistant allowing executives to query plant metrics in natural language.',
    technologies: ['Python', 'SQL Server', 'SSIS', 'Power BI', 'Flask', 'Angular', 'Data Warehouse', 'ETL'],
    status: 'Enterprise',
    github: 'https://github.com/MrTBK/coficab',
    image: '/coficab.png',
    celestialId: 'station-coficab',
    metrics: [
      { label: 'ETL Automation', value: '100% Hands-Free' },
      { label: 'Data Quality', value: 'Quarantine Gatekeeper' },
      { label: 'AI Query Engine', value: 'Natural Language' },
      { label: 'Company', value: 'COFICAB Group' }
    ],
    highlights: [
      'Designed and deployed automated ETL pipelines using Python and SSIS, eliminating manual Excel processing.',
      'Architected a dedicated quarantine holding zone preventing corrupted records from entering production tables.',
      'Engineered star-schema dimensional models on SQL Server for rapid executive querying.',
      'Delivered full-stack administrative interface (Angular + Flask) and Power BI executive dashboards.',
      'Integrated an enterprise AI chatbot enabling natural-language business metric queries.'
    ],
    features: [
      'Automated multi-source Excel extraction and schema validation',
      'Quarantine management console for corrupted record inspection',
      'SQL Server dimensional warehouse with SSMS optimization',
      'Interactive Power BI KPI dashboards for plant management',
      'Full-stack file management portal (Angular + Flask)',
      'Natural-language AI assistant for operational metrics'
    ],
    architecture: [
      'Industrial Plant Excel Operational Logs',
      'Python & SSIS Automated Cleaning & Transformation Engine',
      'Data Quality Quarantine & Production SQL Server Warehouse',
      'Full-Stack Web Console (Angular + Flask)',
      'Power BI Executive Dashboards & AI Query Assistant'
    ]
  },
  {
    id: 'robotics',
    slug: 'robotics',
    name: 'Robotics & Embedded Systems',
    category: 'Robotics & Hardware',
    domain: 'Microcontrollers & Autonomous Automation',
    tagline: 'Autonomous Vehicles, Omnidirectional Robotics & Youth Training',
    description:
      'Hardware and embedded programming portfolio spanning Bluetooth tele-operation, autonomous obstacle detection, Mecanum-wheel omnidirectional robots, and robotics mentorship.',
    longDescription:
      'Combining hardware design, circuit schematics, and embedded C++/C code on Arduino and ESP8266 platforms. Mohamed Aziz Tabakh serves as a Robotics Trainer at Youth Yes We Care Association, mentoring youth on hands-on robotics and preparing competitive teams for regional robotics tournaments. Personal projects include autonomous obstacle-avoiding cars, Bluetooth tele-operated vehicles, and a 4-wheel Mecanum robot.',
    technologies: ['Arduino', 'ESP8266', 'C++', 'C', 'IoT', 'Sensors', 'Bluetooth', 'Motor Controllers'],
    status: 'Active',
    github: 'https://github.com/MrTBK',
    image: '/competitions/bee-battle.jpg',
    celestialId: 'planet-robotics',
    metrics: [
      { label: 'Training Role', value: 'Youth Yes We Care' },
      { label: 'Embedded Lang', value: 'C / C++ / Wiring' },
      { label: 'Robots Built', value: 'Multiple Autonomous' },
      { label: 'Hardware', value: 'Arduino & ESP8266' }
    ],
    highlights: [
      'Robotics & Algorithmic Trainer at Youth Yes We Care Association since June 2024.',
      'Built Bluetooth tele-operated vehicle with mobile app controller interface.',
      'Engineered autonomous obstacle-avoiding robot with ultrasonic sensors and proactive steering logic.',
      'Designed Mecanum-wheel omnidirectional platform supporting 360-degree vector motion.'
    ],
    features: [
      'Ultrasonic distance detection & real-time path deviation algorithms',
      'Wireless Bluetooth serial protocol communication',
      'Mecanum wheel vector mathematics for holonomic motion',
      'Motor driver circuitry (L298N) and power management',
      'Robotics training curriculum development for aspiring young engineers'
    ],
    architecture: [
      'Embedded Microcontroller (Arduino Uno / Mega / ESP8266)',
      'Sensor Subsystem (Ultrasonic HC-SR04, Bluetooth HC-05)',
      'Actuator Subsystem (H-Bridge L298N, DC Gear Motors, Mecanum Wheels)',
      'Firmware Logic (C++ Interrupts, PWM, Control Loops)',
      'Mobile Tele-operation App Interface'
    ]
  },
  {
    id: 'maintiq',
    slug: 'maintiq',
    name: 'MaintIQ',
    category: 'Applied AI & Analytics',
    domain: 'Industrial Predictive Maintenance',
    tagline: 'Sensor Anomaly Detection & Failure Risk Analytics Platform',
    description:
      'Industrial equipment maintenance intelligence platform analyzing machinery sensor streams to identify anomaly patterns and mitigate downtime.',
    longDescription:
      'MaintIQ bridges industrial telemetry and data analytics. Ingesting vibration, temperature, and pressure sensor time-series data, it computes rolling z-score statistics and machine learning anomaly detection to evaluate failure risks and orchestrate preventative maintenance work orders.',
    technologies: ['Python', 'FastAPI', 'React', 'SQL', 'Pandas', 'scikit-learn', 'Docker'],
    status: 'Completed',
    github: 'https://github.com/MrTBK/MaintIQ',
    image: '/catemer360.png',
    celestialId: 'planet-dataforge',
    metrics: [
      { label: 'Sensor Analytics', value: 'Z-score & ML' },
      { label: 'Failure Prediction', value: 'Multi-variable' },
      { label: 'Backend', value: 'FastAPI' },
      { label: 'Focus', value: 'Industrial Industry 4.0' }
    ],
    highlights: [
      'Rolling statistical z-score evaluation for sudden equipment metric deviations.',
      'Failure likelihood ranking prioritized by component wear and operating hours.',
      'Interactive telemetry charts displaying historical machine sensor readings.'
    ],
    features: [
      'Continuous sensor stream ingestion',
      'Threshold and statistical anomaly detection',
      'Work order lifecycle management',
      'Machine health scorecard views'
    ]
  },
  {
    id: 'salespulse',
    slug: 'salespulse',
    name: 'SalesPulse',
    category: 'BI / Analytics',
    domain: 'Commercial Sales Intelligence',
    tagline: 'Dimensional Data Warehouse & Executive Sales Cockpit',
    description:
      'Commercial sales performance BI platform featuring dimensional modeling, automated ETL cleaning, and high-impact Power BI reporting.',
    longDescription:
      'SalesPulse provides complete visibility into sales revenue, representative quotas, regional penetration, and profit margin dynamics. Implemented with Kimball dimensional modeling and Power BI reporting.',
    technologies: ['SQL Server', 'Power BI', 'SSIS', 'Python', 'ETL', 'Data Warehousing'],
    status: 'Completed',
    github: 'https://github.com/MrTBK/SalesPulse',
    image: '/catemer360.png',
    celestialId: 'planet-customer360',
    metrics: [
      { label: 'Analytics Model', value: 'Kimball Star Schema' },
      { label: 'Reporting', value: 'Power BI Executive' },
      { label: 'Automation', value: 'ETL Pipelines' },
      { label: 'Domain', value: 'Retail & Commercial' }
    ],
    highlights: [
      'Structured dimensional star schema optimized for fast analytical aggregations.',
      'Automated extraction and reconciliation of sales transactions across regional branches.',
      'Executive dashboards featuring DAX metrics for YoY growth and margins.'
    ],
    features: [
      'Sales volume and margin analysis',
      'Regional distribution heatmaps',
      'Sales rep commission and quota tracking',
      'Automated data refresh schedules'
    ]
  }
];
