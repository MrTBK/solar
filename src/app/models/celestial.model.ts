export type CelestialType =
  | 'sun'
  | 'planet'
  | 'station'
  | 'system'
  | 'asteroid-belt'
  | 'education'
  | 'moon';

export interface CelestialSatelliteConfig {
  id: string;
  name: string;
  radius: number;
  distance: number;
  speed: number;
  color: string;
  label?: string;
}

export interface CelestialBodyConfig {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  type: CelestialType;
  radius: number;
  orbitDistance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  color: string;
  emissiveColor: string;
  textureType: 'sun' | 'industrial' | 'analytics' | 'logistics' | 'mlops' | 'finance' | 'station' | 'robotics' | 'education' | 'rock';
  roughness?: number;
  metalness?: number;
  ring?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
    opacity: number;
  };
  satellites?: CelestialSatelliteConfig[];
  cameraDistance: number;
  cameraElevation?: number;
  projectId?: string;
  stationId?: string;
  route?: string;
}
