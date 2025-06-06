<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { onMount } from 'svelte';

	let isOpen = $state(false);

	onMount(() => {
		// Simulate an action that opens the dialog
		setTimeout(() => {
			isOpen = true;
		}, 1000);
	});
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>WARNING: Website under development!</AlertDialog.Title>
			<AlertDialog.Description>
				Some features may not work as expected, and content
				may change frequently. Please check back later for updates or contact us if you have any questions.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={() => (isOpen = false)}>Continue to Website</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>