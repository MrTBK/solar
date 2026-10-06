import { CelestialBodyConfig } from '../models/celestial.model';

export const CELESTIAL_BODIES: CelestialBodyConfig[] = [
  {
    id: 'sun-aziz',
    name: 'MOHAMED AZIZ TABAKH',
    subtitle: 'System Core & Personal Identity',
    category: 'System Core',
    type: 'sun',
    radius: 7.0,
    orbitDistance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.003,
    color: '#ffaa00',
    emissiveColor: '#ff8800',
    textureType: 'sun',
    cameraDistance: 22,
    cameraElevation: 6,
    route: '/about'
  },
  {
    id: 'planet-dataforge',
    name: 'DATAFORGE',
    subtitle: 'Production Data Engineering Platform',
    category: 'Data Engineering',
    type: 'planet',
    radius: 2.2,
    orbitDistance: 20,
    orbitSpeed: 0.002,
    rotationSpeed: 0.012,
    color: '#d97706',
    emissiveColor: '#78350f',
    textureType: 'industrial',
    roughness: 0.7,
    metalness: 0.3,
    ring: {
      innerRadius: 3.0,
      outerRadius: 4.2,
      color: '#f59e0b',
      opacity: 0.5
    },
    satellites: [
      {
        id: 'sat-dbt',
        name: 'dbt Core Node',
        radius: 0.35,
        distance: 4.8,
        speed: 0.025,
        color: '#ff6b4a'
      },
      {
        id: 'sat-airflow',
        name: 'Airflow DAG Daemon',
        radius: 0.3,
        distance: 5.6,
        speed: -0.018,
        color: '#38bdf8'
      }
    ],
    cameraDistance: 8.5,
    cameraElevation: 2.5,
    projectId: 'dataforge',
    route: '/projects/dataforge'
  },
  {
    id: 'planet-customer360',
    name: 'CUSTOMER360',
    subtitle: 'Customer Intelligence & Cohort Analytics',
    category: 'BI / Analytics',
    type: 'planet',
    radius: 2.5,
    orbitDistance: 34,
    orbitSpeed: 0.002,
    rotationSpeed: 0.009,
    color: '#0284c7',
    emissiveColor: '#0369a1',
    textureType: 'analytics',
    roughness: 0.5,
    metalness: 0.2,
    ring: {
      innerRadius: 3.4,
      outerRadius: 4.6,
      color: '#38bdf8',
      opacity: 0.4
    },
    satellites: [
      {
        id: 'sat-powerbi',
        name: 'Power BI Telemetry',
        radius: 0.4,
        distance: 5.2,
        speed: 0.02,
        color: '#fbbf24'
      },
      {
        id: 'sat-rfm',
        name: 'RFM Cluster Node',
        radius: 0.28,
        distance: 6.0,
        speed: 0.014,
        color: '#38bdf8'
      }
    ],
    cameraDistance: 9.5,
    cameraElevation: 2.8,
    projectId: 'customer360',
    route: '/projects/customer360'
  },
  {
    id: 'planet-supplychainiq',
    name: 'SUPPLYCHAINIQ',
    subtitle: 'Logistics Analytics & Demand Forecasting',
    category: 'Supply Chain Intelligence',
    type: 'planet',
    radius: 2.4,
    orbitDistance: 48,
    orbitSpeed: 0.002,
    rotationSpeed: 0.008,
    color: '#059669',
    emissiveColor: '#047857',
    textureType: 'logistics',
    roughness: 0.6,
    metalness: 0.3,
    ring: {
      innerRadius: 3.3,
      outerRadius: 4.8,
      color: '#34d399',
      opacity: 0.45
    },
    satellites: [
      {
        id: 'sat-inventory',
        name: 'Safety Stock Sentinel',
        radius: 0.3,
        distance: 5.4,
        speed: 0.019,
        color: '#10b981'
      },
      {
        id: 'sat-logistics',
        name: 'Delay Prediction Relay',
        radius: 0.35,
        distance: 6.3,
        speed: -0.015,
        color: '#6ee7b7'
      }
    ],
    cameraDistance: 9.2,
    cameraElevation: 2.7,
    projectId: 'supplychainiq',
    route: '/projects/supplychainiq'
  },
  {
    id: 'planet-churnlab',
    name: 'CHURNLAB',
    subtitle: 'Predictive MLOps & Real-Time Inference',
    category: 'Machine Learning / MLOps',
    type: 'planet',
    radius: 2.3,
    orbitDistance: 62,
    orbitSpeed: 0.002,
    rotationSpeed: 0.01,
    color: '#7c3aed',
    emissiveColor: '#6d28d9',
    textureType: 'mlops',
    roughness: 0.4,
    metalness: 0.4,
    ring: {
      innerRadius: 3.2,
      outerRadius: 4.4,
      color: '#a78bfa',
      opacity: 0.4
    },
    satellites: [
      {
        id: 'sat-mlflow',
        name: 'MLflow Registry Node',
        radius: 0.35,
        distance: 5.1,
        speed: 0.022,
        color: '#c084fc'
      },
      {
        id: 'sat-fastapi',
        name: 'FastAPI Microservice',
        radius: 0.3,
        distance: 5.9,
        speed: -0.017,
        color: '#2dd4bf'
      }
    ],
    cameraDistance: 9.0,
    cameraElevation: 2.6,
    projectId: 'churnlab',
    route: '/projects/churnlab'
  },
  {
    id: 'planet-masroufi',
    name: 'MASROUFI (مصروفي)',
    subtitle: 'Private Offline-First Personal Finance App',
    category: 'Mobile Application',
    type: 'planet',
    radius: 1.8,
    orbitDistance: 76,
    orbitSpeed: 0.002,
    rotationSpeed: 0.014,
    color: '#0d9488',
    emissiveColor: '#0f766e',
    textureType: 'finance',
    roughness: 0.3,
    metalness: 0.5,
    satellites: [
      {
        id: 'sat-sqlite',
        name: 'Local SQLite Cipher',
        radius: 0.28,
        distance: 3.8,
        speed: 0.03,
        color: '#5eead4'
      }
    ],
    cameraDistance: 7.8,
    cameraElevation: 2.2,
    projectId: 'masroufi',
    route: '/projects/masroufi'
  },
  {
    id: 'station-coficab',
    name: 'COFICAB MISSION',
    subtitle: 'Enterprise BI Platform & AI Assistant',
    category: 'Professional Mission',
    type: 'station',
    radius: 1.6,
    orbitDistance: 26,
    orbitSpeed: 0.002,
    rotationSpeed: 0.006,
    color: '#3b82f6',
    emissiveColor: '#1d4ed8',
    textureType: 'station',
    cameraDistance: 7.2,
    cameraElevation: 2.0,
    stationId: 'coficab-mission',
    projectId: 'coficab',
    route: '/experience'
  },
  {
    id: 'planet-robotics',
    name: 'ROBOTICS SYSTEM',
    subtitle: 'Embedded Hardware & Youth Robotics Mentorship',
    category: 'Robotics & Hardware',
    type: 'system',
    radius: 2.1,
    orbitDistance: 44,
    orbitSpeed: 0.002,
    rotationSpeed: 0.009,
    color: '#ea580c',
    emissiveColor: '#c2410c',
    textureType: 'robotics',
    roughness: 0.5,
    metalness: 0.6,
    satellites: [
      {
        id: 'moon-mecanum',
        name: 'Mecanum Omnidirectional',
        radius: 0.45,
        distance: 4.8,
        speed: 0.024,
        color: '#fb923c'
      },
      {
        id: 'moon-obstacle',
        name: 'Autonomous Obstacle Car',
        radius: 0.4,
        distance: 6.0,
        speed: -0.016,
        color: '#f97316'
      },
      {
        id: 'moon-bt',
        name: 'Bluetooth Tele-Op',
        radius: 0.35,
        distance: 7.2,
        speed: 0.013,
        color: '#fdba74'
      }
    ],
    cameraDistance: 8.8,
    cameraElevation: 2.5,
    projectId: 'robotics',
    route: '/skills'
  },
  {
    id: 'belt-competitive',
    name: 'ALGORITHMIC RING',
    subtitle: 'Competitive Programming & Hackathons',
    category: 'Problem Solving',
    type: 'asteroid-belt',
    radius: 1.2,
    orbitDistance: 64,
    orbitSpeed: 0.002,
    rotationSpeed: 0.004,
    color: '#94a3b8',
    emissiveColor: '#64748b',
    textureType: 'rock',
    cameraDistance: 12.0,
    cameraElevation: 4.0,
    route: '/experience'
  },
  {
    id: 'station-education',
    name: 'ACADEMIA ORBITAL',
    subtitle: 'ESEN Business Intelligence & Lycée M.A. Chammari',
    category: 'Education',
    type: 'education',
    radius: 1.7,
    orbitDistance: 84,
    orbitSpeed: 0.002,
    rotationSpeed: 0.005,
    color: '#6366f1',
    emissiveColor: '#4f46e5',
    textureType: 'education',
    cameraDistance: 7.5,
    cameraElevation: 2.2,
    route: '/education'
  }
];
