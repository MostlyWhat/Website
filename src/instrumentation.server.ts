import * as Sentry from '@sentry/sveltekit';

// Only initialize Sentry in environments where it's supported
// Cloudflare Workers has limited support for some Sentry features
if (typeof globalThis.process !== 'undefined' || typeof globalThis.caches !== 'undefined') {
  try {
    Sentry.init({
      dsn: 'https://94b5bd458e7585f90bbf695ad5306b1f@o4504852968570880.ingest.us.sentry.io/4510488795152384',

      tracesSampleRate: 1.0,

      // Disable features not supported in Cloudflare Workers
      enableLogs: false,
      spotlight: false,

      // Use basic transport for Workers
      beforeSend(event) {
        return event;
      }
    });
  } catch (e) {
    console.warn('Sentry initialization failed:', e);
  }
}