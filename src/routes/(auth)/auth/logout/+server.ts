import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Logout Handler
 * 
 * Signs out the user and redirects to home page.
 */
export const GET: RequestHandler = async ({ locals: { supabase } }) => {
    await supabase.auth.signOut();
    redirect(303, '/');
};

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
    await supabase.auth.signOut();
    redirect(303, '/');
};
