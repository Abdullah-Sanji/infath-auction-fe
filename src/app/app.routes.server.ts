import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'home',
    renderMode: RenderMode.Prerender  // Static, pre-render at build
  },
  {
    path: 'auctions',
    renderMode: RenderMode.Server  // Dynamic, render on each request
  },
  {
    path: 'wallet',
    renderMode: RenderMode.Server  // Dynamic, render on each request
  },
  {
    path: 'privacy-policy',
    renderMode: RenderMode.Client  // Dynamic, render on each request
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender  // Default for all other routes
  }
];
