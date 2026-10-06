import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { PROJECTS_DATA } from '../../../data/project.data';
import { CELESTIAL_BODIES } from '../../../data/celestial.data';
import { PORTFOLIO_CONFIG } from '../../../data/portfolio.config';
import { ProjectData } from '../../../models/project.model';
import { CelestialBodyConfig } from '../../../models/celestial.model';

@Component({
  selector: 'app-fallback-2d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 px-4 pt-24 pb-16 text-slate-100 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <!-- 2D Header Banner -->
        <div class="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div class="flex items-center gap-2 font-mono text-xs text-cyan-400">
                <span class="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>SYSTEM 2D SCHEMATIC MODE</span>
              </div>
              <h1 class="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {{ config.name }}
              </h1>
              <p class="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                {{ config.missionStatement }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                (click)="toggle3D()"
                class="rounded-xl border border-cyan-500 bg-cyan-500/20 px-4 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-cyan-500/30"
              >
                SWITCH TO 3D UNIVERSE ↗
              </button>
            </div>
          </div>
        </div>

        <!-- 2D Orbital Radar Map -->
        <div class="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div class="font-mono text-xs font-bold text-slate-300 tracking-wider uppercase">
            ORBITAL SECTOR DIAGRAM
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            @for (body of celestialBodies; track body.id) {
              <button
                (click)="onSelectBody(body)"
                class="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 transition-all hover:border-cyan-400 hover:bg-slate-900"
              >
                <span
                  class="h-3 w-3 rounded-full"
                  [style.background-color]="body.color"
                ></span>
                <span class="text-xs font-semibold text-slate-200">{{ body.name }}</span>
                <span class="font-mono text-[10px] text-slate-500 uppercase">{{ body.category }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Filter tabs for projects -->
        <div class="mt-10 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 class="text-xl font-bold text-white">Project Planetary Fleet</h2>
            <p class="text-xs text-slate-400">Explore engineering architectures and analytics systems</p>
          </div>
          <div class="flex gap-1.5 font-mono text-xs">
            @for (f of ['All', 'Data Engineering', 'BI / Analytics', 'Machine Learning / MLOps', 'Mobile Application']; track f) {
              <button
                (click)="filter.set(f)"
                [class.bg-cyan-500]="filter() === f"
                [class.text-slate-950]="filter() === f"
                [class.font-bold]="filter() === f"
                [class.bg-slate-900]="filter() !== f"
                [class.text-slate-300]="filter() !== f"
                class="rounded-lg border border-slate-700/60 px-3 py-1 transition-colors hover:border-slate-500"
              >
                {{ f.split(' ')[0] }}
              </button>
            }
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          @for (proj of filteredProjects(); track proj.id) {
            <div
              (click)="openProject(proj.id)"
              class="group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)]"
            >
              @if (proj.image) {
                <div class="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    [src]="proj.image"
                    [alt]="proj.name"
                    class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-104"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  <span
                    class="absolute top-3 left-3 rounded-md border border-cyan-500/40 bg-slate-950/80 px-2.5 py-0.5 font-mono text-[10px] text-cyan-300 backdrop-blur-md"
                  >
                    {{ proj.category }}
                  </span>
                </div>
              }

              <div class="p-5">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {{ proj.name }}
                  </h3>
                  <span class="font-mono text-xs text-slate-400">→</span>
                </div>

                <p class="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {{ proj.description }}
                </p>

                <!-- Tech pills -->
                <div class="mt-4 flex flex-wrap gap-1.5 border-t border-slate-800/80 pt-3">
                  @for (t of proj.technologies.slice(0, 4); track t) {
                    <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      {{ t }}
                    </span>
                  }
                  @if (proj.technologies.length > 4) {
                    <span class="font-mono text-[10px] text-slate-500 self-center">
                      +{{ proj.technologies.length - 4 }}
                    </span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class Fallback2DComponent {
  private state = inject(StateService);

  public config = PORTFOLIO_CONFIG;
  public projects = PROJECTS_DATA;
  public celestialBodies = CELESTIAL_BODIES;

  public filter = signal<string>('All');

  public filteredProjects(): ProjectData[] {
    const f = this.filter();
    if (f === 'All') return this.projects;
    return this.projects.filter((p) => p.category === f);
  }

  public toggle3D(): void {
    this.state.toggle2DMode();
  }

  public openProject(id: string): void {
    this.state.openProject(id);
  }

  public onSelectBody(body: CelestialBodyConfig): void {
    this.state.selectTarget(body, true);
  }
}
