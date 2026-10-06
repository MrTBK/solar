import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-tour-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isTourActive()) {
      <div
        class="pointer-events-none fixed bottom-4 left-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 transition-all animate-fade-in"
      >
        <div
          class="pointer-events-auto overflow-hidden rounded-2xl border border-amber-500/50 bg-slate-950/95 p-4 shadow-[0_10px_50px_rgba(245,158,11,0.25)] backdrop-blur-2xl sm:p-5"
        >
          <!-- Top bar with Stop Counter & Auto-Advance Progress -->
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span class="font-mono text-xs font-bold tracking-wider text-amber-300 uppercase">
                AUTOPILOT TOUR // STOP {{ currentIndex() + 1 }} OF {{ stops.length }}
              </span>
            </div>

            <!-- Countdown Timer & Actions -->
            <div class="flex items-center gap-2">
              <div
                class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] text-amber-200"
              >
                {{ isPaused() ? 'PAUSED' : 'NEXT IN ' + countdown() + 's' }}
              </div>
              <button
                (click)="exitTour()"
                class="rounded-lg border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-xs text-slate-400 hover:border-slate-600 hover:text-white"
                title="Exit Guided Tour (ESC)"
              >
                EXIT ✕
              </button>
            </div>
          </div>

          <!-- Active Stop Content -->
          @if (currentStop(); as stop) {
            <div class="mt-3">
              <div class="flex flex-wrap items-baseline gap-2">
                <h3 class="text-lg font-black text-white sm:text-xl">{{ stop.name }}</h3>
                <span class="font-mono text-xs text-cyan-400">// {{ stop.role }}</span>
              </div>
              <div class="mt-1 font-mono text-xs font-semibold text-amber-200">
                {{ stop.headline }}
              </div>
              <p class="mt-1.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                {{ stop.description }}
              </p>
            </div>
          }

          <!-- Countdown Progress Bar -->
          <div class="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              class="h-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-1000 ease-linear"
              [style.width.%]="progressPercent()"
            ></div>
          </div>

          <!-- Controls Footer -->
          <div class="mt-3 flex items-center justify-between font-mono text-xs">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <button
                (click)="prevStop()"
                class="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-slate-300 hover:border-cyan-400 hover:text-white"
              >
                ◀ PREV
              </button>
              <button
                (click)="togglePause()"
                class="rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1 font-bold text-amber-200 hover:bg-amber-500/30"
              >
                {{ isPaused() ? '▶ RESUME' : '⏸ PAUSE' }}
              </button>
              <button
                (click)="nextStop()"
                class="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-slate-300 hover:border-cyan-400 hover:text-white"
              >
                NEXT ▶
              </button>
            </div>

            <!-- Inspect object in detail -->
            <button
              (click)="inspectCurrent()"
              class="flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 font-bold text-cyan-300 hover:bg-cyan-500/25"
            >
              <span>INSPECT</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class TourPlayerComponent {
  private state = inject(StateService);

  public stops = this.state.tourStops;
  public isTourActive = computed(() => this.state.isTourActive());
  public currentIndex = computed(() => this.state.tourIndex());
  public countdown = computed(() => this.state.tourCountdown());
  public isPaused = computed(() => this.state.isTourPaused());

  public currentStop = computed(() => this.stops[this.currentIndex()] || null);

  public progressPercent = computed(() => {
    const remaining = this.countdown();
    return Math.max(0, Math.min(100, ((8 - remaining) / 8) * 100));
  });

  public prevStop(): void {
    this.state.prevTourStop();
  }

  public nextStop(): void {
    this.state.nextTourStop();
  }

  public togglePause(): void {
    this.state.toggleTourPause();
  }

  public exitTour(): void {
    this.state.stopTour();
    this.state.returnToSystem();
  }

  public inspectCurrent(): void {
    const stop = this.currentStop();
    if (!stop) return;
    this.state.stopTour();

    if (stop.id === 'sun-aziz') {
      this.state.openModal('about', true);
    } else if (stop.id === 'station-coficab') {
      this.state.openModal('experience', true);
    } else if (stop.id === 'belt-competitive') {
      this.state.openModal('competitions', true);
    } else {
      const projId = stop.id.replace('planet-', '');
      this.state.openProject(projId, true);
    }
  }
}
