import { sentrySvelteKit } from "@sentry/sveltekit";
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sentrySvelteKit({
		org: "mostlywhat",
		project: "website",
		authToken: process.env.SENTRY_AUTH_TOKEN,
	}), tailwindcss(), sveltekit(), devtoolsJson(), paraglideVitePlugin({
		project: './project.inlang',
		outdir: './src/lib/paraglide',
		strategy: ['url', 'cookie', 'baseLocale']
	})],
	// Optimization settings for faster compile times
	optimizeDeps: {
		// Pre-bundle heavy dependencies
		include: [
			'clsx',
			'tailwind-merge',
			'bits-ui',
			'@supabase/supabase-js',
			'drizzle-orm',
			'marked',
			'svelte-sonner',
			'mode-watcher',
			'@lucide/svelte'
		],
		// Exclude SvelteKit internals
		exclude: ['@sveltejs/kit']
	},
	server: {
		// Warm up frequently accessed files
		warmup: {
			clientFiles: [
				'./src/lib/components/ui/**/*.svelte',
				'./src/routes/**/*.svelte'
			]
		}
	},
	build: {
		// Target modern browsers for smaller builds
		target: 'esnext',
		// Enable source maps for development
		sourcemap: true
	}
});