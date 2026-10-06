export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ArchitectureStep {
  step: string;
  title: string;
  detail: string;
  tech?: string;
  badge?: 'source' | 'process' | 'validation' | 'storage' | 'serving' | 'analytics' | 'hardware';
}

export interface ProjectData {
  id: string;
  slug: string;
  name: string;
  category: string;
  domain: string;
  tagline: string;
  description: string;
  longDescription: string;
  problemSolved: string;
  engineeringDecisions: string[];
  measurableResults: string[];
  implementedFeatures: string[];
  plannedFeatures?: string[];
  technologies: string[];
  status: 'Production' | 'Active' | 'Open Source' | 'Completed' | 'Enterprise';
  github?: string;
  demo?: string;
  image?: string;
  metrics: ProjectMetric[];
  highlights: string[];
  features?: string[];
  architecture?: string[];
  architectureSteps: ArchitectureStep[];
  celestialId: string;
}

