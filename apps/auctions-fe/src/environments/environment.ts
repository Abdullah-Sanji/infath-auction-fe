export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:8080/realms/auctions',
    realm: 'auctions',
    clientId: 'auctions-fe',
  },
  gtm: {
    id: 'GTM-XXXXXXX', // Replace with your GTM container ID for development
  },
  grafana: {
    enabled: true,
    url: 'http://localhost:4000/collect', // Replace with your Grafana Faro collector URL
    appName: 'auctions-fe-dev',
    appVersion: '1.0.0',
    environment: 'development',
    // Optional: Configure session tracking
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
    // Optional: Configure which data to collect
    instrumentations: {
      errors: true,
      console: true,
      webVitals: true,
      interactions: true,
      network: true,
    },
  },
};
