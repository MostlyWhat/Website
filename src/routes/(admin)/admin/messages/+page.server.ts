import { createDb } from '$lib/server/db';
import { contactSubmissions, tickets, organizations, profiles } from '$lib/server/db/schema';
import { desc, eq, and, sql, isNull } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Generate ticket number
async function generateTicketNumber(): Promise<string> {
	const db = createDb();
	const year = new Date().getFullYear();
	
	// Get the latest ticket number for this year
	const result = await db
		.select({ ticketNumber: tickets.ticketNumber })
		.from(tickets)
		.where(sql`${tickets.ticketNumber} LIKE ${'TKT-' + year + '-%'}`)
		.orderBy(desc(tickets.ticketNumber))
		.limit(1);
	
	let nextNum = 1;
	if (result.length > 0 && result[0].ticketNumber) {
		const lastNum = parseInt(result[0].ticketNumber.split('-')[2], 10);
		if (!isNaN(lastNum)) {
			nextNum = lastNum + 1;
		}
	}
	
	return `TKT-${year}-${String(nextNum).padStart(5, '0')}`;
}

export const load: PageServerLoad = async ({ url }) => {
	const db = createDb();
	
	// Get filter params
	const status = url.searchParams.get('status') || 'all';
	const topic = url.searchParams.get('topic') || 'all';
	
	// Build query conditions
	const conditions = [];
	if (status !== 'all') {
		conditions.push(eq(contactSubmissions.status, status as any));
	}
	if (topic !== 'all') {
		conditions.push(eq(contactSubmissions.topic, topic as any));
	}
	
	// Fetch submissions
	const submissions = await db
		.select()
		.from(contactSubmissions)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(desc(contactSubmissions.createdAt))
		.limit(100);
	
	// Get stats
	const stats = await db
		.select({
			total: sql<number>`count(*)`,
			new: sql<number>`count(*) filter (where ${contactSubmissions.status} = 'new')`,
			read: sql<number>`count(*) filter (where ${contactSubmissions.status} = 'read')`,
			replied: sql<number>`count(*) filter (where ${contactSubmissions.status} = 'replied')`,
			support: sql<number>`count(*) filter (where ${contactSubmissions.topic} = 'support')`,
			quote: sql<number>`count(*) filter (where ${contactSubmissions.topic} = 'quote')`,
		})
		.from(contactSubmissions)
		.then(r => r[0]);
	
	// Get organizations for ticket conversion
	const orgs = await db
		.select({ id: organizations.id, name: organizations.name })
		.from(organizations)
		.orderBy(organizations.name);
	
	return {
		submissions,
		stats,
		organizations: orgs,
		filters: { status, topic }
	};
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const status = formData.get('status') as string;
		
		if (!id || !status) {
			return fail(400, { error: 'Missing required fields' });
		}
		
		const db = createDb();
		
		const updateData: Record<string, any> = { status };
		if (status === 'read') {
			updateData.readAt = new Date();
		} else if (status === 'replied') {
			updateData.repliedAt = new Date();
		}
		
		await db
			.update(contactSubmissions)
			.set(updateData)
			.where(eq(contactSubmissions.id, id));
		
		return { success: true };
	},
	
	convertToTicket: async ({ request, locals }) => {
		const formData = await request.formData();
		const submissionId = formData.get('submissionId') as string;
		const organizationId = formData.get('organizationId') as string;
		const priority = (formData.get('priority') as string) || 'medium';
		
		if (!submissionId || !organizationId) {
			return fail(400, { error: 'Submission ID and Organization are required' });
		}
		
		if (!locals.profile) {
			return fail(401, { error: 'Not authenticated' });
		}
		
		const db = createDb();
		
		// Get the submission
		const [submission] = await db
			.select()
			.from(contactSubmissions)
			.where(eq(contactSubmissions.id, submissionId))
			.limit(1);
		
		if (!submission) {
			return fail(404, { error: 'Submission not found' });
		}
		
		if (submission.ticketId) {
			return fail(400, { error: 'This submission has already been converted to a ticket' });
		}
		
		try {
			// Generate ticket number
			const ticketNumber = await generateTicketNumber();
			
			// Create the ticket
			const [newTicket] = await db
				.insert(tickets)
				.values({
					ticketNumber,
					organizationId,
					subject: submission.subject || `Contact: ${submission.topic} from ${submission.name}`,
					description: `**From:** ${submission.name} (${submission.email})${submission.company ? `\n**Company:** ${submission.company}` : ''}${submission.phone ? `\n**Phone:** ${submission.phone}` : ''}\n\n---\n\n${submission.message}${submission.orderId ? `\n\n**Order/Project ID:** ${submission.orderId}` : ''}${submission.urgency ? `\n**Urgency:** ${submission.urgency}` : ''}`,
					priority: priority as any,
					category: submission.topic,
					createdById: locals.profile.id,
					scope: 'organization'
				})
				.returning({ id: tickets.id, ticketNumber: tickets.ticketNumber });
			
			// Update the submission with ticket reference
			await db
				.update(contactSubmissions)
				.set({
					ticketId: newTicket.id,
					convertedToTicketAt: new Date(),
					status: 'replied'
				})
				.where(eq(contactSubmissions.id, submissionId));
			
			return { 
				success: true, 
				ticketId: newTicket.id,
				ticketNumber: newTicket.ticketNumber
			};
		} catch (error) {
			console.error('Failed to convert to ticket:', error);
			return fail(500, { error: 'Failed to create ticket' });
		}
	},
	
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		
		if (!id) {
			return fail(400, { error: 'Missing submission ID' });
		}
		
		const db = createDb();
		
		await db
			.delete(contactSubmissions)
			.where(eq(contactSubmissions.id, id));
		
		return { success: true };
	},
	
	markAsSpam: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		
		if (!id) {
			return fail(400, { error: 'Missing submission ID' });
		}
		
		const db = createDb();
		
		await db
			.update(contactSubmissions)
			.set({ status: 'spam' })
			.where(eq(contactSubmissions.id, id));
		
		return { success: true };
	}
};
