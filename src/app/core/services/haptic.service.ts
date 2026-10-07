import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HapticService {
  /**
   * Subtle tick for standard UI interactions (button click, toggle)
   */
  public light(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  }

  /**
   * Medium pulse for selecting a planet or locking target
   */
  public medium(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
  }

  /**
   * Success / Milestone pulse pattern
   */
  public success(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15, 30, 25]);
      } catch {}
    }
  }

  /**
   * Heavy rumble for warp jump, thruster burst, or singularity
   */
  public heavy(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 60]);
      } catch {}
    }
  }
}
