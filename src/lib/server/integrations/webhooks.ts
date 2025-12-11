/**
 * Webhook Service
 * 
 * Manages webhook subscriptions and deliveries for external integrations
 */

import { createDb } from '$lib/server/db';
import { webhooks, webhookDeliveries } from '$lib/server/db/schema';
import { eq, and, or, lte } from 'drizzle-orm';
import crypto from 'node:crypto';

export type WebhookEvent =
    | 'ticket.created'
    | 'ticket.updated'
    | 'ticket.status_changed'
    | 'ticket.assigned'
    | 'ticket.resolved'
    | 'ticket.closed'
    | 'project.created'
    | 'project.updated'
    | 'project.status_changed'
    | 'invoice.created'
    | 'invoice.sent'
    | 'invoice.paid'
    | 'invoice.overdue'
    | 'payment.received'
    | 'payment.failed';

export interface WebhookPayload {
    event: WebhookEvent;
    timestamp: string;
    data: any;
    organizationId?: string;
    projectId?: string;
}

/**
 * Create a new webhook subscription
 */
export async function createWebhook(options: {
    url: string;
    events: WebhookEvent[];
    organizationId?: string;
    projectId?: string;
    description?: string;
    headers?: Record<string, string>;
    createdById: string;
}) {
    const db = createDb();

    // Generate a secret for signature verification
    const secret = crypto.randomBytes(32).toString('hex');

    const [webhook] = await db
        .insert(webhooks)
        .values({
            url: options.url,
            secret,
            events: options.events,
            organizationId: options.organizationId,
            projectId: options.projectId,
            description: options.description,
            headers: options.headers || {},
            createdById: options.createdById,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning();

    return { webhook, secret };
}

/**
 * Get all active webhooks for an event
 */
async function getActiveWebhooksForEvent(
    event: WebhookEvent,
    filters?: {
        organizationId?: string;
        projectId?: string;
    }
): Promise<any[]> {
    const db = createDb();

    const conditions = [eq(webhooks.isActive, true)];

    // Filter by organization if provided
    if (filters?.organizationId) {
        conditions.push(
            or(
                eq(webhooks.organizationId, filters.organizationId),
                eq(webhooks.organizationId, null as any)
            ) as any
        );
    }

    // Filter by project if provided
    if (filters?.projectId) {
        conditions.push(
            or(
                eq(webhooks.projectId, filters.projectId),
                eq(webhooks.projectId, null as any)
            ) as any
        );
    }

    const activeWebhooks = await db
        .select()
        .from(webhooks)
        .where(and(...conditions));

    // Filter webhooks that are subscribed to this event
    return activeWebhooks.filter((webhook) => webhook.events.includes(event));
}

/**
 * Generate HMAC signature for webhook payload
 */
function generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Deliver a webhook
 */
async function deliverWebhook(webhookId: string, payload: WebhookPayload): Promise<void> {
    const db = createDb();

    // Get webhook details
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, webhookId)).limit(1);

    if (!webhook || !webhook.isActive) {
        return;
    }

    const payloadString = JSON.stringify(payload);
    const signature = generateSignature(payloadString, webhook.secret);

    // Create delivery record
    const [delivery] = await db
        .insert(webhookDeliveries)
        .values({
            webhookId,
            event: payload.event,
            payload: payload as any,
            status: 'pending',
            attempts: 0,
            createdAt: new Date()
        })
        .returning();

    try {
        // Prepare headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': payload.event,
            'X-Webhook-Timestamp': payload.timestamp,
            'User-Agent': 'MostlyWhat-Webhooks/1.0',
            ...webhook.headers
        };

        // Make the HTTP request
        const response = await fetch(webhook.url, {
            method: 'POST',
            headers,
            body: payloadString,
            signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        const responseBody = await response.text();

        // Update delivery record
        await db
            .update(webhookDeliveries)
            .set({
                status: response.ok ? 'success' : 'failed',
                responseCode: response.status,
                responseBody: responseBody.substring(0, 1000), // Limit stored response
                attempts: 1,
                deliveredAt: new Date()
            })
            .where(eq(webhookDeliveries.id, delivery.id));

        // Update webhook stats
        await db
            .update(webhooks)
            .set({
                lastTriggeredAt: new Date(),
                totalDeliveries: webhook.totalDeliveries + 1,
                failedDeliveries: response.ok ? webhook.failedDeliveries : webhook.failedDeliveries + 1
            })
            .where(eq(webhooks.id, webhookId));

        // Schedule retry if failed
        if (!response.ok && webhook.maxRetries > 0) {
            await scheduleRetry(delivery.id, webhook.retryDelay);
        }
    } catch (error) {
        console.error('Webhook delivery error:', error);

        // Update delivery record with error
        await db
            .update(webhookDeliveries)
            .set({
                status: 'failed',
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                attempts: 1
            })
            .where(eq(webhookDeliveries.id, delivery.id));

        // Update webhook stats
        await db
            .update(webhooks)
            .set({
                failedDeliveries: webhook.failedDeliveries + 1
            })
            .where(eq(webhooks.id, webhookId));

        // Schedule retry
        if (webhook.maxRetries > 0) {
            await scheduleRetry(delivery.id, webhook.retryDelay);
        }
    }
}

/**
 * Schedule a retry for a failed webhook delivery
 */
async function scheduleRetry(deliveryId: string, delaySeconds: number): Promise<void> {
    const db = createDb();

    const nextRetryAt = new Date(Date.now() + delaySeconds * 1000);

    await db
        .update(webhookDeliveries)
        .set({ nextRetryAt })
        .where(eq(webhookDeliveries.id, deliveryId));
}

/**
 * Process webhook retries
 * This should be called by a cron job
 */
export async function processWebhookRetries(): Promise<void> {
    const db = createDb();

    const now = new Date();

    // Get failed deliveries that are ready for retry
    const pendingRetries = await db
        .select()
        .from(webhookDeliveries)
        .where(and(eq(webhookDeliveries.status, 'failed'), lte(webhookDeliveries.nextRetryAt, now)))
        .limit(100);

    for (const delivery of pendingRetries) {
        // Get the webhook to check max retries
        const [webhook] = await db
            .select()
            .from(webhooks)
            .where(eq(webhooks.id, delivery.webhookId))
            .limit(1);

        if (!webhook || delivery.attempts >= webhook.maxRetries) {
            // Max retries exceeded, mark as permanently failed
            await db
                .update(webhookDeliveries)
                .set({ status: 'failed', nextRetryAt: null })
                .where(eq(webhookDeliveries.id, delivery.id));
            continue;
        }

        // Retry the delivery
        try {
            const signature = generateSignature(JSON.stringify(delivery.payload), webhook.secret);

            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': signature,
                    'X-Webhook-Event': delivery.event,
                    ...webhook.headers
                },
                body: JSON.stringify(delivery.payload),
                signal: AbortSignal.timeout(30000)
            });

            const responseBody = await response.text();

            await db
                .update(webhookDeliveries)
                .set({
                    status: response.ok ? 'success' : 'failed',
                    responseCode: response.status,
                    responseBody: responseBody.substring(0, 1000),
                    attempts: delivery.attempts + 1,
                    deliveredAt: response.ok ? new Date() : delivery.deliveredAt,
                    nextRetryAt: response.ok ? null : new Date(Date.now() + webhook.retryDelay * 1000)
                })
                .where(eq(webhookDeliveries.id, delivery.id));
        } catch (error) {
            await db
                .update(webhookDeliveries)
                .set({
                    status: 'failed',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error',
                    attempts: delivery.attempts + 1,
                    nextRetryAt: new Date(Date.now() + webhook.retryDelay * 1000)
                })
                .where(eq(webhookDeliveries.id, delivery.id));
        }
    }
}

/**
 * Trigger webhooks for an event
 * This is the main function to call when an event occurs
 */
export async function triggerWebhooks(
    event: WebhookEvent,
    data: any,
    filters?: {
        organizationId?: string;
        projectId?: string;
    }
): Promise<void> {
    const activeWebhooks = await getActiveWebhooksForEvent(event, filters);

    const payload: WebhookPayload = {
        event,
        timestamp: new Date().toISOString(),
        data,
        organizationId: filters?.organizationId,
        projectId: filters?.projectId
    };

    // Deliver to all matching webhooks
    const deliveryPromises = activeWebhooks.map((webhook) =>
        deliverWebhook(webhook.id, payload).catch((error) => {
            console.error(`Failed to deliver webhook ${webhook.id}:`, error);
        })
    );

    // Fire and forget (don't block on webhook deliveries)
    void Promise.allSettled(deliveryPromises);
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(webhookId: string): Promise<void> {
    const db = createDb();

    await db.delete(webhooks).where(eq(webhooks.id, webhookId));
}

/**
 * Update webhook status
 */
export async function updateWebhookStatus(webhookId: string, isActive: boolean): Promise<void> {
    const db = createDb();

    await db
        .update(webhooks)
        .set({ isActive, updatedAt: new Date() })
        .where(eq(webhooks.id, webhookId));
}

/**
 * Get webhook statistics
 */
export async function getWebhookStats(webhookId: string) {
    const db = createDb();

    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, webhookId)).limit(1);

    if (!webhook) {
        return null;
    }

    // Get recent deliveries
    const recentDeliveries = await db
        .select()
        .from(webhookDeliveries)
        .where(eq(webhookDeliveries.webhookId, webhookId))
        .orderBy(webhookDeliveries.createdAt)
        .limit(100);

    const successCount = recentDeliveries.filter((d) => d.status === 'success').length;
    const failedCount = recentDeliveries.filter((d) => d.status === 'failed').length;
    const pendingCount = recentDeliveries.filter((d) => d.status === 'pending').length;

    return {
        webhook,
        stats: {
            totalDeliveries: webhook.totalDeliveries,
            failedDeliveries: webhook.failedDeliveries,
            successRate:
                webhook.totalDeliveries > 0
                    ? ((webhook.totalDeliveries - webhook.failedDeliveries) / webhook.totalDeliveries) * 100
                    : 0,
            recentStats: {
                success: successCount,
                failed: failedCount,
                pending: pendingCount
            }
        },
        recentDeliveries: recentDeliveries.slice(0, 10)
    };
}
