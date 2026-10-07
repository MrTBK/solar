import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { DeviceService } from '../../core/services/device.service';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { CelestialBodyConfig } from '../../models/celestial.model';
import { SKILL_PLANETS, SkillPlanetItem } from '../../data/skill.data';

@Component({
  selector: 'app-radar-mini-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!is2DMode() && showRadar()) {
      <div class="pointer-events-none fixed right-3 bottom-16 z-30 md:right-6 md:bottom-16">
        <div
          class="pointer-events-auto relative rounded-2xl border border-cyan-500/30 bg-slate-950/90 shadow-2xl backdrop-blur-xl transition-all"
          [class.p-3]="!isMinimized()"
          [class.p-2]="isMinimized()"
          [class.w-48]="!isMinimized()"
          [class.w-auto]="isMinimized()"
        >
          <!-- Radar Header -->
          <div class="flex items-center justify-between" [class.pb-1.5]="!isMinimized()" [class.border-b]="!isMinimized()" [class.border-slate-800/80]="!isMinimized()">
            <button
              (click)="toggleMinimize()"
              class="flex items-center gap-1.5 font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer select-none"
              [title]="isMinimized() ? 'Expand Tactical Radar' : 'Minimize Tactical Radar'"
            >
              <span class="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" [class.animate-ping]="!isMinimized()"></span>
              <span>{{ isMinimized() ? '🛰️ RADAR' : 'TACTICAL RADAR' }}</span>
              <span class="text-slate-400 ml-1 text-[11px]">{{ isMinimized() ? '⤢' : '—' }}</span>
            </button>
          </div>

          @if (!isMinimized()) {
            <!-- Circular Radar Display -->
            <div class="relative mt-2 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
              <!-- Radial grid rings -->
              <div class="absolute h-36 w-36 rounded-full border border-cyan-500/10"></div>
              <div class="absolute h-28 w-28 rounded-full border border-cyan-500/15"></div>
              <div class="absolute h-20 w-20 rounded-full border border-cyan-500/20"></div>
              <div class="absolute h-12 w-12 rounded-full border border-cyan-500/25"></div>

              <!-- Crosshairs -->
              <div class="absolute h-full w-[1px] bg-cyan-500/15"></div>
              <div class="absolute h-[1px] w-full bg-cyan-500/15"></div>

              <!-- Rotating sweep line -->
              <div
                class="pointer-events-none absolute h-36 w-36 rounded-full border-r border-cyan-400/30 animate-spin"
                style="animation-duration: 4s;"
              ></div>

              <!-- Celestial Blips -->
              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 160 160">
                <!-- Sector Corridor Ray Guides -->
                <!-- Projects Corridor (Top-Right) -->
                <line x1="80" y1="80" x2="141" y2="45" stroke="rgba(56, 189, 248, 0.25)" stroke-width="0.8" stroke-dasharray="2,2" />
                <!-- Work Corridor (Bottom) -->
                <line x1="80" y1="80" x2="80" y2="150" stroke="rgba(99, 102, 241, 0.25)" stroke-width="0.8" stroke-dasharray="2,2" />
                <!-- Skills Corridor (Top-Left) -->
                <line x1="80" y1="80" x2="19" y2="45" stroke="rgba(52, 211, 153, 0.25)" stroke-width="0.8" stroke-dasharray="2,2" />

                <!-- Center: Sun -->
                <circle
                  cx="80"
                  cy="80"
                  r="4"
                  fill="#f59e0b"
                  class="cursor-pointer hover:r-5 transition-all"
                  (click)="onBlipClick(bodies[0])"
                >
                  <title>{{ bodies[0].name }} (Sun Core)</title>
                </circle>

                <!-- Orbiting career bodies (Circles) -->
                @for (body of orbitalBodies(); track body.id; let idx = $index) {
                  @if (getBlipCoords(body, idx); as coords) {
                    <!-- Orbit trace circle -->
                    <circle
                      cx="80"
                      cy="80"
                      [attr.r]="coords.r"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.12)"
                      stroke-width="0.5"
                    />

                    <!-- Blip point -->
                    <circle
                      [attr.cx]="coords.x"
                      [attr.cy]="coords.y"
                      [attr.r]="selectedBody()?.id === body.id ? 4 : 2.5"
                      [attr.fill]="body.color"
                      [attr.stroke]="selectedBody()?.id === body.id ? '#ffffff' : 'none'"
                      stroke-width="1"
                      class="cursor-pointer transition-all hover:scale-150"
                      (click)="onBlipClick(body)"
                    >
                      <title>{{ body.name }} ({{ body.category }})</title>
                    </circle>
                  }
                }

                <!-- Skill Planets (Diamonds) -->
                @for (sp of skillPlanets; track sp.id; let idx = $index) {
                  @if (getSkillBlipCoords(sp, idx); as coords) {
                    <!-- Orbit trace circle -->
                    <circle
                      cx="80"
                      cy="80"
                      [attr.r]="coords.r"
                      fill="none"
                      [attr.stroke]="sp.color + '26'"
                      stroke-width="0.5"
                      stroke-dasharray="1.5,1.5"
                    />

                    <!-- Diamond Blip -->
                    <rect
                      [attr.x]="coords.x - (activeSkillPlanet()?.id === sp.id ? 3.5 : 2.2)"
                      [attr.y]="coords.y - (activeSkillPlanet()?.id === sp.id ? 3.5 : 2.2)"
                      [attr.width]="activeSkillPlanet()?.id === sp.id ? 7 : 4.4"
                      [attr.height]="activeSkillPlanet()?.id === sp.id ? 7 : 4.4"
                      [attr.fill]="sp.color"
                      [attr.stroke]="activeSkillPlanet()?.id === sp.id ? '#ffffff' : 'none'"
                      stroke-width="1"
                      [attr.transform]="'rotate(45 ' + coords.x + ' ' + coords.y + ')'"
                      class="cursor-pointer transition-all hover:scale-150"
                      (click)="onSkillBlipClick(sp)"
                    >
                      <title>{{ sp.name }} (Skill Planet: {{ sp.category }})</title>
                    </rect>
                  }
                }
              </svg>

              <!-- Target indicator label -->
              @if (activeSkillPlanet(); as sp) {
                <div class="absolute bottom-1 left-2 font-mono text-[9px] text-emerald-400 truncate max-w-[130px]">
                  SKILL: {{ sp.name }}
                </div>
              } @else if (selectedBody(); as selected) {
                <div class="absolute bottom-1 left-2 font-mono text-[9px] text-cyan-300 truncate max-w-[130px]">
                  LOCK: {{ selected.name }}
                </div>
              }
            </div>

            <!-- Jump Hint Footer -->
            <div class="mt-1.5 flex items-center justify-between font-mono text-[9px] text-slate-400">
              <span class="text-[8px] text-slate-400">Proj ↗ | Work ↓ | Skill ↖</span>
              <button
                (click)="returnToOverview()"
                class="text-cyan-400 hover:text-white underline cursor-pointer"
              >
                RESET ⎋
              </button>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class RadarMiniMapComponent {
  private state = inject(StateService);
  private device = inject(DeviceService);

  public isMinimized = signal<boolean>(this.device.isMobile());
  public bodies = CELESTIAL_BODIES;
  public skillPlanets = SKILL_PLANETS;

  public is2DMode = computed(() => this.state.is2DMode());
  public showRadar = computed(() => this.state.showRadar());
  public selectedBody = computed(() => this.state.selectedTarget());
  public activeSkillPlanet = computed(() => this.state.activeSkillPlanet());

  public orbitalBodies = computed(() =>
    this.bodies.filter((b) => b.orbitDistance > 0 && b.type !== 'asteroid-belt')
  );

  private SECTOR_ANGLES = {
    projects: -Math.PI / 6,              // -30° (Top-Right corridor)
    work: Math.PI / 2,                   // +90° (Bottom/Front corridor)
    skills: (7 * Math.PI) / 6            // 210° (Top-Left corridor)
  };

  private skillOrbitDistances: Record<string, number> = {
    'skill-python': 22,
    'skill-bi': 34,
    'skill-algorithms': 46,
    'skill-web': 58,
    'skill-robotics': 70,
    'skill-mobile': 82
  };

  public toggleMinimize(): void {
    this.isMinimized.set(!this.isMinimized());
  }

  public onBlipClick(body: CelestialBodyConfig): void {
    this.state.selectTarget(body, true);
  }

  public onSkillBlipClick(sp: SkillPlanetItem): void {
    this.state.openSkillPlanet(sp);
  }

  public returnToOverview(): void {
    this.state.returnToSystem();
  }

  public getBlipCoords(body: CelestialBodyConfig, idx: number): { x: number; y: number; r: number } {
    const maxOrbit = 95;
    const maxRadius = 66;
    const r = Math.max(12, (body.orbitDistance / maxOrbit) * maxRadius);

    const isWork =
      body.id === 'station-coficab' ||
      body.id === 'planet-robotics' ||
      body.id === 'belt-competitive' ||
      body.id === 'station-education';
    const angle = isWork ? this.SECTOR_ANGLES.work : this.SECTOR_ANGLES.projects;

    const x = 80 + Math.cos(angle) * r;
    const y = 80 + Math.sin(angle) * r;

    return { x, y, r };
  }

  public getSkillBlipCoords(sp: SkillPlanetItem, idx: number): { x: number; y: number; r: number } {
    const dist = this.skillOrbitDistances[sp.id] ?? (22 + idx * 12);
    const maxOrbit = 95;
    const maxRadius = 66;
    const r = Math.max(12, (dist / maxOrbit) * maxRadius);

    const angle = this.SECTOR_ANGLES.skills;
    const x = 80 + Math.cos(angle) * r;
    const y = 80 + Math.sin(angle) * r;

    return { x, y, r };
  }
}
