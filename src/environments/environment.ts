export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  clientUrl: 'https://localhost:4200',
  notificationDuration: 10000,
  keycloak: {
    config: {
      url: 'http://localhost:8080',
      realm: 'Azm-Test',
      clientId: 'angular-client',
    },
    initOptions: {
      //onLoad: 'login-required',
      checkLoginIframe: false,
      onLoad: 'check-sso',
      pkceMethod: 'S256',
    },
    sessionTimeout: 60000,
  },
  gtm: {
    id: 'GTM-XXXXXXX' // Replace with your GTM container ID for development
  }
};
