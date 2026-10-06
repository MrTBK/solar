import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { PROJECTS_DATA } from '../../../data/project.data';
import { EXPERIENCES_DATA } from '../../../data/experience.data';
import { SKILLS_DATA } from '../../../data/skill.data';
import { EDUCATION_DATA, CERTIFICATIONS_DATA } from '../../../data/education.data';
import { COMPETITIONS_DATA } from '../../../data/competition.data';
import { PORTFOLIO_CONFIG } from '../../../data/portfolio.config';
import { SOCIAL_DATA } from '../../../data/social.data';
import { ProjectData } from '../../../models/project.model';

@Component({
  selector: 'app-fallback-2d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 px-4 pt-20 pb-20 text-slate-100 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">

        <!-- Top Mode Banner & Switcher -->
        <div class="mb-8 rounded-3xl border border-cyan-500/30 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div class="flex items-center gap-2 font-mono text-xs text-cyan-400">
                <span class="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>2D RECRUITER MODE // FAST-READING PORTFOLIO</span>
              </div>
              <h1 class="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                {{ config.name }}
              </h1>
              <p class="mt-1 font-mono text-sm text-cyan-300">
                Business Intelligence Student · Data Developer · Competitive Programmer
              </p>
              <p class="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm max-w-2xl">
                {{ config.missionStatement }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>📍 {{ config.location }}</span>
                <span>·</span>
                <span>🎓 {{ config.institution }}</span>
              </div>
            </div>

            <!-- Primary Actions -->
            <div class="flex flex-wrap gap-2.5 shrink-0">
              <button
                (click)="toggle3D()"
                class="flex items-center gap-2 rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-102 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                <span>🪐 SWITCH TO 3D UNIVERSE</span>
              </button>

              <a
                [href]="social.resume.url"
                [download]="social.resume.fileName"
                class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-slate-400 focus:outline-none"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>CV (PDF)</span>
              </a>

              <a
                [href]="social.linkedin.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 font-mono text-xs font-semibold text-blue-200 transition-colors hover:bg-blue-500/20 hover:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <span>LINKEDIN</span>
              </a>

              <a
                [href]="social.github.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-slate-400 focus:outline-none"
              >
                <span>GITHUB</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Sticky Section Navigation Tabs -->
        <div class="sticky top-16 z-30 mb-8 rounded-2xl border border-slate-800 bg-slate-950/90 p-2 shadow-xl backdrop-blur-xl">
          <div class="flex flex-wrap gap-1 font-mono text-xs">
            @for (tab of ['projects', 'career', 'skills', 'education', 'contact']; track tab) {
              <button
                (click)="activeTab.set(tab)"
                [class.bg-cyan-500]="activeTab() === tab"
                [class.text-slate-950]="activeTab() === tab"
                [class.font-bold]="activeTab() === tab"
                [class.text-slate-300]="activeTab() !== tab"
                [class.hover:bg-slate-800]="activeTab() !== tab"
                class="flex-1 min-w-[100px] rounded-xl px-3 py-2 text-center transition-colors uppercase focus:ring-2 focus:ring-cyan-400 focus:outline-none"
              >
                {{ tab }}
              </button>
            }
          </div>
        </div>

        <!-- SECTION: PROJECTS -->
        @if (activeTab() === 'projects') {
          <section class="animate-fade-in space-y-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 class="text-2xl font-black text-white">Engineering Projects</h2>
                <p class="text-xs text-slate-400">Data pipelines, analytical warehouses, MLOps, and applications</p>
              </div>
              <!-- Category filter -->
              <div class="flex flex-wrap gap-1.5 font-mono text-xs">
                @for (cat of ['All', 'Data Engineering', 'BI / Analytics', 'Machine Learning / MLOps', 'Mobile Application']; track cat) {
                  <button
                    (click)="projectFilter.set(cat)"
                    [class.bg-slate-800]="projectFilter() === cat"
                    [class.text-cyan-300]="projectFilter() === cat"
                    [class.border-cyan-400]="projectFilter() === cat"
                    [class.border-slate-800]="projectFilter() !== cat"
                    [class.text-slate-400]="projectFilter() !== cat"
                    class="rounded-lg border px-2.5 py-1 transition-colors hover:text-white focus:outline-none"
                  >
                    {{ cat.split(' ')[0] }}
                  </button>
                }
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              @for (proj of filteredProjects(); track proj.id) {
                <div class="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-cyan-500/40 hover:bg-slate-900/80">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="text-xl font-black text-white">{{ proj.name }}</h3>
                        <span class="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                          {{ proj.status }}
                        </span>
                      </div>
                      <p class="font-mono text-xs text-slate-400">{{ proj.domain }}</p>
                    </div>
                  </div>

                  <p class="mt-2 text-xs font-semibold text-cyan-200">{{ proj.tagline }}</p>
                  <p class="mt-2 text-xs leading-relaxed text-slate-300">{{ proj.description }}</p>

                  <!-- Problem Solved Callout -->
                  <div class="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-300">
                    <span class="font-mono font-bold text-amber-300 text-[11px] block mb-1">PROBLEM SOLVED:</span>
                    <span>{{ proj.problemSolved }}</span>
                  </div>

                  <!-- Visual Pipeline Flow -->
                  @if (proj.architectureSteps && proj.architectureSteps.length > 0) {
                    <div class="mt-4">
                      <div class="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">SYSTEM PIPELINE FLOW:</div>
                      <div class="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                        @for (step of proj.architectureSteps; track step.step; let last = $last) {
                          <span class="rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-200">
                            {{ step.title }}
                          </span>
                          @if (!last) {
                            <span class="text-cyan-400 font-bold">→</span>
                          }
                        }
                      </div>
                    </div>
                  }

                  <!-- Metrics -->
                  @if (proj.metrics && proj.metrics.length > 0) {
                    <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      @for (m of proj.metrics; track m.label) {
                        <div class="rounded-lg border border-slate-800 bg-slate-950/50 p-2 text-center">
                          <div class="font-mono text-xs font-bold text-white">{{ m.value }}</div>
                          <div class="text-[9px] text-slate-400">{{ m.label }}</div>
                        </div>
                      }
                    </div>
                  }

                  <!-- Tech stack -->
                  <div class="mt-4 flex flex-wrap gap-1 border-t border-slate-800/80 pt-3">
                    @for (t of proj.technologies; track t) {
                      <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {{ t }}
                      </span>
                    }
                  </div>

                  <!-- Action Buttons -->
                  <div class="mt-5 flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      (click)="openProject(proj.id)"
                      class="flex-1 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-bold text-cyan-300 transition-colors hover:bg-cyan-500/20 text-center"
                    >
                      OPEN DOSSIER &amp; ARCHITECTURE
                    </button>
                    @if (proj.github) {
                      <a
                        [href]="proj.github"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300 hover:text-white"
                      >
                        GitHub ↗
                      </a>
                    }
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- SECTION: CAREER & EXPEDITIONS -->
        @if (activeTab() === 'career') {
          <section class="animate-fade-in space-y-6">
            <div class="border-b border-slate-800 pb-4">
              <h2 class="text-2xl font-black text-white">Career &amp; Professional Experience</h2>
              <p class="text-xs text-slate-400">Internships, embedded hardware engineering, leadership, and teaching</p>
            </div>

            <div class="space-y-4">
              @for (exp of experiences; track exp.id) {
                <div class="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-cyan-500/40">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="text-lg font-bold text-white">{{ exp.role }}</h3>
                        <span class="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                          {{ exp.badge }}
                        </span>
                      </div>
                      <div class="font-mono text-xs text-cyan-300">{{ exp.company }} · {{ exp.location }}</div>
                    </div>
                    <div class="font-mono text-xs text-slate-400">
                      {{ exp.period }}
                    </div>
                  </div>

                  <ul class="mt-4 space-y-2 text-xs leading-relaxed text-slate-300">
                    @for (h of exp.highlights; track h) {
                      <li class="flex items-start gap-2">
                        <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400"></span>
                        <span>{{ h }}</span>
                      </li>
                    }
                  </ul>

                  <div class="mt-4 flex flex-wrap gap-1.5 border-t border-slate-800/80 pt-3">
                    @for (s of exp.skills; track s) {
                      <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {{ s }}
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- SECTION: SKILLS -->
        @if (activeTab() === 'skills') {
          <section class="animate-fade-in space-y-6">
            <div class="border-b border-slate-800 pb-4">
              <h2 class="text-2xl font-black text-white">Technical Capabilities Matrix</h2>
              <p class="text-xs text-slate-400">Verified core competencies across data engineering, algorithms, and development</p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              @for (cat of skillCategories; track cat.id) {
                <div class="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                  <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full" [style.background-color]="cat.accentColor"></span>
                    <h3 class="font-mono text-sm font-bold uppercase tracking-wider text-white">
                      {{ cat.name }}
                    </h3>
                  </div>
                  <p class="mt-1 text-xs text-slate-400">{{ cat.description }}</p>

                  <div class="mt-4 space-y-2.5">
                    @for (sk of cat.skills; track sk.name) {
                      <div class="rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5">
                        <div class="flex items-center justify-between">
                          <span class="font-semibold text-xs text-white">{{ sk.name }}</span>
                          <span class="font-mono text-[10px] font-bold text-cyan-300">{{ sk.level }}</span>
                        </div>
                        @if (sk.detail) {
                          <p class="mt-1 text-[11px] text-slate-400">{{ sk.detail }}</p>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- SECTION: EDUCATION & HONORS -->
        @if (activeTab() === 'education') {
          <section class="animate-fade-in space-y-6">
            <div class="border-b border-slate-800 pb-4">
              <h2 class="text-2xl font-black text-white">Academic Degrees &amp; Honors</h2>
              <p class="text-xs text-slate-400">University credentials, competitive programming tournaments, and hackathons</p>
            </div>

            <!-- Degrees -->
            <div class="space-y-4">
              @for (edu of education; track edu.id) {
                <div class="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                  <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 class="text-lg font-bold text-white">{{ edu.degree }}</h3>
                      <div class="font-mono text-xs text-cyan-300">{{ edu.institution }} · {{ edu.location }}</div>
                    </div>
                    <div class="font-mono text-xs text-slate-400">{{ edu.period }}</div>
                  </div>
                  <p class="mt-2 text-xs text-slate-300">{{ edu.description }}</p>

                  <div class="mt-3 flex flex-wrap gap-1.5">
                    @for (top of edu.keyTopics; track top) {
                      <span class="rounded bg-slate-950 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        {{ top }}
                      </span>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Competitions & Honors -->
            <div class="mt-8">
              <h3 class="font-mono text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                COMPETITIVE PROGRAMMING &amp; HACKATHONS
              </h3>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                @for (comp of competitions; track comp.id) {
                  <div class="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                    <div class="flex items-center justify-between">
                      <span class="font-mono text-xs font-bold text-amber-300">{{ comp.rank }}</span>
                      <span class="font-mono text-[10px] text-slate-400">{{ comp.date }}</span>
                    </div>
                    <h4 class="mt-1 font-bold text-white text-sm">{{ comp.title }}</h4>
                    <p class="font-mono text-[11px] text-slate-400">{{ comp.organizer }}</p>
                    <p class="mt-2 text-xs leading-relaxed text-slate-300">{{ comp.description }}</p>
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- SECTION: CONTACT -->
        @if (activeTab() === 'contact') {
          <section class="animate-fade-in space-y-6">
            <div class="border-b border-slate-800 pb-4">
              <h2 class="text-2xl font-black text-white">Contact &amp; Communication Channels</h2>
              <p class="text-xs text-slate-400">Direct transmission coordinates for technical interviews and collaborations</p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Email -->
              <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div class="font-mono text-xs text-cyan-400 uppercase">DIRECT EMAIL</div>
                <div class="mt-1 text-sm font-bold text-white">{{ social.email.handle }}</div>
                <a
                  [href]="social.email.url"
                  class="mt-3 inline-block rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300 hover:bg-cyan-500/20"
                >
                  Send Email ↗
                </a>
              </div>

              <!-- Phone / WhatsApp -->
              <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div class="font-mono text-xs text-emerald-400 uppercase">PHONE / WHATSAPP</div>
                <div class="mt-1 text-sm font-bold text-white">{{ social.phone.handle }}</div>
                <a
                  [href]="social.phone.url"
                  class="mt-3 inline-block rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300 hover:bg-emerald-500/20"
                >
                  Call / Message ↗
                </a>
              </div>

              <!-- LinkedIn -->
              <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div class="font-mono text-xs text-blue-400 uppercase">LINKEDIN PROFILE</div>
                <div class="mt-1 text-sm font-bold text-white">Mohamed Aziz Tabakh</div>
                <a
                  [href]="social.linkedin.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-3 inline-block rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-1 font-mono text-xs text-blue-300 hover:bg-blue-500/20"
                >
                  Open LinkedIn ↗
                </a>
              </div>

              <!-- Resume Download -->
              <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div class="font-mono text-xs text-amber-400 uppercase">CURRICULUM VITAE</div>
                <div class="mt-1 text-sm font-bold text-white">{{ social.resume.fileName }}</div>
                <a
                  [href]="social.resume.url"
                  [download]="social.resume.fileName"
                  class="mt-3 inline-block rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-300 hover:bg-amber-500/20"
                >
                  Download PDF ↓
                </a>
              </div>
            </div>
          </section>
        }

      </div>
    </div>
  `
})
export class Fallback2DComponent {
  private state = inject(StateService);

  public config = PORTFOLIO_CONFIG;
  public social = SOCIAL_DATA;
  public projects = PROJECTS_DATA;
  public experiences = EXPERIENCES_DATA;
  public skillCategories = SKILLS_DATA;
  public education = EDUCATION_DATA;
  public certifications = CERTIFICATIONS_DATA;
  public competitions = COMPETITIONS_DATA;

  public activeTab = signal<string>('projects');
  public projectFilter = signal<string>('All');

  constructor() {
    // If state has an active 2D section requested from HUD, align tab
    const requested = this.state.active2DSection();
    if (requested) {
      this.activeTab.set(requested);
    }
  }

  public filteredProjects(): ProjectData[] {
    const f = this.projectFilter();
    if (f === 'All') return this.projects;
    return this.projects.filter((p) => p.category === f);
  }

  public toggle3D(): void {
    this.state.toggle2DMode();
  }

  public openProject(id: string): void {
    this.state.openProject(id, false);
  }
}
