import { Component, HostListener, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../core/services/state.service';
import { CameraService } from '../../core/services/camera.service';
import { AudioService } from '../../core/services/audio.service';
import { DeviceService } from '../../core/services/device.service';
import { HapticService } from '../../core/services/haptic.service';

@Component({
  selector: 'app-pilot-hud',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isFlightMode()) {
      <div class="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-6 select-none font-mono text-cyan-400">
        <!-- Top Status Bar -->
        <div class="flex items-start justify-between w-full">
          <!-- Ship Telemetry -->
          <div class="rounded-xl border border-cyan-500/40 bg-slate-950/80 p-3.5 shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md">
            <div class="flex items-center gap-2 text-xs font-bold tracking-wider text-white">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>PROBE // MK-IV EXPLORER</span>
            </div>
            <div class="mt-1 flex items-baseline gap-2">
              <span class="text-2xl font-black text-cyan-300 font-mono">{{ velocity() }}</span>
              <span class="text-[10px] text-cyan-500">KM/S VELOCITY</span>
            </div>
            <!-- Thruster throttle bar -->
            <div class="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-slate-800">
              <div
                class="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 transition-all duration-75"
                [style.width.%]="throttlePercent()"
              ></div>
            </div>
          </div>

          <!-- Exit Flight Button (Pointer events auto) -->
          <div class="pointer-events-auto flex items-center gap-2">
            <button
              (click)="exitFlight()"
              class="flex items-center gap-2 rounded-xl border border-rose-500/50 bg-slate-950/90 px-4 py-2 text-xs font-bold text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)] backdrop-blur-md transition-all active:scale-95 hover:bg-rose-950/80 hover:text-white"
            >
              <span>DISENGAGE PILOT</span>
              <span class="rounded bg-rose-900/60 px-1.5 py-0.5 text-[10px] text-white">ESC</span>
            </button>
          </div>
        </div>

        <!-- Center Cockpit Reticle -->
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="relative flex items-center justify-center">
            <!-- Outer Target Circle -->
            <div class="h-44 w-44 rounded-full border border-dashed border-cyan-500/30 animate-spin" style="animation-duration: 40s;"></div>

            <!-- Pitch Ladder Marks -->
            <div class="absolute h-24 w-32 flex flex-col justify-between items-center opacity-40">
              <div class="w-16 border-t border-cyan-400"></div>
              <div class="w-24 border-t border-cyan-400"></div>
              <div class="w-16 border-t border-cyan-400"></div>
            </div>

            <!-- Center Crosshair Dot -->
            <div class="absolute h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
            <div class="absolute -top-6 text-[10px] tracking-widest text-cyan-300">HORIZON // 0.0°</div>
            <div class="absolute -bottom-6 text-[9px] tracking-wider text-slate-400">NAV LOCK ACTIVE</div>
          </div>
        </div>

        <!-- Bottom Controls & Hints -->
        <div class="flex items-end justify-between w-full">
          <!-- Desktop Keyboard Guides -->
          <div class="hidden md:flex flex-col gap-1 rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 text-[11px] text-slate-400 shadow-xl backdrop-blur-md">
            <div class="text-cyan-400 font-bold mb-0.5">MANUAL FLIGHT SYSTEMS:</div>
            <div class="flex items-center gap-3">
              <span><b class="text-white">W / S</b> : Forward / Retro-Thrust</span>
              <span>·</span>
              <span><b class="text-white">A / D</b> : Yaw Left / Right</span>
              <span>·</span>
              <span><b class="text-white">↑ / ↓</b> : Pitch</span>
              <span>·</span>
              <span><b class="text-white">SHIFT</b> : Hyperspace Boost</span>
            </div>
          </div>

          <!-- Mobile Touch Flight Controls (Pointer events auto) -->
          <div class="pointer-events-auto flex items-center justify-between w-full md:hidden gap-3 px-1 pb-1">
            <!-- Left Pad: Steering (Yaw) -->
            <div class="flex items-center gap-2">
              <button
                (touchstart)="startInput('yawLeft')"
                (touchend)="stopInput('yawLeft')"
                (mousedown)="startInput('yawLeft')"
                (mouseup)="stopInput('yawLeft')"
                class="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-slate-950/90 text-lg font-black text-cyan-300 shadow-lg active:bg-cyan-900/60"
              >
                ◀
              </button>
              <button
                (touchstart)="startInput('yawRight')"
                (touchend)="stopInput('yawRight')"
                (mousedown)="startInput('yawRight')"
                (mouseup)="stopInput('yawRight')"
                class="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-slate-950/90 text-lg font-black text-cyan-300 shadow-lg active:bg-cyan-900/60"
              >
                ▶
              </button>
            </div>

            <!-- Right Pad: Throttle & Boost -->
            <div class="flex items-center gap-2">
              <button
                (touchstart)="startInput('reverse')"
                (touchend)="stopInput('reverse')"
                (mousedown)="startInput('reverse')"
                (mouseup)="stopInput('reverse')"
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-xs font-bold text-slate-300 shadow-lg active:bg-slate-800"
              >
                REV
              </button>
              <button
                (touchstart)="startInput('thrust')"
                (touchend)="stopInput('thrust')"
                (mousedown)="startInput('thrust')"
                (mouseup)="stopInput('thrust')"
                class="flex h-14 w-16 items-center justify-center rounded-2xl border border-cyan-400 bg-cyan-950/90 text-xs font-black text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:bg-cyan-800"
              >
                THRUST
              </button>
              <button
                (touchstart)="startInput('boost')"
                (touchend)="stopInput('boost')"
                (mousedown)="startInput('boost')"
                (mouseup)="stopInput('boost')"
                class="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/50 bg-amber-950/80 text-xs font-black text-amber-300 shadow-lg active:bg-amber-900"
              >
                ⚡
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class PilotHudComponent implements OnInit, OnDestroy {
  private state = inject(StateService);
  private cameraService = inject(CameraService);
  private audio = inject(AudioService);
  private device = inject(DeviceService);
  private haptic = inject(HapticService);

  public isFlightMode = computed(() => this.state.isFlightMode());
  public velocity = computed(() => this.state.flightVelocity());
  public throttlePercent = computed(() => Math.min(100, (this.velocity() / 25000) * 100));

  private keysDown: Set<string> = new Set();
  private touchInputs: {
    thrust: boolean;
    reverse: boolean;
    yawLeft: boolean;
    yawRight: boolean;
    boost: boolean;
  } = {
    thrust: false,
    reverse: false,
    yawLeft: false,
    yawRight: false,
    boost: false
  };

  private loopInterval: any;

  ngOnInit(): void {
    this.loopInterval = setInterval(() => this.updateFlight(), 16);
  }

  ngOnDestroy(): void {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isFlightMode()) return;
    if (event.key === 'Escape') {
      this.exitFlight();
      return;
    }
    this.keysDown.add(event.code);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (!this.isFlightMode()) return;
    this.keysDown.delete(event.code);
  }

  public startInput(type: 'thrust' | 'reverse' | 'yawLeft' | 'yawRight' | 'boost'): void {
    this.touchInputs[type] = true;
    this.haptic.light();
    if (type === 'thrust' || type === 'boost') {
      this.audio.playThruster();
    }
  }

  public stopInput(type: 'thrust' | 'reverse' | 'yawLeft' | 'yawRight' | 'boost'): void {
    this.touchInputs[type] = false;
  }

  private updateFlight(): void {
    if (!this.isFlightMode()) return;

    let forward = 0;
    let yaw = 0;
    let pitch = 0;
    let roll = 0;
    let boost = false;

    // Keyboard inputs
    if (this.keysDown.has('KeyW')) forward += 1;
    if (this.keysDown.has('KeyS')) forward -= 0.6;
    if (this.keysDown.has('KeyA')) yaw += 1;
    if (this.keysDown.has('KeyD')) yaw -= 1;
    if (this.keysDown.has('ArrowUp')) pitch -= 0.8;
    if (this.keysDown.has('ArrowDown')) pitch += 0.8;
    if (this.keysDown.has('KeyQ')) roll += 1;
    if (this.keysDown.has('KeyE')) roll -= 1;
    if (this.keysDown.has('ShiftLeft') || this.keysDown.has('ShiftRight')) boost = true;

    // Mobile touch inputs
    if (this.touchInputs.thrust) forward += 1;
    if (this.touchInputs.reverse) forward -= 0.6;
    if (this.touchInputs.yawLeft) yaw += 1;
    if (this.touchInputs.yawRight) yaw -= 1;
    if (this.touchInputs.boost) boost = true;

    this.cameraService.setFlightInputs(forward, yaw, pitch, roll, boost);
  }

  public exitFlight(): void {
    this.state.toggleFlightMode();
  }
}
