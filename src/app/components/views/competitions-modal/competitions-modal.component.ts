import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { COMPETITIONS_DATA } from '../../../data/competition.data';

@Component({
  selector: 'app-competitions-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-purple-500/30 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[700px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
            <span class="font-mono text-xs font-bold tracking-widest text-purple-400 uppercase">
              ALGORITHMIC RING // COMPETITIVE HONORS
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

        <!-- Intro -->
        <div class="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 text-xs text-slate-300 leading-relaxed">
          The Algorithmic Asteroid Belt encapsulates high-pressure problem solving, algorithmic decomposition, and team programming tournaments including the TCPC (ICPC National Qualifier) and hackathon championships.
        </div>

        <!-- Competitions Grid -->
        <div class="mt-6 space-y-6">
          @for (comp of competitions; track comp.id) {
            <div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all hover:border-purple-500/40">
              <!-- Event Photo -->
              @if (comp.image) {
                <div class="relative h-48 w-full overflow-hidden bg-slate-950 sm:h-56">
                  <img
                    [src]="comp.image"
                    [alt]="comp.title"
                    class="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-103"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70"
                  ></div>
                  <span
                    class="absolute top-3 right-3 rounded-full border border-purple-500/40 bg-slate-950/80 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-purple-300 backdrop-blur-md"
                  >
                    {{ comp.category }}
                  </span>
                </div>
              }

              <div class="p-5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h2 class="text-base font-bold text-white">{{ comp.title }}</h2>
                  <span class="rounded bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                    {{ comp.rank }}
                  </span>
                </div>

                <div class="mt-1 font-mono text-xs text-slate-400">
                  {{ comp.organizer }} · {{ comp.date }}
                </div>

                <p class="mt-2.5 text-xs text-slate-300 leading-relaxed">
                  {{ comp.description }}
                </p>

                <!-- Tags -->
                <div class="mt-4 flex flex-wrap gap-1.5 border-t border-slate-800/80 pt-3">
                  @for (tag of comp.tags; track tag) {
                    <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      {{ tag }}
                    </span>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <div class="mt-8 border-t border-slate-800 pt-6">
          <button
            (click)="close()"
            class="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 font-mono text-xs text-slate-300 hover:text-white"
          >
            RETURN TO SOLAR SYSTEM
          </button>
        </div>
      </div>
    </div>
  `
})
export class CompetitionsModalComponent {
  private state = inject(StateService);

  public competitions = COMPETITIONS_DATA;

  public close(): void {
    this.state.returnToSystem();
  }

  public onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
