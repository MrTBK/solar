import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DeviceService } from './device.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private device = inject(DeviceService);

  public camera!: THREE.PerspectiveCamera;
  public controls!: OrbitControls;

  // Overview default coordinates
  private defaultPos = new THREE.Vector3(0, 75, 120);
  private defaultTarget = new THREE.Vector3(0, 0, 0);

  // Transition animation state
  private isTransitioning = false;
  private transitionProgress = 0;
  private transitionDuration = 1.6; // seconds
  private startPos = new THREE.Vector3();
  private startTarget = new THREE.Vector3();
  private destPos = new THREE.Vector3();
  private destTarget = new THREE.Vector3();

  // Active object being tracked
  public trackingObject: THREE.Object3D | null = null;
  public trackingOffset = new THREE.Vector3(0, 4, 10);

  public init(canvas: HTMLCanvasElement): void {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 2000);
    this.camera.position.copy(this.defaultPos);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 350;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.2; // Don't flip below system floor
    this.controls.target.copy(this.defaultTarget);

    // Mobile adjustments
    if (this.device.isMobile()) {
      this.defaultPos.set(0, 110, 160);
      this.camera.position.copy(this.defaultPos);
    }
  }

  public updateAspect(width: number, height: number): void {
    if (!this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public flyTo(
    targetPosition: THREE.Vector3,
    distance = 12,
    elevation = 4,
    trackedObj: THREE.Object3D | null = null
  ): void {
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.startPos.copy(this.camera.position);
    this.startTarget.copy(this.controls.target);

    this.destTarget.copy(targetPosition);

    // Calculate camera destination vector relative to target
    // We position slightly elevated and offset
    const dir = new THREE.Vector3(0, 0, 1);
    if (targetPosition.length() > 0.01) {
      dir.copy(targetPosition).normalize();
    }
    this.destPos.copy(targetPosition).add(dir.clone().multiplyScalar(distance));
    this.destPos.y += elevation;

    this.trackingObject = trackedObj;
    this.trackingOffset.set(dir.x * distance, elevation, dir.z * distance);
  }

  public flyToOverview(): void {
    this.trackingObject = null;
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.startPos.copy(this.camera.position);
    this.startTarget.copy(this.controls.target);

    this.destTarget.copy(this.defaultTarget);
    this.destPos.copy(this.defaultPos);
  }

  public update(delta: number): void {
    if (!this.camera || !this.controls) return;

    if (this.isTransitioning) {
      this.transitionProgress += delta / this.transitionDuration;
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isTransitioning = false;
      }

      // Smooth cubic easeInOut
      const t = this.easeInOutCubic(this.transitionProgress);

      this.camera.position.lerpVectors(this.startPos, this.destPos, t);
      this.controls.target.lerpVectors(this.startTarget, this.destTarget, t);
      this.controls.update();
    } else if (this.trackingObject) {
      // Follow orbital target as it moves
      const worldPos = new THREE.Vector3();
      this.trackingObject.getWorldPosition(worldPos);

      // Smoothly update controls target to follow orbiting planet
      this.controls.target.lerp(worldPos, 0.08);

      // Desired camera position follows planet with trackingOffset
      const desiredPos = worldPos.clone().add(this.trackingOffset);
      this.camera.position.lerp(desiredPos, 0.08);

      this.controls.update();
    } else {
      this.controls.update();
    }
  }

  private easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}
