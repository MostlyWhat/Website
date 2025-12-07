import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://94b5bd458e7585f90bbf695ad5306b1f@o4504852968570880.ingest.us.sentry.io/4510488795152384',

  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: import.meta.env.DEV,
});