import { Environment } from '@abp/ng.core';

const baseUrl = 'https://web.pass';

const oAuthConfig = {
  issuer: 'https://auth.pass/',
  redirectUri: baseUrl,
  clientId: 'PASS_App',
  responseType: 'code',
  scope: 'offline_access PASS',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'PASS',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://auth.pass/',
      rootNamespace: 'PASS',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  // remoteEnv: {
  //   url: '/getEnvConfig',
  //   mergeStrategy: 'deepmerge'
  // }
} as Environment;
