<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	const languages = [
		{ value: 'en', label: 'English' },
		{ value: 'th', label: 'Thai' }
	];

</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex flex-row justify-between p-4 border-b border-muted text-white hover:bg-primary hover:text-primary-foreground"
	>
		LANGUAGE
		<span class="flex flex-row items-center">[<ChevronDown class="h-4 w-4" />]</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-50 border-b shadow-popover outline-hidden focus-visible:outline-hidden w-screen"
		>
			{#each languages as language}
				<DropdownMenu.Item
					class=""
				>
					<a
						class="flex flex-row justify-between p-4 border-b border-muted text-white hover:bg-primary hover:text-primary-foreground items-center font-mono uppercase text-sm"
						href="/{language.value}">
						{language.label}
					</a>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>