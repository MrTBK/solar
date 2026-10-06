import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { CelestialBodyConfig, CelestialSatelliteConfig } from '../../models/celestial.model';

@Injectable({
  providedIn: 'root'
})
export class CelestialFactoryService {
  private textureCache = new Map<string, THREE.CanvasTexture>();

  // --- PROCEDURAL TEXTURE GENERATION ---

  public createSunTexture(): THREE.CanvasTexture {
    const key = 'sun_texture';
    if (this.textureCache.has(key)) return this.textureCache.get(key)!;

    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Fiery base
    const grad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#fff7ed');
    grad.addColorStop(0.2, '#fef08a');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.8, '#d97706');
    grad.addColorStop(1, '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Plasma swirls & granulations
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 90 + 30;
      const alpha = Math.random() * 0.25 + 0.05;

      const pGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      pGrad.addColorStop(0, `rgba(255, 245, 180, ${alpha})`);
      pGrad.addColorStop(0.6, `rgba(245, 158, 11, ${alpha * 0.5})`);
      pGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Solar flares / dark sunspots
    ctx.fillStyle = 'rgba(146, 64, 14, 0.4)';
    for (let i = 0; i < 18; i++) {
      const sx = Math.random() * size;
      const sy = Math.random() * size;
      const sr = Math.random() * 14 + 4;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    this.textureCache.set(key, texture);
    return texture;
  }

  public createSunGlowSprite(color = '#f59e0b', size = 256): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 240, 180, 0.9)');
    grad.addColorStop(0.2, 'rgba(245, 158, 11, 0.6)');
    grad.addColorStop(0.5, 'rgba(217, 119, 6, 0.25)');
    grad.addColorStop(0.8, 'rgba(180, 83, 9, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: new THREE.Color(color),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(28, 28, 1);
    return sprite;
  }

  public createNebulaField(count = 240): THREE.Points {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cCyan = new THREE.Color(0x06b6d4);
    const cPurple = new THREE.Color(0x9333ea);
    const cAmber = new THREE.Color(0xd97706);
    const cIndigo = new THREE.Color(0x3b82f6);

    for (let i = 0; i < count; i++) {
      const sector = i % 3;
      const baseAngle = sector * ((Math.PI * 2) / 3);
      const angle = baseAngle + (Math.random() - 0.5) * 1.2;
      const r = 450 + Math.random() * 450;
      const elevation = (Math.random() - 0.5) * 350;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = elevation;
      positions[i * 3 + 2] = Math.sin(angle) * r;

      const pick = Math.random();
      const col = sector === 0 ? (pick > 0.4 ? cCyan : cIndigo) : sector === 1 ? (pick > 0.4 ? cPurple : cIndigo) : cAmber;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.4)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.08)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 48.0,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    return new THREE.Points(geo, mat);
  }

  public createSolarProminences(sunRadius = 7.0): THREE.Group {
    const group = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + 0.4;
      const points: THREE.Vector3[] = [];
      const steps = 24;
      const height = sunRadius + 1.2 + Math.random() * 0.8;
      const span = 0.35;

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const currentAngle = angle + (t - 0.5) * span;
        const r = sunRadius + Math.sin(t * Math.PI) * (height - sunRadius);
        const y = Math.sin(t * Math.PI) * 0.6 * (i % 2 === 0 ? 1 : -1);
        points.push(new THREE.Vector3(Math.cos(currentAngle) * r, y, Math.sin(currentAngle) * r));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.08, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0xffedd5,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      group.add(new THREE.Mesh(tubeGeo, tubeMat));
    }
    return group;
  }

  public createCometGroup(): { group: THREE.Group; head: THREE.Mesh } {
    const group = new THREE.Group();
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const headMat = new THREE.MeshBasicMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.95
    });
    const head = new THREE.Mesh(headGeo, headMat);
    group.add(head);

    const glowSprite = this.createSunGlowSprite('#38bdf8', 128);
    glowSprite.scale.set(4.0, 4.0, 1);
    head.add(glowSprite);

    const tailCount = 40;
    const tailGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(tailCount * 3);

    for (let i = 0; i < tailCount; i++) {
      const dist = (i / tailCount) * 14.0;
      positions[i * 3] = -dist;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4 * (dist / 4);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4 * (dist / 4);
    }
    tailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const tailMat = new THREE.PointsMaterial({
      size: 1.0,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const tail = new THREE.Points(tailGeo, tailMat);
    group.add(tail);

    return { group, head };
  }

  public createPlanetTexture(type: CelestialBodyConfig['textureType'], baseHex: string): THREE.CanvasTexture {
    const key = `planet_${type}_${baseHex}`;
    if (this.textureCache.has(key)) return this.textureCache.get(key)!;

    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext('2d')!;

    const w = canvas.width;
    const h = canvas.height;

    // Fill base
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, w, h);

    if (type === 'industrial') {
      // DataForge: Industrial copper/graphite bands & pipeline circuit traces
      for (let y = 0; y < h; y += 16) {
        ctx.fillStyle = y % 32 === 0 ? 'rgba(30, 41, 59, 0.7)' : 'rgba(217, 119, 6, 0.4)';
        ctx.fillRect(0, y, w, 8);
      }
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.random() * 80, sy);
        ctx.lineTo(sx + Math.random() * 80, sy + (Math.random() - 0.5) * 40);
        ctx.stroke();
      }
    } else if (type === 'analytics') {
      // Customer360: Deep ocean blue with bright cyan continents & coordinate meridians
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Continents
      ctx.fillStyle = '#0284c7';
      for (let i = 0; i < 35; i++) {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        const cr = Math.random() * 120 + 40;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lat/Long Coordinate Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (type === 'logistics') {
      // SupplyChainIQ: Teal landmasses with glowing transportation corridors
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#10b981';
      for (let i = 0; i < 28; i++) {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        const cr = Math.random() * 140 + 50;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shipping nodes & corridors
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 25; i++) {
        const x1 = Math.random() * w;
        const y1 = Math.random() * h;
        const x2 = x1 + (Math.random() - 0.5) * 200;
        const y2 = y1 + (Math.random() - 0.5) * 100;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = '#a7f3d0';
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.arc(x2, y2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'mlops') {
      // ChurnLab: Swirling violet nebula atmosphere with glowing neural connections
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#2e1065');
      grad.addColorStop(0.5, '#581c87');
      grad.addColorStop(1, '#3b0764');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Synaptic lines
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 45; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#e9d5ff';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 120, y + (Math.random() - 0.5) * 80);
        ctx.stroke();
      }
    } else if (type === 'finance') {
      // Masroufi: Clean mint/teal surface with sleek golden meridian lines
      ctx.fillStyle = '#042f2e';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#0f766e';
      for (let i = 0; i < 20; i++) {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.random() * 90 + 30, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
      ctx.lineWidth = 1.5;
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (type === 'robotics') {
      // Robotics: Burnt orange metallic hull with dark modular mechanical plates
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#9a3412';
      for (let x = 0; x < w; x += 80) {
        for (let y = 0; y < h; y += 50) {
          if ((x + y) % 3 === 0) {
            ctx.fillRect(x + 4, y + 4, 72, 42);
          }
        }
      }

      // Circuit lines
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 30; i++) {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 50, sy);
        ctx.lineTo(sx + 50, sy + 30);
        ctx.stroke();
      }
    } else {
      // General rock or asteroid
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, w, h);

      // Craters
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 25 + 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    this.textureCache.set(key, texture);
    return texture;
  }

  // --- ATMOSPHERIC GLOW SHADER ---

  public createAtmosphereGlow(radius: number, colorHex: string): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(radius * 1.18, 32, 32);

    // Vertex & Fragment shader for Fresnel rim glow
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform vec3 glowColor;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float intensity = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);
        gl_FragColor = vec4(glowColor, intensity * 0.7);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(colorHex) }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    return new THREE.Mesh(geometry, material);
  }

  // --- ORBITAL RINGS & DISKS ---

  public createPlanetRing(innerRadius: number, outerRadius: number, colorHex: string, opacity: number): THREE.Mesh {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: opacity,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }

  public createOrbitLine(radius: number, colorHex: string): THREE.Line {
    const segments = 128;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array((segments + 1) * 3);

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0.28,
      linewidth: 1
    });

    return new THREE.Line(geometry, material);
  }

  // --- SATELLITES & MOONS ---

  public createSatelliteGroup(sat: CelestialSatelliteConfig): { group: THREE.Group; mesh: THREE.Mesh } {
    const group = new THREE.Group();

    // Satellite body (cube or mini sphere)
    const bodyGeo = new THREE.BoxGeometry(sat.radius * 1.5, sat.radius * 0.9, sat.radius * 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);

    // Solar panels (blue planes on either side)
    const panelGeo = new THREE.BoxGeometry(sat.radius * 3.2, sat.radius * 0.1, sat.radius * 1.2);
    const panelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(sat.color),
      emissive: new THREE.Color(sat.color),
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1
    });
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    panelMesh.position.y = 0;

    // Small glowing beacon LED
    const ledGeo = new THREE.SphereGeometry(sat.radius * 0.35, 12, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0, sat.radius * 0.6, 0);

    const satelliteMesh = new THREE.Group();
    satelliteMesh.add(bodyMesh);
    satelliteMesh.add(panelMesh);
    satelliteMesh.add(ledMesh);
    satelliteMesh.position.set(sat.distance, 0, 0);

    // Save for raycasting / animation
    (satelliteMesh as unknown as { isSatellite: boolean }).isSatellite = true;

    // Subtle orbit path for satellite
    const satOrbitGeo = new THREE.BufferGeometry();
    const satSegments = 48;
    const satPos = new Float32Array((satSegments + 1) * 3);
    for (let i = 0; i <= satSegments; i++) {
      const a = (i / satSegments) * Math.PI * 2;
      satPos[i * 3] = Math.cos(a) * sat.distance;
      satPos[i * 3 + 1] = 0;
      satPos[i * 3 + 2] = Math.sin(a) * sat.distance;
    }
    satOrbitGeo.setAttribute('position', new THREE.BufferAttribute(satPos, 3));
    const satOrbitLine = new THREE.Line(
      satOrbitGeo,
      new THREE.LineBasicMaterial({ color: new THREE.Color(sat.color), transparent: true, opacity: 0.2 })
    );

    group.add(satelliteMesh);
    group.add(satOrbitLine);

    return { group, mesh: bodyMesh };
  }

  // --- COFICAB ORBITAL STATION GEOMETRY ---

  public createCoficabStationMesh(): THREE.Group {
    const station = new THREE.Group();

    // Central cylindrical hull
    const coreGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.2, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.z = Math.PI / 2;
    station.add(core);

    // Rotating docking ring around station
    const ringGeo = new THREE.TorusGeometry(1.6, 0.18, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.y = Math.PI / 2;
    station.add(ring);

    // Large solar array wings (2 wings)
    const wingGeo = new THREE.BoxGeometry(4.5, 0.08, 1.4);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      emissive: 0x2563eb,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.1
    });

    const wing1 = new THREE.Mesh(wingGeo, wingMat);
    wing1.position.set(0, 1.8, 0);
    station.add(wing1);

    const wing2 = new THREE.Mesh(wingGeo, wingMat);
    wing2.position.set(0, -1.8, 0);
    station.add(wing2);

    // Enterprise Communication Dish
    const dishGeo = new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.7,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(2.0, 0, 0);
    dish.rotation.z = -Math.PI / 2;
    station.add(dish);

    // Station Beacon Light
    const beaconGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 0, 1.7);
    station.add(beacon);

    return station;
  }

  // --- EDUCATION ACADEMY STATION GEOMETRY ---

  public createEducationStationMesh(): THREE.Group {
    const station = new THREE.Group();

    // Central octagonal crystal core
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.6,
      metalness: 0.6,
      roughness: 0.2
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    station.add(core);

    // Dual nested orbital gyroscopic rings
    const ring1Geo = new THREE.TorusGeometry(2.0, 0.1, 12, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xa5b4fc,
      emissive: 0x818cf8,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.3
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    station.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.4, 0.08, 12, 48);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    station.add(ring2);

    return station;
  }

  // --- ASTEROID BELT (COMPETITIVE PROGRAMMING) ---

  public createAsteroidBelt(count = 450, radius = 98, width = 12): THREE.Group {
    const beltGroup = new THREE.Group();

    // InstancedMesh or multiple randomized low-poly rocks
    const rockGeo = new THREE.DodecahedronGeometry(0.45, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.9,
      metalness: 0.1
    });

    const instancedMesh = new THREE.InstancedMesh(rockGeo, rockMat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
      const dist = radius + (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * 4.5;
      const scale = Math.random() * 0.9 + 0.3;

      dummy.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    beltGroup.add(instancedMesh);

    // Add 4 distinctive glowing Major Nodes (TCPC, Monopoly, Codeforces, Bee Battle)
    const majorNodes = [
      { name: 'TCPC Rank 32', color: '#38bdf8', angle: 0 },
      { name: 'Monopoly 1st Place', color: '#fbbf24', angle: Math.PI * 0.5 },
      { name: 'Codeforces Specialist', color: '#a855f7', angle: Math.PI },
      { name: 'Bee Battle Setter', color: '#34d399', angle: Math.PI * 1.5 }
    ];

    majorNodes.forEach((node) => {
      const nodeGeo = new THREE.IcosahedronGeometry(0.9, 2);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.2
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(Math.cos(node.angle) * radius, 0, Math.sin(node.angle) * radius);
      beltGroup.add(nodeMesh);
    });

    return beltGroup;
  }

  // --- 3D SPRITE LABELS ---

  public createLabelSprite(text: string, category: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background pill HUD box
    ctx.fillStyle = 'rgba(6, 11, 25, 0.75)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 112, 16);
    ctx.fill();
    ctx.stroke();

    // Category pill
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText(category.toUpperCase(), 256, 45);

    // Main name
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 256, 92);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(6, 1.5, 1);
    return sprite;
  }

  // --- BLACK HOLE SINGULARITY & ACCRETION DISK ---

  public createBlackHoleGroup(): {
    group: THREE.Group;
    horizon: THREE.Mesh;
    accretionDisk: THREE.Mesh;
    photonRing: THREE.Mesh;
    particles: THREE.Points;
  } {
    const group = new THREE.Group();

    // 1. Event Horizon: Pure unreflective pitch-black void
    const horizonGeo = new THREE.SphereGeometry(6.0, 48, 48);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    group.add(horizon);

    // 2. Photon Ring: Intense glowing border around the event horizon
    const photonRingGeo = new THREE.TorusGeometry(6.2, 0.22, 16, 64);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    photonRing.rotation.x = Math.PI / 2;
    group.add(photonRing);

    // 3. Accretion Disk Canvas Texture (Swirling relativistic vortex)
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Draw multi-color swirling spiral vortex
    const cx = size / 2;
    const cy = size / 2;
    const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, cx);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.15, '#f59e0b');
    grad.addColorStop(0.4, '#ef4444');
    grad.addColorStop(0.7, '#8b5cf6');
    grad.addColorStop(0.9, '#38bdf8');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Spiral accretion arms
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const angle = (i / 40) * Math.PI * 2;
      for (let r = 60; r < cx; r += 6) {
        const a = angle + r * 0.04;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (r === 60) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    const diskTex = new THREE.CanvasTexture(canvas);
    diskTex.wrapS = THREE.RepeatWrapping;
    diskTex.wrapT = THREE.RepeatWrapping;

    const accretionGeo = new THREE.RingGeometry(6.2, 28.0, 64);
    const accretionMat = new THREE.MeshBasicMaterial({
      map: diskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const accretionDisk = new THREE.Mesh(accretionGeo, accretionMat);
    accretionDisk.rotation.x = Math.PI / 2;
    group.add(accretionDisk);

    // 4. Slender Relativistic Jets (North and South poles)
    const jetGeo = new THREE.CylinderGeometry(0.1, 1.8, 45, 16);
    const jetMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const jetNorth = new THREE.Mesh(jetGeo, jetMat);
    jetNorth.position.y = 22;
    group.add(jetNorth);

    const jetSouth = new THREE.Mesh(jetGeo, jetMat);
    jetSouth.position.y = -22;
    group.add(jetSouth);

    // 5. Inward Swirling Vortex Particles
    const pCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const c1 = new THREE.Color(0xf59e0b);
    const c2 = new THREE.Color(0x38bdf8);

    for (let i = 0; i < pCount; i++) {
      const radius = 6.5 + Math.random() * 32;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.5;

      pPos[i * 3] = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = y;
      pPos[i * 3 + 2] = Math.sin(angle) * radius;

      const c = Math.random() > 0.5 ? c1 : c2;
      pCol[i * 3] = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    // Start with scale 0 (hidden until triggered)
    group.scale.set(0.001, 0.001, 0.001);
    group.visible = false;

    return { group, horizon, accretionDisk, photonRing, particles };
  }
}

