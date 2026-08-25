<script lang="ts">
    import type { Snippet } from 'svelte';
    import AuthLayout from '@/layouts/auth/AuthCardLayout.svelte';

    let {
        title = '',
        description = '',
        children
    }: {
        title?: string;
        description?: string;
        children?: Snippet;
    } = $props();
</script>

<AuthLayout {description} {title}>
    {@render children?.()}
</AuthLayout>
