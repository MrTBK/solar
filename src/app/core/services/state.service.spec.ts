import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StateService } from './state.service';
import { AudioService } from './audio.service';
import { DeviceService } from './device.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StateService,
        AudioService,
        DeviceService,
        provideRouter([])
      ]
    });
    service = TestBed.inject(StateService);
  });

  it('should be created with initial default state', () => {
    expect(service).toBeTruthy();
    expect(service.isTourActive()).toBe(false);
    expect(service.activeModal()).toBeNull();
    expect(service.activeTechFilter()).toBeNull();
    expect(service.showRadar()).toBe(true);
  });

  it('should start, advance, and stop the guided tour', () => {
    service.startTour();
    expect(service.isTourActive()).toBe(true);
    expect(service.tourIndex()).toBe(0);

    service.nextTourStop();
    expect(service.tourIndex()).toBe(1);

    service.prevTourStop();
    expect(service.tourIndex()).toBe(0);

    service.stopTour();
    expect(service.isTourActive()).toBe(false);
  });

  it('should set and clear tech stack filters', () => {
    service.setTechFilter('Python');
    expect(service.activeTechFilter()).toBe('Python');

    // Clicking same filter toggles it off
    service.setTechFilter('Python');
    expect(service.activeTechFilter()).toBeNull();

    service.setTechFilter('dbt');
    expect(service.activeTechFilter()).toBe('dbt');
    expect(service.isBodyMatchingTech('planet-dataforge')).toBe(true);
  });

  it('should open and close modals', () => {
    service.openModal('dossier', false);
    expect(service.activeModal()).toBe('dossier');

    service.closeModal();
    expect(service.activeModal()).toBeNull();
  });

  it('should toggle radar visibility', () => {
    const initial = service.showRadar();
    service.toggleRadar();
    expect(service.showRadar()).toBe(!initial);
  });

  it('should open skill planet, track exploration, and clear on closeModal', () => {
    const testPlanet = {
      id: 'skill-python',
      name: 'PYTHON & DATA PIPELINES',
      category: 'Data Engineering',
      tagline: 'Batch ETL, dbt Modeling',
      color: '#38bdf8',
      emissiveColor: '#0284c7',
      textureType: 'industrial' as const,
      radius: 3.2,
      rowX: -50,
      highlight: 'ETL Pipelines',
      skills: [{ name: 'Python', level: 'Advanced' }]
    };

    service.openSkillPlanet(testPlanet);
    expect(service.activeSkillPlanet()).toEqual(testPlanet);
    expect(service.activeModal()).toBe('skill-planet');
    expect(service.exploredPlanets().has('skill-python')).toBe(true);
    expect(service.telemetry().targetName).toBe(testPlanet.name);

    service.closeModal();
    expect(service.activeSkillPlanet()).toBeNull();
    expect(service.activeModal()).toBeNull();
  });

  it('should toggle skills row mode and reset on returnToSystem', () => {
    expect(service.isSkillsRowMode()).toBe(false);
    service.toggleSkillsRowMode();
    expect(service.isSkillsRowMode()).toBe(true);

    service.returnToSystem();
    expect(service.isSkillsRowMode()).toBe(false);
    expect(service.activeSkillPlanet()).toBeNull();
  });

  it('should fly to sectors smoothly', () => {
    service.flyToSector('projects');
    expect(service.selectedTarget()?.id).toBe('planet-dataforge');

    service.flyToSector('career');
    expect(service.selectedTarget()?.id).toBe('station-coficab');

    service.flyToSector('system');
    expect(service.selectedTarget()).toBeNull();
  });

  it('should manage adaptive quality levels', () => {
    expect(service.qualityLevel()).toBe('HIGH');
    service.setQualityLevel('MEDIUM');
    expect(service.qualityLevel()).toBe('MEDIUM');
    service.setQualityLevel('LOW');
    expect(service.qualityLevel()).toBe('LOW');
  });
});

