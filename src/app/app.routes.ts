import { Routes, provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/counter/counter').then(m => m.Counter),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
  },
  // fallback
  { path: '**', redirectTo: '' },
];
