export const environment = {
  production: true,
  apiUrl: '/api',
  keycloak: {
    url: '/realms/auctions',
    realm: 'auctions',
    clientId: 'auctions-fe'
  },
  gtm: {
    id: 'GTM-XXXXXXX' // Replace with your GTM container ID for production
  }
};
