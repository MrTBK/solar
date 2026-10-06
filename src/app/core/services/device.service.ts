import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public isMobile = signal<boolean>(false);
  public isTablet = signal<boolean>(false);
  public isPortrait = signal<boolean>(false);
  public isLandscape = signal<boolean>(true);
  public isRotatePromptDismissed = signal<boolean>(false);
  public isLowPerformance = signal<boolean>(false);
  public isWebGLSupported = signal<boolean>(true);
  public prefersReducedMotion = signal<boolean>(false);

  constructor() {
    this.checkEnvironment();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkViewport());
      window.addEventListener('orientationchange', () => this.checkViewport());
      if (screen.orientation) {
        screen.orientation.addEventListener('change', () => this.checkViewport());
      }
    }
  }

  private checkEnvironment(): void {
    if (typeof window === 'undefined') return;

    this.checkViewport();
    this.checkWebGL();
    this.checkReducedMotion();
  }

  private checkViewport(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const minDim = Math.min(width, height);
    const maxDim = Math.max(width, height);

    // Accurate mobile detection: handles both portrait (< 600) and landscape phone dimensions
    const mobileDetected = minDim < 600 || (isTouch && maxDim < 1024 && minDim < 820);
    this.isMobile.set(mobileDetected);
    this.isTablet.set(!mobileDetected && (isTouch || (width >= 768 && width < 1024)));

    // Orientation detection
    const portrait = height > width;
    this.isPortrait.set(portrait);
    this.isLandscape.set(!portrait);

    // Reset dismiss state whenever the user rotates to landscape
    if (!portrait) {
      this.isRotatePromptDismissed.set(false);
    }

    // Performance detection
    const cores = navigator.hardwareConcurrency || 4;
    this.isLowPerformance.set(mobileDetected || cores <= 4);
  }

  public async requestLandscape(): Promise<boolean> {
    try {
      const orientation = screen.orientation as any;
      if (orientation && typeof orientation.lock === 'function') {
        await orientation.lock('landscape');
        this.checkViewport();
        return true;
      }
    } catch {
      // Orientation lock may require fullscreen or user gesture
    }

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        const orientation = screen.orientation as any;
        if (orientation && typeof orientation.lock === 'function') {
          await orientation.lock('landscape');
          this.checkViewport();
          return true;
        }
      }
    } catch {
      // Browser does not support orientation lock (e.g. iOS Safari)
    }

    return false;
  }

  public dismissRotatePrompt(): void {
    this.isRotatePromptDismissed.set(true);
  }

  public openRotatePrompt(): void {
    this.isRotatePromptDismissed.set(false);
  }

  private checkWebGL(): void {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      this.isWebGLSupported.set(!!gl);
    } catch {
      this.isWebGLSupported.set(false);
    }
  }

  private checkReducedMotion(): void {
    if (window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion.set(media.matches);
    }
  }

  public getRecommendedStarCount(): number {
    if (this.isMobile()) return 1800;
    if (this.isTablet()) return 3500;
    return 6000;
  }

  public getRecommendedDPR(): number {
    if (typeof window === 'undefined') return 1;
    const dpr = window.devicePixelRatio || 1;
    if (this.isMobile()) return Math.min(dpr, 1.5);
    return Math.min(dpr, 2.0);
  }
}
