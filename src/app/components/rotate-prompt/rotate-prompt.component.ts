import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../core/services/device.service';

@Component({
  selector: 'app-rotate-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Full-Screen Rotation Modal Prompt (When in portrait on mobile and not dismissed) -->
    @if (shouldShowFullPrompt()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur-xl animate-fade-in"
      >
        <!-- Background subtle glow -->
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)]"></div>

        <div
          class="relative w-full max-w-sm rounded-3xl border border-cyan-500/40 bg-slate-950/95 p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-2xl"
        >
          <!-- Corner Accents -->
          <div class="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none"></div>
          <div class="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none"></div>
          <div class="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none"></div>
          <div class="absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none"></div>

          <!-- Animated Rotating Phone Graphic -->
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <div class="relative flex items-center justify-center">
              <!-- Outer glowing orbit indicator -->
              <div class="absolute h-20 w-20 rounded-full border border-dashed border-cyan-500/40 animate-spin" style="animation-duration: 12s;"></div>

              <!-- Animated Phone Icon that cycles vertical to horizontal -->
              <div class="rotate-phone-anim flex items-center justify-center">
                <div class="relative h-14 w-8 rounded-xl border-2 border-cyan-400 bg-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex flex-col items-center justify-between p-1">
                  <!-- Speaker notch -->
                  <div class="h-0.5 w-3 rounded-full bg-cyan-400"></div>
                  <!-- Solar icon on screen -->
                  <div class="text-[10px] text-amber-400">☀</div>
                  <!-- Home indicator -->
                  <div class="h-0.5 w-2 rounded-full bg-cyan-400"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Badge -->
          <div class="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/50 px-3 py-0.5 font-mono text-[10px] text-cyan-300">
            <span class="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>OPTIMAL VIEWPORT // 3D ORRERY</span>
          </div>

          <!-- Heading -->
          <h2 class="mt-3 text-xl font-black tracking-tight text-white">
            ROTATE FOR 3D WIDESCREEN
          </h2>

          <!-- Description -->
          <p class="mt-2 text-xs leading-relaxed text-slate-300">
            The Solar System is best experienced in horizontal landscape rotation. Turn your device to explore the planetary orbits in wide panoramic glory.
          </p>

          <!-- Action Buttons -->
          <div class="mt-5 flex flex-col gap-2 font-mono text-xs">
            <button
              (click)="rotateToLandscape()"
              class="flex items-center justify-center gap-2 rounded-xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all active:scale-98 hover:brightness-110"
            >
              <span>🔄 ROTATE TO LANDSCAPE</span>
            </button>

            <button
              (click)="dismiss()"
              class="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-400 transition-colors hover:text-slate-200"
            >
              Continue in Portrait ✕
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Discreet Quick Floating Rotate Badge (When on mobile in portrait and dismissed) -->
    @if (shouldShowFloatingBadge()) {
      <div class="pointer-events-none fixed right-3 bottom-14 z-40 md:hidden">
        <button
          (click)="reopenPrompt()"
          class="pointer-events-auto flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-slate-950/90 px-3 py-1.5 font-mono text-[11px] font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md transition-all active:scale-95"
          title="Rotate phone to landscape for widescreen 3D view"
        >
          <span class="animate-spin" style="animation-duration: 4s;">📱</span>
          <span>ROTATE ⟳</span>
        </button>
      </div>
    }
  `,
  styles: [
    `
      @keyframes phoneTilt {
        0%, 20% {
          transform: rotate(0deg);
        }
        50%, 80% {
          transform: rotate(-90deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }

      .rotate-phone-anim {
        animation: phoneTilt 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `
  ]
})
export class RotatePromptComponent {
  private device = inject(DeviceService);

  public shouldShowFullPrompt = computed(() => {
    return this.device.isMobile() && this.device.isPortrait() && !this.device.isRotatePromptDismissed();
  });

  public shouldShowFloatingBadge = computed(() => {
    return this.device.isMobile() && this.device.isPortrait() && this.device.isRotatePromptDismissed();
  });

  public async rotateToLandscape(): Promise<void> {
    const success = await this.device.requestLandscape();
    if (!success) {
      // If browser security blocks API lock without full native permissions,
      // the visual prompt has instructed the user to turn their device physically.
      this.device.dismissRotatePrompt();
    }
  }

  public dismiss(): void {
    this.device.dismissRotatePrompt();
  }

  public reopenPrompt(): void {
    this.device.openRotatePrompt();
  }
}
