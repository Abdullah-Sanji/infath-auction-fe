import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'auctions',
    loadComponent: () => import('./pages/auctions/auctions').then(m => m.Auctions),
    canActivate: [authGuard]
  },
  {
    path: 'wallet',
    loadComponent: () => import('./pages/wallet/wallet').then(m => m.Wallet),
    canActivate: [authGuard]
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy/privacy').then(m => m.PrivacyPolicy)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () => import('./pages/terms/terms').then(m => m.TermsAndConditionsComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
