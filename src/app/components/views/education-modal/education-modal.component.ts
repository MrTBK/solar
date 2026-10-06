import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { EDUCATION_DATA, CERTIFICATIONS_DATA } from '../../../data/education.data';

@Component({
  selector: 'app-education-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-indigo-500/30 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[620px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]"></span>
            <span class="font-mono text-xs font-bold tracking-widest text-indigo-400 uppercase">
              ACADEMIA ORBITAL // EDUCATION
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

        <!-- Degrees -->
        <div class="mt-6 space-y-5">
          @for (edu of education; track edu.id) {
            <div class="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h2 class="text-base font-bold text-white">{{ edu.institution }}</h2>
                  <div class="font-mono text-xs text-indigo-300">{{ edu.degree }}</div>
                  <div class="mt-0.5 text-xs text-cyan-300 font-medium">{{ edu.field }}</div>
                </div>
                <div class="text-right">
                  <span class="rounded bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 font-mono text-xs text-indigo-300">
                    {{ edu.period }}
                  </span>
                  <div class="mt-1 text-[11px] text-slate-400">{{ edu.location }}</div>
                </div>
              </div>

              <p class="mt-3 text-xs leading-relaxed text-slate-300">
                {{ edu.description }}
              </p>

              <div class="mt-3">
                <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                  FOCUS TOPICS
                </div>
                <ul class="mt-1.5 space-y-1 text-xs text-slate-300">
                  @for (topic of edu.keyTopics; track topic) {
                    <li class="flex items-center gap-2">
                      <span class="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                      <span>{{ topic }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>

        <!-- Certifications -->
        <div class="mt-6">
          <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
            TECHNICAL CERTIFICATIONS &amp; PLATFORM CREDENTIALS
          </div>
          <div class="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            @for (cert of certifications; track cert.id) {
              <div class="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-white">{{ cert.title }}</span>
                  <span class="rounded bg-slate-800 px-2 py-0.5 font-mono text-[9px] text-cyan-300">
                    {{ cert.badge }}
                  </span>
                </div>
                <div class="mt-1 font-mono text-[11px] text-slate-400">
                  {{ cert.issuer }} · {{ cert.date }}
                </div>
                <div class="mt-2 text-xs text-slate-300">
                  {{ cert.description }}
                </div>
              </div>
            }
          </div>
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
export class EducationModalComponent {
  private state = inject(StateService);

  public education = EDUCATION_DATA;
  public certifications = CERTIFICATIONS_DATA;

  public close(): void {
    this.state.returnToSystem();
  }

  public onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
