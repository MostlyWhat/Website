import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json() as { name?: string; email?: string; company?: string; message?: string; topic?: string };
        const { name, email, company, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // In a real application, you would:
        // 1. Send an email notification
        // 2. Store the submission in a database
        // 3. Integrate with a CRM or ticketing system

        // For now, we'll just log the submission and return success
        console.log('Contact form submission:', {
            name,
            email,
            company: company || 'Not provided',
            message,
            timestamp: new Date().toISOString()
        });

        // Simulate a small delay to make it feel more realistic
        await new Promise(resolve => setTimeout(resolve, 500));

        return json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
};
