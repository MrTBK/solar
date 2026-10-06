import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { AudioService } from '../../core/services/audio.service';
import { PORTFOLIO_CONFIG } from '../../data/portfolio.config';
import { SOCIAL_DATA } from '../../data/social.data';

@Component({
  selector: 'app-hud-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="pointer-events-none fixed top-0 right-0 left-0 z-40 px-3 py-3 md:px-6">
      <div
        class="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/75 px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all"
      >
        <!-- Logo / Identity -->
        <button
          (click)="returnToSystem()"
          class="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div
            class="relative flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 transition-transform group-hover:scale-105"
          >
            <span class="text-amber-400 text-sm">☀</span>
            <span
              class="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
            ></span>
          </div>
          <div>
            <div class="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-white">
              <span>AZIZ.SYS</span>
              <span class="text-[10px] text-cyan-400 font-normal">[v2.6]</span>
            </div>
            <div class="hidden text-[10px] text-slate-400 sm:block">
              Business Intelligence & Data
            </div>
          </div>
        </button>

        <!-- Main Navigation Links -->
        <nav class="hidden items-center gap-1 lg:flex">
          <button
            (click)="returnToSystem()"
            [class.text-cyan-400]="!activeModal() && !selectedTarget()"
            class="rounded-lg px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            SYSTEM
          </button>

          <button
            (click)="openModal('skills')"
            [class.text-cyan-400]="activeModal() === 'skills'"
            class="rounded-lg px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            SKILLS
          </button>

          <button
            (click)="openModal('experience')"
            [class.text-cyan-400]="activeModal() === 'experience'"
            class="rounded-lg px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            EXPERIENCE
          </button>

          <button
            (click)="openModal('competitions')"
            [class.text-cyan-400]="activeModal() === 'competitions'"
            class="rounded-lg px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            HONORS
          </button>

          <button
            (click)="openModal('education')"
            [class.text-cyan-400]="activeModal() === 'education'"
            class="rounded-lg px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            EDUCATION
          </button>

          <button
            (click)="openModal('about')"
            [class.text-cyan-400]="activeModal() === 'about'"
            class="rounded-lg px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            ABOUT
          </button>

          <button
            (click)="openModal('contact')"
            [class.text-cyan-400]="activeModal() === 'contact'"
            class="rounded-lg px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          >
            CONTACT
          </button>
        </nav>

        <!-- Control Actions -->
        <div class="flex items-center gap-2">
          <!-- Mission Control HUD Toggle -->
          <button
            (click)="toggleMissionControl()"
            [class.border-cyan-500]="isMissionControlOpen()"
            [class.bg-cyan-500/20]="isMissionControlOpen()"
            class="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-slate-200 transition-all hover:border-cyan-400 hover:text-white"
            title="Toggle Mission Control Telemetry HUD"
          >
            <span class="inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
            <span class="hidden sm:inline">HUD</span>
          </button>

          <!-- 3D / 2D Toggle -->
          <button
            (click)="toggle2DMode()"
            class="rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-slate-200 transition-all hover:border-slate-500 hover:text-white"
            [title]="is2DMode() ? 'Switch to 3D Solar System' : 'Switch to 2D Fallback Mode'"
          >
            {{ is2DMode() ? '3D VIEW' : '2D VIEW' }}
          </button>

          <!-- Audio Mute -->
          <button
            (click)="toggleAudio()"
            class="rounded-lg border border-slate-700/80 bg-slate-900/80 p-1.5 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            [title]="isMuted() ? 'Unmute Audio' : 'Mute Audio'"
          >
            @if (isMuted()) {
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            } @else {
              <svg class="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            }
          </button>

          <!-- Download CV Button -->
          <a
            [href]="social.resume.url"
            [download]="social.resume.fileName"
            class="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-200 transition-all hover:scale-102 hover:border-cyan-400 hover:text-white"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>CV</span>
          </a>
        </div>
      </div>
    </header>
  `
})
export class HudNavComponent {
  private state = inject(StateService);
  private audio = inject(AudioService);

  public config = PORTFOLIO_CONFIG;
  public social = SOCIAL_DATA;

  public activeModal = computed(() => this.state.activeModal());
  public selectedTarget = computed(() => this.state.selectedTarget());
  public isMissionControlOpen = computed(() => this.state.isMissionControlOpen());
  public is2DMode = computed(() => this.state.is2DMode());
  public isMuted = computed(() => this.audio.isMuted());

  public returnToSystem(): void {
    this.state.returnToSystem();
  }

  public openModal(modal: any): void {
    this.state.openModal(modal);
  }

  public toggleMissionControl(): void {
    this.state.toggleMissionControl();
  }

  public toggle2DMode(): void {
    this.state.toggle2DMode();
  }

  public toggleAudio(): void {
    this.audio.toggleMute();
  }
}
