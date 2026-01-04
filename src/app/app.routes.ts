import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'auctions/:id',
    loadComponent: () =>
      import('./pages/auctions/auction-details/auction-details').then((m) => m.AuctionDetails),
  },
  {
    path: 'auctions',
    loadComponent: () => import('./pages/auctions/auctions').then((m) => m.Auctions),
  },
  {
    path: 'wallet',
    loadComponent: () => import('./pages/wallet/wallet').then((m) => m.Wallet),
    canActivate: [authGuard],
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.PrivacyPolicy),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
    children: [
      {
        path: '',
        redirectTo: 'personal-info',
        pathMatch: 'full'
      },
      {
        path: 'personal-info',
        loadComponent: () => import('./pages/profile/components/personal-info/personal-info').then((m) => m.PersonalInfo),
      },
      {
        path: 'change-password',
        loadComponent: () => import('./pages/profile/components/change-password/change-password').then((m) => m.ChangePassword),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/profile/components/settings/settings').then((m) => m.Settings),
      },
      {
        path: 'regions',
        loadComponent: () => import('./pages/profile/components/regions/regions').then((m) => m.Regions),
      },
      {
        path: 'auction-preferences',
        loadComponent: () => import('./pages/profile/components/auction-preferences/auction-preferences').then((m) => m.AuctionPreferences),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./pages/profile/components/favorites/favorites').then((m) => m.Favorites),
      },
    ],
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () => import('./pages/terms/terms').then((m) => m.TermsAndConditionsComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
