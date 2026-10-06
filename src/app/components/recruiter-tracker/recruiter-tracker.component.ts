import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { SKILL_PLANETS, SkillPlanetItem } from '../../data/skill.data';

@Component({
  selector: 'app-recruiter-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isBlackHoleActive() && !isBlackHoleCompleted()) {
      <div class="pointer-events-none fixed top-16 left-3 z-30 md:left-6">
        <div
          class="pointer-events-auto rounded-xl border border-cyan-500/30 bg-slate-950/85 shadow-xl backdrop-blur-xl transition-all"
          [class.max-w-xs]="!collapsed()"
        >
          <!-- Header (always visible) -->
          <div class="flex items-center justify-between gap-2 px-3 py-2.5">
            <button
              (click)="toggleCollapsed()"
              class="flex items-center gap-2 min-w-0"
              title="Toggle recruiter tracker"
            >
              <span class="inline-block h-2 w-2 shrink-0 rounded-full bg-cyan-400 animate-ping"></span>
              @if (!collapsed()) {
                <span class="font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase truncate">
                  RECRUITER SCANNER
                </span>
              }
            </button>
            <div class="flex items-center gap-2 shrink-0">
              <span class="rounded bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold whitespace-nowrap">
                {{ exploredCount() }}<span class="text-cyan-500">/</span>{{ totalPlanets }}
              </span>
              <button
                (click)="toggleCollapsed()"
                class="text-slate-400 hover:text-white transition-colors text-xs font-mono leading-none"
              >
                {{ collapsed() ? '▶' : '◀' }}
              </button>
            </div>
          </div>

          @if (!collapsed()) {
            <div class="px-3 pb-3">
              <!-- Progress bar -->
              <div class="mb-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  [style.width.%]="progressPercent()"
                ></div>
              </div>

              <!-- Planet Dots Bar -->
              <div class="flex items-center gap-1.5">
                @for (planet of planets; track planet.id) {
                  <button
                    (click)="onPlanetPipClick(planet)"
                    [title]="planet.name + (isPlanetExplored(planet.id) ? ' ✓ Explored' : ' — not explored')"
                    class="group relative flex-1 h-2.5 rounded-full transition-all duration-300"
                    [class.bg-emerald-400]="isPlanetExplored(planet.id)"
                    [class.bg-slate-700]="!isPlanetExplored(planet.id)"
                  >
                    <!-- Tooltip on hover -->
                    <span
                      class="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-50"
                    >
                      {{ planet.name }}
                    </span>
                  </button>
                }
              </div>

              <!-- Actions -->
              <div class="mt-3 flex items-center gap-2 font-mono text-[11px]">
                <!-- Toggle Skills Row Mode -->
                <button
                  (click)="toggleRowMode()"
                  class="flex-1 rounded-lg border border-cyan-500/40 px-2.5 py-1.5 text-center transition-colors"
                  [class.bg-cyan-500]="isRowMode()"
                  [class.text-slate-950]="isRowMode()"
                  [class.font-bold]="isRowMode()"
                  [class.bg-slate-900]="!isRowMode()"
                  [class.text-slate-300]="!isRowMode()"
                >
                  {{ isRowMode() ? '🌌 ROW [ON]' : '🪐 ALIGN ROW' }}
                </button>

                <!-- Trigger Black Hole Button -->
                <button
                  (click)="triggerBlackHole()"
                  class="rounded-lg border border-purple-500/50 bg-purple-500/20 px-2.5 py-1.5 font-bold text-purple-200 transition-all hover:bg-purple-500/40 hover:text-white"
                  title="Trigger Cosmic Black Hole — Gravitational Collapse"
                >
                  🕳️
                </button>
              </div>

              <div class="mt-2 text-[10px] text-slate-400 font-mono leading-snug">
                @if (allExplored()) {
                  <span class="text-emerald-400 font-bold animate-pulse">✓ ALL EXPLORED — SUMMON BLACK HOLE ↑</span>
                } @else {
                  Explore all {{ totalPlanets }} skill planets → Black Hole → Contacts
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

  public planets = SKILL_PLANETS;
  public totalPlanets = SKILL_PLANETS.length;
  public collapsed = signal<boolean>(false);

  public isRowMode = computed(() => this.state.isSkillsRowMode());
  public exploredCount = computed(() => this.state.exploredCount());
  public isBlackHoleActive = computed(() => this.state.isBlackHoleActive());
  public isBlackHoleCompleted = computed(() => this.state.isBlackHoleCompleted());
  public allExplored = computed(() => this.state.allPlanetsExplored());
  public progressPercent = computed(() => (this.exploredCount() / this.totalPlanets) * 100);

  public isPlanetExplored(id: string): boolean {
    return this.state.exploredPlanets().has(id);
  }

  public toggleCollapsed(): void {
    this.collapsed.set(!this.collapsed());
  }

  public onPlanetPipClick(planet: SkillPlanetItem): void {
    this.state.setSkillsRowMode(true);
    this.state.openSkillPlanet(planet);
  }

  public toggleRowMode(): void {
    this.state.toggleSkillsRowMode();
  }

  public triggerBlackHole(): void {
    this.state.triggerBlackHole();
  }
}
