import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-hover-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (target(); as body) {
      @if (pos(); as p) {
        <div
          class="pointer-events-none fixed z-30 transition-all duration-75 hidden md:block"
          [style.left.px]="clampedX(p.x)"
          [style.top.px]="p.y"
          [style.transform]="getTransform(p.x)"
        >
          <div
            class="relative rounded-lg border border-cyan-500/40 bg-slate-950/90 px-4 py-2.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md"
          >
            <!-- Corner HUD accents -->
            <div class="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-cyan-400"></div>
            <div class="absolute -top-1 -right-1 h-2 w-2 border-t-2 border-r-2 border-cyan-400"></div>
            <div class="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-cyan-400"></div>
            <div class="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-cyan-400"></div>

            <div class="flex items-center gap-2">
              <span class="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400"></span>
              <span class="font-mono text-[10px] tracking-widest text-cyan-400 uppercase whitespace-nowrap">
                {{ body.category }}
              </span>
            </div>

            <div class="mt-0.5 text-sm font-bold tracking-wide text-white whitespace-nowrap max-w-[220px] truncate">
              {{ body.name }}
            </div>

            @if (body.subtitle) {
              <div class="text-[11px] text-slate-300 max-w-[220px] truncate">
                {{ body.subtitle }}
              </div>
            }

            <div class="mt-2 border-t border-slate-800 pt-1 font-mono text-[9px] tracking-wider text-slate-400">
              [ CLICK TO ENGAGE ORBIT ]
            </div>
          </div>
        </div>
      }
    }
  `
})
export class HoverTooltipComponent {
  private state = inject(StateService);

  public target = computed(() => this.state.hoveredTarget());
  public pos = computed(() => this.state.hoverPosition());

  // Clamp X position so tooltip doesn't go off-screen edges
  public clampedX(x: number): number {
    const TOOLTIP_WIDTH = 240;
    const MARGIN = 8;
    return Math.max(MARGIN + TOOLTIP_WIDTH / 2, Math.min(window.innerWidth - MARGIN - TOOLTIP_WIDTH / 2, x));
  }

  // If near right edge, anchor right; if near left edge, anchor left
  public getTransform(x: number): string {
    const TOOLTIP_WIDTH = 240;
    if (x > window.innerWidth - TOOLTIP_WIDTH) {
      return 'translateX(-90%) translateY(-120%)';
    }
    if (x < TOOLTIP_WIDTH / 2) {
      return 'translateX(-10%) translateY(-120%)';
    }
    return 'translateX(-50%) translateY(-120%)';
  }
}
