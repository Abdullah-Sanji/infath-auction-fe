import { OpenIdConfiguration, StsConfigLoader } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
const isBrowser = typeof window !== 'undefined';
const origin = environment.clientUrl;
const config: OpenIdConfiguration = {
  authority: `${environment.keycloak.config.url}/realms/${environment.keycloak.config.realm}`,
  redirectUrl: origin + '/login-callback',
  postLogoutRedirectUri: origin,
  clientId: environment.keycloak.config.clientId,
  scope: 'openid profile email',
  responseType: 'code',
  silentRenew: isBrowser,
  useRefreshToken: false,
  renewTimeBeforeTokenExpiresInSeconds: 30,
  secureRoutes: [environment.apiUrl],
  triggerAuthorizationResultEvent: true,
  silentRenewUrl: isBrowser ? `${origin}/silent-renew.html` : '',
  ignoreNonceAfterRefresh: true,
  usePushedAuthorisationRequests: false,
  disablePkce: false,
};

export const oidcConfig = config;

export const oidcConfigFactory = (): StsConfigLoader => {
  return { loadConfigs: () => of([oidcConfig]) };
};
