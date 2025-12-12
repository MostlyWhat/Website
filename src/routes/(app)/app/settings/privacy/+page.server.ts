import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { getUserConsents } from '$lib/server/gdpr';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.safeGetSession();
	
	if (!session?.user) {
		throw error(401, 'Unauthorized');
	}
	
	// Get user's current consent preferences
	const consents = await getUserConsents(session.user.id);
	
	return {
		consents,
		user: session.user
	};
};

export const actions = {
	exportData: async ({ locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		return {
			success: true,
			message: 'Data export initiated. Download will start shortly.'
		};
	},
	
	deleteAccount: async ({ request, locals }) => {
		const session = await locals.safeGetSession();
		
		if (!session?.user) {
			return fail(401, { error: 'Unauthorized' });
		}
		
		const formData = await request.formData();
		const confirm = formData.get('confirm');
		
		if (confirm !== 'DELETE MY DATA') {
			return fail(400, { 
				error: 'Please type "DELETE MY DATA" to confirm account deletion' 
			});
		}
		
		return {
			success: true,
			confirmed: true
		};
	}
} satisfies Actions;
