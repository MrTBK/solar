import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', children: [] },
  { path: 'projects/:id', children: [] },
  { path: 'projects', children: [] },
  { path: 'skills', children: [] },
  { path: 'experience', children: [] },
  { path: 'education', children: [] },
  { path: 'about', children: [] },
  { path: 'competitions', children: [] },
  { path: 'contact', children: [] },
  { path: '**', redirectTo: '' }
];
