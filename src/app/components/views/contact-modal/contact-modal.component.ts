import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { SOCIAL_DATA } from '../../../data/social.data';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-emerald-500/30 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[600px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            <span class="font-mono text-xs font-bold tracking-widest text-emerald-400 uppercase">
              COMMUNICATION RELAY // CONTACT
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

        <div class="mt-6">
          <h1 class="text-2xl font-black text-white">Transmit Transmission</h1>
          <p class="mt-1 text-xs text-slate-400 leading-relaxed">
            Reach out regarding Data Engineering, Business Intelligence internships, software architecture, or algorithmic projects.
          </p>
        </div>

        <!-- Copy Email Toast Notice -->
        @if (copied()) {
          <div class="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 font-mono text-xs text-emerald-300 animate-fade-in">
            <span>✓</span>
            <span>Email copied to clipboard: mohamedaziz.tabakh&#64;esen.tn</span>
          </div>
        }

        <!-- Channels -->
        <div class="mt-6 space-y-3">
          <!-- Email Card -->
          <div class="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-slate-700">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-cyan-400">
                ✉
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">Academic &amp; Pro Email</div>
                <div class="font-mono text-xs font-bold text-white">{{ social.email.handle }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="copyEmail()"
                class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-200 transition-colors hover:border-cyan-400 hover:text-white"
              >
                Copy
              </button>
              <a
                [href]="social.email.url"
                class="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs text-cyan-300 transition-colors hover:bg-cyan-500/20 hover:text-white"
              >
                Send
              </a>
            </div>
          </div>

          <!-- LinkedIn Card -->
          <a
            [href]="social.linkedin.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-blue-500/50 hover:bg-slate-900"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900/30 text-blue-400">
                in
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">LinkedIn Profile</div>
                <div class="text-xs font-bold text-white group-hover:text-blue-300">Mohamed Aziz Tabakh</div>
              </div>
            </div>
            <span class="font-mono text-xs text-slate-400 group-hover:text-white">Visit ↗</span>
          </a>

          <!-- GitHub Card -->
          <a
            [href]="social.github.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-600 hover:bg-slate-900"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
                gh
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">GitHub Workspace</div>
                <div class="font-mono text-xs font-bold text-white group-hover:text-cyan-300">{{ social.github.handle }}</div>
              </div>
            </div>
            <span class="font-mono text-xs text-slate-400 group-hover:text-white">Explore ↗</span>
          </a>

          <!-- Phone / WhatsApp -->
          <a
            [href]="social.phone.url"
            class="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900/30 text-emerald-400">
                📞
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">Phone &amp; WhatsApp</div>
                <div class="font-mono text-xs font-bold text-white group-hover:text-emerald-300">{{ social.phone.handle }}</div>
              </div>
            </div>
            <span class="font-mono text-xs text-slate-400 group-hover:text-white">Call ↗</span>
          </a>
        </div>

        <!-- Download CV Section -->
        <div class="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 p-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="font-mono text-xs font-bold text-cyan-300 uppercase">
                Curriculum Vitae (PDF)
              </div>
              <div class="text-xs text-slate-300">
                Detailed academic background, enterprise internship, and project portfolio.
              </div>
            </div>
            <a
              [href]="social.resume.url"
              [download]="social.resume.fileName"
              class="flex items-center justify-center gap-2 rounded-xl border border-cyan-500 bg-cyan-500/20 px-4 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-cyan-500 hover:text-slate-950"
            >
              <span>Download CV</span>
              <span>↓</span>
            </a>
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
export class ContactModalComponent {
  private state = inject(StateService);

  public social = SOCIAL_DATA;
  public copied = signal<boolean>(false);

  public close(): void {
    this.state.returnToSystem();
  }

  public copyEmail(): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.social.email.handle);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 3000);
    }
  }

  public onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
