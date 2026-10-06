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
  rowPos?: THREE.Vector3;
  initialScale: THREE.Vector3;
  initialLocalPos: THREE.Vector3;
}

export interface SkillPlanetRecord {
  config: SkillPlanetItem;
  mesh: THREE.Mesh;
  label: THREE.Sprite;
  atmosphere: THREE.Mesh;
  pivot: THREE.Group;
  orbitLine: THREE.Line;
  orbitDistance: number;
  orbitSpeed: number;
  elevation: number;
  currentAngle: number;
  rowPos: THREE.Vector3;
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
  private blackHoleShakeIntensity = 0;

  // Tri-Sector Galaxy Alignment Constants
  public static readonly SECTOR_ANGLES = {
    projects: -Math.PI / 6,              // -30° (Top-Right corridor)
    work: Math.PI / 2,                   // +90° (Bottom/Front corridor)
    skills: (7 * Math.PI) / 6            // 210° (Top-Left corridor)
  };
  private galaxyRotationAngle = 0;

  // Special animated objects
  private sunMesh: THREE.Mesh | null = null;
  private sunGlow: THREE.Sprite | null = null;
  private asteroidBeltGroup: THREE.Group | null = null;
  private starfieldPoints: THREE.Points | null = null;
  private nebulaPoints: THREE.Points | null = null;
  private solarProminences: THREE.Group | null = null;
  private comet: { group: THREE.Group; head: THREE.Mesh } | null = null;
  private cometActive = false;
  private cometTimer = 0;
  private cometProgress = 0;
  private cometStart = new THREE.Vector3();
  private cometEnd = new THREE.Vector3();

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

    // React to quality level changes
    effect(() => {
      const q = this.state.qualityLevel();
      this.applyQualityLevel(q);
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
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !this.device.isMobile(),
        powerPreference: 'high-performance',
        alpha: false
      });
      this.renderer.setSize(canvas.clientWidth || 800, canvas.clientHeight || 600);
      this.renderer.setPixelRatio(this.device.getRecommendedDPR());
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.25;
    } catch {
      return;
    }

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

    // Deep space procedural nebulae
    this.nebulaPoints = this.factory.createNebulaField();
    this.scene.add(this.nebulaPoints);
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

        this.solarProminences = this.factory.createSolarProminences(config.radius);
        sun.add(this.solarProminences);

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
        planet.rotation.z = 0.22; // subtle realistic axial tilt
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

      let startAngle = 0;
      if (config.type === 'sun') {
        startAngle = 0;
      } else if (
        config.id === 'station-coficab' ||
        config.id === 'planet-robotics' ||
        config.id === 'belt-competitive' ||
        config.id === 'station-education'
      ) {
        startAngle = SolarSceneService.SECTOR_ANGLES.work;
      } else {
        startAngle = SolarSceneService.SECTOR_ANGLES.projects;
      }
      const systemRowPositions: Record<string, number> = {
        'planet-dataforge': -16,
        'station-coficab': -30,
        'planet-customer360': -44,
        'planet-supplychainiq': -58,
        'planet-robotics': -72,
        'planet-churnlab': -86,
        'belt-competitive': -100,
        'planet-masroufi': -114,
        'station-education': -128
      };

      this.objects.set(config.id, {
        config,
        pivot,
        mesh: mainMesh,
        orbitLine,
        labelSprite,
        currentAngle: startAngle,
        satellites: satList,
        atmosphere,
        rowPos: config.type === 'sun' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(systemRowPositions[config.id] ?? -config.orbitDistance, 0, 0),
        initialScale: mainMesh.scale.clone(),
        initialLocalPos: mainMesh.position.clone()
      });
    });

    // Setup Comet Group
    this.comet = this.factory.createCometGroup();
    this.comet.group.visible = false;
    this.scene.add(this.comet.group);
  }

  // --- BUILD SKILLS PLANETS WITH ORBITS & ROW DUAL-MODE ---

  private skillOrbitParams: Record<string, { orbitDistance: number; orbitSpeed: number; elevation: number }> = {
    'skill-python': { orbitDistance: 22, orbitSpeed: 0.002, elevation: 0 },
    'skill-bi': { orbitDistance: 34, orbitSpeed: 0.002, elevation: 0 },
    'skill-algorithms': { orbitDistance: 46, orbitSpeed: 0.002, elevation: 0 },
    'skill-web': { orbitDistance: 58, orbitSpeed: 0.002, elevation: 0 },
    'skill-robotics': { orbitDistance: 70, orbitSpeed: 0.002, elevation: 0 },
    'skill-mobile': { orbitDistance: 82, orbitSpeed: 0.002, elevation: 0 }
  };

  private buildSkillPlanetsRow(): void {
    this.skillPlanetRecords.clear();
    this.skillPlanetsGroup.clear();
    this.scene.add(this.skillPlanetsGroup);

    SKILL_PLANETS.forEach((item, index) => {
      const orbitParam = this.skillOrbitParams[item.id] || {
        orbitDistance: 22 + index * 12,
        orbitSpeed: 0.002,
        elevation: 0
      };

      const pivot = new THREE.Group();
      const startAngle = SolarSceneService.SECTOR_ANGLES.skills;
      pivot.rotation.y = startAngle;
      this.scene.add(pivot);

      const geo = new THREE.SphereGeometry(item.radius, 36, 36);
      const mat = new THREE.MeshStandardMaterial({
        map: this.factory.createPlanetTexture(item.textureType, item.color),
        roughness: 0.5,
        metalness: 0.3,
        emissive: new THREE.Color(item.emissiveColor),
        emissiveIntensity: 0.18
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(orbitParam.orbitDistance, orbitParam.elevation, 0);

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

      pivot.add(mesh);

      // Colored orbit line around Sun
      const orbitLine = this.factory.createOrbitLine(orbitParam.orbitDistance, item.color);
      orbitLine.position.y = orbitParam.elevation;
      this.scene.add(orbitLine);

      this.skillPlanetRecords.set(item.id, {
        config: item,
        mesh,
        label,
        atmosphere,
        pivot,
        orbitLine,
        orbitDistance: orbitParam.orbitDistance,
        orbitSpeed: orbitParam.orbitSpeed,
        elevation: orbitParam.elevation,
        currentAngle: startAngle,
        rowPos: new THREE.Vector3(item.rowX, 0, 0),
        initialScale: mesh.scale.clone()
      });
    });

    // Skill planets are ALWAYS active and visible in the solar system
    this.skillPlanetsGroup.visible = true;
  }

  // --- BUILD BLACK HOLE ---

  private buildBlackHole(): void {
    this.blackHole = this.factory.createBlackHoleGroup();
    this.blackHole.group.position.set(0, 0, 0);
    this.scene.add(this.blackHole.group);
  }

  public handleSkillsRowMode(isRow: boolean): void {
    if (isRow) {
      // Camera moves to wide front view framing the entire aligned fleet of planets
      this.cameraService.flyTo(new THREE.Vector3(0, 0, 0), 160, 32, null);
    } else {
      if (!this.state.selectedTarget() && !this.state.activeSkillPlanet()) {
        this.cameraService.flyToOverview();
      }
    }
  }

  public focusSkillPlanet(id: string): void {
    const record = this.skillPlanetRecords.get(id);
    if (!record) return;

    const worldPos = new THREE.Vector3();
    record.mesh.getWorldPosition(worldPos);

    this.cameraService.flyTo(
      worldPos,
      13,
      3.5,
      record.mesh
    );
  }

  public restoreUniverse(): void {
    this.devouredNotified = false;
    if (this.blackHole) {
      this.blackHole.group.visible = false;
      this.blackHole.group.scale.set(0.001, 0.001, 0.001);
    }

    // Restore regular celestial bodies: position, scale, and pivot rotation
    this.objects.forEach((rec) => {
      rec.mesh.position.copy(rec.initialLocalPos);
      rec.mesh.scale.copy(rec.initialScale);
      rec.mesh.visible = true;
      const isWork =
        rec.config.id === 'station-coficab' ||
        rec.config.id === 'planet-robotics' ||
        rec.config.id === 'belt-competitive' ||
        rec.config.id === 'station-education';
      const baseAngle = isWork ? SolarSceneService.SECTOR_ANGLES.work : SolarSceneService.SECTOR_ANGLES.projects;
      rec.pivot.rotation.y = this.galaxyRotationAngle + baseAngle;
      rec.currentAngle = rec.pivot.rotation.y;
      if (rec.orbitLine) {
        rec.orbitLine.visible = this.state.showOrbitLines();
      }
    });

    // Restore skill planets
    this.skillPlanetRecords.forEach((rec) => {
      rec.mesh.position.set(rec.orbitDistance, rec.elevation, 0);
      rec.mesh.scale.copy(rec.initialScale);
      rec.mesh.visible = true;
      rec.pivot.rotation.y = this.galaxyRotationAngle + SolarSceneService.SECTOR_ANGLES.skills;
      rec.currentAngle = rec.pivot.rotation.y;
      if (rec.orbitLine) {
        rec.orbitLine.visible = this.state.showOrbitLines();
      }
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
            if (rec.orbitLine) {
              rec.orbitLine.visible = false;
            }
            const worldPos = new THREE.Vector3();
            rec.mesh.getWorldPosition(worldPos);
            const distToCenter = worldPos.length();

            const pullStrength = Math.max(0.3, 6 / (distToCenter + 1));
            rec.pivot.rotation.y += pullStrength * delta;

            const localX = rec.mesh.position.x;
            if (Math.abs(localX) > 0.5) {
              rec.mesh.position.x = localX * Math.max(0.01, 1 - delta * 1.8);
            }
            rec.mesh.position.y = rec.mesh.position.y * Math.max(0.01, 1 - delta * 1.8);

            if (distToCenter < 28) {
              rec.mesh.scale.multiplyScalar(Math.max(0.01, 1 - delta * 2.8));
            }
            if (distToCenter < 6.0 || rec.mesh.scale.x < 0.02) {
              rec.mesh.scale.set(0.0001, 0.0001, 0.0001);
              rec.mesh.position.set(0, 0, 0);
            }
          }
        });

        // Devour System Project Planets
        this.objects.forEach((rec) => {
          if (rec.config.type !== 'sun' && rec.mesh.scale.x > 0.02) {
            totalRemaining++;
            // Directly orbit-spin pivot toward center, shrink mesh
            const worldPos = new THREE.Vector3();
            rec.mesh.getWorldPosition(worldPos);
            const distToCenter = worldPos.length();

            // Move pivot angle faster as object falls in
            const pullStrength = Math.max(0.3, 6 / (distToCenter + 1));
            rec.pivot.rotation.y += pullStrength * delta;

            // Pull orbit distance inward by scaling the mesh's local X
            const localX = rec.mesh.position.x;
            if (Math.abs(localX) > 0.5) {
              rec.mesh.position.x = localX * Math.max(0.01, 1 - delta * 1.8);
            }

            if (distToCenter < 28) {
              rec.mesh.scale.multiplyScalar(Math.max(0.01, 1 - delta * 2.8));
            }
            if (distToCenter < 6.0 || rec.mesh.scale.x < 0.02) {
              rec.mesh.scale.set(0.0001, 0.0001, 0.0001);
              rec.mesh.position.set(0, 0, 0);
            }
          }
        });

        // Check if all planets are devoured
        if (totalRemaining === 0 && !this.devouredNotified) {
          this.devouredNotified = true;
          this.blackHoleShakeIntensity = 0; // stop shake
          // Flash effect & trigger completion
          this.blackHole.photonRing.scale.multiplyScalar(1.4);
          setTimeout(() => {
            this.state.onBlackHoleCompleted();
          }, 1200);
        } else {
          // Increase camera shake as planets are consumed
          const maxPlanets = this.skillPlanetRecords.size + this.objects.size - 1; // -1 for sun
          const consumed = maxPlanets - totalRemaining;
          this.blackHoleShakeIntensity = Math.min(1.2, (consumed / maxPlanets) * 1.5);
        }
      } else {
        // --- NORMAL ORBITAL & ROW ROTATIONS ---
        this.blackHoleShakeIntensity = 0;

        if (speedMult > 0 && !isRowMode) {
          this.galaxyRotationAngle += 0.0016 * speedMult * 0.5;
        }

        this.objects.forEach((record) => {
          const { config, pivot, mesh, satellites, orbitLine, labelSprite } = record;

          if (orbitLine) {
            orbitLine.visible = showOrbits && !isRowMode;
          }

          if (labelSprite) {
            labelSprite.visible = showLabels;
          }

          if (config.type !== 'sun') {
            if (isRowMode) {
              // Smoothly lerp pivot rotation to 0 for linear syzygy alignment
              const angleDiff = Math.atan2(Math.sin(0 - pivot.rotation.y), Math.cos(0 - pivot.rotation.y));
              pivot.rotation.y += angleDiff * 0.08;

              // Smoothly lerp mesh to row position
              if (record.rowPos) {
                mesh.position.lerp(record.rowPos, 0.08);
              }
            } else {
              // Smoothly restore to orbital position & sector angle
              const isWork =
                config.id === 'station-coficab' ||
                config.id === 'planet-robotics' ||
                config.id === 'belt-competitive' ||
                config.id === 'station-education';
              const baseAngle = isWork ? SolarSceneService.SECTOR_ANGLES.work : SolarSceneService.SECTOR_ANGLES.projects;
              const targetAngle = this.galaxyRotationAngle + baseAngle;
              const angleDiff = Math.atan2(Math.sin(targetAngle - pivot.rotation.y), Math.cos(targetAngle - pivot.rotation.y));
              pivot.rotation.y += angleDiff * 0.08;

              // Smoothly restore mesh to original orbital distance
              mesh.position.lerp(record.initialLocalPos, 0.08);
            }
          }

          if (config.rotationSpeed > 0) {
            mesh.rotation.y += config.rotationSpeed;
          }

          satellites.forEach((sat) => {
            sat.angle += sat.speed * (speedMult > 0 ? speedMult : 1) * 0.8;
            sat.group.rotation.y = sat.angle;
          });
        });

        // Animate Skill Planets (Seamless Orbit <-> Row Mode)
        this.skillPlanetRecords.forEach((rec) => {
          const { mesh, pivot, orbitLine, label } = rec;

          if (orbitLine) {
            orbitLine.visible = showOrbits && !isRowMode;
          }
          if (label) {
            label.visible = showLabels;
          }

          mesh.rotation.y += 0.012; // Planet axial spin

          if (isRowMode) {
            // Lerp pivot rotation to 0 for flat horizontal alignment along world X
            const angleDiff = Math.atan2(Math.sin(0 - pivot.rotation.y), Math.cos(0 - pivot.rotation.y));
            pivot.rotation.y += angleDiff * 0.08;

            // Lerp mesh to row position (rowX, 0, 0)
            mesh.position.lerp(rec.rowPos, 0.08);
          } else {
            // In orbital mode: synchronized along Skills Arm corridor
            const targetAngle = this.galaxyRotationAngle + SolarSceneService.SECTOR_ANGLES.skills;
            const angleDiff = Math.atan2(Math.sin(targetAngle - pivot.rotation.y), Math.cos(targetAngle - pivot.rotation.y));
            pivot.rotation.y += angleDiff * 0.08;

            // Lerp mesh to orbital distance & elevation
            const targetOrbitalPos = new THREE.Vector3(rec.orbitDistance, rec.elevation, 0);
            mesh.position.lerp(targetOrbitalPos, 0.08);
          }
        });
      }

      const isTour = this.state.isTourActive();

      // Animate Sun & Flares
      if (this.sunMesh) {
        this.sunMesh.rotation.y += 0.002;
      }
      if (this.sunGlow) {
        // Scale glow relative to camera distance & tour mode
        const camDist = this.cameraService.camera.position.length();
        const distScale = Math.max(0.3, Math.min(1.0, (camDist - 30) / 80)) * (isTour ? 0.6 : 1.0);
        const pulse = (26 + Math.sin((now / 1000) * 1.8) * 1.2) * distScale;
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

      // Nebula drift
      if (this.nebulaPoints) {
        this.nebulaPoints.rotation.y += 0.00003;
      }

      // Solar prominences rotation
      if (this.solarProminences) {
        this.solarProminences.rotation.y += 0.0025;
      }

      // Comet shooting star animation
      if (!this.cometActive && this.comet && !isBlackHole) {
        this.cometTimer += delta;
        if (this.cometTimer > 18) {
          this.launchComet();
        }
      } else if (this.cometActive && this.comet) {
        this.cometProgress += delta * 0.45;
        if (this.cometProgress >= 1) {
          this.cometActive = false;
          this.comet.group.visible = false;
          this.cometTimer = 0;
        } else {
          this.comet.group.position.lerpVectors(this.cometStart, this.cometEnd, this.cometProgress);
        }
      }

      // Dynamic Scaling: Tour Mode (smaller planets for better framing) & Tech Stack filters
      const activeTech = this.state.activeTechFilter();
      if (!isBlackHole && !isRowMode) {
        this.objects.forEach((rec) => {
          let scaleFactor = 1.0;
          if (isTour) {
            scaleFactor = rec.config.type === 'sun' ? 0.65 : 0.55;
          } else if (activeTech && rec.config.type !== 'sun') {
            const matches = this.state.isBodyMatchingTech(rec.config.id);
            scaleFactor = matches ? 1.15 : 0.65;
          }

          rec.mesh.scale.lerp(rec.initialScale.clone().multiplyScalar(scaleFactor), 0.1);
        });

        this.skillPlanetRecords.forEach((rec) => {
          const scaleFactor = isTour ? 0.55 : 1.0;
          rec.mesh.scale.lerp(rec.initialScale.clone().multiplyScalar(scaleFactor), 0.1);
        });
      }

      // Adaptive FPS Watchdog
      this.fpsFrames++;
      if (this.fpsFrames >= 120) {
        const now = performance.now();
        const elapsedSec = (now - this.fpsLastTime) / 1000;
        const fps = this.fpsFrames / elapsedSec;
        this.fpsFrames = 0;
        this.fpsLastTime = now;

        if (fps < 25) {
          this.lowFpsCounter++;
          if (this.lowFpsCounter >= 2) {
            const cur = this.state.qualityLevel();
            if (cur === 'HIGH') {
              this.state.setQualityLevel('MEDIUM');
            } else if (cur === 'MEDIUM') {
              this.state.setQualityLevel('LOW');
            }
            this.lowFpsCounter = 0;
          }
        } else {
          this.lowFpsCounter = 0;
        }
      }

      // Camera flight update
      this.cameraService.update(delta);

      // Camera shake effect during black hole
      if (this.blackHoleShakeIntensity > 0) {
        const shake = this.blackHoleShakeIntensity;
        const ox = (Math.random() - 0.5) * shake;
        const oy = (Math.random() - 0.5) * shake;
        this.cameraService.camera.position.x += ox;
        this.cameraService.camera.position.y += oy;
        this.renderer.render(this.scene, this.cameraService.camera);
        this.cameraService.camera.position.x -= ox;
        this.cameraService.camera.position.y -= oy;
      } else {
        this.renderer.render(this.scene, this.cameraService.camera);
      }
    };

    animate();
  }

  private fpsFrames = 0;
  private fpsLastTime = performance.now();
  private lowFpsCounter = 0;

  private applyQualityLevel(level: 'HIGH' | 'MEDIUM' | 'LOW'): void {
    if (!this.renderer) return;
    if (level === 'LOW') {
      this.renderer.setPixelRatio(1.0);
      if (this.nebulaPoints) this.nebulaPoints.visible = false;
      if (this.asteroidBeltGroup) this.asteroidBeltGroup.visible = false;
    } else if (level === 'MEDIUM') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      if (this.nebulaPoints) this.nebulaPoints.visible = true;
      if (this.asteroidBeltGroup) this.asteroidBeltGroup.visible = true;
    } else {
      this.renderer.setPixelRatio(this.device.getRecommendedDPR());
      if (this.nebulaPoints) this.nebulaPoints.visible = true;
      if (this.asteroidBeltGroup) this.asteroidBeltGroup.visible = true;
    }
  }

  private launchComet(): void {
    if (!this.comet) return;
    this.cometActive = true;
    this.cometProgress = 0;

    const angle = Math.random() * Math.PI * 2;
    const rStart = 160 + Math.random() * 40;
    const rEnd = 160 + Math.random() * 40;
    this.cometStart.set(Math.cos(angle) * rStart, 25 + Math.random() * 20, Math.sin(angle) * rStart);
    this.cometEnd.set(-Math.cos(angle) * rEnd, -20 - Math.random() * 20, -Math.sin(angle) * rEnd);

    this.comet.group.position.copy(this.cometStart);
    this.comet.group.lookAt(this.cometEnd);
    this.comet.group.visible = true;
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        if ((obj as THREE.Mesh).material) {
          const mat = (obj as THREE.Mesh).material as any;
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if (m?.map) m.map.dispose();
              m?.dispose();
            });
          } else {
            if (mat?.map) mat.map.dispose();
            mat?.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}
