export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:8080/realms/auctions',
    realm: 'auctions',
    clientId: 'auctions-fe'
  },
  gtm: {
    id: 'GTM-XXXXXXX' // Replace with your GTM container ID for development
  }
};
