import { Injectable, effect, inject } from '@angular/core';
import * as THREE from 'three';
import { CelestialBodyConfig } from '../../models/celestial.model';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { SKILL_PLANETS, SkillPlanetItem } from '../../data/skill.data';
import { CelestialFactoryService } from './celestial-factory.service';
import { CameraService } from './camera.service';
import { DeviceService } from './device.service';
import { StateService } from './state.service';

export interface SceneObjectRecord {
  config: CelestialBodyConfig;
  pivot: THREE.Group;
  mesh: THREE.Object3D;
  orbitLine?: THREE.Line;
  labelSprite?: THREE.Sprite;
  currentAngle: number;
  satellites: { group: THREE.Group; speed: number; angle: number }[];
  atmosphere?: THREE.Mesh;
  initialScale: THREE.Vector3;
  initialLocalPos: THREE.Vector3;
}

export interface SkillPlanetRecord {
  config: SkillPlanetItem;
  mesh: THREE.Mesh;
  label: THREE.Sprite;
  atmosphere: THREE.Mesh;
  initialPos: THREE.Vector3;
  initialScale: THREE.Vector3;
}

@Injectable({
  providedIn: 'root'
})
export class SolarSceneService {
  private factory = inject(CelestialFactoryService);
  private cameraService = inject(CameraService);
  private device = inject(DeviceService);
  private state = inject(StateService);

  public scene!: THREE.Scene;
  public renderer!: THREE.WebGLRenderer;
  public canvas!: HTMLCanvasElement;

  private lastTime = performance.now();
  private animationFrameId: number | null = null;

  public objects: Map<string, SceneObjectRecord> = new Map();
  public interactiveMeshes: THREE.Object3D[] = [];

  // Skills row collection
  public skillPlanetsGroup = new THREE.Group();
  public skillPlanetRecords: Map<string, SkillPlanetRecord> = new Map();

  // Black Hole Singularity
  public blackHole!: {
    group: THREE.Group;
    horizon: THREE.Mesh;
    accretionDisk: THREE.Mesh;
    photonRing: THREE.Mesh;
    particles: THREE.Points;
  };
  private devouredNotified = false;

  // Special animated objects
  private sunMesh: THREE.Mesh | null = null;
  private sunGlow: THREE.Sprite | null = null;
  private asteroidBeltGroup: THREE.Group | null = null;
  private starfieldPoints: THREE.Points | null = null;

  constructor() {
    // React to row mode changes
    effect(() => {
      const isRow = this.state.isSkillsRowMode();
      this.handleSkillsRowMode(isRow);
    });

    // React to reset universe
    effect(() => {
      const isCompleted = this.state.isBlackHoleCompleted();
      const isActive = this.state.isBlackHoleActive();
      if (!isCompleted && !isActive && this.devouredNotified) {
        this.restoreUniverse();
      }
    });
  }

  public init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x030712);
    this.scene.fog = new THREE.FogExp2(0x030712, 0.0018);

    // 2. Camera & Controls
    this.cameraService.init(canvas);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.device.isMobile(),
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(this.device.getRecommendedDPR());
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 4. Lighting & Starfield
    this.setupLighting();
    this.setupStarfield();

    // 5. Build Celestial Bodies, Skills Row & Black Hole
    this.buildSystem();
    this.buildSkillPlanetsRow();
    this.buildBlackHole();

    // 6. Start Animation Loop
    this.startLoop();
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0x1e293b, 1.2);
    this.scene.add(ambient);

    const sunLight = new THREE.PointLight(0xffedd5, 3.5, 300, 0.8);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight.position.set(50, 100, 50);
    this.scene.add(dirLight);
  }

  private setupStarfield(): void {
    const starCount = this.device.getRecommendedStarCount();
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const color1 = new THREE.Color(0xffffff);
    const color2 = new THREE.Color(0x38bdf8);
    const color3 = new THREE.Color(0xfbbf24);
    const color4 = new THREE.Color(0xa855f7);

    for (let i = 0; i < starCount; i++) {
      const r = 400 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      const chosenColor = rand > 0.8 ? color2 : rand > 0.65 ? color3 : rand > 0.55 ? color4 : color1;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true
    });

    this.starfieldPoints = new THREE.Points(geometry, material);
    this.scene.add(this.starfieldPoints);
  }

  private buildSystem(): void {
    this.objects.clear();
    this.interactiveMeshes = [];

    CELESTIAL_BODIES.forEach((config) => {
      const pivot = new THREE.Group();
      this.scene.add(pivot);

      let mainMesh: THREE.Object3D;
      let atmosphere: THREE.Mesh | undefined;
      let labelSprite: THREE.Sprite | undefined;
      const satList: { group: THREE.Group; speed: number; angle: number }[] = [];

      if (config.type === 'sun') {
        const sunGeo = new THREE.SphereGeometry(config.radius, 48, 48);
        const sunMat = new THREE.MeshBasicMaterial({
          map: this.factory.createSunTexture()
        });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        this.sunMesh = sun;
        mainMesh = sun;

        this.sunGlow = this.factory.createSunGlowSprite('#f59e0b', 256);
        sun.add(this.sunGlow);

        mainMesh.position.set(0, 0, 0);
        pivot.add(mainMesh);
      } else if (config.type === 'station') {
        mainMesh = this.factory.createCoficabStationMesh();
        mainMesh.position.set(config.orbitDistance, 0, 0);
        pivot.add(mainMesh);
      } else if (config.type === 'education') {
        mainMesh = this.factory.createEducationStationMesh();
        mainMesh.position.set(config.orbitDistance, 0, 0);
        pivot.add(mainMesh);
      } else if (config.type === 'asteroid-belt') {
        const belt = this.factory.createAsteroidBelt(350, config.orbitDistance, 10);
        this.asteroidBeltGroup = belt;
        mainMesh = belt;
        pivot.add(mainMesh);
      } else {
        const planetGeo = new THREE.SphereGeometry(config.radius, 36, 36);
        const planetMat = new THREE.MeshStandardMaterial({
          map: this.factory.createPlanetTexture(config.textureType, config.color),
          roughness: config.roughness ?? 0.6,
          metalness: config.metalness ?? 0.2,
          emissive: new THREE.Color(config.emissiveColor),
          emissiveIntensity: 0.12
        });
        const planet = new THREE.Mesh(planetGeo, planetMat);
        mainMesh = planet;
        mainMesh.position.set(config.orbitDistance, 0, 0);

        atmosphere = this.factory.createAtmosphereGlow(config.radius, config.color);
        planet.add(atmosphere);

        if (config.ring) {
          const ringMesh = this.factory.createPlanetRing(
            config.ring.innerRadius,
            config.ring.outerRadius,
            config.ring.color,
            config.ring.opacity
          );
          planet.add(ringMesh);
        }

        if (config.satellites) {
          config.satellites.forEach((sat) => {
            const { group } = this.factory.createSatelliteGroup(sat);
            planet.add(group);
            satList.push({
              group,
              speed: sat.speed,
              angle: Math.random() * Math.PI * 2
            });
          });
        }

        pivot.add(mainMesh);
      }

      let orbitLine: THREE.Line | undefined;
      if (config.orbitDistance > 0 && config.type !== 'asteroid-belt') {
        orbitLine = this.factory.createOrbitLine(config.orbitDistance, config.color);
        this.scene.add(orbitLine);
      }

      if (config.type !== 'asteroid-belt') {
        labelSprite = this.factory.createLabelSprite(config.name, config.category);
        labelSprite.position.set(0, config.radius + 3.0, 0);
        mainMesh.add(labelSprite);
      }

      (mainMesh as unknown as { celestialId: string; celestialConfig: CelestialBodyConfig }).celestialId = config.id;
      (mainMesh as unknown as { celestialId: string; celestialConfig: CelestialBodyConfig }).celestialConfig = config;
      this.interactiveMeshes.push(mainMesh);

      const startAngle = Math.random() * Math.PI * 2;
      pivot.rotation.y = startAngle;

      this.objects.set(config.id, {
        config,
        pivot,
        mesh: mainMesh,
        orbitLine,
        labelSprite,
        currentAngle: startAngle,
        satellites: satList,
        atmosphere,
        initialScale: mainMesh.scale.clone(),
        initialLocalPos: mainMesh.position.clone()
      });
    });
  }

  // --- BUILD SKILLS PLANETS IN A ROW ---

  private buildSkillPlanetsRow(): void {
    this.skillPlanetRecords.clear();
    this.skillPlanetsGroup.clear();
    this.scene.add(this.skillPlanetsGroup);

    SKILL_PLANETS.forEach((item) => {
      const geo = new THREE.SphereGeometry(item.radius, 36, 36);
      const mat = new THREE.MeshStandardMaterial({
        map: this.factory.createPlanetTexture(item.textureType, item.color),
        roughness: 0.5,
        metalness: 0.3,
        emissive: new THREE.Color(item.emissiveColor),
        emissiveIntensity: 0.18
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(item.rowX, 0, 0);

      // Atmosphere glow
      const atmosphere = this.factory.createAtmosphereGlow(item.radius, item.color);
      mesh.add(atmosphere);

      // 3D Label
      const label = this.factory.createLabelSprite(item.name, item.category);
      label.position.set(0, item.radius + 2.8, 0);
      mesh.add(label);

      // Orbital indicator ring on floor
      const ringGeo = new THREE.RingGeometry(item.radius * 1.3, item.radius * 1.45, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(item.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const baseRing = new THREE.Mesh(ringGeo, ringMat);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = -item.radius - 0.2;
      mesh.add(baseRing);

      // Tag for Raycasting
      (mesh as unknown as { isSkillPlanet: boolean; skillPlanetConfig: SkillPlanetItem }).isSkillPlanet = true;
      (mesh as unknown as { isSkillPlanet: boolean; skillPlanetConfig: SkillPlanetItem }).skillPlanetConfig = item;
      this.interactiveMeshes.push(mesh);

      this.skillPlanetsGroup.add(mesh);

      this.skillPlanetRecords.set(item.id, {
        config: item,
        mesh,
        label,
        atmosphere,
        initialPos: new THREE.Vector3(item.rowX, 0, 0),
        initialScale: mesh.scale.clone()
      });
    });

    // By default, skills row is hidden until toggled or in skills row mode
    this.skillPlanetsGroup.visible = false;
  }

  // --- BUILD BLACK HOLE ---

  private buildBlackHole(): void {
    this.blackHole = this.factory.createBlackHoleGroup();
    this.blackHole.group.position.set(0, 0, 0);
    this.scene.add(this.blackHole.group);
  }

  public handleSkillsRowMode(isRow: boolean): void {
    this.skillPlanetsGroup.visible = isRow;
    if (isRow) {
      // Camera moves to wide front view of the row
      this.cameraService.flyTo(new THREE.Vector3(0, 0, 0), 85, 22, null);
    }
  }

  public restoreUniverse(): void {
    this.devouredNotified = false;
    if (this.blackHole) {
      this.blackHole.group.visible = false;
      this.blackHole.group.scale.set(0.001, 0.001, 0.001);
    }

    // Restore regular celestial bodies
    this.objects.forEach((rec) => {
      rec.mesh.position.copy(rec.initialLocalPos);
      rec.mesh.scale.copy(rec.initialScale);
      rec.mesh.visible = true;
    });

    // Restore skill planets
    this.skillPlanetRecords.forEach((rec) => {
      rec.mesh.position.copy(rec.initialPos);
      rec.mesh.scale.copy(rec.initialScale);
      rec.mesh.visible = true;
    });

    this.cameraService.flyToOverview();
  }

  public resize(): void {
    if (!this.canvas || !this.renderer) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.cameraService.updateAspect(width, height);
    this.renderer.setSize(width, height);
  }

  private startLoop(): void {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;
      const speedMult = this.state.orbitSpeedMultiplier();
      const showOrbits = this.state.showOrbitLines();
      const showLabels = this.state.showLabels();
      const isBlackHole = this.state.isBlackHoleActive();
      const isRowMode = this.state.isSkillsRowMode();

      // --- BLACK HOLE GRAVITATIONAL COLLAPSE LOOP ---
      if (isBlackHole && this.blackHole) {
        this.blackHole.group.visible = true;
        this.blackHole.group.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2.0);

        // Spin accretion disk rapidly
        this.blackHole.accretionDisk.rotation.z += delta * 4.5;
        this.blackHole.photonRing.rotation.z -= delta * 3.0;

        // Swirl vortex particles
        const posAttr = this.blackHole.particles.geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let i = 0; i < posAttr.count; i++) {
          let x = posAttr.getX(i);
          let z = posAttr.getZ(i);
          const r = Math.hypot(x, z);
          const theta = Math.atan2(z, x) + delta * 2.8;
          const nextR = r > 6.2 ? r - delta * 14 : 32.0;

          posAttr.setX(i, Math.cos(theta) * nextR);
          posAttr.setZ(i, Math.sin(theta) * nextR);
        }
        posAttr.needsUpdate = true;

        let totalRemaining = 0;

        // Devour Skill Planets
        this.skillPlanetRecords.forEach((rec) => {
          if (rec.mesh.scale.x > 0.02) {
            totalRemaining++;
            rec.mesh.position.lerp(new THREE.Vector3(0, 0, 0), delta * 1.8);
            const dist = rec.mesh.position.length();
            if (dist < 22) {
              rec.mesh.scale.multiplyScalar(Math.max(0.01, 1 - delta * 3.2));
            }
            if (dist < 5.0) {
              rec.mesh.scale.set(0.0001, 0.0001, 0.0001);
            }
          }
        });

        // Devour System Project Planets
        this.objects.forEach((rec) => {
          if (rec.config.type !== 'sun' && rec.mesh.scale.x > 0.02) {
            totalRemaining++;
            const worldPos = new THREE.Vector3();
            rec.mesh.getWorldPosition(worldPos);
            worldPos.lerp(new THREE.Vector3(0, 0, 0), delta * 1.6);
            rec.pivot.worldToLocal(worldPos);
            rec.mesh.position.copy(worldPos);

            const dist = rec.mesh.position.length();
            if (dist < 28) {
              rec.mesh.scale.multiplyScalar(Math.max(0.01, 1 - delta * 2.8));
            }
            if (dist < 6.0) {
              rec.mesh.scale.set(0.0001, 0.0001, 0.0001);
            }
          }
        });

        // Check if all planets are devoured
        if (totalRemaining === 0 && !this.devouredNotified) {
          this.devouredNotified = true;
          // Flash effect & trigger completion
          this.blackHole.photonRing.scale.multiplyScalar(1.4);
          setTimeout(() => {
            this.state.onBlackHoleCompleted();
          }, 1200);
        }
      } else {
        // --- NORMAL ORBITAL & ROW ROTATIONS ---
        this.objects.forEach((record) => {
          const { config, pivot, mesh, satellites, orbitLine, labelSprite } = record;

          if (orbitLine) {
            orbitLine.visible = showOrbits && !isRowMode;
          }

          if (labelSprite) {
            labelSprite.visible = showLabels;
          }

          if (config.orbitSpeed > 0 && speedMult > 0 && !isRowMode) {
            pivot.rotation.y += config.orbitSpeed * speedMult * 0.5;
          }

          if (config.rotationSpeed > 0) {
            mesh.rotation.y += config.rotationSpeed;
          }

          satellites.forEach((sat) => {
            sat.angle += sat.speed * (speedMult > 0 ? speedMult : 1) * 0.8;
            sat.group.rotation.y = sat.angle;
          });
        });

        // Rotate Skill Planets in their row
        if (isRowMode) {
          this.skillPlanetRecords.forEach((rec) => {
            rec.mesh.rotation.y += 0.012;
            rec.label.visible = showLabels;
          });
        }
      }

      // Animate Sun & Flares
      if (this.sunMesh) {
        this.sunMesh.rotation.y += 0.002;
      }
      if (this.sunGlow) {
        const pulse = 28 + Math.sin((now / 1000) * 2) * 1.5;
        this.sunGlow.scale.set(pulse, pulse, 1);
      }

      // Asteroid belt drift
      if (this.asteroidBeltGroup) {
        this.asteroidBeltGroup.rotation.y += 0.0006 * (speedMult > 0 ? speedMult : 1);
      }

      // Starfield drift
      if (this.starfieldPoints) {
        this.starfieldPoints.rotation.y += 0.00008;
      }

      // Camera flight update
      this.cameraService.update(delta);

      // Render
      this.renderer.render(this.scene, this.cameraService.camera);
    };

    animate();
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
