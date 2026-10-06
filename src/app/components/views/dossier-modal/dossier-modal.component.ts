import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { PORTFOLIO_CONFIG } from '../../../data/portfolio.config';
import { SOCIAL_DATA } from '../../../data/social.data';

@Component({
  selector: 'app-dossier-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl border border-cyan-500/40 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
      >
        <!-- Header HUD -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span class="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
              EXECUTIVE DOSSIER // CANDIDATE BRIEF
            </span>
          </div>
          <button
            (click)="close()"
            class="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 font-mono text-xs text-slate-300 hover:border-slate-500 hover:text-white"
          >
            <span>RETURN</span>
            <span class="font-bold">✕</span>
          </button>
        </div>

        <!-- Identity Brief -->
        <div class="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-black text-white sm:text-3xl">{{ config.name }}</h1>
              <span class="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                AVAILABLE FOR HIRE
              </span>
            </div>
            <p class="mt-1 font-mono text-xs text-cyan-300">
              Data Developer · Business Intelligence · Competitive Programmer
            </p>
            <p class="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm max-w-2xl">
              {{ config.missionStatement }}
            </p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap gap-2 shrink-0">
            <a
              [href]="social.resume.url"
              [download]="social.resume.fileName"
              class="flex items-center gap-1.5 rounded-xl border border-cyan-500 bg-cyan-500/20 px-4 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-cyan-500/30 hover:scale-102"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>
          </div>
        </div>

        <!-- Quantifiable Impact Metrics -->
        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          @for (stat of config.stats; track stat.label) {
            <div class="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3 text-center">
              <div class="font-mono text-lg font-black text-white sm:text-xl">{{ stat.value }}</div>
              <div class="mt-1 font-mono text-[10px] text-slate-400 uppercase tracking-wider">{{ stat.label }}</div>
            </div>
          }
        </div>

        <!-- Top 3 Engineering Systems -->
        <div class="mt-8">
          <div class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
            FLAGSHIP ARCHITECTURAL SYSTEMS
          </div>
          <div class="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
            <!-- DataForge -->
            <div class="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-4 transition-all hover:border-amber-400">
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-amber-400 uppercase">DataForge</span>
                <span class="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-300">Batch ETL</span>
              </div>
              <p class="mt-2 text-xs text-slate-300 leading-relaxed">
                Production-grade batch pipeline featuring automated quarantine error routing, dbt dimensional modeling on PostgreSQL, and containerized Airflow task scheduling.
              </p>
              <div class="mt-3 flex flex-wrap gap-1">
                @for (t of ['Python', 'dbt', 'PostgreSQL', 'Airflow', 'Docker']; track t) {
                  <span class="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-300">{{ t }}</span>
                }
              </div>
            </div>

            <!-- Customer360 -->
            <div class="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-4 transition-all hover:border-cyan-400">
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-cyan-400 uppercase">Customer360</span>
                <span class="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">BI Analytics</span>
              </div>
              <p class="mt-2 text-xs text-slate-300 leading-relaxed">
                Customer intelligence analyzing 99,441 verified e-commerce orders across 95,560 customers. Kimball star-schema data warehouse, RFM segmentation, cohort retention, and executive Power BI dashboards.
              </p>
              <div class="mt-3 flex flex-wrap gap-1">
                @for (t of ['SQL', 'Power BI', 'Kimball Schema', 'Python', 'ETL']; track t) {
                  <span class="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-300">{{ t }}</span>
                }
              </div>
            </div>

            <!-- SupplyChainIQ -->
            <div class="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-4 transition-all hover:border-emerald-400">
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-emerald-400 uppercase">SupplyChainIQ</span>
                <span class="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">Logistics BI</span>
              </div>
              <p class="mt-2 text-xs text-slate-300 leading-relaxed">
                Logistics &amp; inventory intelligence engine with predictive transit delay classification, statistical safety stock optimization, and supplier performance scorecards.
              </p>
              <div class="mt-3 flex flex-wrap gap-1">
                @for (t of ['Python', 'scikit-learn', 'PostgreSQL', 'Streamlit']; track t) {
                  <span class="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-300">{{ t }}</span>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Core Competencies Matrix -->
        <div class="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div class="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
            VERIFIED TECHNICAL STACK
          </div>
          <div class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 font-mono text-xs">
            <div>
              <div class="text-[11px] font-bold text-cyan-400 uppercase">Data & BI</div>
              <div class="mt-1.5 space-y-1 text-slate-300">
                <div>• PostgreSQL & SQL Server</div>
                <div>• Kimball Star Modeling</div>
                <div>• dbt Transformations</div>
                <div>• Power BI & DAX</div>
              </div>
            </div>

            <div>
              <div class="text-[11px] font-bold text-cyan-400 uppercase">Pipelines & Ops</div>
              <div class="mt-1.5 space-y-1 text-slate-300">
                <div>• Apache Airflow (DAGs)</div>
                <div>• Docker & Compose</div>
                <div>• Linux & Bash Scripting</div>
                <div>• Git & CI/CD Workflows</div>
              </div>
            </div>

            <div>
              <div class="text-[11px] font-bold text-cyan-400 uppercase">Programming</div>
              <div class="mt-1.5 space-y-1 text-slate-300">
                <div>• Python (ETL, Pandas)</div>
                <div>• Modern C++ (Competitive)</div>
                <div>• Dart / Flutter (Mobile)</div>
                <div>• TypeScript / Angular</div>
              </div>
            </div>

            <div>
              <div class="text-[11px] font-bold text-cyan-400 uppercase">Honors & Certs</div>
              <div class="mt-1.5 space-y-1 text-slate-300">
                <div>• TCPC National Rank 32/100</div>
                <div>• Monopoly Hackathon 1st</div>
                <div>• IBM Python for DS Cert</div>
                <div>• Robotics Trainer (50+ stds)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fast Contact Channels with 1-Click Copy -->
        <div class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
          <div class="flex flex-wrap items-center gap-2">
            <!-- Email -->
            <button
              (click)="copyText(social.email.handle, 'Email')"
              class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-slate-200 hover:border-cyan-400"
            >
              <span>✉</span>
              <span>{{ copiedField() === 'Email' ? 'COPIED!' : social.email.handle }}</span>
            </button>

            <!-- Phone -->
            <button
              (click)="copyText(social.phone.handle, 'Phone')"
              class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-slate-200 hover:border-cyan-400"
            >
              <span>📞</span>
              <span>{{ copiedField() === 'Phone' ? 'COPIED!' : social.phone.handle }}</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <a
              [href]="social.linkedin.url"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-cyan-400 hover:text-white"
            >
              LINKEDIN ↗
            </a>
            <a
              [href]="social.github.url"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-cyan-400 hover:text-white"
            >
              GITHUB ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DossierModalComponent {
  private state = inject(StateService);

  public config = PORTFOLIO_CONFIG;
  public social = SOCIAL_DATA;

  public copiedField = signal<string | null>(null);

  public close(): void {
    this.state.closeModal();
  }

  public onBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  public copyText(text: string, field: string): void {
    navigator.clipboard.writeText(text);
    this.copiedField.set(field);
    setTimeout(() => {
      this.copiedField.set(null);
    }, 2000);
  }
}
