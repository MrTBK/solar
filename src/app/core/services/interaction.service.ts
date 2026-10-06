import { Injectable, effect, inject } from '@angular/core';
import * as THREE from 'three';
import { CelestialBodyConfig } from '../../models/celestial.model';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { SkillPlanetItem } from '../../data/skill.data';
import { SolarSceneService } from './solar-scene.service';
import { CameraService } from './camera.service';
import { StateService } from './state.service';
import { AudioService } from './audio.service';

interface InteractiveTarget {
  mesh: THREE.Object3D;
  celestialConfig?: CelestialBodyConfig;
  skillPlanetConfig?: SkillPlanetItem;
}

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
      } else if (!this.state.isSkillsRowMode() && !this.state.isBlackHoleActive()) {
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
    if (this.state.isBlackHoleActive()) return;

    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast
    this.raycaster.setFromCamera(this.mouse, this.cameraService.camera);
    const intersects = this.raycaster.intersectObjects(this.solarScene.interactiveMeshes, true);

    if (intersects.length > 0) {
      const target = this.findInteractiveObject(intersects[0].object);
      if (target) {
        // Apply subtle hover scale
        if (this.hoveredMesh !== target.mesh) {
          this.resetHoveredMesh();
          this.hoveredMesh = target.mesh;
          this.originalScale.copy(target.mesh.scale);
          target.mesh.scale.multiplyScalar(1.08);
          canvas.style.cursor = 'pointer';
        }

        // Screen projection for hover tooltip
        const worldPos = new THREE.Vector3();
        target.mesh.getWorldPosition(worldPos);
        worldPos.project(this.cameraService.camera);

        const screenX = ((worldPos.x + 1) * rect.width) / 2;
        const screenY = ((-worldPos.y + 1) * rect.height) / 2;

        if (target.skillPlanetConfig) {
          const sp = target.skillPlanetConfig;
          const syntheticConfig: CelestialBodyConfig = {
            id: sp.id,
            name: sp.name,
            subtitle: sp.tagline,
            category: sp.category,
            type: 'planet',
            radius: sp.radius,
            orbitDistance: 0,
            orbitSpeed: 0,
            rotationSpeed: 0,
            color: sp.color,
            emissiveColor: sp.emissiveColor,
            textureType: sp.textureType,
            cameraDistance: 12
          };
          this.state.setHoveredTarget(syntheticConfig, { x: screenX, y: screenY });
        } else if (target.celestialConfig) {
          this.state.setHoveredTarget(target.celestialConfig, { x: screenX, y: screenY });
        }
        return;
      }
    }

    // Nothing hovered
    this.resetHoveredMesh();
    canvas.style.cursor = 'default';
    this.state.setHoveredTarget(null, null);
  }

  private handleClick(e: MouseEvent, canvas: HTMLCanvasElement): void {
    if (this.state.isBlackHoleActive()) return;

    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.cameraService.camera);
    const intersects = this.raycaster.intersectObjects(this.solarScene.interactiveMeshes, true);

    if (intersects.length > 0) {
      const target = this.findInteractiveObject(intersects[0].object);
      if (target) {
        if (target.skillPlanetConfig) {
          this.state.openSkillPlanet(target.skillPlanetConfig);

          // Fly camera to skill planet
          const worldPos = new THREE.Vector3();
          target.mesh.getWorldPosition(worldPos);
          this.cameraService.flyTo(worldPos, 14, 3, target.mesh);
        } else if (target.celestialConfig) {
          // Select and focus on celestial body — do NOT track as "explored" for recruiter quest
          this.state.selectTarget(target.celestialConfig, true);
        }
      }
    }
  }

  private findInteractiveObject(obj: THREE.Object3D): InteractiveTarget | null {
    let curr: THREE.Object3D | null = obj;
    while (curr) {
      const anyCurr = curr as unknown as {
        isSkillPlanet?: boolean;
        skillPlanetConfig?: SkillPlanetItem;
        celestialConfig?: CelestialBodyConfig;
      };
      if (anyCurr.isSkillPlanet && anyCurr.skillPlanetConfig) {
        return { mesh: curr, skillPlanetConfig: anyCurr.skillPlanetConfig };
      }
      if (anyCurr.celestialConfig) {
        return { mesh: curr, celestialConfig: anyCurr.celestialConfig };
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
    // Ignore all keys when typing in form elements
    const tag = (e.target as HTMLElement)?.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
      return;
    }
    // Ignore keyboard shortcuts during active black hole animation
    const isModal = !!document.querySelector('[data-modal-trap]');
    if (isModal && !['Escape', 'Home'].includes(e.key)) {
      return;
    }

    if (e.key === 'Escape' || e.key === 'Home') {
      this.state.returnToSystem();
    } else if (e.code === 'Space') {
      e.preventDefault(); // prevent page scroll
      this.state.returnToSystem();
    } else if (e.key === 'm' || e.key === 'M') {
      this.audio.toggleMute();
    } else if (e.key === 't' || e.key === 'T') {
      this.state.toggleOrbitLines();
    } else if (e.key === 'l' || e.key === 'L') {
      this.state.toggleLabels();
    } else if (e.key === 'r' || e.key === 'R') {
      this.state.toggleSkillsRowMode();
    } else if (e.key === 'b' || e.key === 'B') {
      this.state.triggerBlackHole();
    } else if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key, 10) - 1;
      if (index < CELESTIAL_BODIES.length) {
        this.state.selectTarget(CELESTIAL_BODIES[index], true);
      }
    }
  }
}
