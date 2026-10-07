import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { DeviceService } from '../../core/services/device.service';
import { PORTFOLIO_CONFIG } from '../../data/portfolio.config';
import { SOCIAL_DATA } from '../../data/social.data';

@Component({
  selector: 'app-cinematic-intro',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isDone()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 transition-opacity duration-700 backdrop-blur-xl"
        [class.opacity-0]="isFading()"
      >
        <!-- Background subtle glow & radial grid -->
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0,transparent_65%)]"></div>

        <div
          class="relative w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-slate-950/90 p-6 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-2xl sm:p-10"
        >
          <!-- Corner HUD Accents -->
          <div class="absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2 border-amber-400 pointer-events-none"></div>
          <div class="absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2 border-amber-400 pointer-events-none"></div>
          <div class="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-amber-400 pointer-events-none"></div>
          <div class="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-amber-400 pointer-events-none"></div>

          <!-- Star Core Badge -->
          <div class="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/30 px-3.5 py-1 font-mono text-[11px] text-amber-300">
            <span class="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>SYSTEM CORE // DATA &amp; BI PORTFOLIO</span>
          </div>

          <!-- Name -->
          <h1 class="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            MOHAMED AZIZ TABAKH
          </h1>

          <!-- Role Subtitle -->
          <p class="mt-2 text-sm font-semibold text-cyan-300 sm:text-base">
            Business Intelligence Student · Data Developer · Competitive Programmer
          </p>

          <!-- Core Technology Pillars -->
          <div class="mt-5 space-y-1.5 font-mono text-xs text-slate-300 sm:text-sm">
            <div class="text-amber-200">
              Python · SQL · Power BI · Data Warehousing
            </div>
            <div class="text-purple-300">
              C++ · Algorithms · Robotics
            </div>
          </div>

          <!-- Direct Immediate Action Buttons -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <!-- VIEW CV -->
            <a
              [href]="social.resume.url"
              [download]="social.resume.fileName"
              class="flex items-center gap-1.5 rounded-xl border border-cyan-500/50 bg-cyan-500/20 px-4 py-2.5 font-mono text-xs font-bold text-white transition-all hover:bg-cyan-500/30 hover:scale-102 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>VIEW CV</span>
            </a>

            <!-- GITHUB -->
            <a
              [href]="social.github.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 transition-all hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-slate-400 focus:outline-none"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GITHUB</span>
            </a>

            <!-- LINKEDIN -->
            <a
              [href]="social.linkedin.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 font-mono text-xs font-semibold text-blue-200 transition-all hover:bg-blue-500/20 hover:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
              </svg>
              <span>LINKEDIN</span>
            </a>

            <!-- CONTACT -->
            <button
              (click)="openContact()"
              class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 transition-all hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-slate-400 focus:outline-none"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>CONTACT</span>
            </button>

            <!-- EXPLORE SYSTEM -->
            <button
              (click)="enterSystem()"
              class="group flex items-center gap-2 rounded-xl border border-amber-500 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-103 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <span>EXPLORE SYSTEM</span>
              <span class="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div class="mt-6 font-mono text-[11px] text-slate-400">
            [ EXPLORE THE SYSTEM · DISCOVER THE WORK · UNDERSTAND THE ENGINEERING ]
          </div>
        </div>
      </div>
    }
  `
})
export class CinematicIntroComponent {
  private state = inject(StateService);
  private device = inject(DeviceService);

  public config = PORTFOLIO_CONFIG;
  public social = SOCIAL_DATA;
  public isFading = signal<boolean>(false);
  public isDone = signal<boolean>(false);

  public enterSystem(): void {
    if (this.isFading()) return;
    this.isFading.set(true);
    setTimeout(() => {
      this.isDone.set(true);
      this.state.finishCinematicIntro();
    }, 400);
  }

  public openContact(): void {
    this.enterSystem();
    setTimeout(() => {
      this.state.openModal('contact');
    }, 450);
  }
}
