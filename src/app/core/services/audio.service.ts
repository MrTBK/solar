import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioCtx: AudioContext | null = null;
  public isMuted = signal<boolean>(false);
  public volume = signal<number>(0.75);
  public isAmbientHumActive = signal<boolean>(false);

  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;

  constructor() {
    // Check saved audio preference
    const saved = localStorage.getItem('solar_audio_muted');
    if (saved !== null) {
      this.isMuted.set(saved === 'true');
    }
    const savedAmbient = localStorage.getItem('solar_ambient_hum');
    if (savedAmbient === 'true') {
      this.isAmbientHumActive.set(true);
    }
  }

  private initContext(): AudioContext | null {
    if (this.isMuted()) return null;
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setVolume(val: number): void {
    const clamped = Math.max(0, Math.min(1, val));
    this.volume.set(clamped);
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(0.014 * clamped, this.audioCtx.currentTime);
    }
  }

  public toggleMute(): boolean {
    const next = !this.isMuted();
    this.isMuted.set(next);
    localStorage.setItem('solar_audio_muted', String(next));
    if (next) {
      this.stopAmbientHum();
    } else {
      this.playToggle();
      if (this.isAmbientHumActive()) {
        this.startAmbientHum();
      }
    }
    return next;
  }

  public toggleAmbientHum(): boolean {
    const next = !this.isAmbientHumActive();
    this.isAmbientHumActive.set(next);
    localStorage.setItem('solar_ambient_hum', String(next));
    if (next && !this.isMuted()) {
      this.startAmbientHum();
    } else {
      this.stopAmbientHum();
    }
    return next;
  }

  public startAmbientHum(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.stopAmbientHum();

    try {
      const now = ctx.currentTime;
      this.ambientFilter = ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(140, now);
      this.ambientFilter.Q.setValueAtTime(3, now);

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.014 * this.volume(), now + 2.5);

      this.ambientOsc1 = ctx.createOscillator();
      this.ambientOsc1.type = 'triangle';
      this.ambientOsc1.frequency.setValueAtTime(55, now); // A1 note

      this.ambientOsc2 = ctx.createOscillator();
      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(55.6, now); // 0.6Hz binaural drift

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  public stopAmbientHum(): void {
    try {
      if (this.ambientGain && this.audioCtx) {
        const now = this.audioCtx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      }
      setTimeout(() => {
        if (this.ambientOsc1) {
          try { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); } catch {}
          this.ambientOsc1 = null;
        }
        if (this.ambientOsc2) {
          try { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); } catch {}
          this.ambientOsc2 = null;
        }
        if (this.ambientFilter) {
          try { this.ambientFilter.disconnect(); } catch {}
          this.ambientFilter = null;
        }
        if (this.ambientGain) {
          try { this.ambientGain.disconnect(); } catch {}
          this.ambientGain = null;
        }
      }, 900);
    } catch {}
  }

  public playHover(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  public playSelect(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High-tech two-tone lock-on ping
      [523.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.04 + 0.12);

        gain.gain.setValueAtTime(0.04, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.15);
      });
    } catch {}
  }

  public playFly(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.45);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  public playClose(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playToggle(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playExplorationCheck(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        gain.gain.setValueAtTime(0.04, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch {}
  }

  public playBlackHoleRumble(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 3.0);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(55, now);
      sub.frequency.exponentialRampToValueAtTime(20, now + 3.0);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.8);
      gain.gain.linearRampToValueAtTime(0.06, now + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 4.0);
      sub.stop(now + 4.0);
    } catch {}
  }

  public playAccretionChime(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playBigBang(): void {
    if (this.isMuted()) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {}
  }
}
