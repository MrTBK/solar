import { Injectable, inject } from '@angular/core';
import * as THREE from 'three';
import { CelestialBodyConfig } from '../../models/celestial.model';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
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

  private clock = new THREE.Clock();
  private animationFrameId: number | null = null;

  public objects: Map<string, SceneObjectRecord> = new Map();
  public interactiveMeshes: THREE.Object3D[] = [];

  // Special animated objects
  private sunMesh: THREE.Mesh | null = null;
  private sunGlow: THREE.Sprite | null = null;
  private asteroidBeltGroup: THREE.Group | null = null;
  private starfieldPoints: THREE.Points | null = null;

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

    // 5. Build Celestial Bodies
    this.buildSystem();

    // 6. Start Loop
    this.startLoop();
  }

  private setupLighting(): void {
    // Ambient base light for visibility
    const ambient = new THREE.AmbientLight(0x1e293b, 1.2);
    this.scene.add(ambient);

    // Central Sun light
    const sunLight = new THREE.PointLight(0xffedd5, 3.5, 300, 0.8);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    // Subtle directional rim light from high angle
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
      // Spherical distribution around solar system
      const r = 400 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Random stellar tint
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
        // --- SUN ---
        const sunGeo = new THREE.SphereGeometry(config.radius, 48, 48);
        const sunMat = new THREE.MeshBasicMaterial({
          map: this.factory.createSunTexture()
        });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        this.sunMesh = sun;
        mainMesh = sun;

        // Glowing corona sprite
        this.sunGlow = this.factory.createSunGlowSprite('#f59e0b', 256);
        sun.add(this.sunGlow);

        mainMesh.position.set(0, 0, 0);
        pivot.add(mainMesh);
      } else if (config.type === 'station') {
        // --- COFICAB ORBITAL STATION ---
        mainMesh = this.factory.createCoficabStationMesh();
        mainMesh.position.set(config.orbitDistance, 0, 0);
        pivot.add(mainMesh);
      } else if (config.type === 'education') {
        // --- EDUCATION ACADEMY STATION ---
        mainMesh = this.factory.createEducationStationMesh();
        mainMesh.position.set(config.orbitDistance, 0, 0);
        pivot.add(mainMesh);
      } else if (config.type === 'asteroid-belt') {
        // --- ASTEROID BELT ---
        const belt = this.factory.createAsteroidBelt(350, config.orbitDistance, 10);
        this.asteroidBeltGroup = belt;
        mainMesh = belt;
        pivot.add(mainMesh);
      } else {
        // --- STANDARD PLANETS ---
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

        // Atmosphere glow
        atmosphere = this.factory.createAtmosphereGlow(config.radius, config.color);
        planet.add(atmosphere);

        // Rings if configured
        if (config.ring) {
          const ringMesh = this.factory.createPlanetRing(
            config.ring.innerRadius,
            config.ring.outerRadius,
            config.ring.color,
            config.ring.opacity
          );
          planet.add(ringMesh);
        }

        // Satellites / Moons
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

      // Orbit Line
      let orbitLine: THREE.Line | undefined;
      if (config.orbitDistance > 0 && config.type !== 'asteroid-belt') {
        orbitLine = this.factory.createOrbitLine(config.orbitDistance, config.color);
        this.scene.add(orbitLine);
      }

      // 3D Label
      if (config.type !== 'asteroid-belt') {
        labelSprite = this.factory.createLabelSprite(config.name, config.category);
        labelSprite.position.set(0, config.radius + 3.0, 0);
        mainMesh.add(labelSprite);
      }

      // Tag main mesh for Raycasting identification
      (mainMesh as unknown as { celestialId: string; celestialConfig: CelestialBodyConfig }).celestialId = config.id;
      (mainMesh as unknown as { celestialId: string; celestialConfig: CelestialBodyConfig }).celestialConfig = config;
      this.interactiveMeshes.push(mainMesh);

      // Random starting orbital angle
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
        atmosphere
      });
    });
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

      const delta = this.clock.getDelta();
      const speedMult = this.state.orbitSpeedMultiplier();
      const showOrbits = this.state.showOrbitLines();
      const showLabels = this.state.showLabels();

      // 1. Orbit & Rotation updates
      this.objects.forEach((record) => {
        const { config, pivot, mesh, satellites, orbitLine, labelSprite } = record;

        // Toggle orbit line visibility
        if (orbitLine) {
          orbitLine.visible = showOrbits;
        }

        // Toggle 3D label visibility
        if (labelSprite) {
          labelSprite.visible = showLabels;
        }

        // Orbit around Sun (pivot rotation)
        if (config.orbitSpeed > 0 && speedMult > 0) {
          pivot.rotation.y += config.orbitSpeed * speedMult * 0.5;
        }

        // Self-rotation on axis
        if (config.rotationSpeed > 0) {
          mesh.rotation.y += config.rotationSpeed;
        }

        // Satellites orbiting their planet
        satellites.forEach((sat) => {
          sat.angle += sat.speed * (speedMult > 0 ? speedMult : 1) * 0.8;
          sat.group.rotation.y = sat.angle;
        });
      });

      // 2. Animate Sun & Flares
      if (this.sunMesh) {
        this.sunMesh.rotation.y += 0.002;
      }
      if (this.sunGlow) {
        const pulse = 28 + Math.sin(this.clock.getElapsedTime() * 2) * 1.5;
        this.sunGlow.scale.set(pulse, pulse, 1);
      }

      // 3. Asteroid belt slow drift
      if (this.asteroidBeltGroup) {
        this.asteroidBeltGroup.rotation.y += 0.0006 * (speedMult > 0 ? speedMult : 1);
      }

      // 4. Subtle starfield twinkling/rotation
      if (this.starfieldPoints) {
        this.starfieldPoints.rotation.y += 0.00008;
      }

      // 5. Update Camera flight & OrbitControls
      this.cameraService.update(delta);

      // 6. Render
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
