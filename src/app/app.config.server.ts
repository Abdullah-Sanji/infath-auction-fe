import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideAuth, StsConfigLoader } from 'angular-auth-oidc-client';
import { oidcConfigFactory } from './core/services/oidc/oidc.config';
import { OidcSsoProvider } from './core/services/oidc/oidc-sso.provider';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    OidcSsoProvider,
    provideAuth({
      loader: {
        provide: StsConfigLoader,
        useFactory: oidcConfigFactory,
      },
    }),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
