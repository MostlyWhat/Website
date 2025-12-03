/**
 * ID Generator Utilities
 * Generates human-readable sequential IDs for various entities
 */

import { db } from '$lib/server/db';
import { organizations, projects, tickets } from '$lib/server/db/schema';
import { desc, sql } from 'drizzle-orm';

/**
 * Generate organization number (e.g., ORG-0001)
 */
export async function generateOrgNumber(): Promise<string> {
    const prefix = 'ORG-';

    const [lastOrg] = await db
        .select({ orgNumber: organizations.orgNumber })
        .from(organizations)
        .where(sql`${organizations.orgNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(organizations.orgNumber))
        .limit(1);

    let nextNum = 1;
    if (lastOrg) {
        const match = lastOrg.orgNumber.match(/ORG-(\d+)/);
        if (match) {
            nextNum = parseInt(match[1], 10) + 1;
        }
    }

    return `${prefix}${nextNum.toString().padStart(4, '0')}`;
}

/**
 * Generate project number (e.g., PRJ-2024-00001)
 */
export async function generateProjectNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PRJ-${year}-`;

    const [lastProject] = await db
        .select({ projectNumber: projects.projectNumber })
        .from(projects)
        .where(sql`${projects.projectNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(projects.projectNumber))
        .limit(1);

    let nextNum = 1;
    if (lastProject) {
        const match = lastProject.projectNumber.match(/PRJ-\d{4}-(\d+)/);
        if (match) {
            nextNum = parseInt(match[1], 10) + 1;
        }
    }

    return `${prefix}${nextNum.toString().padStart(5, '0')}`;
}

/**
 * Generate ticket number (e.g., TKT-2024-00001)
 */
export async function generateTicketNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `TKT-${year}-`;

    const [lastTicket] = await db
        .select({ ticketNumber: tickets.ticketNumber })
        .from(tickets)
        .where(sql`${tickets.ticketNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(tickets.ticketNumber))
        .limit(1);

    let nextNum = 1;
    if (lastTicket) {
        const match = lastTicket.ticketNumber.match(/TKT-\d{4}-(\d+)/);
        if (match) {
            nextNum = parseInt(match[1], 10) + 1;
        }
    }

    return `${prefix}${nextNum.toString().padStart(5, '0')}`;
}
