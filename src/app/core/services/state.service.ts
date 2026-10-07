import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CelestialBodyConfig } from '../../models/celestial.model';
import { ProjectData } from '../../models/project.model';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { PROJECTS_DATA } from '../../data/project.data';
import { SKILL_PLANETS, SkillPlanetItem, ALL_TRACKED_PLANETS, TrackedPlanetItem } from '../../data/skill.data';
import { AudioService } from './audio.service';
import { DeviceService } from './device.service';
import { HapticService } from './haptic.service';

export type ModalType =
  | 'project'
  | 'skills'
  | 'experience'
  | 'education'
  | 'about'
  | 'contact'
  | 'competitions'
  | 'skill-planet'
  | 'black-hole-contact'
  | 'dossier'
  | null;

export interface TourStop {
  id: string;
  name: string;
  role: string;
  headline: string;
  description: string;
}

export const TOUR_STOPS: TourStop[] = [
  {
    id: 'sun-aziz',
    name: 'MOHAMED AZIZ TABAKH',
    role: 'System Core & Identity',
    headline: 'Data Developer & Business Intelligence Specialist',
    description: 'Transforming complex data into resilient warehouses, automated pipelines, and intelligent executive platforms.'
  },
  {
    id: 'planet-dataforge',
    name: 'DATAFORGE',
    role: 'Batch ETL & Data Ops',
    headline: 'Batch ETL Pipeline with Airflow & dbt Core',
    description: 'Automated validation rules, dimensional modeling on PostgreSQL, and containerized Docker DAG orchestration.'
  },
  {
    id: 'planet-customer360',
    name: 'CUSTOMER360',
    role: 'BI & Customer Intelligence',
    headline: '99,441 E-Commerce Orders Analyzed (Olist)',
    description: 'Kimball star schema, RFM customer segmentation, cohort retention matrices, and interactive Power BI executive dashboards.'
  },
  {
    id: 'planet-supplychainiq',
    name: 'SUPPLYCHAINIQ',
    role: 'Enterprise Analytics',
    headline: 'Multi-Echelon Logistics & Inventory Intelligence',
    description: 'Warehouse turnover monitoring, safety stock alerting, supplier performance KPIs, and supply bottleneck prediction.'
  },
  {
    id: 'planet-churnlab',
    name: 'CHURNLAB',
    role: 'Machine Learning / MLOps',
    headline: 'Predictive Churn Engine & MLflow Tracking',
    description: 'End-to-end ML lifecycle tracking, cross-validated classification, and asynchronous FastAPI inference serving.'
  },
  {
    id: 'planet-masroufi',
    name: 'MASROUFI',
    role: 'Mobile Engineering',
    headline: 'Offline-First Personal Expense Budgeting',
    description: 'Flutter/Dart local SQLite persistence, zero cloud dependencies, native Arabic RTL support, and budget pacing analytics.'
  },
  {
    id: 'station-coficab',
    name: 'COFICAB GROUP',
    role: 'Industry Experience',
    headline: 'Automotive Cable BI & Process Modernization',
    description: 'Developed automated workflow systems, supplier evaluation metrics, and cross-departmental analytics.'
  },
  {
    id: 'belt-competitive',
    name: 'COMPETITIVE PROGRAMMING',
    role: 'Algorithmic Belt',
    headline: 'TCPC Rank 32/100 National & Hackathon Winner',
    description: '200+ Codeforces problems solved, rigorous C++ data structures & graph theory, 1st Place Monopoly Hackathon.'
  }
];

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private router = inject(Router);
  private audio = inject(AudioService);
  private device = inject(DeviceService);
  private haptic = inject(HapticService);
  private title = inject(Title);
  private meta = inject(Meta);

  // Targets & Interaction
  public selectedTarget = signal<CelestialBodyConfig | null>(null);
  public hoveredTarget = signal<CelestialBodyConfig | null>(null);
  public hoverPosition = signal<{ x: number; y: number } | null>(null);

  // Skills Row Alignment Mode & Explored Planets
  public isSkillsRowMode = signal<boolean>(false);
  public exploredPlanets = signal<Set<string>>(new Set());
  public activeSkillPlanet = signal<SkillPlanetItem | null>(null);

  // Black Hole Cosmic Event
  public isBlackHoleActive = signal<boolean>(false);
  public isBlackHoleCompleted = signal<boolean>(false);

  // Explored percentage and counts for all planets (Projects + Skills)
  public allTrackedPlanets = ALL_TRACKED_PLANETS;
  public totalPlanetsCount = ALL_TRACKED_PLANETS.length;
  public totalSkillPlanetsCount = ALL_TRACKED_PLANETS.length;
  public exploredCount = computed(() => {
    const explored = this.exploredPlanets();
    return ALL_TRACKED_PLANETS.filter((p) => explored.has(p.id)).length;
  });
  public allPlanetsExplored = computed(() => this.exploredCount() >= this.totalPlanetsCount);

  // Modals & Active View
  public activeModal = signal<ModalType>(null);
  public activeProjectId = signal<string | null>(null);

  // Active Project computed
  public activeProject = computed<ProjectData | null>(() => {
    const id = this.activeProjectId();
    if (!id) return null;
    return PROJECTS_DATA.find((p) => p.id === id || p.slug === id) || null;
  });

  // Scene & HUD Settings
  public isMissionControlOpen = signal<boolean>(false);
  public is2DMode = signal<boolean>(false);
  public active2DSection = signal<string>('projects');
  public qualityLevel = signal<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  public isCinematicIntroDone = signal<boolean>(false);
  public orbitSpeedMultiplier = signal<number>(1.0);
  public showOrbitLines = signal<boolean>(true);
  public showLabels = signal<boolean>(true);
  public showRadar = signal<boolean>(true);

  // Guided Autopilot Tour
  public tourStops = TOUR_STOPS;
  public isTourActive = signal<boolean>(false);
  public tourIndex = signal<number>(0);
  public tourCountdown = signal<number>(8);
  public isTourPaused = signal<boolean>(false);
  private tourInterval: ReturnType<typeof setInterval> | null = null;

  // Tech Stack Interactive Filter
  public activeTechFilter = signal<string | null>(null);
  public availableTechFilters: string[] = [
    'Python',
    'PostgreSQL',
    'dbt',
    'Airflow',
    'Power BI',
    'Docker',
    'SQL',
    'C++',
    'Flutter'
  ];

  // Telemetry real-time data
  public telemetry = signal<{
    targetName: string;
    targetCategory: string;
    distanceAU: string;
    orbitalPeriod: string;
    temperature: string;
  }>({
    targetName: 'SYSTEM OVERVIEW',
    targetCategory: 'Solar Array Core',
    distanceAU: '0.00 AU',
    orbitalPeriod: 'Synchronous',
    temperature: '5778 K (Core)'
  });

  // Upgrades: Spaceship Flight Mode, Terminal, Constellation & AI Voice
  public isFlightMode = signal<boolean>(false);
  public flightVelocity = signal<number>(0);
  public isTerminalOpen = signal<boolean>(false);
  public isConstellationMode = signal<boolean>(false);
  public isDossierExportOpen = signal<boolean>(false);
  public isVoiceAssistantEnabled = signal<boolean>(true);

  constructor() {
    // If WebGL is not supported, default to 2D
    if (!this.device.isWebGLSupported()) {
      this.is2DMode.set(true);
      this.isCinematicIntroDone.set(true);
    }

    // Respect reduced motion
    if (this.device.prefersReducedMotion()) {
      this.orbitSpeedMultiplier.set(0);
    }
  }

  public finishCinematicIntro(): void {
    this.isCinematicIntroDone.set(true);
    this.audio.playFly();
  }

  public selectTarget(target: CelestialBodyConfig | null, openPanel = true): void {
    if (!target) {
      this.returnToSystem();
      return;
    }

    this.selectedTarget.set(target);
    this.audio.playSelect();
    this.haptic.medium();
    if (this.isVoiceAssistantEnabled()) {
      this.audio.speakVoice(`Entering orbit around ${target.name}`);
    }
    this.updateTelemetry(target);

    if (target.id !== 'sun-aziz') {
      this.explorePlanet(target.id);
    }

    if (openPanel) {
      if (target.projectId) {
        this.openProject(target.projectId, false);
      } else if (target.type === 'sun') {
        this.openModal('about', false);
      } else if (target.type === 'education') {
        this.openModal('education', false);
      } else if (target.type === 'asteroid-belt') {
        this.openModal('competitions', false);
      } else if (target.type === 'station') {
        this.openModal('experience', false);
      } else if (target.type === 'system') {
        this.openModal('skills', false);
      }
    }
  }

  public setHoveredTarget(target: CelestialBodyConfig | null, pos?: { x: number; y: number } | null): void {
    const prev = this.hoveredTarget();
    this.hoveredTarget.set(target);
    if (pos !== undefined) {
      this.hoverPosition.set(pos);
    }
    if (target && target.id !== prev?.id) {
      this.audio.playHover();
    }
  }

  public openProject(projectId: string, focusCelestial = true): void {
    this.activeProjectId.set(projectId);
    this.activeModal.set('project');
    this.audio.playSelect();

    const celestial = CELESTIAL_BODIES.find((c) => c.projectId === projectId || c.id === projectId);
    if (celestial) {
      this.explorePlanet(celestial.id);
    }

    const project = PROJECTS_DATA.find((p) => p.id === projectId || p.slug === projectId);
    if (project) {
      this.title.setTitle(`${project.name} // Mohamed Aziz Tabakh`);
      this.meta.updateTag({ name: 'description', content: project.description });
    }

    if (focusCelestial && celestial) {
      this.selectedTarget.set(celestial);
      this.updateTelemetry(celestial);
    }

    this.router.navigate(['/projects', projectId], { replaceUrl: true });
  }

  public openModal(modal: ModalType, focusCelestial = true): void {
    this.activeModal.set(modal);
    this.activeProjectId.set(null);
    this.audio.playSelect();

    if (modal) {
      const modalTitles: Record<string, string> = {
        about: 'About Mission Profile',
        skills: 'Capabilities Matrix',
        experience: 'Career Expeditions',
        education: 'Academic Degrees & Certifications',
        competitions: 'Competitive Programming & Honors',
        contact: 'Communication Channels',
        dossier: 'Recruiter Executive Dossier'
      };
      const titlePrefix = modalTitles[modal] || modal.toUpperCase();
      this.title.setTitle(`${titlePrefix} // Mohamed Aziz Tabakh`);
    }

    if (focusCelestial) {
      let targetId: string | null = null;
      if (modal === 'about') targetId = 'sun-aziz';
      else if (modal === 'education') targetId = 'station-education';
      else if (modal === 'experience') targetId = 'station-coficab';
      else if (modal === 'skills') targetId = 'planet-robotics';
      else if (modal === 'competitions') targetId = 'belt-competitive';

      if (targetId) {
        const body = CELESTIAL_BODIES.find((b) => b.id === targetId);
        if (body) {
          this.selectedTarget.set(body);
          this.updateTelemetry(body);
        }
      }
    }

    const route = modal ? `/${modal}` : '/';
    this.router.navigate([route], { replaceUrl: true });
  }

  public closeModal(): void {
    this.activeModal.set(null);
    this.activeProjectId.set(null);
    this.activeSkillPlanet.set(null);
    this.audio.playClose();
    this.title.setTitle('Mohamed Aziz Tabakh — 3D Solar System Portfolio');
    this.router.navigate(['/'], { replaceUrl: true });
  }

  public returnToSystem(): void {
    if (this.isTourActive()) {
      this.stopTour();
    }
    this.selectedTarget.set(null);
    this.activeModal.set(null);
    this.activeProjectId.set(null);
    this.activeSkillPlanet.set(null);
    this.isSkillsRowMode.set(false);
    this.audio.playFly();
    this.title.setTitle('Mohamed Aziz Tabakh — 3D Solar System Portfolio');
    this.telemetry.set({
      targetName: 'SOLAR SYSTEM OVERVIEW',
      targetCategory: 'Full Sector Telemetry',
      distanceAU: '0.00 AU',
      orbitalPeriod: 'Omni-View',
      temperature: 'Sector Active'
    });
    this.router.navigate(['/'], { replaceUrl: true });
  }

  public flyToSector(sector: 'system' | 'projects' | 'career' | 'skills' | 'about' | 'contact'): void {
    this.audio.playFly();
    this.closeModal();
    this.active2DSection.set(sector);

    switch (sector) {
      case 'system':
        this.returnToSystem();
        break;
      case 'projects': {
        const dataforge = CELESTIAL_BODIES.find((b) => b.id === 'planet-dataforge');
        if (dataforge) {
          this.selectTarget(dataforge, false);
        }
        break;
      }
      case 'career': {
        const coficab = CELESTIAL_BODIES.find((b) => b.id === 'station-coficab');
        if (coficab) {
          this.selectTarget(coficab, false);
        }
        break;
      }
      case 'skills': {
        const skillsBody = CELESTIAL_BODIES.find((b) => b.id === 'planet-robotics');
        if (skillsBody) {
          this.selectTarget(skillsBody, false);
        }
        break;
      }
      case 'about': {
        const sun = CELESTIAL_BODIES.find((b) => b.id === 'sun-aziz');
        if (sun) {
          this.selectTarget(sun, false);
          this.openModal('about', false);
        }
        break;
      }
      case 'contact':
        this.openModal('contact', false);
        break;
    }
  }

  public setQualityLevel(level: 'HIGH' | 'MEDIUM' | 'LOW'): void {
    this.qualityLevel.set(level);
    this.audio.playToggle();
  }

  public toggle2DMode(): void {
    const next = !this.is2DMode();
    this.is2DMode.set(next);
    this.audio.playToggle();
  }

  public toggleMissionControl(): void {
    const next = !this.isMissionControlOpen();
    this.isMissionControlOpen.set(next);
    this.audio.playToggle();
  }

  public toggleRadar(): void {
    this.showRadar.set(!this.showRadar());
    this.audio.playToggle();
  }

  public setOrbitSpeed(multiplier: number): void {
    this.orbitSpeedMultiplier.set(multiplier);
    this.audio.playToggle();
  }

  public toggleOrbitLines(): void {
    this.showOrbitLines.set(!this.showOrbitLines());
    this.audio.playToggle();
  }

  public toggleLabels(): void {
    this.showLabels.set(!this.showLabels());
    this.audio.playToggle();
  }

  // --- GUIDED AUTOPILOT TOUR ---

  public startTour(): void {
    this.closeModal();
    this.isSkillsRowMode.set(false);
    this.isTourActive.set(true);
    this.tourIndex.set(0);
    this.tourCountdown.set(8);
    this.isTourPaused.set(false);
    this.audio.playFly();

    this.focusTourStop(0);

    if (this.tourInterval) clearInterval(this.tourInterval);
    this.tourInterval = setInterval(() => {
      if (this.isTourPaused()) return;
      const count = this.tourCountdown() - 1;
      if (count <= 0) {
        this.nextTourStop();
      } else {
        this.tourCountdown.set(count);
      }
    }, 1000);
  }

  public toggleTour(): void {
    if (this.isTourActive()) {
      this.stopTour();
    } else {
      this.startTour();
    }
  }

  public stopTour(): void {
    if (this.tourInterval) {
      clearInterval(this.tourInterval);
      this.tourInterval = null;
    }
    this.isTourActive.set(false);
    this.audio.playClose();
  }

  public toggleTourPause(): void {
    const next = !this.isTourPaused();
    this.isTourPaused.set(next);
    this.audio.playToggle();
  }

  public nextTourStop(): void {
    const nextIdx = (this.tourIndex() + 1) % this.tourStops.length;
    this.tourIndex.set(nextIdx);
    this.tourCountdown.set(8);
    this.focusTourStop(nextIdx);
    this.audio.playFly();
  }

  public prevTourStop(): void {
    const prevIdx = (this.tourIndex() - 1 + this.tourStops.length) % this.tourStops.length;
    this.tourIndex.set(prevIdx);
    this.tourCountdown.set(8);
    this.focusTourStop(prevIdx);
    this.audio.playFly();
  }

  private focusTourStop(idx: number): void {
    const stop = this.tourStops[idx];
    const body = CELESTIAL_BODIES.find((b) => b.id === stop.id);
    if (body) {
      this.selectedTarget.set(body);
      this.updateTelemetry(body);
    }
  }

  // --- TECH STACK INTERACTIVE FILTER ---

  public setTechFilter(tech: string | null): void {
    if (this.activeTechFilter() === tech) {
      this.activeTechFilter.set(null);
    } else {
      this.activeTechFilter.set(tech);
    }
    this.audio.playToggle();
  }

  public isBodyMatchingTech(bodyId: string): boolean {
    const filter = this.activeTechFilter();
    if (!filter) return true;

    const body = CELESTIAL_BODIES.find((b) => b.id === bodyId);
    if (!body || !body.projectId) return false;

    const project = PROJECTS_DATA.find((p) => p.id === body.projectId);
    if (!project) return false;

    return project.technologies.some((t) => t.toLowerCase().includes(filter.toLowerCase()));
  }

  // --- SKILLS ROW & RECRUITER QUEST ---

  public toggleSkillsRowMode(): void {
    const next = !this.isSkillsRowMode();
    this.setSkillsRowMode(next);
  }

  public setSkillsRowMode(val: boolean): void {
    this.isSkillsRowMode.set(val);
    this.audio.playToggle();
    if (this.isVoiceAssistantEnabled()) {
      this.audio.speakVoice(val ? 'Planetary alignment protocol engaged.' : 'Standard orbital coordinates restored.');
    }
    if (val) {
      this.closeModal();
      this.telemetry.set({
        targetName: 'SKILLS PLANETARY ALIGNMENT',
        targetCategory: 'Linear Planetary Syzygy',
        distanceAU: '0.00 AU',
        orbitalPeriod: 'Row Locked',
        temperature: 'Aligned Fleet'
      });
    } else {
      this.returnToSystem();
    }
  }

  public explorePlanet(id: string): void {
    const current = new Set(this.exploredPlanets());
    if (!current.has(id)) {
      current.add(id);
      this.exploredPlanets.set(current);
      this.audio.playExplorationCheck();
      this.haptic.success();

      // If all planets (Projects + Skills) are explored, trigger cosmic singularity!
      const count = ALL_TRACKED_PLANETS.filter((p) => current.has(p.id)).length;
      if (count >= this.totalPlanetsCount) {
        setTimeout(() => {
          this.triggerBlackHole();
        }, 1200);
      }
    }
  }

  public focusCelestialBody(id: string): void {
    const celestial = CELESTIAL_BODIES.find((c) => c.id === id);
    if (celestial) {
      this.selectTarget(celestial, true);
    }
  }

  public openSkillPlanet(skillPlanet: SkillPlanetItem): void {
    this.activeSkillPlanet.set(skillPlanet);
    this.activeModal.set('skill-planet');
    this.audio.playSelect();
    this.haptic.medium();
    if (this.isVoiceAssistantEnabled()) {
      this.audio.speakVoice(`Skill node: ${skillPlanet.name}`);
    }
    this.telemetry.set({
      targetName: skillPlanet.name,
      targetCategory: `Skill Planet // ${skillPlanet.category}`,
      distanceAU: '0.00 AU',
      orbitalPeriod: 'Specialized Discipline',
      temperature: 'Active Mastery'
    });
    this.explorePlanet(skillPlanet.id);
  }

  public triggerBlackHole(): void {
    if (this.isBlackHoleActive()) return;
    this.isBlackHoleActive.set(true);
    this.isBlackHoleCompleted.set(false);
    this.closeModal();
    this.audio.playBlackHoleRumble();
    this.haptic.heavy();
    if (this.isVoiceAssistantEnabled()) {
      this.audio.speakVoice('Warning: Gravitational collapse detected. Singularity forming.');
    }
  }

  public onBlackHoleCompleted(): void {
    this.isBlackHoleActive.set(false);
    this.isBlackHoleCompleted.set(true);
    this.activeModal.set('black-hole-contact');
    this.audio.playSelect();
  }

  public resetUniverse(): void {
    this.isBlackHoleActive.set(false);
    this.isBlackHoleCompleted.set(false);
    this.exploredPlanets.set(new Set());
    this.activeModal.set(null);
    this.isSkillsRowMode.set(false);
    this.audio.playBigBang();
    this.returnToSystem();
  }

  // --- UPGRADE METHODS ---

  public toggleFlightMode(): boolean {
    const next = !this.isFlightMode();
    this.isFlightMode.set(next);
    this.audio.playToggle();
    this.haptic.medium();
    if (next) {
      this.closeModal();
      if (this.isVoiceAssistantEnabled()) {
        this.audio.speakVoice('Flight controls online. Manual pilot mode engaged.');
      }
    } else {
      if (this.isVoiceAssistantEnabled()) {
        this.audio.speakVoice('Pilot mode disengaged. Orbital stabilization active.');
      }
    }
    return next;
  }

  public setFlightVelocity(vel: number): void {
    this.flightVelocity.set(vel);
  }

  public toggleTerminal(): boolean {
    const next = !this.isTerminalOpen();
    this.isTerminalOpen.set(next);
    this.audio.playToggle();
    this.haptic.light();
    return next;
  }

  public toggleConstellationMode(): boolean {
    const next = !this.isConstellationMode();
    this.isConstellationMode.set(next);
    this.audio.playToggle();
    this.haptic.light();
    if (this.isVoiceAssistantEnabled()) {
      this.audio.speakVoice(next ? 'Skill constellation matrix online.' : 'Constellations hidden.');
    }
    return next;
  }

  public openDossierExport(): void {
    this.isDossierExportOpen.set(true);
    this.audio.playSelect();
    this.haptic.medium();
  }

  public closeDossierExport(): void {
    this.isDossierExportOpen.set(false);
    this.audio.playClose();
  }

  public toggleVoiceAssistant(): boolean {
    const next = !this.isVoiceAssistantEnabled();
    this.isVoiceAssistantEnabled.set(next);
    this.audio.playToggle();
    if (next) {
      this.audio.speakVoice('AI Mission Control Voice Online.');
    }
    return next;
  }

  private updateTelemetry(body: CelestialBodyConfig): void {
    const au = (body.orbitDistance * 0.05).toFixed(2);
    let temp = '300 K';
    if (body.type === 'sun') temp = '5778 K';
    else if (body.orbitDistance < 30) temp = '420 K';
    else if (body.orbitDistance < 70) temp = '275 K';
    else temp = '140 K';

    this.telemetry.set({
      targetName: body.name,
      targetCategory: body.category,
      distanceAU: `${au} AU`,
      orbitalPeriod: body.orbitSpeed > 0 ? `${(1 / body.orbitSpeed).toFixed(0)} d` : 'Static Core',
      temperature: temp
    });
  }
}
