import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDb } from '$lib/server/db';
import { contactSubmissions } from '$lib/server/db/schema';
import { siteConfig } from '$lib/config/site';
import { logActivity } from '$lib/server/activity-logger';

interface ContactFormData {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    message?: string;
    topic?: 'quote' | 'support' | 'general' | 'partnership' | 'feedback';
    subject?: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
    orderId?: string;
    urgency?: string;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
    try {
        const body = await request.json() as ContactFormData;
        const {
            name,
            email,
            company,
            phone,
            message,
            topic = 'general',
            subject,
            projectType,
            budget,
            timeline,
            orderId,
            urgency
        } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return json(
                { error: 'Missing required fields: name, email, and message are required' },
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

        // Validate topic if provided
        const validTopics = ['quote', 'support', 'general', 'partnership', 'feedback'];
        if (topic && !validTopics.includes(topic)) {
            return json(
                { error: 'Invalid topic' },
                { status: 400 }
            );
        }

        // Get request metadata
        let ipAddress: string | null = null;
        try {
            ipAddress = getClientAddress();
        } catch {
            // IP address not available
        }

        const userAgent = request.headers.get('user-agent');
        const referrer = request.headers.get('referer');

        // Create per-request database connection
        const db = createDb();

        // Store in database
        const [submission] = await db.insert(contactSubmissions).values({
            name,
            email,
            company: company || null,
            phone: phone || null,
            topic: topic as 'quote' | 'support' | 'general' | 'partnership' | 'feedback',
            subject: subject || null,
            message,
            projectType: projectType || null,
            budget: budget || null,
            timeline: timeline || null,
            orderId: orderId || null,
            urgency: urgency || null,
            source: 'website',
            ipAddress,
            userAgent,
            referrer
        }).returning({ id: contactSubmissions.id });

        // Log for debugging (can be removed in production)
        console.log('Contact form submission stored:', {
            id: submission.id,
            name,
            email,
            topic,
            timestamp: new Date().toISOString()
        });

        // Log activity
        await logActivity({
            entityType: 'user',
            entityId: submission.id,
            activityType: 'created',
            description: `New ${topic} inquiry from ${name} (${email})`,
            newValues: {
                name,
                email,
                company,
                topic,
                subject
            },
            ipAddress: ipAddress ?? undefined,
            userAgent: userAgent ?? undefined
        });

        // TODO: Send email notification to admin
        // This can be implemented using:
        // 1. Supabase Edge Functions with Resend/SendGrid
        // 2. Direct SMTP via Nodemailer
        // 3. A webhook to a notification service
        // For now, we rely on admin dashboard to view new submissions

        return json({
            success: true,
            message: 'Thank you for your message. We will get back to you within 24 hours!',
            submissionId: submission.id
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return json(
            { error: 'Failed to submit your message. Please try again or email us directly.' },
            { status: 500 }
        );
    }
};
