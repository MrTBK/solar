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
    problemSolved:
      'Ingestion of inconsistent transactional data frequently corrupts downstream analytical warehouses or halts entire ETL pipelines. DataForge isolates non-compliant records in a dedicated quarantine zone while continuing to process clean records into production marts.',
    engineeringDecisions: [
      'Quarantine Staging vs. Pipeline Halting: Isolated non-compliant records into a dedicated schema with error logs rather than failing the entire batch, ensuring data availability for downstream analytics.',
      'dbt Core for Dimensional Transformation: Decoupled raw extraction from modeling logic, enabling version-controlled transformations, lineage tracking, and schema testing in SQL.',
      'Kimball Star Schema on PostgreSQL: Designed Fact_Sales and conformed dimension tables (Dim_Customer, Dim_Product, Dim_Date) optimized for analytical aggregation queries.',
      'Containerized Task Orchestration: Deployed Apache Airflow with Docker Compose for deterministic environment reproduction, task retry logic, and DAG scheduling.'
    ],
    measurableResults: [
      'Automated multi-stage schema and null validation rules applied to all incoming batch transactions.',
      'Audit-ready quarantine logging capturing original record payload and failure reason.',
      'Automated dbt documentation and dependency lineage graph generation.',
      'Multi-container Docker Compose deployment orchestrating Airflow, PostgreSQL, and dbt.'
    ],
    implementedFeatures: [
      'Batch CSV file ingestion engine',
      'Multi-stage data validation & quality assertion rules',
      'PostgreSQL staging and isolated quarantine tables',
      'dbt Core Kimball star schema transformations',
      'Apache Airflow scheduled DAGs and retry logic',
      'Containerized Docker Compose configuration'
    ],
    plannedFeatures: [
      'Great Expectations integration for automated dataset profiling',
      'CDC (Change Data Capture) streaming ingestion via Kafka / Debezium'
    ],
    technologies: ['Python', 'PostgreSQL', 'dbt', 'Airflow', 'Docker', 'SQL', 'Bash'],
    status: 'Production',
    github: 'https://github.com/MrTBK/DataForge',
    image: '/dataforge.png',
    celestialId: 'planet-dataforge',
    metrics: [
      { label: 'Validation Rules', value: 'Automated Schema Checks' },
      { label: 'Warehouse Schema', value: 'Kimball Star Schema' },
      { label: 'Orchestration', value: 'Docker & Airflow' },
      { label: 'Data Quarantine', value: 'Isolated Error Staging' }
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
      'Raw Source Data (CSV / JSON)',
      'Python Validation & Ingestion Engine',
      'PostgreSQL Staging & Quarantine Tables',
      'dbt Transform -> Star Schema Data Warehouse',
      'Analytical Marts & Metric Views'
    ],
    architectureSteps: [
      { step: '01', title: 'RAW DATA', detail: 'Ingestion of multi-source retail transaction CSV and JSON files', tech: 'Filesystem / S3', badge: 'source' },
      { step: '02', title: 'INGESTION', detail: 'Python ingestion engine loading raw records into staging tables', tech: 'Python / SQLAlchemy', badge: 'process' },
      { step: '03', title: 'VALIDATION', detail: 'Schema integrity, null checks, and value range assertion engine', tech: 'Pandas / SQL', badge: 'validation' },
      { step: '04', title: 'QUARANTINE', detail: 'Non-compliant records routed to quarantine schema with error metadata', tech: 'PostgreSQL', badge: 'storage' },
      { step: '05', title: 'DBT TRANSFORMATION', detail: 'Staging, dimensional cleaning, and business logic execution', tech: 'dbt Core', badge: 'process' },
      { step: '06', title: 'STAR SCHEMA', detail: 'Analytical fact and dimension tables (Fact_Sales, Dim_Customers)', tech: 'PostgreSQL DWH', badge: 'storage' },
      { step: '07', title: 'ANALYTICS', detail: 'Materialized analytical views and BI consumption endpoints', tech: 'SQL Views / BI', badge: 'analytics' }
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
    problemSolved:
      'E-commerce leadership lacked consolidated visibility into customer repurchase behavior, lifetime value, and churn rates across disparate relational tables in the Brazilian Olist ecosystem.',
    engineeringDecisions: [
      'Dimensional Star Schema on PostgreSQL: Denormalized relational tables into conformed dimensions (Dim_Customers, Dim_Products, Dim_Geolocation) and transaction facts (Fact_Orders, Fact_Order_Items).',
      'Algorithmic RFM Segmentation: Calculated Recency, Frequency, and Monetary scores using statistical quintiles to cluster buyers into actionable tiers (Champions, At-Risk, Hibernating).',
      'Cohort Retention Matrix: Engineered monthly acquisition cohorts to measure retention decay and repurchase velocity over time.',
      'Power BI Executive Modeling: Created DAX measures for YoY growth, average order value (AOV), and customer retention rate.'
    ],
    measurableResults: [
      '95,560 unique customer profiles and 99,441 verified orders processed and analyzed.',
      'Automated behavioral RFM segmentation identifying high-value customer clusters.',
      '12-month cohort retention matrix tracking customer decay rates.',
      'Multi-page interactive Power BI dashboard with geographic and category drill-downs.'
    ],
    implementedFeatures: [
      'Relational data cleaning & normalization pipeline',
      'PostgreSQL dimensional star-schema warehouse',
      'RFM segmentation algorithm & loyalty tiering',
      'Cohort retention analysis engine',
      'Interactive Power BI executive dashboards'
    ],
    plannedFeatures: [
      'Predictive customer lifetime value (CLV) regression model',
      'Automated email notification triggers for at-risk accounts'
    ],
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
      'PostgreSQL Dimensional Warehouse',
      'Analytical Views & RFM Scoring Engine',
      'Interactive Power BI Reporting Layer'
    ],
    architectureSteps: [
      { step: '01', title: 'OLIST DATA', detail: 'Multi-table relational datasets (Orders, Customers, Items, Payments)', tech: 'Raw CSVs', badge: 'source' },
      { step: '02', title: 'ETL CLEANING', detail: 'Deduplication, timestamp formatting, and address normalization', tech: 'Python / Pandas', badge: 'process' },
      { step: '03', title: 'DWH MODELING', detail: 'Kimball star schema with Fact_Orders and dimensional entities', tech: 'PostgreSQL', badge: 'storage' },
      { step: '04', title: 'RFM SEGMENTATION', detail: 'Quintile scoring based on Recency, Frequency, and Monetary value', tech: 'SQL / Python', badge: 'process' },
      { step: '05', title: 'COHORT RETENTION', detail: 'Monthly acquisition cohorts calculating retention decay', tech: 'Pandas / DAX', badge: 'analytics' },
      { step: '06', title: 'EXECUTIVE BI', detail: 'Interactive Power BI decision dashboards with drill-through filters', tech: 'Power BI / DAX', badge: 'analytics' }
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
      'End-to-end supply chain analytics platform delivering inventory monitoring, supplier evaluation, delivery delay risk prediction, and dynamic safety stock optimization.',
    longDescription:
      'Engineered on historical logistics and supply chain data, SupplyChainIQ bridges physical inventory movements with quantitative business intelligence. It automates reorder point calculations, detects bottleneck suppliers, flags late deliveries before arrival, and empowers managers with proactive risk mitigation tools.',
    problemSolved:
      'Procurement and logistics teams face unpredictable delivery delays and excess carrying costs when using static inventory thresholds and manual supplier reviews.',
    engineeringDecisions: [
      'Delivery Delay Classifier: Trained Scikit-Learn classification models on shipment telemetry, carrier modes, origin-destination routes, and order characteristics.',
      'Dynamic Safety Stock Formulation: Replaced static rule-of-thumb buffers with statistical safety stock calculations incorporating lead time variance and demand standard deviation.',
      'Supplier Risk Scorecards: Aggregated historical fulfillment on-time rates and defect frequencies into quantitative supplier reliability tiers.',
      'Streamlit Decision Console: Provided a lightweight interactive web dashboard for supply chain planners to simulate inventory thresholds.'
    ],
    measurableResults: [
      'Classification model estimating probability of transit delivery delays.',
      'Statistical safety stock and Economic Order Quantity (EOQ) calculations across inventory categories.',
      'Supplier performance rating matrix categorizing supplier reliability tiers.',
      'Interactive Streamlit operations dashboard for logistics planners.'
    ],
    implementedFeatures: [
      'Logistics data processing & feature engineering pipeline',
      'Delivery delay risk prediction model',
      'Dynamic safety stock & EOQ calculation engine',
      'Supplier scorecard rating system',
      'Streamlit operational web console'
    ],
    plannedFeatures: [
      'Real-time weather and traffic disruption API integrations',
      'Automated purchase order generation via ERP webhooks'
    ],
    technologies: ['Python', 'PostgreSQL', 'scikit-learn', 'SQL', 'ETL', 'Pandas', 'Streamlit'],
    status: 'Production',
    github: 'https://github.com/MrTBK/SupplyChainIQ',
    image: '/supplychainiq.png',
    celestialId: 'planet-supplychainiq',
    metrics: [
      { label: 'Risk Prediction', value: 'Classification Model' },
      { label: 'Safety Stock', value: 'Dynamic Formulas' },
      { label: 'Data Warehouse', value: 'PostgreSQL Marts' },
      { label: 'Interface', value: 'Streamlit Console' }
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
    ],
    architectureSteps: [
      { step: '01', title: 'LOGISTICS DATA', detail: 'Historical shipping manifests, inventory levels, and supplier orders', tech: 'Relational DB', badge: 'source' },
      { step: '02', title: 'FEATURE ENGINE', detail: 'Lead-time calculation, route encoding, and demand standard deviation', tech: 'Python / Pandas', badge: 'process' },
      { step: '03', title: 'RISK MODEL', detail: 'Scikit-learn classification predicting late shipment probabilities', tech: 'scikit-learn', badge: 'process' },
      { step: '04', title: 'INVENTORY LOGIC', detail: 'Statistical safety stock and Economic Order Quantity (EOQ) modeling', tech: 'Python Engine', badge: 'process' },
      { step: '05', title: 'SUPPLIER MATRIX', detail: 'Lead-time variance and delivery reliability scorecards', tech: 'PostgreSQL Views', badge: 'analytics' },
      { step: '06', title: 'OPERATIONS UI', detail: 'Interactive Streamlit console for simulation and threshold alerts', tech: 'Streamlit', badge: 'serving' }
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
      'ChurnLab provides an end-to-end machine learning operational system for customer retention. It features automated feature engineering, experiment tracking and model registry with MLflow, containerized asynchronous REST API prediction endpoints built with FastAPI, PostgreSQL storage, and an Angular dashboard for customer scoring and model inspection.',
    problemSolved:
      'Machine learning prototypes frequently fail to provide business value due to lack of experiment tracking, difficult model versioning, and slow manual deployment workflows.',
    engineeringDecisions: [
      'MLflow for Experiment Tracking: Recorded hyperparameters, cross-validation metrics, and model artifacts to ensure complete experiment reproducibility.',
      'FastAPI for Low-Latency Serving: Built asynchronous REST endpoints with Pydantic schema validation for real-time inference requests.',
      'Scikit-Learn Feature Pipeline: Packaged encoders, standard scalers, and the classification model into a single serialized pipeline object to prevent train-serve skew.',
      'Decoupled Angular UI: Implemented a responsive frontend allowing analysts to test individual customer feature combinations.'
    ],
    measurableResults: [
      'Systematic experiment tracking and model artifact versioning using MLflow.',
      'Asynchronous REST API prediction endpoints with OpenAPI / Swagger documentation.',
      'Scikit-Learn classification pipeline with stratified cross-validation.',
      'Decoupled Angular frontend for real-time customer feature scoring.'
    ],
    implementedFeatures: [
      'Automated preprocessing and feature pipeline',
      'Model training with cross-validation',
      'MLflow experiment logging and artifact registry',
      'FastAPI asynchronous REST API with Swagger documentation',
      'Angular frontend for interactive prediction scoring'
    ],
    plannedFeatures: [
      'Data drift and concept drift monitoring using Evidently AI',
      'Automated retraining pipeline triggered by drift alerts'
    ],
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'scikit-learn', 'MLflow', 'Angular', 'Docker'],
    status: 'Active',
    github: 'https://github.com/MrTBK',
    image: '/catemer360.png',
    celestialId: 'planet-churnlab',
    metrics: [
      { label: 'Evaluation Metric', value: 'ROC-AUC & Cross-Val' },
      { label: 'Tracking', value: 'MLflow Registry' },
      { label: 'API Serving', value: 'FastAPI Async' },
      { label: 'Frontend', value: 'Angular Console' }
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
    ],
    architectureSteps: [
      { step: '01', title: 'DATA INGESTION', detail: 'Customer tenure, contract terms, billing data, and usage metrics', tech: 'PostgreSQL / CSV', badge: 'source' },
      { step: '02', title: 'PREPROCESSING', detail: 'Categorical one-hot encoding, feature scaling, and missing value imputation', tech: 'scikit-learn Pipeline', badge: 'process' },
      { step: '03', title: 'TRAINING', detail: 'Model training with stratified cross-validation and hyperparameter tuning', tech: 'scikit-learn', badge: 'process' },
      { step: '04', title: 'MLFLOW REGISTRY', detail: 'Logging metrics, model parameters, and serialized artifact versions', tech: 'MLflow', badge: 'storage' },
      { step: '05', title: 'FASTAPI SERVING', detail: 'Asynchronous REST microservice with Pydantic request validation', tech: 'FastAPI / Uvicorn', badge: 'serving' },
      { step: '06', title: 'ANGULAR UI', detail: 'Web console for submitting customer features and visualizing churn risk', tech: 'Angular 22', badge: 'analytics' }
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
      'A privacy-first personal finance and expense budgeting mobile app engineered with Flutter, local SQLite persistence, and multilingual RTL/LTR support.',
    longDescription:
      'Masroufi ("My Expenses") eliminates cloud privacy vulnerabilities by running 100% offline. Built in Flutter with local SQLite persistence, it offers intuitive daily expense tracking, categorized financial analytics, budgeting thresholds, and native support for Arabic (RTL), French, and English.',
    problemSolved:
      'Most financial budgeting apps require remote user accounts and cloud synchronization, creating data privacy concerns and failing without reliable internet connections.',
    engineeringDecisions: [
      '100% Offline-First Architecture: Zero external network calls or cloud dependencies, keeping all personal financial records strictly on the local device.',
      'Local SQLite Persistence: Implemented relational SQLite schema for fast daily transaction queries, category aggregation, and monthly comparisons.',
      'Native Arabic RTL Support: Designed adaptive Right-to-Left and Left-to-Right layout rendering supporting Arabic, French, and English seamlessly.',
      'Clean State Management in Flutter: Structured application state for rapid one-hand expense logging and interactive breakdown charts.'
    ],
    measurableResults: [
      '100% offline operational capability with zero external cloud dependencies.',
      'Native multilingual localization supporting Arabic (RTL), French, and English.',
      'Sub-second query response times for historical transactions via local SQLite.',
      'Interactive monthly category breakdown and budget threshold tracking.'
    ],
    implementedFeatures: [
      'Local SQLite database schema and CRUD operations',
      'Multilingual interface with automatic RTL/LTR orientation',
      'Expense categories, tags, and recurrence scheduling',
      'Visual financial breakdown charts & monthly budgeting goals',
      'Local data backup and JSON export capabilities'
    ],
    plannedFeatures: [
      'CSV transaction import from bank statement exports',
      'Automated monthly PDF summary report generation'
    ],
    technologies: ['Flutter', 'SQLite', 'Dart', 'Arabic RTL', 'French', 'English', 'Local Storage'],
    status: 'Completed',
    github: 'https://github.com/MrTBK/Masroufi',
    image: '/masroufi.png',
    celestialId: 'planet-masroufi',
    metrics: [
      { label: 'Cloud Dependencies', value: '0% (100% Offline)' },
      { label: 'Languages', value: 'Arabic, French, English' },
      { label: 'Database', value: 'SQLite Local' },
      { label: 'Layout', value: 'Adaptive RTL / LTR' }
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
    ],
    architectureSteps: [
      { step: '01', title: 'FLUTTER UI', detail: 'Cross-platform reactive interface supporting native Arabic RTL and LTR', tech: 'Flutter / Dart', badge: 'serving' },
      { step: '02', title: 'STATE LAYER', detail: 'Reactive state management handling rapid transaction inputs', tech: 'Provider / BLoC', badge: 'process' },
      { step: '03', title: 'SQLITE PERSISTENCE', detail: 'Local on-device relational database for expense records and categories', tech: 'SQLite / sqflite', badge: 'storage' },
      { step: '04', title: 'BUDGET ENGINE', detail: 'Calculation of category expenditure thresholds and monthly savings', tech: 'Dart Business Logic', badge: 'process' },
      { step: '05', title: 'LOCAL CHARTS', detail: 'Interactive spending breakdowns, trend analysis, and JSON backup export', tech: 'Flutter Charts', badge: 'analytics' }
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
      'Developed during a Business Intelligence internship at COFICAB Group (Tunisia). The platform automated ingestion of complex, heterogeneous Excel operational sheets into Microsoft SQL Server, enforced a data quarantine quality zone, modeled a star-schema analytical warehouse, developed executive Power BI dashboards, built a Flask & Angular administrative web portal, and integrated an AI conversational assistant allowing executives to query plant metrics in natural language.',
    problemSolved:
      'Industrial automotive manufacturing plant reporting relied on disparate manual Excel spreadsheets, leading to human errors, reporting latency, and lack of real-time operational visibility.',
    engineeringDecisions: [
      'Automated Python & SSIS Ingestion: Built robust extraction pipelines to parse complex operational Excel files, eliminating manual data entry.',
      'Data Quarantine Zone: Routed schema mismatches and invalid values into a dedicated quarantine area to protect production analytical tables.',
      'SQL Server Kimball Star Schema: Designed dimensional models with fact tables (Fact_Production, Fact_Waste) and conformed dimensions for rapid querying.',
      'Full-Stack Console & AI Query Assistant: Created an Angular + Flask portal for file management with an embedded natural language assistant for querying plant KPIs.'
    ],
    measurableResults: [
      'Automated extraction eliminating manual Excel data consolidation across departments.',
      'Quarantine holding zone preventing corrupted inputs from reaching production reporting.',
      'Star-schema dimensional models on Microsoft SQL Server supporting executive Power BI dashboards.',
      'Full-stack administrative web portal (Angular + Flask) and AI natural language assistant prototype.'
    ],
    implementedFeatures: [
      'Automated multi-source Excel extraction and schema validation',
      'Quarantine management for corrupted record inspection',
      'SQL Server dimensional warehouse with SSMS optimization',
      'Interactive Power BI KPI dashboards for plant management',
      'Full-stack file management portal (Angular + Flask)',
      'Natural-language AI assistant prototype for operational metrics'
    ],
    plannedFeatures: [
      'Direct integration with PLC / SCADA industrial IoT machinery sensors'
    ],
    technologies: ['Python', 'SQL Server', 'SSIS', 'Power BI', 'Flask', 'Angular', 'Data Warehouse', 'ETL'],
    status: 'Enterprise',
    github: 'https://github.com/MrTBK/coficab',
    image: '/coficab.png',
    celestialId: 'station-coficab',
    metrics: [
      { label: 'ETL Automation', value: 'Python & SSIS' },
      { label: 'Data Quality', value: 'Quarantine Staging' },
      { label: 'Query Interface', value: 'Natural Language AI' },
      { label: 'Host Organization', value: 'COFICAB Group' }
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
    ],
    architectureSteps: [
      { step: '01', title: 'OPERATIONAL DATA', detail: 'Plant production logs, cable manufacturing metrics, and scrap reports', tech: 'Excel Sheets', badge: 'source' },
      { step: '02', title: 'ETL PIPELINE', detail: 'Automated extraction, normalization, and data cleansing', tech: 'Python / SSIS', badge: 'process' },
      { step: '03', title: 'QUARANTINE ZONE', detail: 'Validation gateway routing corrupted records to isolated staging', tech: 'SQL Server', badge: 'validation' },
      { step: '04', title: 'DIMENSIONAL DWH', detail: 'Kimball star schema with production facts and machine dimensions', tech: 'Microsoft SQL Server', badge: 'storage' },
      { step: '05', title: 'EXECUTIVE BI', detail: 'Interactive Power BI dashboards tracking plant efficiency and yield', tech: 'Power BI', badge: 'analytics' },
      { step: '06', title: 'WEB PORTAL & AI', detail: 'Angular + Flask administrative console with natural-language query engine', tech: 'Flask / Angular / NLP', badge: 'serving' }
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
    problemSolved:
      'Connecting theoretical algorithmic logic and software programming to physical microcontroller hardware, while developing practical STEM robotics training curricula for youth.',
    engineeringDecisions: [
      'Microcontroller Selection: Deployed Arduino Uno/Mega and ESP8266 boards for real-time sensor polling, PWM motor control, and Wi-Fi telemetry.',
      'Mecanum Kinematic Calculations: Implemented vector mathematics for 4-wheel independent Mecanum drives to achieve 360-degree holonomic movement.',
      'Ultrasonic Obstacle Avoidance: Created real-time distance polling algorithms with proactive course correction logic.',
      'Modular Robotics Training Curriculum: Designed step-by-step laboratory modules on breadboard prototyping, H-bridges, and embedded C++.'
    ],
    measurableResults: [
      'Multiple functional autonomous and wireless robotic vehicle prototypes designed and built.',
      'Lead Robotics Trainer at Youth Yes We Care Association since June 2024.',
      'Mentored competitive youth teams for regional robotics challenges and hackathons.'
    ],
    implementedFeatures: [
      'Ultrasonic distance detection & real-time path deviation algorithms',
      'Wireless Bluetooth serial protocol communication',
      'Mecanum wheel vector mathematics for holonomic motion',
      'Motor driver circuitry (L298N) and power management',
      'Robotics training curriculum development for young students'
    ],
    plannedFeatures: [
      'Computer vision line tracking and object recognition via ESP32-CAM'
    ],
    technologies: ['Arduino', 'ESP8266', 'C++', 'C', 'IoT', 'Sensors', 'Bluetooth', 'Motor Controllers'],
    status: 'Active',
    github: 'https://github.com/MrTBK',
    image: '/competitions/bee-battle.jpg',
    celestialId: 'planet-robotics',
    metrics: [
      { label: 'Mentorship Role', value: 'Youth Yes We Care' },
      { label: 'Languages', value: 'Embedded C / C++' },
      { label: 'Hardware', value: 'Arduino & ESP8266' },
      { label: 'Platforms', value: 'Autonomous & Tele-Op' }
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
    ],
    architectureSteps: [
      { step: '01', title: 'MICROCONTROLLERS', detail: 'Arduino Uno/Mega and ESP8266 processing real-time control loops', tech: 'Atmega328P / ESP8266', badge: 'hardware' },
      { step: '02', title: 'SENSOR SUBSYSTEM', detail: 'Ultrasonic HC-SR04, Bluetooth HC-05, and wheel speed encoders', tech: 'Sensors / Serial', badge: 'hardware' },
      { step: '03', title: 'ACTUATOR DRIVERS', detail: 'L298N Dual H-Bridges controlling DC motors with PWM speed regulation', tech: 'H-Bridges / PWM', badge: 'hardware' },
      { step: '04', title: 'FIRMWARE LOGIC', detail: 'Non-blocking control loops, hardware interrupts, and vector kinematics', tech: 'Embedded C / C++', badge: 'process' },
      { step: '05', title: 'MOBILE TELE-OP', detail: 'Wireless serial protocol connecting mobile smartphone app to vehicle', tech: 'Bluetooth Serial', badge: 'serving' },
      { step: '06', title: 'TRAINING LABS', detail: 'Hands-on curriculum labs for Youth Yes We Care robotics students', tech: 'Pedagogy / STEM', badge: 'analytics' }
    ]
  }
];
