import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';
import { SKILLS_DATA, SkillCategory } from '../../../data/skill.data';

@Component({
  selector: 'app-skills-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-40 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all md:items-stretch"
      (click)="onBackdropClick($event)"
    >
      <div
        class="relative flex h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border-t border-sky-500/30 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl md:h-full md:w-[680px] md:rounded-t-none md:rounded-l-3xl md:border-t-0 md:border-l md:p-8"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-2">
            <span class="inline-block h-2 w-2 rounded-full bg-sky-400"></span>
            <span class="font-mono text-xs font-bold tracking-widest text-sky-400 uppercase">
              SKILLS CONSTELLATION // CAPABILITY MATRIX
            </span>
          </div>
          <button
            (click)="close()"
            class="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            <span>RETURN TO SYSTEM</span>
            <span class="font-bold">✕</span>
          </button>
        </div>

        <!-- Filter tabs -->
        <div class="mt-4 flex flex-wrap gap-1.5 font-mono text-xs">
          <button
            (click)="selectedCategory.set('all')"
            [class.bg-sky-500]="selectedCategory() === 'all'"
            [class.text-slate-950]="selectedCategory() === 'all'"
            [class.bg-slate-900]="selectedCategory() !== 'all'"
            [class.text-slate-300]="selectedCategory() !== 'all'"
            class="rounded-lg border border-slate-700/60 px-2.5 py-1 transition-colors"
          >
            ALL CAPABILITIES
          </button>
          @for (cat of categories; track cat.id) {
            <button
              (click)="selectedCategory.set(cat.id)"
              [class.bg-sky-500]="selectedCategory() === cat.id"
              [class.text-slate-950]="selectedCategory() === cat.id"
              [class.bg-slate-900]="selectedCategory() !== cat.id"
              [class.text-slate-300]="selectedCategory() !== cat.id"
              class="rounded-lg border border-slate-700/60 px-2.5 py-1 transition-colors"
            >
              {{ cat.name.split(' ')[0] }}
            </button>
          }
        </div>

        <!-- Categories & Cards -->
        <div class="mt-6 space-y-6">
          @for (cat of filteredCategories(); track cat.id) {
            <div class="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5">
              <div class="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div class="flex items-center gap-2">
                  <span
                    class="h-2.5 w-2.5 rounded-full"
                    [style.background-color]="cat.accentColor"
                  ></span>
                  <h2 class="text-sm font-bold text-white tracking-wide">{{ cat.name }}</h2>
                </div>
                <span class="font-mono text-[10px] text-slate-400">
                  {{ cat.skills.length }} Nodes
                </span>
              </div>
              <p class="mt-2 text-xs text-slate-400 leading-relaxed">
                {{ cat.description }}
              </p>

              <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                @for (skill of cat.skills; track skill.name) {
                  <div class="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                    <div class="flex items-center justify-between">
                      <span class="font-mono text-xs font-semibold text-slate-100">
                        {{ skill.name }}
                      </span>
                      <span
                        class="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[9px] text-sky-300"
                      >
                        {{ skill.level }}
                      </span>
                    </div>
                    @if (skill.detail) {
                      <div class="mt-1 text-[11px] text-slate-400">
                        {{ skill.detail }}
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="mt-8 border-t border-slate-800 pt-6">
          <button
            (click)="close()"
            class="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 font-mono text-xs text-slate-300 hover:text-white"
          >
            RETURN TO SOLAR SYSTEM
          </button>
        </div>
      </div>
    </div>
  `
})
export class SkillsModalComponent {
  private state = inject(StateService);

  public categories = SKILLS_DATA;
  public selectedCategory = signal<string>('all');

  public filteredCategories(): SkillCategory[] {
    const sel = this.selectedCategory();
    if (sel === 'all') return this.categories;
    return this.categories.filter((c) => c.id === sel);
  }

  public close(): void {
    this.state.returnToSystem();
  }

  public onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
