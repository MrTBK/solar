import { Component, computed, inject, signal } from '@angular/core';
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
        class="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-slate-800/90 bg-slate-950/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all"
      >
        <!-- Identity -->
        <button
          (click)="flyTo('system')"
          aria-label="Return to System Overview"
          class="group flex items-center gap-2.5 text-left focus:ring-2 focus:ring-cyan-400 focus:outline-none rounded-lg p-1"
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
              <span>MOHAMED AZIZ TABAKH</span>
            </div>
            <div class="hidden text-[10px] text-slate-400 sm:block">
              Business Intelligence &amp; Data Developer
            </div>
          </div>
        </button>

        <!-- Primary Minimal Navigation (SYSTEM, PROJECTS, CAREER, SKILLS, ABOUT, CONTACT) -->
        <nav aria-label="Main Navigation" class="hidden items-center gap-1 lg:flex">
          <button
            (click)="flyTo('system')"
            [class.text-cyan-400]="isCurrentSector('system')"
            [class.bg-slate-800/60]="isCurrentSector('system')"
            class="rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            SYSTEM
          </button>

          <button
            (click)="flyTo('projects')"
            [class.text-cyan-400]="isCurrentSector('projects')"
            [class.bg-slate-800/60]="isCurrentSector('projects')"
            class="rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            PROJECTS
          </button>

          <button
            (click)="flyTo('career')"
            [class.text-cyan-400]="isCurrentSector('career')"
            [class.bg-slate-800/60]="isCurrentSector('career')"
            class="rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            CAREER
          </button>

          <button
            (click)="flyTo('skills')"
            [class.text-cyan-400]="isCurrentSector('skills')"
            [class.bg-slate-800/60]="isCurrentSector('skills')"
            class="rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            SKILLS
          </button>

          <button
            (click)="flyTo('about')"
            [class.text-cyan-400]="isCurrentSector('about')"
            [class.bg-slate-800/60]="isCurrentSector('about')"
            class="rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            ABOUT
          </button>

          <button
            (click)="flyTo('contact')"
            [class.text-cyan-400]="isCurrentSector('contact')"
            [class.bg-slate-800/60]="isCurrentSector('contact')"
            class="rounded-lg px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            CONTACT
          </button>
        </nav>

        <!-- Secondary Controls & Actions -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- Executive Dossier Button -->
          <button
            (click)="openModal('dossier')"
            [class.text-cyan-400]="activeModal() === 'dossier'"
            class="hidden md:flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            title="Executive Dossier Brief"
          >
            <span>DOSSIER</span>
          </button>

          <!-- Autopilot Tour Button -->
          <button
            (click)="toggleTour()"
            [class.border-amber-400]="isTourActive()"
            [class.bg-amber-500/20]="isTourActive()"
            [class.text-amber-300]="isTourActive()"
            class="hidden sm:flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-slate-300 transition-all hover:border-amber-400 hover:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
            title="Start automated cinematic tour of key engineering projects"
          >
            <span>🚀</span>
            <span class="text-[11px] font-bold">{{ isTourActive() ? 'TOUR [ON]' : 'TOUR' }}</span>
          </button>

          <!-- Adaptive Quality Selector (HIGH / MED / LOW) -->
          <button
            (click)="cycleQuality()"
            class="hidden lg:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1.5 font-mono text-[10px] text-slate-400 transition-colors hover:border-slate-600 hover:text-white focus:ring-2 focus:ring-slate-400 focus:outline-none"
            [title]="'Quality Level: ' + qualityLevel() + ' (Click to cycle)'"
          >
            <span>PERF:</span>
            <span class="font-bold text-cyan-300">{{ qualityLevel() }}</span>
          </button>

          <!-- Audio Mute Control -->
          <button
            (click)="toggleAudio()"
            class="rounded-lg border border-slate-700/80 bg-slate-900/80 p-1.5 text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            [title]="isMuted() ? 'Unmute Audio' : 'Mute Audio'"
            [attr.aria-label]="isMuted() ? 'Unmute Audio' : 'Mute Audio'"
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
            class="hidden sm:flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-200 transition-all hover:scale-102 hover:border-cyan-400 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>CV</span>
          </a>

          <!-- Mobile Menu Hamburger (Visible < lg) -->
          <button
            (click)="toggleMobileMenu()"
            aria-label="Toggle navigation menu"
            [class.border-cyan-500]="isMobileMenuOpen()"
            class="flex lg:hidden rounded-lg border border-slate-700/80 bg-slate-900/80 p-1.5 text-slate-300 transition-colors hover:border-slate-500 hover:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              @if (isMobileMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      @if (isMobileMenuOpen()) {
        <div class="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-2xl lg:hidden animate-fade-in">
          <div class="grid grid-cols-2 gap-2 font-mono text-xs">
            <button
              (click)="flyToMobile('system')"
              class="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-left text-slate-200 hover:border-cyan-400"
            >
              SYSTEM OVERVIEW
            </button>
            <button
              (click)="flyToMobile('projects')"
              class="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-left text-slate-200 hover:border-cyan-400"
            >
              PROJECTS FLEET
            </button>
            <button
              (click)="flyToMobile('career')"
              class="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-left text-slate-200 hover:border-cyan-400"
            >
              CAREER &amp; EXP
            </button>
            <button
              (click)="flyToMobile('skills')"
              class="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-left text-slate-200 hover:border-cyan-400"
            >
              SKILLS MATRIX
            </button>
            <button
              (click)="flyToMobile('about')"
              class="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-left text-slate-200 hover:border-cyan-400"
            >
              ABOUT / BIO
            </button>
            <button
              (click)="flyToMobile('contact')"
              class="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-left text-slate-200 hover:border-cyan-400"
            >
              CONTACT
            </button>
          </div>

          <div class="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <button
              (click)="openModal('dossier'); isMobileMenuOpen.set(false)"
              class="font-mono text-xs text-cyan-300 hover:underline"
            >
              📋 Executive Dossier
            </button>
            <a
              [href]="social.resume.url"
              [download]="social.resume.fileName"
              class="font-mono text-xs text-amber-300 hover:underline"
            >
              📄 Download Resume
            </a>
          </div>
        </div>
      }
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
  public isTourActive = computed(() => this.state.isTourActive());
  public isMuted = computed(() => this.audio.isMuted());
  public qualityLevel = computed(() => this.state.qualityLevel());

  public isMobileMenuOpen = signal<boolean>(false);

  public flyTo(sector: 'system' | 'projects' | 'career' | 'skills' | 'about' | 'contact'): void {
    this.state.flyToSector(sector);
  }

  public flyToMobile(sector: 'system' | 'projects' | 'career' | 'skills' | 'about' | 'contact'): void {
    this.isMobileMenuOpen.set(false);
    this.state.flyToSector(sector);
  }

  public isCurrentSector(sector: string): boolean {
    if (sector === 'system') return !this.activeModal() && !this.selectedTarget();
    if (sector === 'projects') return this.selectedTarget()?.category === 'Data Engineering' || this.selectedTarget()?.category === 'BI / Analytics' || this.selectedTarget()?.category === 'Supply Chain Intelligence' || this.selectedTarget()?.category === 'Machine Learning / MLOps' || this.selectedTarget()?.category === 'Mobile Application';
    if (sector === 'career') return this.selectedTarget()?.category === 'Professional Mission' || this.selectedTarget()?.category === 'Problem Solving' || this.selectedTarget()?.category === 'Education';
    if (sector === 'skills') return this.selectedTarget()?.category === 'Robotics & Hardware';
    if (sector === 'about') return this.activeModal() === 'about' || this.selectedTarget()?.type === 'sun';
    if (sector === 'contact') return this.activeModal() === 'contact';
    return false;
  }

  public openModal(modal: any): void {
    this.state.openModal(modal);
  }

  public toggleTour(): void {
    this.state.toggleTour();
  }

  public cycleQuality(): void {
    const current = this.state.qualityLevel();
    if (current === 'HIGH') this.state.setQualityLevel('MEDIUM');
    else if (current === 'MEDIUM') this.state.setQualityLevel('LOW');
    else this.state.setQualityLevel('HIGH');
  }

  public toggleAudio(): void {
    this.audio.toggleMute();
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }
}
