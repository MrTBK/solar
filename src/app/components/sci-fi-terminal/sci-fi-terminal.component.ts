import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { AudioService } from '../../core/services/audio.service';
import { HapticService } from '../../core/services/haptic.service';
import { CELESTIAL_BODIES } from '../../data/celestial.data';
import { SKILL_PLANETS } from '../../data/skill.data';
import { PROJECTS_DATA } from '../../data/project.data';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

@Component({
  selector: 'app-sci-fi-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-md animate-fade-in"
      >
        <div
          class="relative flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-emerald-500/50 bg-slate-950/95 font-mono text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-2xl overflow-hidden"
        >
          <!-- Top Bar -->
          <div class="flex items-center justify-between border-b border-emerald-950 bg-slate-900/80 px-4 py-2.5">
            <div class="flex items-center gap-2 text-xs">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="font-bold tracking-wider text-emerald-300">SOLAR CORE TERMINAL // v2.4</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[10px] text-slate-500">TYPE 'help' FOR COMMANDS</span>
              <button
                (click)="close()"
                class="rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-rose-950 hover:text-white transition-colors"
              >
                ✕ ESC
              </button>
            </div>
          </div>

          <!-- Terminal Output Body -->
          <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-2 text-xs leading-relaxed crt-scanlines">
            <!-- Welcome message -->
            <div class="text-slate-400">
              Welcome to the Solar System Core Terminal.<br />
              Connected to Astronaut: <span class="text-emerald-300 font-bold">Mohamed Aziz Tabakh</span><br />
              Type <span class="text-cyan-300 font-bold">'help'</span> for a list of orbital telemetry commands.
            </div>

            @for (line of lines(); track $index) {
              <div>
                @if (line.type === 'input') {
                  <span class="text-cyan-400 font-bold">tbk&#64;solar-core:~$ </span>
                  <span class="text-white">{{ line.text }}</span>
                } @else if (line.type === 'error') {
                  <span class="text-rose-400 font-semibold">[ERROR] {{ line.text }}</span>
                } @else if (line.type === 'success') {
                  <span class="text-emerald-300 font-semibold">{{ line.text }}</span>
                } @else if (line.type === 'system') {
                  <span class="text-amber-400">{{ line.text }}</span>
                } @else {
                  <span class="text-slate-300 whitespace-pre-wrap">{{ line.text }}</span>
                }
              </div>
            }
          </div>

          <!-- Terminal Input Line -->
          <div class="flex items-center gap-2 border-t border-emerald-950 bg-slate-900/90 px-4 py-3">
            <span class="text-cyan-400 font-bold text-xs">tbk&#64;solar-core:~$</span>
            <input
              #inputField
              [(ngModel)]="currentInput"
              (keydown.enter)="executeCommand()"
              (keydown.arrowup)="prevHistory($event)"
              (keydown.arrowdown)="nextHistory($event)"
              type="text"
              class="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-600 caret-emerald-400"
              placeholder="Enter command... (e.g. 'warp mars', 'pilot', 'cat resume')"
              autofocus
            />
            <button
              (click)="executeCommand()"
              class="rounded bg-emerald-900/50 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-800 transition-colors"
            >
              EXEC ↵
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .crt-scanlines {
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
        background-size: 100% 3px, 6px 100%;
      }
      .animate-fade-in {
        animation: fadeIn 0.2s ease-out forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
      }
    `
  ]
})
export class SciFiTerminalComponent {
  private state = inject(StateService);
  private audio = inject(AudioService);
  private haptic = inject(HapticService);

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('inputField') private inputField?: ElementRef<HTMLInputElement>;

  public isOpen = computed(() => this.state.isTerminalOpen());
  public currentInput = '';
  public lines = signal<TerminalLine[]>([]);

  private history: string[] = [];
  private historyIdx = -1;

  @HostListener('window:keydown', ['$event'])
  onGlobalKey(event: KeyboardEvent): void {
    if (event.key === '`' || event.key === '~') {
      event.preventDefault();
      this.state.toggleTerminal();
      if (this.isOpen()) {
        setTimeout(() => this.inputField?.nativeElement.focus(), 50);
      }
    }
    if (this.isOpen() && event.key === 'Escape') {
      this.close();
    }
  }

  public close(): void {
    this.state.toggleTerminal();
  }

  public executeCommand(): void {
    const raw = this.currentInput.trim();
    if (!raw) return;

    this.haptic.light();
    this.lines.update((l) => [...l, { text: raw, type: 'input' }]);
    this.history.push(raw);
    this.historyIdx = this.history.length;
    this.currentInput = '';

    const parts = raw.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    this.processCommand(cmd, args);

    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 10);
  }

  private processCommand(cmd: string, args: string[]): void {
    switch (cmd) {
      case 'help':
        this.addLine(`AVAILABLE COMMANDS:
  warp <target>      - Warp camera to a planet (e.g. 'warp mars', 'warp angular', 'warp sun')
  pilot              - Toggle spaceship probe manual cockpit flight mode
  align              - Engage linear planetary alignment (syzygy mode)
  constellation      - Toggle skill tech-tree constellation matrix
  speed <multiplier> - Adjust orbital speed (e.g. 'speed 5', 'speed -2', 'speed 0')
  cat resume         - Print astronaut biography & qualifications
  cat skills         - List core technologies & competency levels
  projects           - List featured engineering repositories & pipelines
  voice              - Toggle AI mission control voice synthesis
  contact            - View encrypted comms frequency & links
  clear              - Clear terminal display
  exit               - Disengage terminal interface`, 'output');
        break;

      case 'warp':
      case 'goto': {
        const query = args.join(' ').toLowerCase();
        if (!query) {
          this.addLine('Usage: warp <target_name> (e.g. warp mars, warp dataforge, warp angular)', 'error');
          return;
        }

        const planetMatch = CELESTIAL_BODIES.find((b) => b.name.toLowerCase().includes(query) || b.id.toLowerCase().includes(query));
        if (planetMatch) {
          this.state.selectTarget(planetMatch, false);
          this.addLine(`WARP SEQUENCE ENGAGED: Vector locked to [${planetMatch.name}].`, 'success');
          this.close();
          return;
        }

        const skillMatch = SKILL_PLANETS.find((s) => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query));
        if (skillMatch) {
          this.state.openSkillPlanet(skillMatch);
          this.addLine(`WARP SEQUENCE ENGAGED: Navigating to Skill Node [${skillMatch.name}].`, 'success');
          this.close();
          return;
        }

        this.addLine(`Target '${query}' not detected in navigational starcharts. Type 'projects' or 'cat skills'.`, 'error');
        break;
      }

      case 'pilot':
      case 'fly':
        this.state.toggleFlightMode();
        this.addLine('Spaceship flight mode toggled. Controls: WASD to steer, Shift to boost, ESC to exit.', 'success');
        this.close();
        break;

      case 'align':
      case 'row':
        this.state.toggleSkillsRowMode();
        this.addLine('Planetary alignment protocol toggled.', 'system');
        this.close();
        break;

      case 'constellation':
      case 'tree':
        this.state.toggleConstellationMode();
        this.addLine('Skill tech-tree constellation display toggled.', 'system');
        break;

      case 'speed': {
        const val = parseFloat(args[0]);
        if (isNaN(val)) {
          this.addLine('Usage: speed <number> (e.g. speed 5, speed -1, speed 0)', 'error');
          return;
        }
        this.state.setOrbitSpeed(val);
        this.addLine(`Orbital velocity multiplier set to ${val}x.`, 'success');
        break;
      }

      case 'cat': {
        const target = args[0]?.toLowerCase();
        if (target === 'resume' || target === 'dossier') {
          this.addLine(`ASTRONAUT DOSSIER: MOHAMED AZIZ TABAKH
Title: Business Intelligence Specialist & Data Developer
Focus: Kimball Dimensional Modeling, Batch ETL Pipelines (Airflow, dbt), Predictive ML
Education: TBS - Tunis Business School (Business Intelligence & Data Analytics)
Honors: TCPC Finalist (32/100 National), 1st Place Monopoly Hackathon 2026
Experience: Coficab Group (Automotive Wiring Workflow & Analytics)`, 'output');
        } else if (target === 'skills') {
          this.addLine(`SKILL MATRIX:
• Python (Advanced) - Pandas, FastAPI, Scikit-Learn
• SQL / PostgreSQL / SQL Server (Advanced) - Window Functions, Star Schemas
• Power BI & DAX (Advanced) - Executive Visual Dashboards
• dbt & Airflow (Proficient) - Orchestration & Transformations
• Angular 22 & Three.js (Proficient) - Reactive Signals & 3D Shaders
• C++ (Advanced) - Algorithmic Complexity, STL, Graph Theory`, 'output');
        } else {
          this.addLine(`File '${target}' not found. Try 'cat resume' or 'cat skills'.`, 'error');
        }
        break;
      }

      case 'projects': {
        const list = PROJECTS_DATA.map((p) => `• [${p.id}] ${p.name} (${p.category})`).join('\n');
        this.addLine(`FEATURED PROJECTS:\n${list}\nUse 'warp <id>' to intercept.`, 'output');
        break;
      }

      case 'voice':
        this.state.toggleVoiceAssistant();
        this.addLine(`AI Mission Voice Assistant is now ${this.state.isVoiceAssistantEnabled() ? 'ENABLED' : 'MUTED'}.`, 'system');
        break;

      case 'contact':
        this.addLine(`COMMS FREQUENCIES:
• Email: medaziz.tabakh@gmail.com
• GitHub: https://github.com/MrTBK
• LinkedIn: https://linkedin.com/in/mohamed-aziz-tabakh
• Location: Tunis, Tunisia (UTC+1)`, 'output');
        break;

      case 'clear':
      case 'cls':
        this.lines.set([]);
        break;

      case 'exit':
      case 'quit':
        this.close();
        break;

      default:
        this.addLine(`Command not recognized: '${cmd}'. Type 'help' for supported commands.`, 'error');
        break;
    }
  }

  private addLine(text: string, type: TerminalLine['type']): void {
    this.lines.update((l) => [...l, { text, type }]);
  }

  public prevHistory(event: Event): void {
    event.preventDefault();
    if (this.history.length === 0) return;
    if (this.historyIdx > 0) {
      this.historyIdx--;
      this.currentInput = this.history[this.historyIdx];
    }
  }

  public nextHistory(event: Event): void {
    event.preventDefault();
    if (this.historyIdx < this.history.length - 1) {
      this.historyIdx++;
      this.currentInput = this.history[this.historyIdx];
    } else {
      this.historyIdx = this.history.length;
      this.currentInput = '';
    }
  }
}
