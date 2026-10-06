import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { PORTFOLIO_CONFIG } from '../../../data/portfolio.config';
import { SOCIAL_DATA } from '../../../data/social.data';

@Component({
  selector: 'app-about-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-amber-500/30 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[620px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]"></span>
            <span class="font-mono text-xs font-bold tracking-widest text-amber-400 uppercase">
              MISSION PROFILE // SYSTEM CORE
            </span>
          </div>
          <button
            (click)="close()"
            class="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            <span>RETURN TO SYSTEM</span>
            <span class="font-bold">✕</span>
          </button>
        </div>

        <!-- Identity Banner -->
        <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div class="relative shrink-0">
            <div class="h-28 w-28 overflow-hidden rounded-2xl border-2 border-amber-500/50 p-1 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <img
                [src]="config.avatar"
                [alt]="config.name"
                class="h-full w-full rounded-xl object-cover"
              />
            </div>
            <span class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border border-amber-500 text-xs">
              ☀
            </span>
          </div>

          <div>
            <div class="font-mono text-xs text-amber-400">
              {{ config.callsign }}
            </div>
            <h1 class="text-2xl font-black text-white sm:text-3xl">
              {{ config.name }}
            </h1>
            <div class="mt-1 flex flex-wrap gap-1.5 text-xs text-slate-300">
              @for (title of config.titles; track title) {
                <span class="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[11px] text-cyan-300">
                  {{ title }}
                </span>
              }
            </div>
            <div class="mt-2 text-xs text-slate-400 flex items-center gap-2">
              <span>📍 {{ config.location }}</span>
              <span>·</span>
              <span class="font-mono">{{ config.coordinates }}</span>
            </div>
          </div>
        </div>

        <!-- Mission Statement -->
        <div class="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div class="font-mono text-[10px] tracking-wider text-amber-400 uppercase">
            MISSION DIRECTIVE &amp; PHILOSOPHY
          </div>
          <p class="mt-2 text-sm leading-relaxed text-slate-200">
            {{ config.missionStatement }}
          </p>
        </div>

        <!-- System Stats -->
        <div class="mt-6">
          <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
            OPERATIONAL METRICS
          </div>
          <div class="mt-2 grid grid-cols-2 gap-2.5">
            @for (stat of config.stats; track stat.label) {
              <div class="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
                <div class="font-mono text-base font-black text-amber-300">{{ stat.value }}</div>
                <div class="mt-0.5 text-xs text-slate-400">{{ stat.label }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Academic & Association Standing -->
        <div class="mt-6">
          <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
            INSTITUTIONAL AFFILIATION
          </div>
          <div class="mt-2 space-y-2">
            <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
              <div class="text-xs font-semibold text-white">{{ config.institution }}</div>
              <div class="text-xs text-cyan-300">{{ config.degree }}</div>
              <div class="mt-1 text-[11px] text-slate-400">2024 – Present · Specializing in Data Warehouses, Dimensional Modeling &amp; Analytics</div>
            </div>

            <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
              <div class="text-xs font-semibold text-white">Youth Yes We Care Association</div>
              <div class="text-xs text-amber-300">Robotics &amp; Algorithmic Trainer</div>
              <div class="mt-1 text-[11px] text-slate-400">Instructing youth in Arduino microcontrollers, circuit logic, and robotics tournaments since June 2024.</div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 border-t border-slate-800 pt-6 flex items-center gap-3">
          <a
            [href]="social.resume.url"
            [download]="social.resume.fileName"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/20 px-4 py-2.5 font-mono text-xs font-bold text-amber-200 transition-all hover:bg-amber-500/30 hover:text-white"
          >
            <span>DOWNLOAD CURRICULUM VITAE</span>
          </a>
          <button
            (click)="close()"
            class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs text-slate-300 hover:text-white"
          >
            RETURN
          </button>
        </div>
      </div>
    </div>
  `
})
export class AboutModalComponent {
  private state = inject(StateService);

  public config = PORTFOLIO_CONFIG;
  public social = SOCIAL_DATA;

  public close(): void {
    this.state.returnToSystem();
  }

  public onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
