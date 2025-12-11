/**
 * Project Notes Helper
 * 
 * Provides functionality for managing internal staff notes on projects
 */

import { createDb } from '$lib/server/db';
import { projectNotes, profiles } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface CreateNoteOptions {
    projectId: string;
    content: string;
    createdById: string;
}

export interface CreateNoteResult {
    success: boolean;
    error?: string;
    noteId?: string;
}

/**
 * Create a new project note
 */
export async function createProjectNote(options: CreateNoteOptions): Promise<CreateNoteResult> {
    const { projectId, content, createdById } = options;
    const db = createDb();

    try {
        if (!content.trim()) {
            return { success: false, error: 'Note content cannot be empty' };
        }

        const [created] = await db
            .insert(projectNotes)
            .values({
                projectId,
                content: content.trim(),
                createdById,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning({ id: projectNotes.id });

        return {
            success: true,
            noteId: created.id
        };
    } catch (error) {
        console.error('Error creating project note:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create note'
        };
    }
}

/**
 * Update a project note
 */
export async function updateProjectNote(noteId: string, content: string): Promise<CreateNoteResult> {
    const db = createDb();

    try {
        if (!content.trim()) {
            return { success: false, error: 'Note content cannot be empty' };
        }

        await db
            .update(projectNotes)
            .set({
                content: content.trim(),
                updatedAt: new Date()
            })
            .where(eq(projectNotes.id, noteId));

        return { success: true };
    } catch (error) {
        console.error('Error updating project note:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update note'
        };
    }
}

/**
 * Delete a project note
 */
export async function deleteProjectNote(noteId: string): Promise<CreateNoteResult> {
    const db = createDb();

    try {
        await db
            .delete(projectNotes)
            .where(eq(projectNotes.id, noteId));

        return { success: true };
    } catch (error) {
        console.error('Error deleting project note:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete note'
        };
    }
}

/**
 * Get all notes for a project
 */
export async function getProjectNotes(projectId: string) {
    const db = createDb();

    const notes = await db
        .select({
            id: projectNotes.id,
            content: projectNotes.content,
            createdAt: projectNotes.createdAt,
            updatedAt: projectNotes.updatedAt,
            createdBy: {
                id: profiles.id,
                name: sql<string>`COALESCE(${profiles.displayName}, ${profiles.firstName} || ' ' || ${profiles.lastName}, ${profiles.email})`,
                email: profiles.email,
                role: profiles.role
            }
        })
        .from(projectNotes)
        .leftJoin(profiles, eq(projectNotes.createdById, profiles.id))
        .where(eq(projectNotes.projectId, projectId))
        .orderBy(desc(projectNotes.createdAt));

    return notes;
}

/**
 * Get a single note by ID
 */
export async function getProjectNoteById(noteId: string) {
    const db = createDb();

    const note = await db
        .select({
            id: projectNotes.id,
            projectId: projectNotes.projectId,
            content: projectNotes.content,
            createdById: projectNotes.createdById,
            createdAt: projectNotes.createdAt,
            updatedAt: projectNotes.updatedAt
        })
        .from(projectNotes)
        .where(eq(projectNotes.id, noteId))
        .limit(1);

    return note[0] || null;
}
