import { Component, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from '../../core/services/device.service';

@Component({
  selector: 'app-rotate-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Non-intrusive floating hint on mobile portrait -->
    @if (shouldShowPrompt()) {
      <div class="pointer-events-none fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] px-2 animate-fade-in">
        <div
          class="pointer-events-auto flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-950/90 px-3.5 py-1.5 shadow-[0_4px_20px_rgba(6,182,212,0.25)] backdrop-blur-xl"
        >
          <span class="text-xs">🔄</span>
          <span class="font-mono text-[11px] text-cyan-200 tracking-tight">Rotate phone for widescreen view</span>
          <button
            (click)="dismiss()"
            class="ml-1 rounded-full px-1 text-slate-400 hover:text-white transition-colors text-xs font-mono"
            aria-label="Dismiss rotation tip"
          >
            ✕
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `
  ]
})
export class RotatePromptComponent implements OnDestroy {
  private device = inject(DeviceService);
  private autoDismissTimeout: any = null;

  public shouldShowPrompt = computed(() => {
    const show = this.device.isMobile() && this.device.isPortrait() && !this.device.isRotatePromptDismissed();
    if (show && typeof window !== 'undefined' && !this.autoDismissTimeout) {
      this.autoDismissTimeout = setTimeout(() => {
        this.dismiss();
      }, 7000);
    }
    return show;
  });

  public dismiss(): void {
    if (this.autoDismissTimeout) {
      clearTimeout(this.autoDismissTimeout);
      this.autoDismissTimeout = null;
    }
    this.device.dismissRotatePrompt();
  }

  ngOnDestroy(): void {
    if (this.autoDismissTimeout) {
      clearTimeout(this.autoDismissTimeout);
      this.autoDismissTimeout = null;
    }
  }
}
