import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { grafanaInterceptor } from './core/interceptors/grafana.interceptor';
import { GrafanaService } from './core/services/grafana.service';
import { environment } from '../environments/environment';

/**
 * Initialize Grafana Frontend Observability
 * This runs before the application starts to ensure all errors and events are tracked
 */
function initializeGrafana(grafanaService: GrafanaService): () => void {
  return () => {
    grafanaService.initialize(environment.grafana);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // HTTP Interceptors: Grafana runs first to track all requests, then Auth
    provideHttpClient(withInterceptors([grafanaInterceptor, authInterceptor])),
    MessageService,
    // Initialize Grafana Faro on application startup
    {
      provide: APP_INITIALIZER,
      useFactory: initializeGrafana,
      deps: [GrafanaService],
      multi: true
    }
  ]
};
