import { initCloudflareSentryHandle, sentryHandle, handleErrorWithSentry } from '@sentry/sveltekit';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import { createDb } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { logLoginEvent, getClientIp } from '$lib/server/activity-logger';

/**
 * Paraglide i18n middleware
 */
const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

/**
 * Supabase Auth middleware
 * 
 * Creates a Supabase client for each request and handles session management.
 * All database operations should still go through Drizzle ORM.
 */
const handleSupabase: Handle = async ({ event, resolve }) => {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		// Skip Supabase setup if not configured (dev without Supabase)
		event.locals.session = null;
		event.locals.user = null;
		event.locals.profile = null;
		return resolve(event);
	}

	// Create Supabase client for this request
	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});

	/**
		* Safe session getter that validates JWT
		* Unlike `supabase.auth.getSession()`, this validates the JWT before returning.
		* Also logs session timeouts when JWT validation fails.
		*/
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		// Validate the JWT by calling getUser()
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			// JWT validation failed - could be session timeout
			// Log this as a potential timeout event
			if (session?.user?.id) {
				await logLoginEvent({
					profileId: session.user.id,
					eventType: 'logout',
					ipAddress: getClientIp(event.request),
					userAgent: event.request.headers.get('user-agent') ?? undefined,
					success: true,
					failureReason: 'Session timeout or invalid JWT'
				});
			}
			return { session: null, user: null };
		}

		return { session, user };
	};

	// Get the session and user
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// Create database connection for this request (Cloudflare Workers compatible)
	// This ensures each request gets its own connection context
	const db = createDb();
	event.locals.db = db;

	// Get the user's profile from our database if authenticated
	if (user) {
		try {
			const profile = await db.query.profiles.findFirst({
				where: eq(profiles.id, user.id)
			});
			event.locals.profile = profile ?? null;
		} catch {
			// Profile might not exist yet (new user)
			event.locals.profile = null;
		}
	} else {
		event.locals.profile = null;
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Supabase libraries use these headers
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

/**
 * Route protection middleware
 * 
 * Protects routes based on authentication status and user roles.
 */
const handleRouteProtection: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const { user, profile } = event.locals;

	// Define protected route patterns
	const isAuthRoute = pathname.startsWith('/auth');
	const isAppRoute = pathname.startsWith('/app');
	const isAdminRoute = pathname.startsWith('/admin');
	const isOnboardingRoute = pathname.startsWith('/onboarding');
	const isApiRoute = pathname.startsWith('/api');

	// Skip protection for API routes (they handle their own auth)
	if (isApiRoute) {
		return resolve(event);
	}

	// Auth routes: Redirect to dashboard if already logged in
	if (isAuthRoute && !pathname.includes('/logout') && !pathname.includes('/callback')) {
		if (user) {
			// If user hasn't completed onboarding, redirect there
			if (profile && !profile.onboardingCompleted) {
				return new Response(null, {
					status: 302,
					headers: { Location: '/onboarding' }
				});
			}
			// Otherwise redirect to appropriate dashboard
			const redirectTo = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'staff' ? '/admin' : '/app';
			return new Response(null, {
				status: 302,
				headers: { Location: redirectTo }
			});
		}
	}

	// Protected routes: Require authentication
	if (isAppRoute || isAdminRoute || isOnboardingRoute) {
		if (!user) {
			const redirectUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`;
			return new Response(null, {
				status: 302,
				headers: { Location: redirectUrl }
			});
		}

		// SECURITY: Require profile to exist for app/admin routes
		// If no profile, redirect to onboarding (it will create one)
		if (!isOnboardingRoute && !profile) {
			return new Response(null, {
				status: 302,
				headers: { Location: '/onboarding' }
			});
		}

		// Check if user needs to complete onboarding
		if (!isOnboardingRoute && profile && !profile.onboardingCompleted) {
			return new Response(null, {
				status: 302,
				headers: { Location: '/onboarding' }
			});
		}

		// Admin routes: Require admin, super_admin, or staff role
		if (isAdminRoute) {
			const allowedRoles = ['super_admin', 'admin', 'staff'];
			if (!profile || !allowedRoles.includes(profile.role ?? '')) {
				return new Response(null, {
					status: 302,
					headers: { Location: '/app' }
				});
			}
		}
	}

	return resolve(event);
};

// Initialize Sentry for Cloudflare Workers
const initSentry = initCloudflareSentryHandle({
	dsn: env.PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1.0
});

export const handle: Handle = sequence(initSentry, sentryHandle(), handleParaglide, handleSupabase, handleRouteProtection);
export const handleError: HandleServerError = handleErrorWithSentry();