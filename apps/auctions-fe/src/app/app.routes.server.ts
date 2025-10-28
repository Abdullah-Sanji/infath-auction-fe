import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'home',
    renderMode: RenderMode.Prerender, // Static, pre-render at build
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender, // Static, pre-render at build
  },
  {
    path: 'auctions',
    renderMode: RenderMode.Server, // Dynamic, render on each request
  },
  {
    path: 'login',
    renderMode: RenderMode.Client, // Client-side only (uses localStorage, etc.)
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender, // Default for all other routes
  },
];
