<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { AlertTriangle, Download, Trash2, Cookie } from '@lucide/svelte';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	let deleteConfirmText = $state('');
	let isDeleting = $state(false);
	let showDeleteConfirm = $state(false);
	let isSavingConsent = $state(false);
	let consentMessage = $state('');
	
	// Editable consent preferences
	let functional = $state(data.consents.functional);
	let analytics = $state(data.consents.analytics);
	let marketing = $state(data.consents.marketing);
	
	async function updateConsent() {
		isSavingConsent = true;
		consentMessage = '';
		
		try {
			const response = await fetch('/api/consent/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					necessary: true,
					functional,
					analytics,
					marketing
				})
			});
			
			if (response.ok) {
				consentMessage = 'Consent preferences updated successfully!';
				// Reload page to apply new settings
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				consentMessage = 'Failed to update preferences. Please try again.';
			}
		} catch (error) {
			console.error('Error updating consent:', error);
			consentMessage = 'Failed to update preferences. Please try again.';
		} finally {
			isSavingConsent = false;
		}
	}
	
	async function exportData() {
		try {
			const response = await fetch('/api/gdpr/export');
			if (response.ok) {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `data-export-${Date.now()}.json`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			} else {
				alert('Failed to export data. Please try again.');
			}
		} catch (error) {
			console.error('Error exporting data:', error);
			alert('Failed to export data. Please try again.');
		}
	}
	
	async function deleteAccount() {
		if (deleteConfirmText !== 'DELETE MY DATA') {
			alert('Please type "DELETE MY DATA" to confirm');
			return;
		}
		
		if (!confirm('This action is PERMANENT and IRREVERSIBLE. All your data will be deleted. Continue?')) {
			return;
		}
		
		isDeleting = true;
		
		try {
			const response = await fetch('/api/gdpr/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					confirm: true,
					confirmText: deleteConfirmText
				})
			});
			
			if (response.ok) {
				alert('Your account and all data have been deleted. You will be signed out.');
				goto('/');
			} else {
				const errorData = await response.json() as { error?: string };
				alert(`Failed to delete account: ${errorData.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error deleting account:', error);
			alert('Failed to delete account. Please try again.');
		} finally {
			isDeleting = false;
		}
	}
</script>

<div class="container max-w-4xl py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Privacy & Data</h1>
		<p class="text-muted-foreground">
			Manage your privacy settings and exercise your data rights under GDPR.
		</p>
	</div>
	
	<!-- Consent Preferences -->
	<Card class="p-6 mb-6">
		<div class="flex items-start gap-4 mb-4">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
				<Cookie class="h-5 w-5 text-primary" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-semibold mb-1">Cookie Preferences</h2>
				<p class="text-sm text-muted-foreground">
					Your current cookie consent settings. You can change these at any time.
				</p>
			</div>
		</div>
		
		<div class="space-y-3 ml-14">
			<div class="flex items-center gap-3">
				<Checkbox checked={true} disabled={true} />
				<div>
					<Label class="font-semibold">Necessary Cookies</Label>
					<p class="text-xs text-muted-foreground">
						Required for the site to function (always enabled)
					</p>
				</div>
			</div>
			
			<div class="flex items-center gap-3">
				<Checkbox bind:checked={functional} />
				<div>
					<Label class="font-semibold cursor-pointer" for="functional-checkbox">Functional Cookies</Label>
					<p class="text-xs text-muted-foreground">
						Enhanced features and personalization
					</p>
				</div>
			</div>
			
			<div class="flex items-center gap-3">
				<Checkbox bind:checked={analytics} />
				<div>
					<Label class="font-semibold cursor-pointer" for="analytics-checkbox">Analytics Cookies</Label>
					<p class="text-xs text-muted-foreground">
						Help us understand how you use our site
					</p>
				</div>
			</div>
			
			<div class="flex items-center gap-3">
				<Checkbox bind:checked={marketing} />
				<div>
					<Label class="font-semibold cursor-pointer" for="marketing-checkbox">Marketing Cookies</Label>
					<p class="text-xs text-muted-foreground">
						Personalized advertisements
					</p>
				</div>
			</div>
		</div>
		
		<div class="mt-6 ml-14">
			{#if consentMessage}
				<div class="mb-3 p-2 text-sm rounded {consentMessage.includes('success') ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}">
					{consentMessage}
				</div>
			{/if}
			
			<Button onclick={updateConsent} disabled={isSavingConsent}>
				{isSavingConsent ? 'Saving...' : 'Update Cookie Preferences'}
			</Button>
			
			<p class="text-xs text-muted-foreground mt-3">
				Changes will take effect immediately. Your consent is valid for 12 months and can be withdrawn at any time.
			</p>
		</div>
	</Card>
	
	<!-- Data Export -->
	<Card class="p-6 mb-6">
		<div class="flex items-start gap-4 mb-4">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
				<Download class="h-5 w-5 text-blue-500" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-semibold mb-1">Export Your Data</h2>
				<p class="text-sm text-muted-foreground">
					Download a complete copy of your personal data in JSON format (GDPR Article 15 & 20).
				</p>
			</div>
		</div>
		
		<div class="ml-14">
			<p class="text-sm mb-4">
				This export includes:
			</p>
			<ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
				<li>Your profile information</li>
				<li>Organizations you own or are part of</li>
				<li>Projects you've created</li>
				<li>Tickets and support requests</li>
				<li>Invoices and billing information</li>
				<li>Activity logs (recent 1,000 records)</li>
			</ul>
			
			<Button onclick={exportData}>
				<Download class="h-4 w-4 mr-2" />
				Download My Data
			</Button>
		</div>
	</Card>
	
	<!-- Account Deletion -->
	<Card class="p-6 border-destructive/50">
		<div class="flex items-start gap-4 mb-4">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
				<Trash2 class="h-5 w-5 text-destructive" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-semibold mb-1 text-destructive">Delete Your Account</h2>
				<p class="text-sm text-muted-foreground">
					Permanently delete your account and all associated data (GDPR Article 17 - Right to be Forgotten).
				</p>
			</div>
		</div>
		
		<div class="ml-14">
			<div class="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-4">
				<div class="flex items-start gap-2">
					<AlertTriangle class="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
					<div class="text-sm">
						<p class="font-semibold text-destructive mb-1">Warning: This action is permanent and irreversible!</p>
						<p class="text-muted-foreground">
							All your data including profile, organizations, projects, tickets, and invoices will be permanently deleted.
							Some data may be anonymized and retained for legal compliance purposes.
						</p>
					</div>
				</div>
			</div>
			
			{#if !showDeleteConfirm}
				<Button variant="destructive" onclick={() => showDeleteConfirm = true}>
					<Trash2 class="h-4 w-4 mr-2" />
					Delete My Account
				</Button>
			{:else}
				<div class="space-y-4">
					<div>
						<Label for="delete-confirm">
							Type <span class="font-mono font-bold">DELETE MY DATA</span> to confirm:
						</Label>
						<Input
							id="delete-confirm"
							bind:value={deleteConfirmText}
							placeholder="DELETE MY DATA"
							class="mt-2 font-mono"
						/>
					</div>
					
					<div class="flex gap-2">
						<Button
							variant="destructive"
							onclick={deleteAccount}
							disabled={deleteConfirmText !== 'DELETE MY DATA' || isDeleting}
						>
							{isDeleting ? 'Deleting...' : 'Confirm Deletion'}
						</Button>
						<Button
							variant="outline"
							onclick={() => {
								showDeleteConfirm = false;
								deleteConfirmText = '';
							}}
							disabled={isDeleting}
						>
							Cancel
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</Card>
</div>
