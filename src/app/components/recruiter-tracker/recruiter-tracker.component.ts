import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { ALL_TRACKED_PLANETS, SKILL_PLANETS, TrackedPlanetItem } from '../../data/skill.data';

@Component({
  selector: 'app-recruiter-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isBlackHoleActive() && !isBlackHoleCompleted()) {
      <div class="pointer-events-none fixed top-16 left-3 z-30 md:left-6">
        <div
          class="pointer-events-auto rounded-xl border border-cyan-500/30 bg-slate-950/90 shadow-xl backdrop-blur-xl transition-all"
          [class.w-72]="!collapsed()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between gap-2 px-3 py-2.5">
            <button
              (click)="toggleCollapsed()"
              class="flex items-center gap-2 min-w-0 focus:outline-none"
              title="Toggle Exploration Status"
              aria-label="Toggle Exploration Status"
            >
              <span class="inline-block h-2 w-2 shrink-0 rounded-full bg-cyan-400 animate-ping"></span>
              @if (!collapsed()) {
                <span class="font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase truncate">
                  PLANETARY EXPLORATION
                </span>
              }
            </button>
            <div class="flex items-center gap-2 shrink-0">
              <span class="rounded bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold whitespace-nowrap">
                {{ exploredCount() }}<span class="text-cyan-500">/</span>{{ totalPlanets }}
              </span>
              <button
                (click)="toggleCollapsed()"
                aria-label="Collapse exploration tracker"
                class="text-slate-400 hover:text-white transition-colors text-xs font-mono leading-none focus:outline-none"
              >
                {{ collapsed() ? '▶' : '◀' }}
              </button>
            </div>
          </div>

          @if (!collapsed()) {
            <div class="px-3 pb-3">
              <!-- Progress bar -->
              <div class="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  class="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                  [style.width.%]="progressPercent()"
                ></div>
              </div>

              <!-- Project Planets Group (5) -->
              <div class="mb-2.5">
                <div class="mb-1 flex items-center justify-between text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <span>PROJECT FLEET</span>
                  <span>{{ exploredProjectsCount() }}/5</span>
                </div>
                <div class="flex items-center gap-1.5">
                  @for (planet of projectPlanets(); track planet.id) {
                    <button
                      (click)="onPlanetClick(planet)"
                      [title]="planet.name + ' (' + planet.category + ')' + (isPlanetExplored(planet.id) ? ' ✓ Explored' : ' — click to inspect')"
                      class="group relative flex-1 h-2.5 rounded-full transition-all duration-300 focus:outline-none"
                      [style.backgroundColor]="isPlanetExplored(planet.id) ? planet.color : '#334155'"
                      [class.ring-2]="isPlanetExplored(planet.id)"
                      [class.ring-amber-400/50]="isPlanetExplored(planet.id)"
                    >
                      <span
                        class="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-50 font-mono shadow-xl"
                      >
                        {{ planet.shortName }}
                      </span>
                    </button>
                  }
                </div>
              </div>

              <!-- Skill Planets Group (6) -->
              <div>
                <div class="mb-1 flex items-center justify-between text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <span>SKILLS MATRIX</span>
                  <span>{{ exploredSkillsCount() }}/6</span>
                </div>
                <div class="flex items-center gap-1.5">
                  @for (planet of skillPlanets(); track planet.id) {
                    <button
                      (click)="onPlanetClick(planet)"
                      [title]="planet.name + ' (' + planet.category + ')' + (isPlanetExplored(planet.id) ? ' ✓ Explored' : ' — click to inspect')"
                      class="group relative flex-1 h-2.5 rounded-full transition-all duration-300 focus:outline-none"
                      [style.backgroundColor]="isPlanetExplored(planet.id) ? planet.color : '#334155'"
                      [class.ring-2]="isPlanetExplored(planet.id)"
                      [class.ring-cyan-400/50]="isPlanetExplored(planet.id)"
                    >
                      <span
                        class="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-50 font-mono shadow-xl"
                      >
                        {{ planet.shortName }}
                      </span>
                    </button>
                  }
                </div>
              </div>

              <!-- Actions: Align All Planets & Trigger Singularity -->
              <div class="mt-3 flex items-center gap-2 font-mono text-[11px]">
                <!-- Toggle All Planets Row Alignment Mode -->
                <button
                  (click)="toggleRowMode()"
                  class="flex-1 rounded-lg border border-cyan-500/40 px-2.5 py-1.5 text-center transition-colors focus:outline-none"
                  [class.bg-cyan-500]="isRowMode()"
                  [class.text-slate-950]="isRowMode()"
                  [class.font-bold]="isRowMode()"
                  [class.bg-slate-900]="!isRowMode()"
                  [class.text-slate-300]="!isRowMode()"
                  title="Align all planets in a straight syzygy line or restore orbital mechanics"
                >
                  {{ isRowMode() ? '🌌 RESTORE ORBITS' : '🪐 ALIGN ALL PLANETS' }}
                </button>

                <!-- Trigger Black Hole Singularity -->
                <button
                  (click)="triggerBlackHole()"
                  class="rounded-lg border border-purple-500/50 bg-purple-500/20 px-2.5 py-1.5 font-bold text-purple-200 transition-all hover:bg-purple-500/40 hover:text-white focus:outline-none"
                  title="Singularity: Gravitational Collapse Event & Contact Terminal"
                >
                  🕳️
                </button>
              </div>

              <div class="mt-2 text-[10px] text-slate-400 font-mono leading-snug">
                @if (allExplored()) {
                  <span class="text-emerald-400 font-bold">✓ All 11 Planets Explored — Gravitational collapse initiated!</span>
                } @else {
                  Inspect all {{ totalPlanets }} project & skill planets to trigger cosmic singularity
                }
              </div>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class RecruiterTrackerComponent {
  private state = inject(StateService);

  public allPlanets = ALL_TRACKED_PLANETS;
  public totalPlanets = ALL_TRACKED_PLANETS.length;
  public collapsed = signal<boolean>(false);

  public projectPlanets = computed(() => this.allPlanets.filter((p) => p.type === 'project'));
  public skillPlanets = computed(() => this.allPlanets.filter((p) => p.type === 'skill'));

  public isRowMode = computed(() => this.state.isSkillsRowMode());
  public exploredCount = computed(() => this.state.exploredCount());
  public isBlackHoleActive = computed(() => this.state.isBlackHoleActive());
  public isBlackHoleCompleted = computed(() => this.state.isBlackHoleCompleted());
  public allExplored = computed(() => this.state.allPlanetsExplored());
  public progressPercent = computed(() => (this.exploredCount() / this.totalPlanets) * 100);

  public exploredProjectsCount = computed(() =>
    this.projectPlanets().filter((p) => this.isPlanetExplored(p.id)).length
  );

  public exploredSkillsCount = computed(() =>
    this.skillPlanets().filter((p) => this.isPlanetExplored(p.id)).length
  );

  public isPlanetExplored(id: string): boolean {
    return this.state.exploredPlanets().has(id);
  }

  public toggleCollapsed(): void {
    this.collapsed.set(!this.collapsed());
  }

  public onPlanetClick(planet: TrackedPlanetItem): void {
    if (planet.type === 'project' && planet.projectId) {
      this.state.openProject(planet.projectId, true);
    } else {
      const sp = SKILL_PLANETS.find((s) => s.id === planet.id);
      if (sp) {
        this.state.openSkillPlanet(sp);
      }
    }
  }

  public toggleRowMode(): void {
    this.state.toggleSkillsRowMode();
  }

  public triggerBlackHole(): void {
    this.state.triggerBlackHole();
  }
}
