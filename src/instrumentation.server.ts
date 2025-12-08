/**
 * Server Instrumentation
 * 
 * For Cloudflare Workers deployment, Sentry is initialized via the
 * initCloudflareSentryHandle() in hooks.server.ts, not here.
 * 
 * This file is kept for SvelteKit's experimental instrumentation feature
 * but the actual Sentry initialization happens in the server hooks.
 * 
 * @see https://docs.sentry.io/platforms/javascript/guides/sveltekit/deployment/cloudflare/
 */

// No-op for Cloudflare Workers - initialization happens in hooks.server.ts
export {};