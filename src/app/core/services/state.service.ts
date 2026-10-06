import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CelestialBodyConfig } from '../../models/celestial.model';
import { ProjectData } from '../../models/project.model';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { PROJECTS_DATA } from '../../data/project.data';
import { SKILL_PLANETS, SkillPlanetItem } from '../../data/skill.data';
import { AudioService } from './audio.service';
import { DeviceService } from './device.service';

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
  | null;

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private router = inject(Router);
  private audio = inject(AudioService);
  private device = inject(DeviceService);

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

  // Explored percentage and counts
  public totalSkillPlanetsCount = SKILL_PLANETS.length;
  public exploredCount = computed(() => this.exploredPlanets().size);
  public allPlanetsExplored = computed(() => this.exploredCount() >= this.totalSkillPlanetsCount);

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
  public isCinematicIntroDone = signal<boolean>(false);
  public orbitSpeedMultiplier = signal<number>(1.0);
  public showOrbitLines = signal<boolean>(true);
  public showLabels = signal<boolean>(true);

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

  constructor() {
    // If WebGL is not supported, default to 2D
    if (!this.device.isWebGLSupported()) {
      this.is2DMode.set(true);
      this.isCinematicIntroDone.set(true);
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
    this.updateTelemetry(target);

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

    if (focusCelestial) {
      const celestial = CELESTIAL_BODIES.find((c) => c.projectId === projectId);
      if (celestial) {
        this.selectedTarget.set(celestial);
        this.updateTelemetry(celestial);
      }
    }

    this.router.navigate(['/projects', projectId], { replaceUrl: true });
  }

  public openModal(modal: ModalType, focusCelestial = true): void {
    this.activeModal.set(modal);
    this.activeProjectId.set(null);
    this.audio.playSelect();

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
    this.audio.playClose();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  public returnToSystem(): void {
    this.selectedTarget.set(null);
    this.activeModal.set(null);
    this.activeProjectId.set(null);
    this.audio.playFly();
    this.telemetry.set({
      targetName: 'SOLAR SYSTEM OVERVIEW',
      targetCategory: 'Full Sector Telemetry',
      distanceAU: '0.00 AU',
      orbitalPeriod: 'Omni-View',
      temperature: 'Sector Active'
    });
    this.router.navigate(['/'], { replaceUrl: true });
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

  public toggleSkillsRowMode(): void {
    const next = !this.isSkillsRowMode();
    this.setSkillsRowMode(next);
  }

  public setSkillsRowMode(val: boolean): void {
    this.isSkillsRowMode.set(val);
    this.audio.playToggle();
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

      // If all planets explored, trigger black hole!
      if (current.size >= this.totalSkillPlanetsCount) {
        setTimeout(() => {
          this.triggerBlackHole();
        }, 1200);
      }
    }
  }

  public openSkillPlanet(skillPlanet: SkillPlanetItem): void {
    this.activeSkillPlanet.set(skillPlanet);
    this.activeModal.set('skill-planet');
    this.audio.playSelect();
    this.explorePlanet(skillPlanet.id);
  }

  public triggerBlackHole(): void {
    if (this.isBlackHoleActive()) return;
    this.isBlackHoleActive.set(true);
    this.isBlackHoleCompleted.set(false);
    this.closeModal();
    this.audio.playBlackHoleRumble();
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
