import { Component, HostListener, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { SKILL_PLANETS, SkillPlanetItem } from '../../../data/skill.data';

@Component({
  selector: 'app-skill-planet-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (skillPlanet(); as sp) {
      <div
        data-backdrop
        class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
        (click)="onBackdropClick($event)"
      >
        <div
          class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[620px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
          [style.border-color]="sp.color + '60'"
        >
          <!-- Corner HUD Accents -->
          <div
            class="absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2"
            [style.border-color]="sp.color"
          ></div>
          <div
            class="absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2"
            [style.border-color]="sp.color"
          ></div>
          <div
            class="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2"
            [style.border-color]="sp.color"
          ></div>
          <div
            class="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2"
            [style.border-color]="sp.color"
          ></div>

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-2">
              <span
                class="inline-block h-2.5 w-2.5 rounded-full"
                [style.background-color]="sp.color"
                [style.box-shadow]="'0 0 10px ' + sp.color"
              ></span>
              <span
                class="font-mono text-xs font-bold tracking-widest uppercase"
                [style.color]="sp.color"
              >
                SKILL PLANET // {{ sp.category }}
              </span>
            </div>
            <button
              (click)="close()"
              class="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            >
              <span>{{ isRowMode() ? 'RETURN TO ROW' : 'CLOSE' }}</span>
              <span class="font-bold">✕</span>
            </button>
          </div>

          <!-- Main Info -->
          <div class="mt-6">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-2xl font-black tracking-tight text-white md:text-3xl">
                {{ sp.name }}
              </h1>
              <span
                class="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-300"
              >
                <span>✓</span>
                <span>EXPLORED</span>
              </span>
            </div>
            <p class="mt-1 font-mono text-xs text-slate-400">
              {{ sp.category }}
            </p>
            <p class="mt-2 text-sm font-medium text-slate-200 leading-relaxed">
              {{ sp.tagline }}
            </p>
          </div>

          <!-- Highlight -->
          <div
            class="mt-6 rounded-xl border p-4"
            [style.border-color]="sp.color + '40'"
            [style.background-color]="sp.color + '10'"
          >
            <div
              class="font-mono text-[10px] tracking-wider uppercase font-semibold"
              [style.color]="sp.color"
            >
              ARCHITECTURE &amp; CAPABILITY SYNOPSIS
            </div>
            <p class="mt-2 text-xs leading-relaxed text-slate-200">
              {{ sp.highlight }}
            </p>
          </div>

          <!-- Skills breakdown -->
          <div class="mt-6">
            <div class="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
              DEEP TECHNICAL COMPETENCIES
            </div>
            <div class="mt-3 space-y-2.5">
              @for (item of sp.skills; track item.name) {
                <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold text-white">
                      {{ item.name }}
                    </span>
                    <span
                      class="rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-[10px]"
                      [style.color]="sp.color"
                    >
                      {{ item.level }}
                    </span>
                  </div>
                  @if (item.detail) {
                    <div class="mt-1 text-xs text-slate-400">
                      {{ item.detail }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Progress across all planets -->
          <div class="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <div class="font-mono text-[10px] text-slate-400 uppercase mb-2">PLANETARY EXPLORATION PROGRESS</div>
            <div class="flex items-center gap-1.5">
              @for (p of allPlanets; track p.id) {
                <div
                  class="flex-1 h-2 rounded-full transition-all"
                  [style.background-color]="isExplored(p.id) ? p.color : '#1e293b'"
                  [title]="p.name"
                ></div>
              }
            </div>
            <div class="mt-1.5 font-mono text-[10px] text-slate-500">
              {{ exploredCount() }} / {{ allPlanets.length }} planets explored
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-8 border-t border-slate-800 pt-6 flex flex-wrap items-center gap-3">
            <button
              (click)="nextSkillPlanet()"
              class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-500/20 py-2.5 font-mono text-xs font-bold text-white transition-all hover:bg-cyan-500/30"
            >
              <span>INSPECT NEXT PLANET</span>
              <span>→</span>
            </button>
            <button
              (click)="close()"
              class="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs text-slate-300 hover:text-white"
            >
              CLOSE
            </button>
          </div>

          <!-- Keyboard hint -->
          <div class="mt-3 text-center font-mono text-[10px] text-slate-700">
            [ ESC ] close &nbsp;·&nbsp; [ → ] next planet
          </div>
        </div>
      </div>
    }
  `
})
export class SkillPlanetModalComponent {
  private state = inject(StateService);

  public skillPlanet = computed(() => this.state.activeSkillPlanet());
  public isRowMode = computed(() => this.state.isSkillsRowMode());
  public allPlanets = SKILL_PLANETS;
  public exploredCount = computed(() => this.state.exploredCount());

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.skillPlanet()) return;
    const tag = (e.target as HTMLElement)?.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

    if (e.key === 'Escape') {
      this.close();
    } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
      this.nextSkillPlanet();
    } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
      this.prevSkillPlanet();
    }
  }

  public isExplored(id: string): boolean {
    return this.state.exploredPlanets().has(id);
  }

  public close(): void {
    this.state.closeModal();
  }

  public nextSkillPlanet(): void {
    const current = this.skillPlanet();
    if (!current) return;
    const currentIndex = this.allPlanets.findIndex((p) => p.id === current.id);
    const nextIndex = (currentIndex + 1) % this.allPlanets.length;
    this.state.openSkillPlanet(this.allPlanets[nextIndex]);
  }

  public prevSkillPlanet(): void {
    const current = this.skillPlanet();
    if (!current) return;
    const currentIndex = this.allPlanets.findIndex((p) => p.id === current.id);
    const prevIndex = (currentIndex - 1 + this.allPlanets.length) % this.allPlanets.length;
    this.state.openSkillPlanet(this.allPlanets[prevIndex]);
  }

  public onBackdropClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    // Only close if clicking the outer backdrop (has data-backdrop attribute)
    if (target.hasAttribute('data-backdrop')) {
      this.close();
    }
  }
}
