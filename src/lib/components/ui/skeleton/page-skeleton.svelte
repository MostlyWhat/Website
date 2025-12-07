<script lang="ts">
	/**
	 * Page Skeleton
	 * 
	 * A flexible skeleton loading component for page content.
	 * Supports different variants for common page layouts.
	 */
	import { Skeleton } from '$lib/components/ui/skeleton';

	interface Props {
		variant?: 'dashboard' | 'list' | 'detail' | 'grid' | 'form';
	}

	let { variant = 'dashboard' }: Props = $props();
</script>

{#if variant === 'dashboard'}
	<!-- Dashboard Skeleton -->
	<div class="min-h-[calc(100dvh-4rem)]">
		<!-- Header Section -->
		<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
			<Skeleton class="h-3 w-24 rounded" />
			<Skeleton class="mt-4 h-9 w-64 rounded" />
			<Skeleton class="mt-2 h-5 w-80 rounded" />
		</section>

		<!-- Stats Grid -->
		<section class="border-b border-border">
			<div class="grid grid-cols-12 gap-px bg-border">
				{#each Array(4) as _}
					<div class="col-span-6 flex flex-col bg-background px-6 py-8 md:col-span-3 md:px-12 lg:px-16">
						<Skeleton class="h-12 w-12 rounded" />
						<Skeleton class="mt-6 h-10 w-16 rounded" />
						<Skeleton class="mt-2 h-3 w-24 rounded" />
					</div>
				{/each}
			</div>
		</section>

		<!-- Content Grid -->
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-12 bg-background lg:col-span-6">
				<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
					<Skeleton class="h-3 w-32 rounded" />
				</div>
				<div class="space-y-4 px-6 py-8 md:px-12 lg:px-16">
					{#each Array(4) as _}
						<div class="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
							<Skeleton class="h-10 w-10 rounded" />
							<div class="flex-1 space-y-2">
								<Skeleton class="h-4 w-48 rounded" />
								<Skeleton class="h-3 w-24 rounded" />
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="col-span-12 bg-background lg:col-span-6">
				<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
					<Skeleton class="h-3 w-32 rounded" />
				</div>
				<div class="grid grid-cols-2 gap-4 px-6 py-8 md:px-12 lg:px-16">
					{#each Array(4) as _}
						<div class="flex flex-col items-start border border-border bg-card p-6">
							<Skeleton class="h-10 w-10 rounded" />
							<Skeleton class="mt-4 h-4 w-24 rounded" />
							<Skeleton class="mt-2 h-4 w-4 rounded" />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

{:else if variant === 'list'}
	<!-- List Page Skeleton -->
	<div class="min-h-[calc(100dvh-4rem)]">
		<!-- Header -->
		<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
			<Skeleton class="h-3 w-24 rounded" />
			<div class="mt-4 flex items-center justify-between">
				<Skeleton class="h-9 w-48 rounded" />
				<Skeleton class="h-10 w-32 rounded" />
			</div>
			<Skeleton class="mt-2 h-5 w-64 rounded" />
		</section>

		<!-- Filters -->
		<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
			<div class="flex flex-wrap items-center gap-4">
				<Skeleton class="h-10 w-64 rounded" />
				<Skeleton class="h-10 w-32 rounded" />
				<Skeleton class="h-10 w-32 rounded" />
			</div>
		</div>

		<!-- List Items -->
		<div class="divide-y divide-border">
			{#each Array(6) as _}
				<div class="flex items-center gap-4 px-6 py-6 md:px-12 lg:px-16">
					<Skeleton class="h-10 w-10 rounded" />
					<div class="flex-1 space-y-2">
						<Skeleton class="h-5 w-64 rounded" />
						<Skeleton class="h-4 w-48 rounded" />
					</div>
					<Skeleton class="h-6 w-20 rounded-full" />
					<Skeleton class="h-4 w-24 rounded" />
				</div>
			{/each}
		</div>
	</div>

{:else if variant === 'detail'}
	<!-- Detail Page Skeleton -->
	<div class="min-h-[calc(100dvh-4rem)]">
		<!-- Header -->
		<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
			<div class="flex items-center gap-2">
				<Skeleton class="h-4 w-4 rounded" />
				<Skeleton class="h-3 w-16 rounded" />
			</div>
			<Skeleton class="mt-4 h-9 w-80 rounded" />
			<div class="mt-4 flex items-center gap-4">
				<Skeleton class="h-6 w-24 rounded-full" />
				<Skeleton class="h-4 w-32 rounded" />
			</div>
		</section>

		<!-- Content Grid -->
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 space-y-6 bg-background px-6 py-8 md:px-12 lg:col-span-8 lg:px-16">
				<div class="space-y-4">
					<Skeleton class="h-3 w-24 rounded" />
					<Skeleton class="h-4 w-full rounded" />
					<Skeleton class="h-4 w-full rounded" />
					<Skeleton class="h-4 w-3/4 rounded" />
				</div>
				<div class="space-y-4">
					<Skeleton class="h-3 w-24 rounded" />
					<Skeleton class="h-4 w-full rounded" />
					<Skeleton class="h-4 w-2/3 rounded" />
				</div>
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 space-y-6 border-t border-border bg-card px-6 py-8 md:px-12 lg:col-span-4 lg:border-t-0 lg:px-8">
				<div class="space-y-2">
					<Skeleton class="h-3 w-16 rounded" />
					<Skeleton class="h-5 w-32 rounded" />
				</div>
				<div class="space-y-2">
					<Skeleton class="h-3 w-16 rounded" />
					<Skeleton class="h-5 w-24 rounded" />
				</div>
				<div class="space-y-2">
					<Skeleton class="h-3 w-16 rounded" />
					<Skeleton class="h-5 w-40 rounded" />
				</div>
				<Skeleton class="h-10 w-full rounded" />
			</div>
		</div>
	</div>

{:else if variant === 'grid'}
	<!-- Grid Page Skeleton -->
	<div class="min-h-[calc(100dvh-4rem)]">
		<!-- Header -->
		<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
			<Skeleton class="h-3 w-24 rounded" />
			<div class="mt-4 flex items-center justify-between">
				<Skeleton class="h-9 w-48 rounded" />
				<Skeleton class="h-10 w-32 rounded" />
			</div>
		</section>

		<!-- Grid -->
		<div class="grid grid-cols-12 gap-px bg-border">
			{#each Array(6) as _}
				<div class="col-span-12 bg-background p-6 sm:col-span-6 lg:col-span-4">
					<div class="border border-border p-6">
						<div class="flex items-start justify-between">
							<Skeleton class="h-10 w-10 rounded" />
							<Skeleton class="h-6 w-20 rounded-full" />
						</div>
						<Skeleton class="mt-4 h-5 w-48 rounded" />
						<Skeleton class="mt-2 h-4 w-full rounded" />
						<Skeleton class="mt-1 h-4 w-2/3 rounded" />
						<div class="mt-4 flex items-center gap-2">
							<Skeleton class="h-6 w-6 rounded-full" />
							<Skeleton class="h-4 w-24 rounded" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

{:else if variant === 'form'}
	<!-- Form Page Skeleton -->
	<div class="min-h-[calc(100dvh-4rem)]">
		<!-- Header -->
		<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
			<div class="flex items-center gap-2">
				<Skeleton class="h-4 w-4 rounded" />
				<Skeleton class="h-3 w-16 rounded" />
			</div>
			<Skeleton class="mt-4 h-9 w-64 rounded" />
			<Skeleton class="mt-2 h-5 w-80 rounded" />
		</section>

		<!-- Form Fields -->
		<div class="px-6 py-8 md:px-12 lg:px-16">
			<div class="max-w-2xl space-y-6">
				{#each Array(5) as _}
					<div class="space-y-2">
						<Skeleton class="h-4 w-24 rounded" />
						<Skeleton class="h-10 w-full rounded" />
					</div>
				{/each}
				<div class="flex gap-4 pt-4">
					<Skeleton class="h-10 w-24 rounded" />
					<Skeleton class="h-10 w-32 rounded" />
				</div>
			</div>
		</div>
	</div>
{/if}
