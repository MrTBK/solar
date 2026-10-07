import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { AudioService } from '../../core/services/audio.service';
import { HapticService } from '../../core/services/haptic.service';

@Component({
  selector: 'app-orrery-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Bottom Right Tactical Mission Bar -->
    @if (!activeModal() && !isFlightMode()) {
      <aside aria-label="Orbital Controls" class="pointer-events-none fixed bottom-4 right-4 z-30 hidden lg:flex flex-col items-end gap-2 font-mono">
        <!-- Orrery Time Machine Bar -->
        <div
          class="pointer-events-auto flex items-center gap-1.5 rounded-2xl border border-slate-800/90 bg-slate-950/90 p-1.5 text-xs text-slate-300 shadow-2xl backdrop-blur-xl transition-all"
        >
          <!-- Live Stardate / Chronometer -->
          <div class="px-2.5 py-1 text-[11px] font-bold text-cyan-400 border-r border-slate-800/80">
            <span class="text-slate-500">STARDATE: </span>
            <span>{{ stardate() }}</span>
          </div>

          <!-- Speed presets -->
          <button
            (click)="setSpeed(-3)"
            [class.bg-cyan-500/20]="speedMult() === -3"
            [class.text-cyan-300]="speedMult() === -3"
            class="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reverse orbital motion"
          >
            -3x ⟲
          </button>

          <button
            (click)="setSpeed(0)"
            [class.bg-amber-500/20]="speedMult() === 0"
            [class.text-amber-300]="speedMult() === 0"
            class="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Freeze planetary orbits"
          >
            {{ speedMult() === 0 ? '⏸ PAUSED' : '⏸ 0x' }}
          </button>

          <button
            (click)="setSpeed(1)"
            [class.bg-cyan-500/20]="speedMult() === 1"
            [class.text-cyan-300]="speedMult() === 1"
            class="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Real-time orbital speed"
          >
            1x
          </button>

          <button
            (click)="setSpeed(5)"
            [class.bg-cyan-500/20]="speedMult() === 5"
            [class.text-cyan-300]="speedMult() === 5"
            class="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="5x orbital simulation speed"
          >
            5x
          </button>

          <button
            (click)="setSpeed(20)"
            [class.bg-purple-500/20]="speedMult() === 20"
            [class.text-purple-300]="speedMult() === 20"
            class="rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="20x hyper speed"
          >
            20x ⚡
          </button>

          <!-- Divider -->
          <div class="h-4 w-px bg-slate-800 mx-0.5"></div>

          <!-- Constellation toggle -->
          <button
            (click)="toggleConstellations()"
            [class.border-cyan-400]="isConstellationMode()"
            [class.bg-cyan-500/20]="isConstellationMode()"
            [class.text-cyan-300]="isConstellationMode()"
            class="rounded-lg border border-transparent px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            title="Toggle Skill Tech-Tree Constellation Matrix"
          >
            ✨ CONSTELLATION
          </button>

          <!-- Spaceship Pilot Mode -->
          <button
            (click)="toggleFlight()"
            class="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 px-3 py-1 text-[11px] font-bold text-cyan-200 hover:border-cyan-400 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            title="Pilot Probe MK-IV in manual spaceship flight mode (or press 'F')"
          >
            <span>🚀 PILOT</span>
          </button>

          <!-- Terminal CLI Toggle -->
          <button
            (click)="toggleTerminal()"
            class="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900/60 transition-colors"
            title="Open Retro Sci-Fi Terminal (Press ~)"
          >
            <span>&gt;_ CLI</span>
          </button>
        </div>
      </aside>
    }
  `
})
export class OrreryControlsComponent {
  private state = inject(StateService);
  private audio = inject(AudioService);
  private haptic = inject(HapticService);

  public activeModal = computed(() => this.state.activeModal());
  public isFlightMode = computed(() => this.state.isFlightMode());
  public speedMult = computed(() => this.state.orbitSpeedMultiplier());
  public isConstellationMode = computed(() => this.state.isConstellationMode());

  public stardate = computed(() => {
    const d = new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const day = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${d.getFullYear()}.${day.toString().padStart(3, '0')}`;
  });

  public setSpeed(val: number): void {
    this.haptic.light();
    this.state.setOrbitSpeed(val);
  }

  public toggleConstellations(): void {
    this.haptic.light();
    this.state.toggleConstellationMode();
  }

  public toggleFlight(): void {
    this.haptic.medium();
    this.state.toggleFlightMode();
  }

  public toggleTerminal(): void {
    this.haptic.light();
    this.state.toggleTerminal();
  }
}
