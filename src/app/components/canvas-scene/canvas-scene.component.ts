import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolarSceneService } from '../../core/services/solar-scene.service';
import { InteractionService } from '../../core/services/interaction.service';
import { StateService } from '../../core/services/state.service';
import { HoverTooltipComponent } from '../hover-tooltip/hover-tooltip.component';

@Component({
  selector: 'app-canvas-scene',
  standalone: true,
  imports: [CommonModule, HoverTooltipComponent],
  template: `
    <div class="relative h-full w-full overflow-hidden bg-slate-950">
      <canvas #webglCanvas class="block h-full w-full cursor-grab active:cursor-grabbing touch-none"></canvas>
      <app-hover-tooltip></app-hover-tooltip>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
      }
    `
  ]
})
export class CanvasSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webglCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private solarScene = inject(SolarSceneService);
  private interaction = inject(InteractionService);
  private state = inject(StateService);

  // Double-tap detection for mobile
  private lastTapTime = 0;
  private readonly DOUBLE_TAP_MS = 300;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.solarScene.init(canvas);
    this.interaction.init(canvas);

    // Touch: double-tap returns to system overview
    canvas.addEventListener('touchend', (e: TouchEvent) => {
      const now = Date.now();
      if (now - this.lastTapTime < this.DOUBLE_TAP_MS && e.touches.length === 0) {
        e.preventDefault();
        this.state.returnToSystem();
      }
      this.lastTapTime = now;
    }, { passive: false });
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onResize(): void {
    this.solarScene.resize();
  }

  ngOnDestroy(): void {
    this.solarScene.destroy();
  }
}
