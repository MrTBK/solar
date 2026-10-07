import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { SOCIAL_DATA } from '../../data/social.data';
import { HapticService } from '../../core/services/haptic.service';
import { GithubService } from '../../core/services/github.service';

@Component({
  selector: 'app-mission-dossier-export',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-xl animate-fade-in overflow-y-auto"
      >
        <div
          class="relative w-full max-w-3xl rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 sm:p-8 text-slate-100 shadow-[0_0_60px_rgba(6,182,212,0.25)] font-mono my-auto print-container"
        >
          <!-- Corner Tech Accents -->
          <div class="absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-cyan-400 no-print"></div>
          <div class="absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-cyan-400 no-print"></div>
          <div class="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-cyan-400 no-print"></div>
          <div class="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-cyan-400 no-print"></div>

          <!-- Top Actions (Hidden in Print) -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 no-print">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-xs font-bold tracking-widest text-cyan-300">ASTRONAUT FLIGHT DOSSIER // OFFICIAL RECORD</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="printDossier()"
                class="flex items-center gap-1.5 rounded-xl border border-cyan-400 bg-cyan-950/80 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-800 transition-colors"
              >
                <span>🖨 PRINT / PDF</span>
              </button>
              <a
                [href]="social.resume.url"
                [download]="social.resume.fileName"
                class="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>⬇ RESUME PDF</span>
              </a>
              <button
                (click)="close()"
                class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Document Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div class="text-[10px] tracking-widest text-cyan-400 font-bold">SOLAR CORE SPACE ODYSSEY · PERSONNEL RECORD</div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">MOHAMED AZIZ TABAKH</h1>
              <div class="text-xs text-cyan-300 font-semibold mt-0.5">Business Intelligence Specialist · Data Developer · Robotics Trainer</div>
            </div>
            <div class="flex flex-col sm:items-end text-xs text-slate-400">
              <span class="text-emerald-400 font-bold">STATUS: FLIGHT READY</span>
              <span>CLEARANCE: LEVEL 5 (UNRESTRICTED)</span>
              <span>TUNIS, TUNISIA (UTC+1)</span>
              <span class="text-[11px] text-slate-500 mt-1">GITHUB: MrTBK (★ {{ githubStats().stars }})</span>
            </div>
          </div>

          <!-- Executive Summary -->
          <div class="mt-6">
            <h2 class="text-xs font-bold tracking-wider text-cyan-400 mb-1.5">// MISSION PROFILE</h2>
            <p class="text-xs leading-relaxed text-slate-300">
              Specialized in engineering robust dimensional data warehouses, scalable batch ETL pipelines (Airflow, dbt Core, PostgreSQL), and executive Power BI analytics. Proven algorithmic excellence as a TCPC National Contest Finalist (32/100) and competitive robotics trainer.
            </p>
          </div>

          <!-- Core Competencies Matrix -->
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5">
              <div class="text-xs font-bold text-cyan-300 mb-2">DATA &amp; CLOUD SYSTEMS</div>
              <ul class="text-xs space-y-1 text-slate-300">
                <li>• <b class="text-white">Python</b>: Pandas, FastAPI, Scikit-Learn</li>
                <li>• <b class="text-white">SQL / DWH</b>: Kimball Star Schema, PostgreSQL, SSMS</li>
                <li>• <b class="text-white">ETL &amp; Orchestration</b>: dbt Core, Apache Airflow</li>
                <li>• <b class="text-white">BI &amp; Visuals</b>: Power BI, DAX, Cohort Retention</li>
              </ul>
            </div>

            <div class="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3.5">
              <div class="text-xs font-bold text-cyan-300 mb-2">DEVELOPMENT &amp; ALGORITHMS</div>
              <ul class="text-xs space-y-1 text-slate-300">
                <li>• <b class="text-white">C++ (STL)</b>: O(N log N) Graph &amp; Dynamic Programming</li>
                <li>• <b class="text-white">Frontend</b>: Angular 22, TypeScript, Three.js 3D WebGL</li>
                <li>• <b class="text-white">Mobile</b>: Flutter, Dart, Offline SQLite Persistence</li>
                <li>• <b class="text-white">Embedded</b>: Arduino, ESP8266, Sensor Telemetry</li>
              </ul>
            </div>
          </div>

          <!-- Key Missions History -->
          <div class="mt-6">
            <h2 class="text-xs font-bold tracking-wider text-cyan-400 mb-2">// LOGGED FLIGHT MISSIONS</h2>
            <div class="space-y-2.5 text-xs">
              <div class="rounded-lg border border-slate-800/60 p-2.5">
                <div class="flex justify-between font-bold text-white">
                  <span>COFICAB GROUP — BI &amp; Workflow Modernization</span>
                  <span class="text-slate-400">Industry Station</span>
                </div>
                <div class="text-[11px] text-slate-300 mt-0.5">Automotive wiring workflow tracking, supplier quality scorecards, cross-departmental operations.</div>
              </div>

              <div class="rounded-lg border border-slate-800/60 p-2.5">
                <div class="flex justify-between font-bold text-white">
                  <span>DATAFORGE — Batch ETL Pipeline</span>
                  <span class="text-slate-400">Airflow · dbt Core</span>
                </div>
                <div class="text-[11px] text-slate-300 mt-0.5">Automated validation rules, dimensional Kimball models on PostgreSQL, containerized Docker DAGs.</div>
              </div>

              <div class="rounded-lg border border-slate-800/60 p-2.5">
                <div class="flex justify-between font-bold text-white">
                  <span>CUSTOMER360 &amp; SUPPLYCHAINIQ</span>
                  <span class="text-slate-400">Power BI · DAX</span>
                </div>
                <div class="text-[11px] text-slate-300 mt-0.5">99,441 e-commerce order analytics, RFM customer segmentation, multi-echelon inventory monitoring.</div>
              </div>
            </div>
          </div>

          <!-- Honors & Verification Stamp -->
          <div class="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
            <div class="text-[11px] text-slate-400">
              <span class="text-amber-400 font-bold">HONORS:</span> TCPC Rank 32/100 · 1st Place Monopoly Hackathon 2026 · 200+ Codeforces Solved
            </div>
            <!-- Verification Seal -->
            <div class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-[10px] font-bold text-emerald-300">
              <span>CERTIFIED FLIGHT RECORD ✓</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @media print {
        body {
          background: white !important;
          color: black !important;
        }
        .no-print {
          display: none !important;
        }
        .print-container {
          box-shadow: none !important;
          border: 1px solid #ccc !important;
          background: white !important;
          color: black !important;
          padding: 0 !important;
        }
        .print-container * {
          color: black !important;
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.2s ease-out forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
    `
  ]
})
export class MissionDossierExportComponent {
  private state = inject(StateService);
  private haptic = inject(HapticService);
  private github = inject(GithubService);

  public social = SOCIAL_DATA;
  public isOpen = computed(() => this.state.isDossierExportOpen());
  public githubStats = computed(() => this.github.repoStats());

  public printDossier(): void {
    this.haptic.light();
    window.print();
  }

  public close(): void {
    this.state.closeDossierExport();
  }
}
