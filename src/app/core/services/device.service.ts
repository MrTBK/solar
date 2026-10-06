import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  public isMobile = signal<boolean>(false);
  public isTablet = signal<boolean>(false);
  public isLowPerformance = signal<boolean>(false);
  public isWebGLSupported = signal<boolean>(true);
  public prefersReducedMotion = signal<boolean>(false);

  constructor() {
    this.checkEnvironment();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkViewport());
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
    this.isMobile.set(width < 768);
    this.isTablet.set(width >= 768 && width < 1024);

    // If mobile or low hardware concurrency, mark low performance
    const cores = navigator.hardwareConcurrency || 4;
    this.isLowPerformance.set(width < 768 || cores <= 4);
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
