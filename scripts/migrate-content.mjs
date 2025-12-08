/**
 * Content Migration Script
 *
 * This script migrates existing markdown content (blog posts and portfolio projects)
 * from static MD files to the database. Run this once after applying migrations.
 *
 * Prerequisites:
 *   - Install gray-matter: pnpm add -D gray-matter
 *
 * Usage:
 *   node scripts/migrate-content.mjs              # Interactive mode (prompts for environment)
 *   node scripts/migrate-content.mjs --local      # Use local Supabase
 *   node scripts/migrate-content.mjs --production # Use production Supabase (requires env vars)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local Supabase defaults (from `supabase start`)
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321';
const LOCAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const LOCAL_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    return {
        local: args.includes('--local') || args.includes('-l'),
        production: args.includes('--production') || args.includes('-p'),
        help: args.includes('--help') || args.includes('-h')
    };
}

/**
 * Prompt user for environment selection
 */
async function promptEnvironment() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        console.log('\n📦 Content Migration Script\n');
        console.log('Select target environment:');
        console.log('  1. Local Supabase (http://127.0.0.1:54321)');
        console.log('  2. Production Supabase (requires environment variables)\n');
        
        rl.question('Enter choice [1/2]: ', (answer) => {
            rl.close();
            resolve(answer.trim() === '2' ? 'production' : 'local');
        });
    });
}

/**
 * Get Supabase configuration based on environment
 */
function getSupabaseConfig(environment) {
    if (environment === 'local') {
        console.log('\n🏠 Using LOCAL Supabase instance');
        console.log(`   URL: ${LOCAL_SUPABASE_URL}\n`);
        return {
            url: LOCAL_SUPABASE_URL,
            serviceKey: LOCAL_SUPABASE_SERVICE_KEY
        };
    }

    // Production - use environment variables
    const url = process.env.PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
        console.error('\n❌ Production mode requires environment variables:');
        console.error('   - PUBLIC_SUPABASE_URL');
        console.error('   - SUPABASE_SERVICE_ROLE_KEY\n');
        console.error('Example:');
        console.error('   $env:PUBLIC_SUPABASE_URL="https://your-project.supabase.co"');
        console.error('   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
        console.error('   node scripts/migrate-content.mjs --production\n');
        process.exit(1);
    }

    console.log('\n🌐 Using PRODUCTION Supabase instance');
    console.log(`   URL: ${url}\n`);
    return { url, serviceKey };
}

/**
 * Initialize Supabase client
 */
async function initSupabase() {
    const args = parseArgs();

    if (args.help) {
        console.log(`
Content Migration Script

Usage:
  node scripts/migrate-content.mjs [options]

Options:
  --local, -l       Use local Supabase instance (http://127.0.0.1:54321)
  --production, -p  Use production Supabase (requires env vars)
  --help, -h        Show this help message

Environment Variables (for production):
  PUBLIC_SUPABASE_URL         Your Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY   Service role key (admin access)
`);
        process.exit(0);
    }

    let environment;
    if (args.local) {
        environment = 'local';
    } else if (args.production) {
        environment = 'production';
    } else {
        environment = await promptEnvironment();
    }

    const config = getSupabaseConfig(environment);
    return createClient(config.url, config.serviceKey);
}

let supabase;

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
    const { data, content: body } = matter(content);
    return { frontmatter: data, body };
}

/**
 * Read all markdown files from a directory
 */
function readMarkdownFiles(dir) {
    const files = [];
    const absoluteDir = path.resolve(__dirname, '..', dir);

    if (!fs.existsSync(absoluteDir)) {
        console.warn(`Directory not found: ${absoluteDir}`);
        return files;
    }

    for (const file of fs.readdirSync(absoluteDir)) {
        if (file.endsWith('.md')) {
            const filePath = path.join(absoluteDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const { frontmatter, body } = parseFrontmatter(content);
            files.push({
                filename: file,
                slug: file.replace('.md', ''),
                frontmatter,
                content: body
            });
        }
    }

    return files;
}

/**
 * Migrate blog posts
 */
async function migrateBlogPosts() {
    console.log('\n📝 Migrating blog posts...');

    const posts = readMarkdownFiles('src/lib/content/blog');

    for (const post of posts) {
        const { frontmatter, content, slug } = post;

        // Check if post already exists
        const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            console.log(`  ⏭️  Skipping "${frontmatter.title}" (already exists)`);
            continue;
        }

        const blogPost = {
            slug: frontmatter.slug || slug,
            title: frontmatter.title,
            content: content,
            excerpt: frontmatter.excerpt,
            category: frontmatter.category || 'General',
            tags: frontmatter.tags || [],
            featured_image: frontmatter.featuredImage || null,
            meta_title: frontmatter.metaTitle || frontmatter.title,
            meta_description: frontmatter.metaDescription || frontmatter.excerpt,
            read_time: frontmatter.readTime || '5 min read',
            status: 'published',
            is_featured: frontmatter.featured || false,
            published_at: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString()
        };

        const { error } = await supabase.from('blog_posts').insert(blogPost);

        if (error) {
            console.error(`  ❌ Failed to migrate "${frontmatter.title}":`, error.message);
        } else {
            console.log(`  ✅ Migrated "${frontmatter.title}"`);
        }
    }
}

/**
 * Migrate portfolio projects
 */
async function migratePortfolioProjects() {
    console.log('\n🎨 Migrating portfolio projects...');

    const projects = readMarkdownFiles('src/lib/content/projects');

    for (const project of projects) {
        const { frontmatter, content, slug } = project;

        // Check if project already exists
        const { data: existing } = await supabase
            .from('portfolio_projects')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            console.log(`  ⏭️  Skipping "${frontmatter.title}" (already exists)`);
            continue;
        }

        const portfolioProject = {
            slug: frontmatter.slug || slug,
            title: frontmatter.title,
            client: frontmatter.client || null,
            category: frontmatter.category || 'General',
            year: frontmatter.year || new Date().getFullYear().toString(),
            description: frontmatter.description || null,
            tags: frontmatter.tags || [],
            content: content,
            featured_image: frontmatter.featuredImage || null,
            gallery_images: frontmatter.gallery || [],
            testimonial: frontmatter.testimonial || null,
            meta_title: frontmatter.metaTitle || frontmatter.title,
            meta_description: frontmatter.metaDescription || frontmatter.description,
            status: 'published',
            is_featured: frontmatter.featured || false,
            published_at: new Date().toISOString()
        };

        const { error } = await supabase.from('portfolio_projects').insert(portfolioProject);

        if (error) {
            console.error(`  ❌ Failed to migrate "${frontmatter.title}":`, error.message);
        } else {
            console.log(`  ✅ Migrated "${frontmatter.title}"`);
        }
    }
}

/**
 * Main migration function
 */
async function main() {
    // Initialize Supabase client with environment selection
    supabase = await initSupabase();

    console.log('🚀 Starting content migration...\n');
    console.log('Source: src/lib/content/');
    console.log('Destination: Supabase database\n');

    try {
        await migrateBlogPosts();
        await migratePortfolioProjects();

        console.log('\n✨ Migration complete!');
        console.log('\nNote: The original MD files are preserved as templates.');
        console.log('You can now manage content through the admin panel.');
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

main();
