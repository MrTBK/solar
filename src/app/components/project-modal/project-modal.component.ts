import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { ProjectData } from '../../models/project.model';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (project(); as p) {
      <div
        data-backdrop
        class="fixed inset-0 z-40 flex justify-end bg-slate-950/70 backdrop-blur-md transition-all md:items-stretch"
        (click)="onBackdropClick($event)"
      >
        <div
          class="relative flex h-[92vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-cyan-500/40 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[680px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
        >
          <!-- Corner HUD Accents -->
          <div class="absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none"></div>
          <div class="absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none"></div>
          <div class="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none"></div>
          <div class="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-2">
              <span class="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
                ENGINEERING DOSSIER // {{ p.category }}
              </span>
            </div>
            <button
              (click)="close()"
              aria-label="Close dossier and return to system"
              class="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              <span>RETURN</span>
              <span class="font-bold">✕</span>
            </button>
          </div>

          <!-- Project Identity Header -->
          <div class="mt-5">
            <div class="flex flex-wrap items-center gap-2.5">
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

          <!-- Primary View Mode Tabs (OVERVIEW vs ARCHITECTURE) -->
          <div class="mt-6 flex border-b border-slate-800 font-mono text-xs">
            <button
              (click)="activeTab.set('overview')"
              [class.border-cyan-400]="activeTab() === 'overview'"
              [class.text-cyan-300]="activeTab() === 'overview'"
              [class.border-transparent]="activeTab() !== 'overview'"
              [class.text-slate-400]="activeTab() !== 'overview'"
              class="flex items-center gap-2 border-b-2 px-4 py-2.5 font-bold transition-colors hover:text-white focus:outline-none"
            >
              <span>📊 OVERVIEW</span>
            </button>
            <button
              (click)="activeTab.set('architecture')"
              [class.border-cyan-400]="activeTab() === 'architecture'"
              [class.text-cyan-300]="activeTab() === 'architecture'"
              [class.border-transparent]="activeTab() !== 'architecture'"
              [class.text-slate-400]="activeTab() !== 'architecture'"
              class="flex items-center gap-2 border-b-2 px-4 py-2.5 font-bold transition-colors hover:text-white focus:outline-none"
            >
              <span>🏗️ ARCHITECTURE</span>
            </button>
          </div>

          <!-- TAB 1: OVERVIEW -->
          @if (activeTab() === 'overview') {
            <div class="animate-fade-in">
              <!-- Problem Solved -->
              <div class="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div class="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <span>PROBLEM SOLVED</span>
                </div>
                <p class="mt-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {{ p.problemSolved }}
                </p>
              </div>

              <!-- Measurable Results / Key Metrics -->
              @if (p.metrics.length > 0) {
                <div class="mt-6">
                  <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">MEASURABLE METRICS &amp; SPECS</div>
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

              <!-- Visual Screenshot Preview if present -->
              @if (p.image) {
                <div class="group relative mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
                  <img
                    [src]="p.image"
                    [alt]="p.name + ' Preview'"
                    class="h-52 w-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div class="absolute bottom-2.5 left-3 font-mono text-[10px] text-slate-300">
                    VISUAL EVIDENCE // {{ p.name }}
                  </div>
                </div>
              }

              <!-- Engineering Decisions -->
              @if (p.engineeringDecisions && p.engineeringDecisions.length > 0) {
                <div class="mt-6">
                  <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">KEY ENGINEERING DECISIONS</div>
                  <div class="mt-2 space-y-2">
                    @for (decision of p.engineeringDecisions; track decision; let idx = $index) {
                      <div class="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs leading-relaxed text-slate-300">
                        <span class="font-mono font-bold text-cyan-400 mr-1.5">[{{ idx + 1 }}]</span>
                        <span>{{ decision }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Measurable Results Summary -->
              @if (p.measurableResults && p.measurableResults.length > 0) {
                <div class="mt-6">
                  <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">SYSTEM OUTCOMES</div>
                  <ul class="mt-2 space-y-1.5 text-xs text-slate-300">
                    @for (res of p.measurableResults; track res) {
                      <li class="flex items-start gap-2">
                        <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"></span>
                        <span>{{ res }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Implemented vs Planned Features -->
              <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <!-- Implemented Features -->
                <div class="rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-4">
                  <div class="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-400 uppercase">
                    <span>✓ IMPLEMENTED</span>
                  </div>
                  <ul class="mt-2.5 space-y-1.5 text-xs text-slate-300">
                    @for (feat of p.implementedFeatures; track feat) {
                      <li class="flex items-start gap-2">
                        <span class="text-emerald-400 font-mono text-[10px]">•</span>
                        <span>{{ feat }}</span>
                      </li>
                    }
                  </ul>
                </div>

                <!-- Planned / Roadmap Features -->
                @if (p.plannedFeatures && p.plannedFeatures.length > 0) {
                  <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                    <div class="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-400 uppercase">
                      <span>⚡ PLANNED / ROADMAP</span>
                    </div>
                    <ul class="mt-2.5 space-y-1.5 text-xs text-slate-400">
                      @for (feat of p.plannedFeatures; track feat) {
                        <li class="flex items-start gap-2">
                          <span class="text-slate-500 font-mono text-[10px]">○</span>
                          <span>{{ feat }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>

              <!-- Technologies Deployed -->
              <div class="mt-6">
                <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">TECHNOLOGIES DEPLOYED</div>
                <div class="mt-2 flex flex-wrap gap-1.5">
                  @for (tech of p.technologies; track tech) {
                    <span class="rounded-lg border border-slate-700/80 bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-200">
                      {{ tech }}
                    </span>
                  }
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: ARCHITECTURE (Visual Pipeline Diagram) -->
          @if (activeTab() === 'architecture') {
            <div class="animate-fade-in mt-6">
              <div class="rounded-2xl border border-cyan-500/30 bg-slate-900/50 p-4">
                <div class="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  SYSTEM PIPELINE FLOW
                </div>
                <p class="mt-1 text-xs text-slate-300">
                  Visual representation of the end-to-end data lifecycle and component hierarchy.
                </p>
              </div>

              <!-- Interactive Architecture Steps Flow -->
              <div class="mt-6 space-y-3">
                @for (step of p.architectureSteps; track step.step; let idx = $index; let last = $last) {
                  <div class="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition-all hover:border-cyan-500/40 hover:bg-slate-900/90">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2.5">
                        <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 font-mono text-xs font-bold text-cyan-300 border border-cyan-500/40">
                          {{ step.step }}
                        </span>
                        <h2 class="font-mono text-sm font-bold tracking-wide text-white">
                          {{ step.title }}
                        </h2>
                      </div>
                      @if (step.badge) {
                        <span class="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-slate-300 uppercase">
                          {{ step.badge }}
                        </span>
                      }
                    </div>

                    <p class="mt-2 text-xs leading-relaxed text-slate-300">
                      {{ step.detail }}
                    </p>

                    @if (step.tech) {
                      <div class="mt-2.5 flex items-center gap-1.5">
                        <span class="font-mono text-[10px] text-slate-500">ENGINE:</span>
                        <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                          {{ step.tech }}
                        </span>
                      </div>
                    }

                    <!-- Downward Flow Arrow -->
                    @if (!last) {
                      <div class="my-1 flex justify-center text-cyan-400/60 font-mono text-xs">
                        ↓
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- High-level architectural summary -->
              <div class="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
                <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                  ARCHITECTURAL SUMMARY
                </div>
                <p class="mt-2 text-xs leading-relaxed text-slate-300">
                  {{ p.longDescription }}
                </p>
              </div>
            </div>
          }

          <!-- Bottom Action Buttons -->
          <div class="mt-8 border-t border-slate-800 pt-6 flex flex-wrap items-center gap-3">
            @if (p.github) {
              <a
                [href]="p.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-500/20 px-4 py-2.5 font-mono text-xs font-bold text-white transition-all hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GITHUB REPOSITORY</span>
              </a>
            }
            @if (p.demo) {
              <a
                [href]="p.demo"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-4 py-2.5 font-mono text-xs font-bold text-white transition-colors hover:bg-emerald-500/30 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              >
                <span>LIVE DEMO ↗</span>
              </a>
            }
            <button
              (click)="close()"
              class="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900 px-4 py-2.5 font-mono text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-slate-400 focus:outline-none"
            >
              <span>RETURN TO SYSTEM</span>
            </button>
          </div>

          <!-- Keyboard hint -->
          <div class="mt-3 text-center font-mono text-[10px] text-slate-600">
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
  public activeTab = signal<'overview' | 'architecture'>('overview');

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
