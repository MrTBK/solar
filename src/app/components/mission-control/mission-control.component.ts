import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { CelestialBodyConfig } from '../../models/celestial.model';

@Component({
  selector: 'app-mission-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <aside
        class="fixed top-18 right-3 z-35 w-[340px] max-w-[calc(100vw-24px)] rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl md:right-6"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
            <h2 class="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
              MISSION CONTROL // HUD
            </h2>
          </div>
          <button
            (click)="close()"
            class="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            title="Close Mission Control"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Telemetry Readouts -->
        <div class="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div class="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2">
            <div class="text-[9px] text-slate-400 uppercase">Sector Focus</div>
            <div class="mt-0.5 truncate font-semibold text-white">{{ telemetry().targetName }}</div>
          </div>
          <div class="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2">
            <div class="text-[9px] text-slate-400 uppercase">Distance</div>
            <div class="mt-0.5 font-semibold text-cyan-300">{{ telemetry().distanceAU }}</div>
          </div>
          <div class="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2">
            <div class="text-[9px] text-slate-400 uppercase">Orbital Period</div>
            <div class="mt-0.5 font-semibold text-amber-300">{{ telemetry().orbitalPeriod }}</div>
          </div>
          <div class="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2">
            <div class="text-[9px] text-slate-400 uppercase">Core Temperature</div>
            <div class="mt-0.5 font-semibold text-rose-300">{{ telemetry().temperature }}</div>
          </div>
        </div>

        <!-- Simulation Speed -->
        <div class="mt-4 border-t border-slate-800/80 pt-3">
          <div class="flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span>ORBIT PROPULSION SPEED</span>
            <span class="text-cyan-400 font-semibold">{{ speed() }}x</span>
          </div>
          <div class="mt-2 grid grid-cols-4 gap-1.5 font-mono text-xs">
            @for (s of [0, 1, 2, 5]; track s) {
              <button
                (click)="setSpeed(s)"
                [class.bg-cyan-500]="speed() === s"
                [class.text-slate-950]="speed() === s"
                [class.font-bold]="speed() === s"
                [class.bg-slate-900]="speed() !== s"
                [class.text-slate-300]="speed() !== s"
                class="rounded-md border border-slate-700/60 py-1 transition-colors hover:border-cyan-400"
              >
                {{ s === 0 ? 'PAUSE' : s + 'x' }}
              </button>
            }
          </div>
        </div>

        <!-- View Layers Toggles -->
        <div class="mt-3 flex gap-2 font-mono text-xs">
          <button
            (click)="toggleOrbits()"
            [class.border-cyan-500]="showOrbits()"
            [class.text-cyan-300]="showOrbits()"
            class="flex-1 rounded-lg border border-slate-800 bg-slate-900/60 py-1.5 text-center text-slate-400 transition-colors hover:border-slate-600"
          >
            ORBITS: {{ showOrbits() ? 'ON' : 'OFF' }}
          </button>
          <button
            (click)="toggleLabels()"
            [class.border-cyan-500]="showLabels()"
            [class.text-cyan-300]="showLabels()"
            class="flex-1 rounded-lg border border-slate-800 bg-slate-900/60 py-1.5 text-center text-slate-400 transition-colors hover:border-slate-600"
          >
            LABELS: {{ showLabels() ? 'ON' : 'OFF' }}
          </button>
        </div>

        <!-- Celestial Jumps -->
        <div class="mt-4 border-t border-slate-800/80 pt-3">
          <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
            CELESTIAL RADAR [CLICK TO INTERCEPT]
          </div>
          <div class="mt-2 max-h-48 space-y-1 overflow-y-auto pr-1">
            @for (body of celestialBodies; track body.id) {
              <button
                (click)="selectBody(body)"
                [class.border-cyan-500]="selectedBody()?.id === body.id"
                [class.bg-cyan-500/15]="selectedBody()?.id === body.id"
                class="flex w-full items-center justify-between rounded-lg border border-slate-800/60 bg-slate-900/40 px-2.5 py-1.5 text-left transition-colors hover:border-slate-600 hover:bg-slate-800/50"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="h-2 w-2 rounded-full"
                    [style.background-color]="body.color"
                  ></span>
                  <span class="text-xs font-medium text-slate-200">{{ body.name }}</span>
                </div>
                <span class="font-mono text-[9px] text-slate-400 uppercase">
                  {{ body.category }}
                </span>
              </button>
            }
          </div>
        </div>

        <!-- Shortcuts footer -->
        <div class="mt-3 border-t border-slate-800/80 pt-2 font-mono text-[9px] text-slate-400">
          SHORTCUTS: <span class="text-slate-200">[ESC]</span> Return · <span class="text-slate-200">[1-9]</span> Jump · <span class="text-slate-200">[M]</span> Audio
        </div>
      </aside>
    }
  `
})
export class MissionControlComponent {
  private state = inject(StateService);

  public celestialBodies = CELESTIAL_BODIES;

  public isOpen = computed(() => this.state.isMissionControlOpen());
  public telemetry = computed(() => this.state.telemetry());
  public speed = computed(() => this.state.orbitSpeedMultiplier());
  public showOrbits = computed(() => this.state.showOrbitLines());
  public showLabels = computed(() => this.state.showLabels());
  public selectedBody = computed(() => this.state.selectedTarget());

  public close(): void {
    this.state.isMissionControlOpen.set(false);
  }

  public setSpeed(s: number): void {
    this.state.setOrbitSpeed(s);
  }

  public toggleOrbits(): void {
    this.state.toggleOrbitLines();
  }

  public toggleLabels(): void {
    this.state.toggleLabels();
  }

  public selectBody(body: CelestialBodyConfig): void {
    this.state.selectTarget(body, true);
  }
}
