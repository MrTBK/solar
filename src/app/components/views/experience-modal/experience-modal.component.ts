import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { EXPERIENCES_DATA } from '../../../data/experience.data';

@Component({
  selector: 'app-experience-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-blue-500/30 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[680px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span>
            <span class="font-mono text-xs font-bold tracking-widest text-blue-400 uppercase">
              PROFESSIONAL EXPEDITIONS // MISSION LOG
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

        <!-- Experience Timeline -->
        <div class="mt-6 space-y-6">
          @for (exp of experiences; track exp.id) {
            <div class="relative rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 transition-colors hover:border-slate-700">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-bold text-white">{{ exp.company }}</h2>
                    <span class="rounded bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 font-mono text-[10px] text-blue-300">
                      {{ exp.badge }}
                    </span>
                  </div>
                  <div class="mt-0.5 font-mono text-xs text-cyan-300">
                    {{ exp.role }}
                  </div>
                </div>

                <div class="text-right">
                  <div class="font-mono text-xs text-slate-300">{{ exp.period }}</div>
                  <div class="text-[11px] text-slate-400">{{ exp.location }}</div>
                </div>
              </div>

              <!-- Highlights -->
              <div class="mt-3">
                <ul class="space-y-1.5 text-xs leading-relaxed text-slate-300">
                  @for (h of exp.highlights; track h) {
                    <li class="flex items-start gap-2">
                      <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
                      <span>{{ h }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Skills tags -->
              <div class="mt-4 flex flex-wrap gap-1.5 border-t border-slate-800/60 pt-3">
                @for (skill of exp.skills; track skill) {
                  <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {{ skill }}
                  </span>
                }
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
export class ExperienceModalComponent {
  private state = inject(StateService);

  public experiences = EXPERIENCES_DATA;

  public close(): void {
    this.state.returnToSystem();
  }

  public onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
