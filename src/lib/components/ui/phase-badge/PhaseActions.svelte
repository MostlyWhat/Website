<script lang="ts">
	/**
	 * PhaseActions - Action buttons for transitioning between phases
	 */
	import type { ProjectPhase, ProposalConfirmationStatus } from '$lib/server/db/schema';
	import { getPhaseConfig, canTransitionToPhase, getNextPhase } from './phase-utils';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import {
		Play,
		Send,
		CheckCircle2,
		Hammer,
		Flag,
		HeadphonesIcon,
		XCircle,
		Pause,
		ArrowRight
	} from '@lucide/svelte';

	interface Props {
		currentPhase: ProjectPhase;
		proposalStatus?: ProposalConfirmationStatus | null;
		onAction: (action: string, data?: Record<string, unknown>) => void;
		loading?: boolean;
		class?: string;
	}

	let {
		currentPhase,
		proposalStatus = null,
		onAction,
		loading = false,
		class: className = ''
	}: Props = $props();

	// Get available actions based on current phase
	const actions = $derived.by(() => {
		const result: Array<{
			action: string;
			label: string;
			icon: typeof Play;
			variant: 'default' | 'destructive' | 'outline' | 'secondary';
			description?: string;
		}> = [];

		switch (currentPhase) {
			case 'request':
				result.push({
					action: 'start_review',
					label: 'Start Review',
					icon: Play,
					variant: 'default',
					description: 'Begin reviewing this project request'
				});
				result.push({
					action: 'decline',
					label: 'Decline Request',
					icon: XCircle,
					variant: 'destructive',
					description: 'Decline this project request'
				});
				break;

			case 'review':
				result.push({
					action: 'create_proposal',
					label: 'Create Proposal',
					icon: Send,
					variant: 'default',
					description: 'Create and send a proposal to the client'
				});
				result.push({
					action: 'request_info',
					label: 'Request More Info',
					icon: ArrowRight,
					variant: 'outline',
					description: 'Ask client for more details'
				});
				result.push({
					action: 'decline',
					label: 'Decline',
					icon: XCircle,
					variant: 'destructive'
				});
				break;

			case 'proposal':
				if (proposalStatus === 'client_accepted') {
					result.push({
						action: 'confirm_start',
						label: 'Confirm & Start',
						icon: CheckCircle2,
						variant: 'default',
						description: 'Client accepted - confirm to begin work'
					});
				} else if (!proposalStatus || proposalStatus === 'draft') {
					result.push({
						action: 'send_proposal',
						label: 'Send Proposal',
						icon: Send,
						variant: 'default',
						description: 'Send the proposal to the client'
					});
				}
				result.push({
					action: 'revise_proposal',
					label: 'Revise Proposal',
					icon: ArrowRight,
					variant: 'outline'
				});
				break;

			case 'confirmed':
				result.push({
					action: 'start_building',
					label: 'Start Building',
					icon: Hammer,
					variant: 'default',
					description: 'Begin active development'
				});
				break;

			case 'building':
				result.push({
					action: 'mark_complete',
					label: 'Mark Complete',
					icon: Flag,
					variant: 'default',
					description: 'Project deliverables are complete'
				});
				result.push({
					action: 'put_on_hold',
					label: 'Put On Hold',
					icon: Pause,
					variant: 'outline'
				});
				break;

			case 'completed':
				result.push({
					action: 'enable_support',
					label: 'Enable Support',
					icon: HeadphonesIcon,
					variant: 'default',
					description: 'Start ongoing support phase'
				});
				break;

			case 'support':
				result.push({
					action: 'end_support',
					label: 'End Support',
					icon: XCircle,
					variant: 'outline',
					description: 'End support contract'
				});
				break;
		}

		return result;
	});

	const primaryAction = $derived(actions[0]);
	const secondaryActions = $derived(actions.slice(1));
</script>

<div class={cn('space-y-3', className)}>
	{#if primaryAction}
		<Button
			variant={primaryAction.variant}
			class="w-full justify-start gap-2"
			disabled={loading}
			onclick={() => onAction(primaryAction.action)}
		>
			<primaryAction.icon class="h-4 w-4" />
			{primaryAction.label}
		</Button>
		{#if primaryAction.description}
			<p class="text-xs text-muted-foreground">{primaryAction.description}</p>
		{/if}
	{/if}

	{#if secondaryActions.length > 0}
		<div class="flex flex-wrap gap-2 pt-2 border-t border-border">
			{#each secondaryActions as action (action.action)}
				<Button
					variant={action.variant}
					size="sm"
					disabled={loading}
					onclick={() => onAction(action.action)}
				>
					<action.icon class="mr-1.5 h-3.5 w-3.5" />
					{action.label}
				</Button>
			{/each}
		</div>
	{/if}
</div>
