/**
 * Content Migration Script
 *
 * This script migrates existing markdown content (blog posts and portfolio projects)
 * from static MD files to the database. Run this once after applying migrations.
 *
 * Usage: node --loader ts-node/esm scripts/migrate-content.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
