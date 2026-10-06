import { Injectable, effect, inject } from '@angular/core';
import * as THREE from 'three';
import { CelestialBodyConfig } from '../../models/celestial.model';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { SolarSceneService } from './solar-scene.service';
import { CameraService } from './camera.service';
import { StateService } from './state.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private solarScene = inject(SolarSceneService);
  private cameraService = inject(CameraService);
  private state = inject(StateService);
  private audio = inject(AudioService);

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private hoveredMesh: THREE.Object3D | null = null;
  private originalScale = new THREE.Vector3(1, 1, 1);

  // Track drag vs click threshold
  private pointerDownPos = { x: 0, y: 0 };
  private isPointerDown = false;

  constructor() {
    // React to selectedTarget changes (e.g. from nav clicks)
    effect(() => {
      const target = this.state.selectedTarget();
      if (target) {
        this.focusOnTarget(target);
      } else {
        this.cameraService.flyToOverview();
      }
    });
  }

  public init(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointermove', (e) => this.onPointerMove(e, canvas));
    canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    canvas.addEventListener('pointerup', (e) => this.onPointerUp(e, canvas));
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  private onPointerDown(e: MouseEvent): void {
    this.isPointerDown = true;
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
  }

  private onPointerUp(e: MouseEvent, canvas: HTMLCanvasElement): void {
    this.isPointerDown = false;
    // Check if mouse moved significantly (drag/orbit vs click)
    const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
    if (dist < 6) {
      this.handleClick(e, canvas);
    }
  }

  private onPointerMove(e: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast
    this.raycaster.setFromCamera(this.mouse, this.cameraService.camera);
    const intersects = this.raycaster.intersectObjects(this.solarScene.interactiveMeshes, true);

    if (intersects.length > 0) {
      const topTarget = this.findCelestialObject(intersects[0].object);
      if (topTarget) {
        const config = (topTarget as unknown as { celestialConfig: CelestialBodyConfig }).celestialConfig;

        // Apply subtle hover scale
        if (this.hoveredMesh !== topTarget) {
          this.resetHoveredMesh();
          this.hoveredMesh = topTarget;
          this.originalScale.copy(topTarget.scale);
          topTarget.scale.multiplyScalar(1.08);
          canvas.style.cursor = 'pointer';
        }

        // Screen projection for hover tooltip
        const worldPos = new THREE.Vector3();
        topTarget.getWorldPosition(worldPos);
        worldPos.project(this.cameraService.camera);

        const screenX = ((worldPos.x + 1) * rect.width) / 2;
        const screenY = ((-worldPos.y + 1) * rect.height) / 2;

        this.state.setHoveredTarget(config, { x: screenX, y: screenY });
        return;
      }
    }

    // Nothing hovered
    this.resetHoveredMesh();
    canvas.style.cursor = 'default';
    this.state.setHoveredTarget(null, null);
  }

  private handleClick(e: MouseEvent, canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.cameraService.camera);
    const intersects = this.raycaster.intersectObjects(this.solarScene.interactiveMeshes, true);

    if (intersects.length > 0) {
      const topTarget = this.findCelestialObject(intersects[0].object);
      if (topTarget) {
        const config = (topTarget as unknown as { celestialConfig: CelestialBodyConfig }).celestialConfig;
        this.state.selectTarget(config, true);
      }
    }
  }

  private findCelestialObject(obj: THREE.Object3D): THREE.Object3D | null {
    let curr: THREE.Object3D | null = obj;
    while (curr) {
      if ((curr as unknown as { celestialConfig?: CelestialBodyConfig }).celestialConfig) {
        return curr;
      }
      curr = curr.parent;
    }
    return null;
  }

  private resetHoveredMesh(): void {
    if (this.hoveredMesh) {
      this.hoveredMesh.scale.copy(this.originalScale);
      this.hoveredMesh = null;
    }
  }

  public focusOnTarget(config: CelestialBodyConfig): void {
    const record = this.solarScene.objects.get(config.id);
    if (!record) return;

    const worldPos = new THREE.Vector3();
    record.mesh.getWorldPosition(worldPos);

    this.cameraService.flyTo(
      worldPos,
      config.cameraDistance,
      config.cameraElevation ?? 3,
      record.mesh
    );
  }

  private onKeyDown(e: KeyboardEvent): void {
    // If typing in input or textarea, ignore
    if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
      return;
    }

    if (e.key === 'Escape') {
      this.state.returnToSystem();
    } else if (e.key === 'Home' || e.code === 'Space') {
      this.state.returnToSystem();
    } else if (e.key === 'm' || e.key === 'M') {
      this.audio.toggleMute();
    } else if (e.key === 't' || e.key === 'T') {
      this.state.toggleOrbitLines();
    } else if (e.key === 'l' || e.key === 'L') {
      this.state.toggleLabels();
    } else if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key, 10) - 1;
      if (index < CELESTIAL_BODIES.length) {
        this.state.selectTarget(CELESTIAL_BODIES[index], true);
      }
    }
  }
}
