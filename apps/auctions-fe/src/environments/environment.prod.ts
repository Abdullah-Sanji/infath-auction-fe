export const environment = {
  production: true,
  apiUrl: '/api',
  keycloak: {
    url: '/realms/auctions',
    realm: 'auctions',
    clientId: 'auctions-fe',
  },
  gtm: {
    id: 'GTM-XXXXXXX', // Replace with your GTM container ID for production
  },
  grafana: {
    enabled: true,
    url: 'https://your-grafana-faro-collector.com/collect', // Replace with your production Grafana Faro collector URL
    appName: 'auctions-fe',
    appVersion: '1.0.0',
    environment: 'production',
    // Optional: Configure session tracking
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
    // Optional: Configure which data to collect
    instrumentations: {
      errors: true,
      console: false, // Disable console logs in production
      webVitals: true,
      interactions: true,
      network: true,
    },
  },
};
