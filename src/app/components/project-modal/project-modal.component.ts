import { Component, HostListener, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (project(); as p) {
      <div
        data-backdrop
        class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
        (click)="onBackdropClick($event)"
      >
        <div
          class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-cyan-500/30 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[620px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
        >
          <!-- Corner HUD Accents -->
          <div class="absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2 border-cyan-400"></div>
          <div class="absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2 border-cyan-400"></div>
          <div class="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-cyan-400"></div>
          <div class="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-cyan-400"></div>

          <!-- Close / Back Button -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-2">
              <span class="inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
              <span class="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
                PLANETARY INTEL // {{ p.category }}
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

          <!-- Main Info -->
          <div class="mt-6">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-2xl font-black tracking-tight text-white md:text-3xl">
                {{ p.name }}
              </h1>
              <span
                class="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-cyan-300"
              >
                {{ p.status }}
              </span>
            </div>
            <p class="mt-1 font-mono text-xs text-slate-400">{{ p.domain }}</p>
            <p class="mt-2 text-sm font-medium text-cyan-200">{{ p.tagline }}</p>
          </div>

          <!-- Screenshot Preview -->
          @if (p.image) {
            <div class="group relative mt-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg">
              <img
                [src]="p.image"
                [alt]="p.name + ' Preview'"
                class="h-56 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
            </div>
          }

          <!-- Key Metrics -->
          @if (p.metrics.length > 0) {
            <div class="mt-6">
              <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">MISSION METRICS</div>
              <div class="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                @for (m of p.metrics; track m.label) {
                  <div class="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 text-center">
                    <div class="font-mono text-sm font-bold text-white">{{ m.value }}</div>
                    <div class="mt-0.5 text-[10px] text-slate-400">{{ m.label }}</div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Description -->
          <div class="mt-6">
            <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">OVERVIEW &amp; OBJECTIVES</div>
            <p class="mt-2 text-sm leading-relaxed text-slate-300">{{ p.longDescription }}</p>
          </div>

          <!-- Architecture & Highlights -->
          @if (p.highlights.length > 0) {
            <div class="mt-6">
              <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">KEY ARCHITECTURAL HIGHLIGHTS</div>
              <ul class="mt-2 space-y-2 text-xs text-slate-300">
                @for (h of p.highlights; track h) {
                  <li class="flex items-start gap-2">
                    <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400"></span>
                    <span>{{ h }}</span>
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Architecture Pipeline if present -->
          @if (p.architecture && p.architecture.length > 0) {
            <div class="mt-6">
              <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">PIPELINE ARCHITECTURE</div>
              <div class="mt-2 flex flex-col gap-1.5 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3 font-mono text-[11px]">
                @for (step of p.architecture; track step; let idx = $index; let last = $last) {
                  <div class="flex items-center gap-2">
                    <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-cyan-300">
                      {{ idx + 1 }}
                    </span>
                    <span class="text-slate-200">{{ step }}</span>
                  </div>
                  @if (!last) {
                    <div class="ml-2.5 h-2 border-l border-cyan-500/30"></div>
                  }
                }
              </div>
            </div>
          }

          <!-- Technologies -->
          <div class="mt-6">
            <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">TECHNOLOGIES DEPLOYED</div>
            <div class="mt-2 flex flex-wrap gap-2">
              @for (tech of p.technologies; track tech) {
                <span class="rounded-lg border border-slate-700/80 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-200">
                  {{ tech }}
                </span>
              }
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="mt-8 border-t border-slate-800 pt-6 flex flex-wrap items-center gap-3">
            @if (p.github) {
              <a
                [href]="p.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-500/20 px-4 py-2.5 font-mono text-xs font-bold text-white transition-all hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>SOURCE REPOSITORY</span>
              </a>
            }
            <button
              (click)="close()"
              class="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900 px-4 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            >
              <span>RETURN TO SYSTEM</span>
            </button>
          </div>

          <!-- Keyboard hint -->
          <div class="mt-3 text-center font-mono text-[10px] text-slate-700">
            [ ESC ] return to system overview
          </div>
        </div>
      </div>
    }
  `
})
export class ProjectModalComponent {
  private state = inject(StateService);

  public project = computed(() => this.state.activeProject());

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.project()) return;
    const tag = (e.target as HTMLElement)?.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (e.key === 'Escape') {
      this.close();
    }
  }

  public close(): void {
    this.state.returnToSystem();
  }

  public onBackdropClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (target.hasAttribute('data-backdrop')) {
      this.close();
    }
  }
}
