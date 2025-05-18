<script lang="ts">
	// Components
	import Header from '$lib/components/common/header/header.svelte';
	import Footer from '$lib/components/common/footer/footer.svelte';

	// Plugins
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { onNavigate } from '$app/navigation';

	// Fonts
	import '@fontsource-variable/jetbrains-mono'; // Supports weights 100-800
	import '@fontsource-variable/plus-jakarta-sans'; // Supports weights 200-800

	// Styles
	import '../app.css';

	// View Transition
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// Imports
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	{@render children()}
	<Footer />
</ParaglideJS>

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    @keyframes fade-out {
        to {
            opacity: 0;
        }
    }

    @keyframes slide-from-right {
        from {
            transform: translateX(30px);
        }
    }

    @keyframes slide-to-left {
        to {
            transform: translateX(-30px);
        }
    }

    @keyframes slide-from-bottom {
        from {
            transform: translateY(30px);
        }
    }

    @keyframes slide-to-top {
        to {
            transform: translateY(-30px);
        }
    }

    :root::view-transition-old(root) {
        animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
        500ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-top;
    }

    :root::view-transition-new(root) {
        animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
        500ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-bottom;
    }
</style>