<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Copy, CheckCircle2, Upload } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		instructions: string;
		amount: number;
		currency?: string;
		invoiceNumber: string;
		onUploadReceipt?: () => void;
	}

	let { instructions, amount, currency = 'USD', invoiceNumber, onUploadReceipt }: Props = $props();

	// Parse instructions
	const lines = instructions.split('\n').filter(line => line.trim());

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard');
		} catch (err) {
			toast.error('Failed to copy');
		}
	}

	function copyAllInstructions() {
		copyToClipboard(instructions);
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Wire Transfer Instructions</CardTitle>
		<CardDescription>
			Please transfer {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)} to the following account
		</CardDescription>
	</CardHeader>
	<CardContent class="space-y-4">
		<Alert>
			<CheckCircle2 class="h-4 w-4" />
			<AlertDescription>
				Include invoice number <strong>{invoiceNumber}</strong> in the transfer reference
			</AlertDescription>
		</Alert>

		<div class="rounded-lg border bg-muted/50 p-4 space-y-2">
			{#each lines as line}
				<div class="flex items-center justify-between">
					<code class="text-sm">{line}</code>
					{#if line.includes(':')}
						<Button
							variant="ghost"
							size="sm"
							onclick={() => copyToClipboard(line.split(':')[1].trim())}
						>
							<Copy class="h-3 w-3" />
						</Button>
					{/if}
				</div>
			{/each}
		</div>

		<div class="flex gap-2">
			<Button variant="outline" onclick={copyAllInstructions} class="flex-1">
				<Copy class="h-4 w-4 mr-2" />
				Copy All
			</Button>
			{#if onUploadReceipt}
				<Button onclick={onUploadReceipt} class="flex-1">
					<Upload class="h-4 w-4 mr-2" />
					Upload Receipt
				</Button>
			{/if}
		</div>
	</CardContent>
</Card>
