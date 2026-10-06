import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { SOCIAL_DATA } from '../../../data/social.data';
import { PORTFOLIO_CONFIG } from '../../../data/portfolio.config';

@Component({
  selector: 'app-black-hole-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      data-modal-trap
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-xl animate-fade-in"
    >
      <!-- Background Singularity Glow -->
      <div
        class="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.3)_0,rgba(56,189,248,0.12)_40%,transparent_70%)] animate-pulse"
      ></div>

      <div
        class="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-purple-500/40 bg-slate-950/98 p-6 shadow-[0_0_100px_rgba(168,85,247,0.4)] backdrop-blur-2xl sm:p-8"
      >
        <!-- Corner Accents -->
        <div class="absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2 border-purple-400"></div>
        <div class="absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2 border-purple-400"></div>
        <div class="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-purple-400"></div>
        <div class="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-purple-400"></div>

        <!-- Banner badge -->
        <div class="text-center">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-950/60 px-4 py-1 font-mono text-xs font-bold text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-purple-400 animate-ping"></span>
            <span>COSMIC SINGULARITY COLLAPSE // ALL PLANETS CONSUMED</span>
          </div>

          <h1 class="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl">
            ALL SKILLS CONVERGE ON AZIZ
          </h1>

          <p class="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
            You have inspected every skill planet in the system. Space-time has collapsed into the central singularity.
            Connect directly with <strong class="text-white">{{ config.name }}</strong> to start the next mission.
          </p>
        </div>

        <!-- Feedback toasts -->
        @if (copied()) {
          <div class="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-xs text-emerald-300">
            <span>✓</span>
            <span>Email copied to clipboard: {{ social.email.handle }}</span>
          </div>
        }
        @if (copyFailed()) {
          <div class="mt-4 flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-xs text-amber-300">
            <span>⚠</span>
            <span>Auto-copy unavailable — please copy manually: {{ social.email.handle }}</span>
          </div>
        }

        <!-- Direct Contact Channels -->
        <div class="mt-6 space-y-3">
          <!-- Email -->
          <div class="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-colors hover:border-slate-700">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-900/30 text-purple-300 text-lg">
                ✉
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">Direct Email</div>
                <div class="font-mono text-xs font-bold text-white select-all">{{ social.email.handle }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="copyEmail()"
                class="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-200 transition-colors hover:border-cyan-400 hover:text-white active:scale-95"
              >
                {{ copied() ? '✓ Copied' : 'Copy' }}
              </button>
              <a
                [href]="social.email.url"
                class="rounded-lg border border-purple-500/40 bg-purple-500/20 px-3 py-1.5 font-mono text-xs text-purple-200 transition-colors hover:bg-purple-500/40 hover:text-white"
              >
                Send ↗
              </a>
            </div>
          </div>

          <!-- LinkedIn -->
          <a
            [href]="social.linkedin.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-blue-500/50 hover:bg-slate-900"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900/30 text-blue-400 font-bold text-sm">
                in
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">LinkedIn Profile</div>
                <div class="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">Mohamed Aziz Tabakh</div>
              </div>
            </div>
            <span class="font-mono text-xs text-slate-400 group-hover:text-white transition-colors">Connect ↗</span>
          </a>

          <!-- GitHub -->
          <a
            [href]="social.github.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-slate-600 hover:bg-slate-900"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white font-bold text-sm">
                gh
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">GitHub Repository</div>
                <div class="font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">&#64;MrTBK</div>
              </div>
            </div>
            <span class="font-mono text-xs text-slate-400 group-hover:text-white transition-colors">Inspect Repos ↗</span>
          </a>

          <!-- Phone / WhatsApp -->
          <a
            [href]="social.phone.url"
            class="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all hover:border-emerald-500/50 hover:bg-slate-900"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-900/30 text-emerald-400 text-lg">
                📞
              </div>
              <div>
                <div class="font-mono text-[10px] text-slate-400 uppercase">Phone &amp; WhatsApp</div>
                <div class="font-mono text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{{ social.phone.handle }}</div>
              </div>
            </div>
            <span class="font-mono text-xs text-slate-400 group-hover:text-white transition-colors">Call ↗</span>
          </a>
        </div>

        <!-- Download CV Card -->
        <div class="mt-6 flex flex-col gap-3 rounded-2xl border border-purple-500/30 bg-purple-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="font-mono text-xs font-bold text-purple-300">DOWNLOAD RESUME (PDF)</div>
            <div class="text-[11px] text-slate-400">Complete curriculum vitae and verified project achievements.</div>
          </div>
          <a
            [href]="social.resume.url"
            [download]="social.resume.fileName"
            class="flex items-center justify-center gap-1.5 rounded-xl border border-purple-400 bg-purple-500/30 px-4 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-purple-500 active:scale-95"
          >
            <span>DOWNLOAD CV</span>
            <span>↓</span>
          </a>
        </div>

        <!-- Keyboard hint -->
        <div class="mt-4 text-center font-mono text-[10px] text-slate-600">
          [ ESC ] or [ SPACE ] to return to overview
        </div>

        <!-- Universe Rebirth Button (Big Bang) -->
        <div class="mt-4 border-t border-slate-800 pt-4 flex flex-col gap-3 sm:flex-row">
          <button
            (click)="resetUniverse()"
            class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500 bg-cyan-500/20 py-3 font-mono text-xs font-bold text-cyan-200 transition-all hover:bg-cyan-500/40 hover:text-white active:scale-95"
          >
            <span>✨ BIG BANG: REBIRTH SOLAR SYSTEM</span>
            <span>↺</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class BlackHoleContactComponent {
  private state = inject(StateService);

  public config = PORTFOLIO_CONFIG;
  public social = SOCIAL_DATA;
  public copied = signal<boolean>(false);
  public copyFailed = signal<boolean>(false);

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' || e.code === 'Space') {
      e.preventDefault();
      this.resetUniverse();
    }
  }

  public copyEmail(): void {
    const email = this.social.email.handle;
    this.copyFailed.set(false);

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 3000);
      }).catch(() => {
        this.fallbackCopy(email);
      });
    } else {
      this.fallbackCopy(email);
    }
  }

  private fallbackCopy(text: string): void {
    // execCommand fallback for non-HTTPS or older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const ok = document.execCommand('copy');
      if (ok) {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 3000);
      } else {
        this.copyFailed.set(true);
        setTimeout(() => this.copyFailed.set(false), 5000);
      }
    } catch {
      this.copyFailed.set(true);
      setTimeout(() => this.copyFailed.set(false), 5000);
    }
    document.body.removeChild(textarea);
  }

  public resetUniverse(): void {
    this.state.resetUniverse();
  }
}
