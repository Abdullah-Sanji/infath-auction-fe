import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './core/services/transloco-loader';

export const CustomAura = definePreset(Aura, {
  semantic: {
    primary: {
      50:  'var(--color-primary-50)',
      100: 'var(--color-primary-100)',
      200: 'var(--color-primary-200)',
      300: 'var(--color-primary-300)',
      400: 'var(--color-primary-400)',
      500: 'var(--color-button-primary)', // Brand primary
      600: 'var(--color-primary-600)',
      700: 'var(--color-primary-700)',
      800: 'var(--color-primary-800)',
      900: 'var(--color-primary-900)',
      950: 'var(--color-primary-950)',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Note: provideAnimations() is deprecated in Angular 20 (will be removed in v23)
    // but still required for PrimeNG components (Toast, Dialog, etc.) which use the old Animation API
    // TODO: Remove when PrimeNG migrates to animate.enter/animate.leave directives
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: CustomAura,
        options: {
          darkModeSelector: false,
        }
      }
    }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['en', 'ar'],
        defaultLang: 'ar',
        reRenderOnLangChange: true,
        prodMode: false,
        fallbackLang: 'ar',
        missingHandler: {
          useFallbackTranslation: true
        }
      },
      loader: TranslocoHttpLoader
    }),
    MessageService
  ]
};
