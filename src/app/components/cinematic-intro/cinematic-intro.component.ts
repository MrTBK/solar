import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { PORTFOLIO_CONFIG } from '../../data/portfolio.config';

@Component({
  selector: 'app-cinematic-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isDone()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-6 transition-opacity duration-1000"
        [class.opacity-0]="isFading()"
      >
        <!-- Background radial grid -->
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0,transparent_70%)]"></div>

        <div class="relative max-w-xl text-center">
          <!-- Callsign telemetry -->
          <div class="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1 font-mono text-[11px] text-cyan-300">
            <span class="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>SECTOR SCAN // TUNIS 36.8065° N</span>
          </div>

          <!-- Name -->
          <h1 class="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            MOHAMED AZIZ TABAKH
          </h1>

          <!-- Titles -->
          <div class="mt-3 flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
            <span class="font-mono text-cyan-300">Business Intelligence Student</span>
            <span class="text-slate-600">·</span>
            <span class="font-mono text-amber-300">Data Developer</span>
            <span class="text-slate-600">·</span>
            <span class="font-mono text-purple-300">Competitive Programmer</span>
          </div>

          <!-- Loading progress bar -->
          <div class="mx-auto mt-8 max-w-xs">
            <div class="flex justify-between font-mono text-[10px] text-slate-400">
              <span>SYSTEM CALIBRATION</span>
              <span>{{ progress() }}%</span>
            </div>
            <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
              <div
                class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                [style.width.%]="progress()"
              ></div>
            </div>
          </div>

          <!-- Enter button -->
          <div class="mt-8">
            <button
              (click)="enterSystem()"
              class="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-cyan-500 bg-cyan-500/15 px-6 py-2.5 font-mono text-xs font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-500/30 hover:scale-103"
            >
              <span>ENTER SOLAR SYSTEM</span>
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div class="mt-4 font-mono text-[10px] text-slate-500">
            [ EXPLORE THE SYSTEM · DISCOVER THE WORK ]
          </div>
        </div>
      </div>
    }
  `
})
export class CinematicIntroComponent implements OnInit, OnDestroy {
  private state = inject(StateService);

  public config = PORTFOLIO_CONFIG;
  public progress = signal<number>(0);
  public isFading = signal<boolean>(false);
  public isDone = signal<boolean>(false);

  private intervalId: number | null = null;

  ngOnInit(): void {
    let p = 0;
    this.intervalId = window.setInterval(() => {
      p += 10;
      if (p >= 100) {
        p = 100;
        this.progress.set(100);
        if (this.intervalId) clearInterval(this.intervalId);
        // Automatically enter after a short moment if user hasn't clicked
        setTimeout(() => this.enterSystem(), 800);
      } else {
        this.progress.set(p);
      }
    }, 70);
  }

  public enterSystem(): void {
    if (this.isFading()) return;
    this.isFading.set(true);
    setTimeout(() => {
      this.isDone.set(true);
      this.state.finishCinematicIntro();
    }, 400);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
