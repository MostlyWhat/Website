#!/usr/bin/env node
/**
 * Script to add const db = createDb() to all functions that use db
 * for Cloudflare Workers compatibility.
 * 
 * Run: node scripts/add-db-initialization.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

function walk(dir) {
    const files = [];
    const list = fs.readdirSync(dir);

    list.forEach(f => {
        const fp = path.join(dir, f);
        const stat = fs.statSync(fp);

        if (stat && stat.isDirectory()) {
            files.push(...walk(fp));
        } else if (f.endsWith('.ts')) {
            files.push(fp);
        }
    });

    return files;
}

// Files to skip (already properly handled)
const skipFiles = [
    'src/lib/server/db/index.ts',
    'src/hooks.server.ts',
    'src/lib/server/auth.ts',
    'src/lib/server/activity-logger.ts',
];

const files = walk(srcDir);
let updated = 0;
let errors = [];

files.forEach(f => {
    const relativePath = path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/');

    // Skip files that are already handled
    if (skipFiles.some(skip => relativePath.includes(skip.replace('src/', '')))) {
        return;
    }

    let content = fs.readFileSync(f, 'utf8');

    // Check if file imports createDb and uses db without initializing it
    if (!content.includes("import { createDb } from '$lib/server/db'")) {
        return;
    }

    // Skip if already has const db = createDb() 
    if (content.includes('const db = createDb()')) {
        return;
    }

    // Skip if using locals.db
    if (content.includes('locals.db') && !content.includes('await db.')) {
        return;
    }

    // Check if file actually uses db
    if (!content.includes('await db.') && !content.includes('db.select') &&
        !content.includes('db.insert') && !content.includes('db.update') &&
        !content.includes('db.delete') && !content.includes('db.query')) {
        return;
    }

    let modified = false;

    // Pattern 1: export const load: PageServerLoad = async ({ ... }) => {
    content = content.replace(
        /(export const load[^=]*=\s*async\s*\([^)]*\)\s*=>\s*\{)(\s*)/g,
        (match, p1, p2) => {
            if (content.indexOf('const db = createDb()', content.indexOf(match)) < content.indexOf(match) + 200) {
                return match; // Already has db initialization nearby
            }
            modified = true;
            return p1 + '\n    // Create per-request database connection for Cloudflare Workers\n    const db = createDb();\n';
        }
    );

    // Pattern 2: export const actions: Actions = { actionName: async ({ ... }) => {
    content = content.replace(
        /((?:default|[a-zA-Z_]+):\s*async\s*\([^)]*\)\s*=>\s*\{)(\s*)(?![\s\S]{0,50}const db = createDb)/g,
        (match, p1, p2) => {
            modified = true;
            return p1 + '\n        // Create per-request database connection\n        const db = createDb();\n';
        }
    );

    // Pattern 3: export const GET/POST/PUT/DELETE: RequestHandler = async ({ ... }) => {
    content = content.replace(
        /(export const (?:GET|POST|PUT|DELETE|PATCH)[^=]*=\s*async\s*\([^)]*\)\s*=>\s*\{)(\s*)(?![\s\S]{0,50}const db = createDb)/g,
        (match, p1, p2) => {
            modified = true;
            return p1 + '\n    // Create per-request database connection\n    const db = createDb();\n';
        }
    );

    // Pattern 4: async function funcName(...) {
    content = content.replace(
        /(async function\s+\w+\s*\([^)]*\)\s*(?::\s*Promise<[^>]+>)?\s*\{)(\s*)(?![\s\S]{0,50}const db = createDb)/g,
        (match, p1, p2) => {
            modified = true;
            return p1 + '\n    const db = createDb();\n';
        }
    );

    if (modified) {
        fs.writeFileSync(f, content);
        console.log('Updated:', relativePath);
        updated++;
    }
});

console.log(`\nTotal files updated: ${updated}`);
if (errors.length > 0) {
    console.log('\nErrors:', errors);
}
