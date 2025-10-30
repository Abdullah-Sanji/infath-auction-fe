import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor';
/* import { GrafanaService } from './core/services/grafana.service';
import { environment } from '../environments/environment'; */

/**
 * Initialize Grafana Frontend Observability
 * This runs before the application starts to ensure all errors and events are tracked
 */
/* function initializeGrafana(grafanaService: GrafanaService): () => void {
  return () => {
    grafanaService.initialize(environment.grafana);
  };
} */

/* const CustomAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{emerald.50}',
      100: '{emerald.100}',
      200: '{emerald.200}',
      300: '{emerald.300}',
      400: '{emerald.400}',
      500: '{emerald.500}', // Emerald/green primary
      600: '{emerald.600}',
      700: '{emerald.700}',
      800: '{emerald.800}',
      900: '{emerald.900}',
      950: '{emerald.950}',
    },
  },
}); */

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // HTTP Interceptors: Grafana runs first to track all requests, then Auth
    provideHttpClient(withInterceptors([authInterceptor])),
    MessageService,
    // Initialize Grafana Faro on application startup
    /* {
      provide: APP_INITIALIZER,
      useFactory: initializeGrafana,
      deps: [GrafanaService],
      multi: true,
    }, */
  ],
};
