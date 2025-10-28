// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  azure: {
    clientId: 'your-client-id',
    tenantId: 'your-tenant-id',
    redirectUri: 'http://localhost:4200',  
  },
  backEndUrl: 'http://localhost:8081/api/',
  companyDomain: 'test.com',
  companyName: 'Test',
};


