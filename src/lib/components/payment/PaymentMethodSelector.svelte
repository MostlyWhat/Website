<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { CreditCard, Building2 } from '@lucide/svelte';

	interface Props {
		amount: number;
		currency?: string;
		wireTransferDiscount?: number;
		value?: 'lemon_squeezy' | 'wire_transfer';
		onchange?: (value: 'lemon_squeezy' | 'wire_transfer') => void;
	}

	let { amount, currency = 'USD', wireTransferDiscount = 3, value = $bindable('lemon_squeezy'), onchange }: Props = $props();

	// Calculate savings
	const savings = (amount * wireTransferDiscount) / 100;
	const discountedAmount = amount - savings;

	function handleChange(newValue: string) {
		if (newValue === 'lemon_squeezy' || newValue === 'wire_transfer') {
			value = newValue as 'lemon_squeezy' | 'wire_transfer';
			onchange?.(value);
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Payment Method</CardTitle>
		<CardDescription>Choose how you'd like to pay for this invoice</CardDescription>
	</CardHeader>
	<CardContent>
		<RadioGroup value={value} onValueChange={handleChange}>
			<!-- Online Payment -->
			<div class="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
				<RadioGroupItem value="lemon_squeezy" id="lemon_squeezy" />
				<Label
					for="lemon_squeezy"
					class="flex flex-1 cursor-pointer items-start justify-between"
				>
					<div class="flex items-start gap-3">
						<CreditCard class="h-5 w-5 mt-0.5 text-muted-foreground" />
						<div>
							<div class="font-medium">Pay Online</div>
							<div class="text-sm text-muted-foreground">
								Credit card, PayPal, Apple Pay, Google Pay
							</div>
							<div class="text-sm text-muted-foreground mt-1">
								{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)}
							</div>
						</div>
					</div>
					<Badge variant="secondary">Instant</Badge>
				</Label>
			</div>

			<!-- Wire Transfer -->
			<div class="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
				<RadioGroupItem value="wire_transfer" id="wire_transfer" />
				<Label
					for="wire_transfer"
					class="flex flex-1 cursor-pointer items-start justify-between"
				>
					<div class="flex items-start gap-3">
						<Building2 class="h-5 w-5 mt-0.5 text-muted-foreground" />
						<div>
							<div class="font-medium">Wire Transfer</div>
							<div class="text-sm text-muted-foreground">
								Bank transfer - requires manual approval
							</div>
							<div class="text-sm font-medium text-green-600 mt-1">
								{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(discountedAmount)}
								<span class="text-xs text-muted-foreground ml-1">
									(Save {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(savings)})
								</span>
							</div>
						</div>
					</div>
					<Badge variant="default" class="bg-green-600">{wireTransferDiscount}% Off</Badge>
				</Label>
			</div>
		</RadioGroup>
	</CardContent>
</Card>
