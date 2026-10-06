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
  private defaultPos = new THREE.Vector3(0, 85, 140);
  private defaultTarget = new THREE.Vector3(0, 0, 0);

  // Transition animation state
  private isTransitioning = false;
  private transitionProgress = 0;
  private transitionDuration = 1.4; // seconds
  private startPos = new THREE.Vector3();
  private startTarget = new THREE.Vector3();
  private destPos = new THREE.Vector3();
  private destTarget = new THREE.Vector3();

  // Active object being tracked
  public trackingObject: THREE.Object3D | null = null;
  private lastTrackedPos = new THREE.Vector3();

  public init(canvas: HTMLCanvasElement): void {
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 3500);
    this.camera.position.copy(this.defaultPos);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.2;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 1500; // Unlimited zoom out for full cosmological perspective
    this.controls.minPolarAngle = 0.05; // Prevent flip at true zenith
    this.controls.maxPolarAngle = Math.PI * 0.88; // Wide 3D viewing angle around planets without ground flip
    this.controls.target.copy(this.defaultTarget);

    // Mobile adjustments
    if (this.device.isMobile()) {
      this.defaultPos.set(0, 120, 180);
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
    if (!this.camera || !this.controls) return;
    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.startPos.copy(this.camera.position);
    this.startTarget.copy(this.controls.target);

    this.destTarget.copy(targetPosition);

    // Calculate camera destination vector relative to target
    const dir = new THREE.Vector3(0, 0, 1);
    if (targetPosition.length() > 0.01) {
      dir.copy(targetPosition).normalize();
    }
    this.destPos.copy(targetPosition).add(dir.clone().multiplyScalar(distance));
    this.destPos.y += elevation;

    this.trackingObject = trackedObj;
    if (trackedObj) {
      trackedObj.getWorldPosition(this.lastTrackedPos);
    } else {
      this.lastTrackedPos.copy(targetPosition);
    }
  }

  public flyToOverview(): void {
    if (!this.camera || !this.controls) return;
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
        if (this.trackingObject) {
          this.trackingObject.getWorldPosition(this.lastTrackedPos);
        }
      }

      // Smooth cubic easeInOut
      const t = this.easeInOutCubic(this.transitionProgress);

      this.camera.position.lerpVectors(this.startPos, this.destPos, t);
      this.controls.target.lerpVectors(this.startTarget, this.destTarget, t);
      this.controls.update();
    } else if (this.trackingObject) {
      // Follow orbital target as it moves across its orbit
      const currentPos = new THREE.Vector3();
      this.trackingObject.getWorldPosition(currentPos);
      const deltaPos = currentPos.clone().sub(this.lastTrackedPos);

      // Translate controls target and camera smoothly with the orbiting planet
      // User's zoom distance and viewing angle are 100% PRESERVED
      if (deltaPos.lengthSq() > 0.0000001) {
        this.controls.target.add(deltaPos);
        this.camera.position.add(deltaPos);
        this.lastTrackedPos.copy(currentPos);
      }

      this.controls.update();
    } else {
      this.controls.update();
    }
  }

  public rotateCamera(horizontal: number, vertical: number): void {
    if (!this.controls || !this.camera) return;
    const offset = this.camera.position.clone().sub(this.controls.target);
    const radius = offset.length();
    let theta = Math.atan2(offset.x, offset.z);
    let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

    theta += horizontal;
    phi = Math.max(0.1, Math.min(Math.PI / 2 + 0.15, phi + vertical));

    offset.x = radius * Math.sin(phi) * Math.sin(theta);
    offset.y = radius * Math.cos(phi);
    offset.z = radius * Math.sin(phi) * Math.cos(theta);

    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
  }

  public zoomCamera(amount: number): void {
    if (!this.controls || !this.camera) return;
    const offset = this.camera.position.clone().sub(this.controls.target);
    const currentLen = offset.length();
    const newLen = Math.max(this.controls.minDistance, Math.min(this.controls.maxDistance, currentLen + amount));
    offset.setLength(newLen);
    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
  }

  private easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}
