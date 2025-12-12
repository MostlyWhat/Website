/**
 * Update Consent Preferences API
 * 
 * POST /api/consent/update
 * Allows users to modify their cookie consent preferences
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logConsent } from '$lib/server/gdpr';

interface ConsentPreferences {
	necessary: boolean;
	functional: boolean;
	analytics: boolean;
	marketing: boolean;
}

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const session = await locals.safeGetSession();
	
	if (!session?.user) {
		error(401, 'Authentication required');
	}
	
	try {
		const preferences = await request.json() as ConsentPreferences;
		
		// Validate preferences
		if (typeof preferences.functional !== 'boolean' ||
		    typeof preferences.analytics !== 'boolean' ||
		    typeof preferences.marketing !== 'boolean') {
			error(400, 'Invalid consent preferences');
		}
		
		// Necessary cookies are always enabled
		preferences.necessary = true;
		
		// Create consent data with timestamp
		const consentData = {
			...preferences,
			timestamp: new Date().toISOString(),
			version: '1.0'
		};
		
		// Update cookie
		const cookieValue = JSON.stringify(consentData);
		cookies.set('cookie-consent', cookieValue, {
			path: '/',
			maxAge: 365 * 24 * 60 * 60, // 1 year
			sameSite: 'lax',
			secure: true,
			httpOnly: false // Needs to be accessible by client-side scripts
		});
		
		// Log consent changes to database
		await logConsent({
			userId: session.user.id,
			consentType: 'functional',
			granted: preferences.functional,
			timestamp: new Date()
		});
		await logConsent({
			userId: session.user.id,
			consentType: 'analytics',
			granted: preferences.analytics,
			timestamp: new Date()
		});
		await logConsent({
			userId: session.user.id,
			consentType: 'marketing',
			granted: preferences.marketing,
			timestamp: new Date()
		});
		
		return json({
			success: true,
			message: 'Consent preferences updated successfully',
			preferences: consentData
		});
	} catch (err) {
		console.error('Error updating consent:', err);
		error(500, 'Failed to update consent preferences');
	}
};
