import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AudioService]
    });
    service = TestBed.inject(AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle mute state and persist to localStorage', () => {
    const initialMute = service.isMuted();
    const newMute = service.toggleMute();

    expect(newMute).toBe(!initialMute);
    expect(service.isMuted()).toBe(newMute);
    expect(localStorage.getItem('solar_audio_muted')).toBe(String(newMute));
  });

  it('should toggle ambient hum and persist state', () => {
    const initialHum = service.isAmbientHumActive();
    const newHum = service.toggleAmbientHum();

    expect(newHum).toBe(!initialHum);
    expect(service.isAmbientHumActive()).toBe(newHum);
    expect(localStorage.getItem('solar_ambient_hum')).toBe(String(newHum));
  });

  it('should clamp volume between 0 and 1', () => {
    service.setVolume(1.5);
    expect(service.volume()).toBe(1);

    service.setVolume(-0.5);
    expect(service.volume()).toBe(0);

    service.setVolume(0.65);
    expect(service.volume()).toBe(0.65);
  });
});
