/**
 * Ticket Relationships Helper
 * 
 * Provides functionality for:
 * - Merging duplicate tickets
 * - Managing parent/child relationships
 * - Handling satisfaction surveys
 */

import { createDb } from '$lib/server/db';
import { tickets, ticketComments, ticketSatisfactionSurveys, ticketLinks } from '$lib/server/db/schema';
import { eq, and, isNull, desc, or } from 'drizzle-orm';
import crypto from 'node:crypto';

export interface MergeTicketsOptions {
    sourceTicketId: string;
    targetTicketId: string;
    mergedById: string;
    transferComments?: boolean;
    transferTags?: boolean;
}

export interface MergeTicketsResult {
    success: boolean;
    error?: string;
    targetTicketId?: string;
    mergedCommentCount?: number;
}

/**
 * Merge one ticket into another
 * Transfers comments and marks source as merged
 */
export async function mergeTickets(options: MergeTicketsOptions): Promise<MergeTicketsResult> {
    const { sourceTicketId, targetTicketId, mergedById, transferComments = true, transferTags = true } = options;
    const db = createDb();

    try {
        // Verify both tickets exist and aren't already merged
        const [sourceTicket, targetTicket] = await Promise.all([
            db.select().from(tickets).where(eq(tickets.id, sourceTicketId)).limit(1),
            db.select().from(tickets).where(eq(tickets.id, targetTicketId)).limit(1)
        ]);

        if (!sourceTicket.length) {
            return { success: false, error: 'Source ticket not found' };
        }

        if (!targetTicket.length) {
            return { success: false, error: 'Target ticket not found' };
        }

        if (sourceTicket[0].mergedIntoId) {
            return { success: false, error: 'Source ticket is already merged' };
        }

        if (targetTicket[0].mergedIntoId) {
            return { success: false, error: 'Cannot merge into a ticket that is already merged' };
        }

        // Transfer comments if requested
        let mergedCommentCount = 0;
        if (transferComments) {
            const commentsToTransfer = await db
                .select({ id: ticketComments.id })
                .from(ticketComments)
                .where(eq(ticketComments.ticketId, sourceTicketId));

            mergedCommentCount = commentsToTransfer.length;

            if (mergedCommentCount > 0) {
                await db
                    .update(ticketComments)
                    .set({ ticketId: targetTicketId })
                    .where(eq(ticketComments.ticketId, sourceTicketId));
            }
        }

        // Transfer and merge tags if requested
        if (transferTags && sourceTicket[0].tags && sourceTicket[0].tags.length > 0) {
            const existingTags = targetTicket[0].tags || [];
            const sourceTags = sourceTicket[0].tags || [];
            const mergedTags = [...new Set([...existingTags, ...sourceTags])];

            await db
                .update(tickets)
                .set({ tags: mergedTags })
                .where(eq(tickets.id, targetTicketId));
        }

        // Mark source ticket as merged
        await db
            .update(tickets)
            .set({
                mergedIntoId: targetTicketId,
                mergedAt: new Date(),
                mergedById,
                status: 'closed',
                updatedAt: new Date()
            })
            .where(eq(tickets.id, sourceTicketId));

        return {
            success: true,
            targetTicketId,
            mergedCommentCount
        };
    } catch (error) {
        console.error('Error merging tickets:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Get all tickets merged into a specific ticket
 */
export async function getMergedTickets(ticketId: string) {
    const db = createDb();

    return await db
        .select()
        .from(tickets)
        .where(eq(tickets.mergedIntoId, ticketId))
        .orderBy(desc(tickets.mergedAt));
}

/**
 * Set parent/child relationship
 */
export async function setParentTicket(childTicketId: string, parentTicketId: string | null): Promise<{
    success: boolean;
    error?: string;
}> {
    const db = createDb();

    try {
        // If setting a parent, verify it exists and isn't merged
        if (parentTicketId) {
            const [parentTicket] = await db
                .select()
                .from(tickets)
                .where(eq(tickets.id, parentTicketId))
                .limit(1);

            if (!parentTicket) {
                return { success: false, error: 'Parent ticket not found' };
            }

            if (parentTicket.mergedIntoId) {
                return { success: false, error: 'Cannot use a merged ticket as parent' };
            }

            // Verify child exists
            const [childTicket] = await db
                .select()
                .from(tickets)
                .where(eq(tickets.id, childTicketId))
                .limit(1);

            if (!childTicket) {
                return { success: false, error: 'Child ticket not found' };
            }
        }

        await db
            .update(tickets)
            .set({
                parentTicketId,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, childTicketId));

        return { success: true };
    } catch (error) {
        console.error('Error setting parent ticket:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Get child tickets of a parent ticket
 */
export async function getChildTickets(parentTicketId: string) {
    const db = createDb();

    return await db
        .select()
        .from(tickets)
        .where(
            and(
                eq(tickets.parentTicketId, parentTicketId),
                isNull(tickets.mergedIntoId) // Exclude merged tickets
            )
        )
        .orderBy(tickets.createdAt);
}

/**
 * Get parent ticket hierarchy (ancestors)
 */
export async function getParentHierarchy(ticketId: string): Promise<Array<typeof tickets.$inferSelect>> {
    const db = createDb();
    const hierarchy: Array<typeof tickets.$inferSelect> = [];
    let currentId: string | null = ticketId;
    const maxDepth = 10; // Prevent infinite loops
    let depth = 0;

    while (currentId && depth < maxDepth) {
        const [ticket] = await db
            .select()
            .from(tickets)
            .where(eq(tickets.id, currentId))
            .limit(1);

        if (!ticket || !ticket.parentTicketId) {
            break;
        }

        const [parent] = await db
            .select()
            .from(tickets)
            .where(eq(tickets.id, ticket.parentTicketId))
            .limit(1);

        if (parent) {
            hierarchy.unshift(parent); // Add to beginning
            currentId = parent.parentTicketId;
        } else {
            break;
        }

        depth++;
    }

    return hierarchy;
}

/**
 * Generate satisfaction survey token
 */
function generateSurveyToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Create satisfaction survey for a resolved ticket
 */
export async function createSatisfactionSurvey(
    ticketId: string,
    customerId: string
): Promise<{
    success: boolean;
    surveyToken?: string;
    error?: string;
}> {
    const db = createDb();

    try {
        // Check if survey already exists
        const [existing] = await db
            .select()
            .from(ticketSatisfactionSurveys)
            .where(eq(ticketSatisfactionSurveys.ticketId, ticketId))
            .limit(1);

        if (existing) {
            return {
                success: false,
                error: 'Survey already exists for this ticket'
            };
        }

        const surveyToken = generateSurveyToken();

        await db.insert(ticketSatisfactionSurveys).values({
            ticketId,
            customerId,
            surveyToken,
            rating: 0, // Will be set when customer responds
            surveySentAt: new Date()
        });

        return {
            success: true,
            surveyToken
        };
    } catch (error) {
        console.error('Error creating satisfaction survey:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Submit satisfaction survey response
 */
export async function submitSatisfactionSurvey(
    surveyToken: string,
    data: {
        rating: number;
        feedback?: string;
        responseTimeRating?: number;
        resolutionQualityRating?: number;
        staffProfessionalismRating?: number;
        wouldRecommend?: boolean;
    }
): Promise<{
    success: boolean;
    error?: string;
}> {
    const db = createDb();

    try {
        // Find survey by token
        const [survey] = await db
            .select()
            .from(ticketSatisfactionSurveys)
            .where(eq(ticketSatisfactionSurveys.surveyToken, surveyToken))
            .limit(1);

        if (!survey) {
            return {
                success: false,
                error: 'Survey not found'
            };
        }

        if (survey.respondedAt) {
            return {
                success: false,
                error: 'Survey has already been completed'
            };
        }

        // Validate rating
        if (data.rating < 1 || data.rating > 5) {
            return {
                success: false,
                error: 'Rating must be between 1 and 5'
            };
        }

        await db
            .update(ticketSatisfactionSurveys)
            .set({
                rating: data.rating,
                feedback: data.feedback,
                responseTimeRating: data.responseTimeRating,
                resolutionQualityRating: data.resolutionQualityRating,
                staffProfessionalismRating: data.staffProfessionalismRating,
                wouldRecommend: data.wouldRecommend,
                respondedAt: new Date()
            })
            .where(eq(ticketSatisfactionSurveys.id, survey.id));

        return {
            success: true
        };
    } catch (error) {
        console.error('Error submitting satisfaction survey:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Get satisfaction survey by token
 */
export async function getSurveyByToken(surveyToken: string) {
    const db = createDb();

    const [survey] = await db
        .select()
        .from(ticketSatisfactionSurveys)
        .where(eq(ticketSatisfactionSurveys.surveyToken, surveyToken))
        .limit(1);

    return survey || null;
}

/**
 * Get average satisfaction rating for a time period
 */
export async function getAverageSatisfaction(
    startDate?: Date,
    endDate?: Date
): Promise<{
    averageRating: number;
    totalResponses: number;
    wouldRecommendPercentage: number;
}> {
    const db = createDb();

    // This would typically use aggregation queries
    // For simplicity, fetching all and calculating in JS
    let query = db
        .select()
        .from(ticketSatisfactionSurveys)
        .where(eq(ticketSatisfactionSurveys.respondedAt, ticketSatisfactionSurveys.respondedAt)); // Filter out nulls

    const surveys = await query;

    if (surveys.length === 0) {
        return {
            averageRating: 0,
            totalResponses: 0,
            wouldRecommendPercentage: 0
        };
    }

    const totalRating = surveys.reduce((sum, s) => sum + s.rating, 0);
    const recommendCount = surveys.filter(s => s.wouldRecommend === true).length;

    return {
        averageRating: totalRating / surveys.length,
        totalResponses: surveys.length,
        wouldRecommendPercentage: (recommendCount / surveys.length) * 100
    };
}

// =============================================================================
// TICKET SPLITTING
// =============================================================================

export interface SplitTicketOptions {
    sourceTicketId: string;
    splitById: string;
    newTickets: Array<{
        subject: string;
        description: string;
        priority?: string;
        categoryId?: string;
        transferComments?: boolean; // If true, will transfer specified comment IDs
        commentIdsToTransfer?: string[];
    }>;
}

export interface SplitTicketResult {
    success: boolean;
    error?: string;
    newTicketIds?: string[];
    sourceTicketId?: string;
}

/**
 * Split one ticket into multiple tickets
 * Creates new tickets and optionally transfers specific comments
 */
export async function splitTicket(options: SplitTicketOptions): Promise<SplitTicketResult> {
    const { sourceTicketId, splitById, newTickets } = options;
    const db = createDb();

    try {
        // Verify source ticket exists
        const sourceTicket = await db
            .select()
            .from(tickets)
            .where(eq(tickets.id, sourceTicketId))
            .limit(1);

        if (!sourceTicket.length) {
            return { success: false, error: 'Source ticket not found' };
        }

        const source = sourceTicket[0];

        // Create new tickets
        const newTicketIds: string[] = [];

        for (const newTicket of newTickets) {
            // Create the new ticket
            const [created] = await db
                .insert(tickets)
                .values({
                    subject: newTicket.subject,
                    description: newTicket.description,
                    priority: (newTicket.priority as any) || source.priority,
                    status: 'open',
                    categoryId: newTicket.categoryId || source.categoryId,
                    organizationId: source.organizationId,
                    createdById: source.createdById,
                    source: source.source,
                    parentTicketId: sourceTicketId, // Link to source as parent
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                .returning({ id: tickets.id });

            if (created?.id) {
                newTicketIds.push(created.id);

                // Transfer specific comments if requested
                if (newTicket.transferComments && newTicket.commentIdsToTransfer && newTicket.commentIdsToTransfer.length > 0) {
                    // Update comments to point to new ticket
                    for (const commentId of newTicket.commentIdsToTransfer) {
                        await db
                            .update(ticketComments)
                            .set({ ticketId: created.id })
                            .where(and(
                                eq(ticketComments.id, commentId),
                                eq(ticketComments.ticketId, sourceTicketId)
                            ));
                    }
                }

                // Add a comment to the new ticket referencing the split
                await db.insert(ticketComments).values({
                    ticketId: created.id,
                    createdById: splitById,
                    content: `This ticket was split from ticket #${source.ticketNumber}`,
                    isInternal: false,
                    createdAt: new Date()
                });
            }
        }

        // Add a comment to the source ticket about the split
        const ticketNumbers = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, newTicketIds[0]));

        await db.insert(ticketComments).values({
            ticketId: sourceTicketId,
            createdById: splitById,
            content: `This ticket has been split into ${newTickets.length} new ticket(s)`,
            isInternal: true,
            createdAt: new Date()
        });

        return {
            success: true,
            newTicketIds,
            sourceTicketId
        };
    } catch (error) {
        console.error('Error splitting ticket:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to split ticket'
        };
    }
}

// =============================================================================
// TICKET LINKING (Non-hierarchical)
// =============================================================================

export type TicketLinkType = 'related' | 'duplicate' | 'blocks' | 'blocked_by' | 'references' | 'referenced_by';

export interface LinkTicketsOptions {
    sourceTicketId: string;
    targetTicketId: string;
    linkType: TicketLinkType;
    createdById: string;
}

export interface LinkTicketsResult {
    success: boolean;
    error?: string;
    linkId?: string;
}

/**
 * Create a link between two tickets
 */
export async function linkTickets(options: LinkTicketsOptions): Promise<LinkTicketsResult> {
    const { sourceTicketId, targetTicketId, linkType, createdById } = options;
    const db = createDb();

    try {
        // Verify both tickets exist
        const [sourceTicket, targetTicket] = await Promise.all([
            db.select().from(tickets).where(eq(tickets.id, sourceTicketId)).limit(1),
            db.select().from(tickets).where(eq(tickets.id, targetTicketId)).limit(1)
        ]);

        if (!sourceTicket.length) {
            return { success: false, error: 'Source ticket not found' };
        }

        if (!targetTicket.length) {
            return { success: false, error: 'Target ticket not found' };
        }

        if (sourceTicketId === targetTicketId) {
            return { success: false, error: 'Cannot link a ticket to itself' };
        }

        // Check if link already exists
        const existingLink = await db
            .select()
            .from(ticketLinks)
            .where(
                and(
                    eq(ticketLinks.sourceTicketId, sourceTicketId),
                    eq(ticketLinks.targetTicketId, targetTicketId),
                    eq(ticketLinks.linkType, linkType)
                )
            )
            .limit(1);

        if (existingLink.length > 0) {
            return { success: false, error: 'This link already exists' };
        }

        // Create the link
        const [created] = await db
            .insert(ticketLinks)
            .values({
                sourceTicketId,
                targetTicketId,
                linkType,
                createdById,
                createdAt: new Date()
            })
            .returning({ id: ticketLinks.id });

        // Add comments to both tickets
        const sourceLinkText = getLinkTypeText(linkType, 'source');
        const targetLinkText = getLinkTypeText(linkType, 'target');

        await Promise.all([
            db.insert(ticketComments).values({
                ticketId: sourceTicketId,
                createdById,
                content: `${sourceLinkText} ticket #${targetTicket[0].ticketNumber}`,
                isInternal: true,
                createdAt: new Date()
            }),
            db.insert(ticketComments).values({
                ticketId: targetTicketId,
                createdById,
                content: `${targetLinkText} ticket #${sourceTicket[0].ticketNumber}`,
                isInternal: true,
                createdAt: new Date()
            })
        ]);

        return {
            success: true,
            linkId: created.id
        };
    } catch (error) {
        console.error('Error linking tickets:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to link tickets'
        };
    }
}

/**
 * Remove a link between two tickets
 */
export async function unlinkTickets(linkId: string, deletedById: string): Promise<LinkTicketsResult> {
    const db = createDb();

    try {
        // Get link details before deleting
        const link = await db
            .select()
            .from(ticketLinks)
            .where(eq(ticketLinks.id, linkId))
            .limit(1);

        if (!link.length) {
            return { success: false, error: 'Link not found' };
        }

        // Delete the link
        await db
            .delete(ticketLinks)
            .where(eq(ticketLinks.id, linkId));

        // Add comments to both tickets
        const [sourceTicket, targetTicket] = await Promise.all([
            db.select().from(tickets).where(eq(tickets.id, link[0].sourceTicketId)).limit(1),
            db.select().from(tickets).where(eq(tickets.id, link[0].targetTicketId)).limit(1)
        ]);

        if (sourceTicket.length && targetTicket.length) {
            await Promise.all([
                db.insert(ticketComments).values({
                    ticketId: link[0].sourceTicketId,
                    createdById: deletedById,
                    content: `Unlinked from ticket #${targetTicket[0].ticketNumber}`,
                    isInternal: true,
                    createdAt: new Date()
                }),
                db.insert(ticketComments).values({
                    ticketId: link[0].targetTicketId,
                    createdById: deletedById,
                    content: `Unlinked from ticket #${sourceTicket[0].ticketNumber}`,
                    isInternal: true,
                    createdAt: new Date()
                })
            ]);
        }

        return { success: true };
    } catch (error) {
        console.error('Error unlinking tickets:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to unlink tickets'
        };
    }
}

/**
 * Get all links for a ticket (both as source and target)
 */
export async function getTicketLinks(ticketId: string) {
    const db = createDb();

    const links = await db
        .select({
            id: ticketLinks.id,
            linkType: ticketLinks.linkType,
            sourceTicketId: ticketLinks.sourceTicketId,
            targetTicketId: ticketLinks.targetTicketId,
            createdAt: ticketLinks.createdAt,
            sourceTicket: {
                ticketNumber: tickets.ticketNumber,
                subject: tickets.subject,
                status: tickets.status
            },
            targetTicket: tickets
        })
        .from(ticketLinks)
        .leftJoin(tickets, eq(ticketLinks.targetTicketId, tickets.id))
        .where(
            or(
                eq(ticketLinks.sourceTicketId, ticketId),
                eq(ticketLinks.targetTicketId, ticketId)
            )
        )
        .orderBy(desc(ticketLinks.createdAt));

    return links;
}

/**
 * Get human-readable link type text
 */
function getLinkTypeText(linkType: TicketLinkType, perspective: 'source' | 'target'): string {
    const texts: Record<TicketLinkType, { source: string; target: string }> = {
        related: { source: 'Related to', target: 'Related to' },
        duplicate: { source: 'Duplicate of', target: 'Has duplicate' },
        blocks: { source: 'Blocks', target: 'Blocked by' },
        blocked_by: { source: 'Blocked by', target: 'Blocks' },
        references: { source: 'References', target: 'Referenced by' },
        referenced_by: { source: 'Referenced by', target: 'References' }
    };

    return texts[linkType][perspective];
}
