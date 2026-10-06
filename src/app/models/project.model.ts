export interface ProjectMetric {
  label: string;
  value: string;
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
  technologies: string[];
  status: 'Production' | 'Active' | 'Open Source' | 'Completed' | 'Enterprise';
  github?: string;
  demo?: string;
  image?: string;
  metrics: ProjectMetric[];
  highlights: string[];
  features?: string[];
  architecture?: string[];
  celestialId: string;
}
