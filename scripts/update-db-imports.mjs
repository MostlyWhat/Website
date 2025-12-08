#!/usr/bin/env node
/**
 * Script to update all database imports from { db } to { createDb }
 * and add const db = createDb() initialization within functions.
 * for Cloudflare Workers compatibility.
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
        } else if (f.endsWith('.ts') || f.endsWith('.svelte')) {
            files.push(fp);
        }
    });
    
    return files;
}

const files = walk(srcDir);
let updated = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let modified = false;
    
    // Check if file uses createDb but doesn't have const db = createDb()
    if (content.includes("import { createDb } from '$lib/server/db'") && 
        !content.includes('const db = createDb()') &&
        !content.includes('locals.db') &&
        content.includes('await db.') || content.includes('await db\n') || content.includes('db.select') || content.includes('db.insert') || content.includes('db.update') || content.includes('db.delete') || content.includes('db.query')) {
        
        // Find load function and add db initialization
        const loadMatch = content.match(/export const load[^{]*{\s*/);
        if (loadMatch) {
            const insertPos = loadMatch.index + loadMatch[0].length;
            // Check if db is already defined in the function
            const funcEnd = content.indexOf('};', insertPos);
            const funcBody = content.substring(insertPos, funcEnd);
            if (!funcBody.includes('const db = createDb()') && !funcBody.includes('locals.db')) {
                content = content.substring(0, insertPos) + 
                    '\n    // Create per-request database connection for Cloudflare Workers\n    const db = createDb();\n' +
                    content.substring(insertPos);
                modified = true;
            }
        }
        
        // Find actions and add db initialization
        const actionsMatch = content.matchAll(/(\w+):\s*async\s*\([^)]*\)\s*=>\s*{\s*/g);
        for (const match of actionsMatch) {
            if (match[1] === 'load') continue; // Skip load function
            const insertPos = match.index + match[0].length;
            const funcEnd = content.indexOf('};', insertPos);
            if (funcEnd === -1) continue;
            const funcBody = content.substring(insertPos, funcEnd);
            if (!funcBody.includes('const db = createDb()') && !funcBody.includes('locals.db') && funcBody.includes('db.')) {
                content = content.substring(0, insertPos) + 
                    '\n        // Create per-request database connection\n        const db = createDb();\n' +
                    content.substring(insertPos);
                modified = true;
            }
        }
    }
    
    if (modified) {
        fs.writeFileSync(f, content);
        console.log('Updated:', path.relative(srcDir, f));
        updated++;
    }
});

console.log(`\nTotal files updated: ${updated}`);
