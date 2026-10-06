import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { SKILL_PLANETS } from '../../data/skill.data';

@Component({
  selector: 'app-recruiter-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isBlackHoleActive() && !isBlackHoleCompleted()) {
      <div
        class="pointer-events-none fixed top-16 left-3 z-30 max-w-[320px] sm:max-w-none md:left-6"
      >
        <div
          class="pointer-events-auto rounded-xl border border-cyan-500/30 bg-slate-950/85 p-3 shadow-xl backdrop-blur-xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span class="font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
                RECRUITER SCANNER
              </span>
            </div>
            <span class="rounded bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">
              {{ exploredCount() }} / {{ totalPlanets }} EXPLORED
            </span>
          </div>

          <!-- Planet Dots Bar -->
          <div class="mt-2.5 flex items-center gap-1.5">
            @for (planet of planets; track planet.id) {
              <button
                (click)="onPlanetPipClick(planet)"
                [title]="planet.name"
                class="group relative flex-1 h-2 rounded-full transition-all"
                [class.bg-emerald-400]="isPlanetExplored(planet.id)"
                [class.shadow-[0_0_8px_#34d399]]="isPlanetExplored(planet.id)"
                [class.bg-slate-800]="!isPlanetExplored(planet.id)"
              >
                <!-- Tooltip on hover -->
                <span
                  class="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {{ planet.category }}
                </span>
              </button>
            }
          </div>

          <!-- Actions -->
          <div class="mt-3 flex items-center gap-2 font-mono text-[11px]">
            <!-- Toggle Skills Row Mode -->
            <button
              (click)="toggleRowMode()"
              [class.bg-cyan-500]="isRowMode()"
              [class.text-slate-950]="isRowMode()"
              [class.font-bold]="isRowMode()"
              [class.bg-slate-900]="!isRowMode()"
              [class.text-slate-300]="!isRowMode()"
              class="flex-1 rounded-lg border border-cyan-500/40 px-2.5 py-1.5 text-center transition-colors hover:border-cyan-400"
            >
              {{ isRowMode() ? '🌌 ALIGNED IN ROW' : '🪐 ALIGN IN ROW' }}
            </button>

            <!-- Trigger Black Hole Button -->
            <button
              (click)="triggerBlackHole()"
              class="rounded-lg border border-purple-500/50 bg-purple-500/20 px-2.5 py-1.5 font-bold text-purple-200 transition-all hover:bg-purple-500/40 hover:text-white hover:scale-103"
              title="Trigger Cosmic Black Hole Gravitational Collapse"
            >
              🕳️ BLACK HOLE
            </button>
          </div>

          <div class="mt-2 text-[10px] text-slate-400 font-mono">
            Check all 6 planets to summon the Black Hole &amp; reveal Contacts!
          </div>
        </div>
      </div>
    }
  `
})
export class RecruiterTrackerComponent {
  private state = inject(StateService);

  public planets = SKILL_PLANETS;
  public totalPlanets = SKILL_PLANETS.length;

  public isRowMode = computed(() => this.state.isSkillsRowMode());
  public exploredCount = computed(() => this.state.exploredCount());
  public isBlackHoleActive = computed(() => this.state.isBlackHoleActive());
  public isBlackHoleCompleted = computed(() => this.state.isBlackHoleCompleted());

  public isPlanetExplored(id: string): boolean {
    return this.state.exploredPlanets().has(id);
  }

  public onPlanetPipClick(planet: any): void {
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
