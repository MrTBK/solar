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
import { HoverTooltipComponent } from '../hover-tooltip/hover-tooltip.component';

@Component({
  selector: 'app-canvas-scene',
  standalone: true,
  imports: [CommonModule, HoverTooltipComponent],
  template: `
    <div class="relative h-full w-full overflow-hidden bg-slate-950">
      <canvas #webglCanvas class="block h-full w-full cursor-grab active:cursor-grabbing"></canvas>
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

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.solarScene.init(canvas);
    this.interaction.init(canvas);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.solarScene.resize();
  }

  ngOnDestroy(): void {
    this.solarScene.destroy();
  }
}
