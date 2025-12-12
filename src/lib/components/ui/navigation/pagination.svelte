<script lang="ts">
	import * as PaginationPrimitive from '$lib/components/ui/pagination';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	/**
	 * Pagination - Standardized pagination controls
	 */
	interface Props {
		/** Current page (1-indexed) */
		currentPage: number;
		/** Total number of pages */
		totalPages: number;
		/** Callback when page changes */
		onPageChange: (page: number) => void;
		/** Custom class */
		class?: string;
	}

	let {
		currentPage,
		totalPages,
		onPageChange,
		class: className = ''
	}: Props = $props();

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};
</script>

<PaginationPrimitive.Root count={totalPages} perPage={1} class={className}>
	<PaginationPrimitive.Content>
		<PaginationPrimitive.Item>
			<Button
				variant="ghost"
				size="sm"
				onclick={handlePrevious}
				disabled={currentPage === 1}
			>
				<ChevronLeft class="h-4 w-4" />
				<span class="sr-only">Previous</span>
			</Button>
		</PaginationPrimitive.Item>
		
		<!-- Simple page numbers without primitives slot -->
		{#each Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1) as pageNum}
			<PaginationPrimitive.Item>
				<Button
					variant={currentPage === pageNum ? 'default' : 'ghost'}
					size="sm"
					onclick={() => onPageChange(pageNum)}
				>
					{pageNum}
				</Button>
			</PaginationPrimitive.Item>
		{/each}

		<PaginationPrimitive.Item>
			<Button
				variant="ghost"
				size="sm"
				onclick={handleNext}
				disabled={currentPage === totalPages}
			>
				<ChevronRight class="h-4 w-4" />
				<span class="sr-only">Next</span>
			</Button>
		</PaginationPrimitive.Item>
	</PaginationPrimitive.Content>
</PaginationPrimitive.Root>
