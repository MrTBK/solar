import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StateService } from './core/services/state.service';
import { DeviceService } from './core/services/device.service';
import { AudioService } from './core/services/audio.service';
import { CanvasSceneComponent } from './components/canvas-scene/canvas-scene.component';
import { HudNavComponent } from './components/hud-nav/hud-nav.component';
import { MissionControlComponent } from './components/mission-control/mission-control.component';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { AboutModalComponent } from './components/views/about-modal/about-modal.component';
import { SkillsModalComponent } from './components/views/skills-modal/skills-modal.component';
import { ExperienceModalComponent } from './components/views/experience-modal/experience-modal.component';
import { EducationModalComponent } from './components/views/education-modal/education-modal.component';
import { CompetitionsModalComponent } from './components/views/competitions-modal/competitions-modal.component';
import { ContactModalComponent } from './components/views/contact-modal/contact-modal.component';
import { Fallback2DComponent } from './components/views/fallback-2d/fallback-2d.component';
import { CinematicIntroComponent } from './components/cinematic-intro/cinematic-intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    CanvasSceneComponent,
    HudNavComponent,
    MissionControlComponent,
    ProjectModalComponent,
    AboutModalComponent,
    SkillsModalComponent,
    ExperienceModalComponent,
    EducationModalComponent,
    CompetitionsModalComponent,
    ContactModalComponent,
    Fallback2DComponent,
    CinematicIntroComponent
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  public state = inject(StateService);
  public device = inject(DeviceService);
  public audio = inject(AudioService);
  private router = inject(Router);

  public is2DMode = computed(() => this.state.is2DMode());
  public activeModal = computed(() => this.state.activeModal());
  public selectedTarget = computed(() => this.state.selectedTarget());
  public isMobile = computed(() => this.device.isMobile());

  ngOnInit(): void {
    // Synchronize initial route & route changes
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;
        this.handleRouteUrl(url);
      });

    // Handle initial direct load URL
    this.handleRouteUrl(this.router.url);
  }

  private handleRouteUrl(url: string): void {
    if (!url || url === '/') return;

    if (url.startsWith('/projects/')) {
      const slug = url.replace('/projects/', '').split('?')[0];
      if (slug) {
        this.state.openProject(slug, true);
      }
    } else if (url === '/skills') {
      this.state.openModal('skills', true);
    } else if (url === '/experience') {
      this.state.openModal('experience', true);
    } else if (url === '/education') {
      this.state.openModal('education', true);
    } else if (url === '/about') {
      this.state.openModal('about', true);
    } else if (url === '/competitions') {
      this.state.openModal('competitions', true);
    } else if (url === '/contact') {
      this.state.openModal('contact', true);
    }
  }

  public returnToSystem(): void {
    this.state.returnToSystem();
  }
}
