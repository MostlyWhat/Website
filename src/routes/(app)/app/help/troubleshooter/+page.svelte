<script lang="ts">
	/**
	 * Dashboard Troubleshooter
	 * 
	 * Interactive diagnostic tool for logged-in users.
	 * Guides users through common issues with step-by-step solutions.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		ArrowLeft,
		ArrowRight,
		RotateCcw,
		CheckCircle,
		XCircle,
		AlertTriangle,
		Monitor,
		Globe,
		RefreshCw,
		Clock,
		Send,
		Lightbulb,
		Wrench
	} from '@lucide/svelte';

	type Result = {
		type: 'success' | 'warning' | 'error';
		title: string;
		description: string;
		solutions: string[];
		nextAction?: { label: string; href: string };
	};

	type Option = {
		label: string;
		icon?: typeof CheckCircle;
		next: string | null;
		result?: Result;
	};

	type Step = {
		id: string;
		question: string;
		description?: string;
		options: Option[];
	};

	// Troubleshooting flow
	const steps: Record<string, Step> = {
		start: {
			id: 'start',
			question: 'What type of issue are you experiencing?',
			description: 'Select the category that best describes your problem.',
			options: [
				{ label: 'Website not loading', icon: Globe, next: 'not-loading' },
				{ label: 'Visual/display issues', icon: Monitor, next: 'display-issues' },
				{ label: 'Feature not working', icon: Wrench, next: 'feature-broken' },
				{ label: 'Slow performance', icon: Clock, next: 'slow-performance' },
				{ label: 'Something else', icon: Lightbulb, next: 'other-issue' }
			]
		},
		'not-loading': {
			id: 'not-loading',
			question: 'What do you see when you try to load the page?',
			options: [
				{ label: 'Blank white page', next: 'blank-page' },
				{ label: 'Error message (404, 500, etc.)', next: 'error-page' },
				{ label: 'Page loads partially', next: 'partial-load' },
				{ label: 'Connection timeout', next: 'connection-timeout' }
			]
		},
		'blank-page': {
			id: 'blank-page',
			question: 'Have you tried clearing your browser cache?',
			description: 'Cached files can sometimes cause display issues.',
			options: [
				{ label: 'Yes, still seeing blank page', icon: XCircle, next: 'blank-page-result' },
				{ label: 'No, let me try that', icon: RefreshCw, next: 'try-cache-clear' }
			]
		},
		'try-cache-clear': {
			id: 'try-cache-clear',
			question: 'Did clearing the cache resolve the issue?',
			description: 'Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac) to open cache clearing options.',
			options: [
				{
					label: 'Yes, it\'s working now!',
					icon: CheckCircle,
					next: null,
					result: {
						type: 'success',
						title: 'Issue Resolved!',
						description: 'Clearing your browser cache fixed the problem.',
						solutions: [
							'Consider clearing cache periodically',
							'If this happens frequently, try disabling aggressive caching extensions'
						]
					}
				},
				{ label: 'No, still having issues', icon: XCircle, next: 'blank-page-result' }
			]
		},
		'blank-page-result': {
			id: 'blank-page-result',
			question: 'Does this happen on other devices or browsers?',
			options: [
				{
					label: 'Yes, happens everywhere',
					next: null,
					result: {
						type: 'error',
						title: 'Server-Side Issue Detected',
						description: 'This appears to be a server or hosting issue affecting all users.',
						solutions: [
							'Our team may already be aware and working on it',
							'Check the status page for any ongoing incidents',
							'Submit a ticket for immediate attention'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'No, only on this device/browser',
					next: null,
					result: {
						type: 'warning',
						title: 'Browser/Device Issue',
						description: 'The issue seems specific to your browser or device.',
						solutions: [
							'Try updating your browser to the latest version',
							'Disable browser extensions temporarily',
							'Check if JavaScript is enabled',
							'Try using incognito/private mode'
						],
						nextAction: { label: 'STILL NEED HELP?', href: '/app/tickets/new' }
					}
				}
			]
		},
		'error-page': {
			id: 'error-page',
			question: 'What error code are you seeing?',
			options: [
				{
					label: '404 - Page Not Found',
					next: null,
					result: {
						type: 'warning',
						title: '404 Error - Page Not Found',
						description: 'The page you\'re looking for doesn\'t exist at this URL.',
						solutions: [
							'Check if the URL is correct',
							'The page may have been moved or deleted',
							'Try navigating from the dashboard instead'
						]
					}
				},
				{
					label: '500 - Server Error',
					next: null,
					result: {
						type: 'error',
						title: '500 Error - Server Problem',
						description: 'The server encountered an internal error.',
						solutions: [
							'Wait a few minutes and try again',
							'Clear your browser cache and cookies',
							'This is likely a temporary issue we\'re aware of'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: '403 - Forbidden',
					next: null,
					result: {
						type: 'warning',
						title: '403 Error - Access Denied',
						description: 'You don\'t have permission to access this page.',
						solutions: [
							'Make sure you\'re logged in',
							'Check if your account has the necessary permissions',
							'Contact us if you believe you should have access'
						],
						nextAction: { label: 'CONTACT SUPPORT', href: '/app/tickets/new' }
					}
				},
				{ label: 'Other error', next: 'other-error' }
			]
		},
		'other-error': {
			id: 'other-error',
			question: 'Please submit a ticket with the error details.',
			options: [
				{
					label: 'Submit a support ticket',
					icon: Send,
					next: null,
					result: {
						type: 'warning',
						title: 'Submit Error Details',
						description: 'Please include the error message and any relevant screenshots.',
						solutions: [
							'Screenshot the error message',
							'Note the URL where the error occurs',
							'Include what you were doing when it happened',
							'Mention your browser and device'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				}
			]
		},
		'partial-load': {
			id: 'partial-load',
			question: 'Are images or styles missing?',
			options: [
				{
					label: 'Yes, images are broken',
					next: null,
					result: {
						type: 'warning',
						title: 'Broken Images Detected',
						description: 'Images may be failing to load due to CDN or network issues.',
						solutions: [
							'Try refreshing the page (Ctrl/Cmd + R)',
							'Check your internet connection',
							'Try a different browser',
							'Disable ad blockers temporarily'
						],
						nextAction: { label: 'STILL BROKEN?', href: '/app/tickets/new' }
					}
				},
				{
					label: 'Styles/layout look broken',
					next: null,
					result: {
						type: 'warning',
						title: 'CSS/Styling Issues',
						description: 'Stylesheets may not be loading correctly.',
						solutions: [
							'Clear your browser cache (Ctrl/Cmd + Shift + Delete)',
							'Try hard refresh (Ctrl/Cmd + Shift + R)',
							'Disable browser extensions',
							'Check if using an outdated browser'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{ label: 'Interactive features not working', next: 'feature-broken' }
			]
		},
		'connection-timeout': {
			id: 'connection-timeout',
			question: 'Can you access other websites normally?',
			options: [
				{
					label: 'Yes, other sites work fine',
					next: null,
					result: {
						type: 'error',
						title: 'Server Unavailable',
						description: 'Our servers may be experiencing issues.',
						solutions: [
							'Wait 5-10 minutes and try again',
							'Check our status page for updates',
							'This could be a temporary outage'
						],
						nextAction: { label: 'SUBMIT URGENT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'No, multiple sites are slow/broken',
					next: null,
					result: {
						type: 'warning',
						title: 'Network Issue Detected',
						description: 'The problem appears to be with your internet connection.',
						solutions: [
							'Restart your router/modem',
							'Try connecting via mobile data',
							'Check with your ISP for outages',
							'Try using a VPN'
						]
					}
				}
			]
		},
		'display-issues': {
			id: 'display-issues',
			question: 'What display issue are you experiencing?',
			options: [
				{
					label: 'Layout looks broken/misaligned',
					next: null,
					result: {
						type: 'warning',
						title: 'Layout Issue',
						description: 'Check your zoom level and browser settings.',
						solutions: [
							'Reset zoom to 100% (Ctrl/Cmd + 0)',
							'Try a different browser (Chrome, Firefox, Safari, Edge)',
							'Update your current browser',
							'Clear cache and refresh'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'Text is unreadable or overlapping',
					next: null,
					result: {
						type: 'warning',
						title: 'Text Display Issues',
						description: 'Please include screenshots when reporting.',
						solutions: [
							'Include your browser name and version',
							'Note if any fonts look incorrect',
							'Mention your operating system'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'Mobile display problems',
					next: null,
					result: {
						type: 'warning',
						title: 'Mobile Display Issue',
						description: 'The site should automatically adjust to mobile screens.',
						solutions: [
							'Try refreshing the page',
							'Rotate your device to see if it helps',
							'Try a different mobile browser'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				}
			]
		},
		'feature-broken': {
			id: 'feature-broken',
			question: 'What type of feature is not working?',
			options: [
				{
					label: 'Form submission',
					next: null,
					result: {
						type: 'warning',
						title: 'Form Submission Issue',
						description: 'JavaScript may be blocked or there\'s a validation error.',
						solutions: [
							'Check if all required fields are filled',
							'Look for any error messages on the form',
							'Ensure JavaScript is enabled',
							'Disable browser extensions temporarily'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'Navigation/menus',
					next: null,
					result: {
						type: 'warning',
						title: 'Navigation Issue',
						description: 'The navigation may be blocked by JavaScript issues.',
						solutions: [
							'Try refreshing the page',
							'Check if JavaScript is enabled',
							'Disable ad blockers temporarily',
							'Try a different browser'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'Interactive elements (buttons, modals)',
					next: null,
					result: {
						type: 'warning',
						title: 'Interactive Element Issue',
						description: 'There may be a conflict with browser extensions.',
						solutions: [
							'Disable browser extensions temporarily',
							'Try incognito/private browsing mode',
							'Clear cache and cookies',
							'Try a different browser'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'Search functionality',
					next: null,
					result: {
						type: 'warning',
						title: 'Search Function Issue',
						description: 'The search feature may be experiencing problems.',
						solutions: [
							'Try refreshing the page',
							'Try using different keywords',
							'Wait a moment and try again'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				}
			]
		},
		'slow-performance': {
			id: 'slow-performance',
			question: 'Is the slowness affecting the whole site or specific pages?',
			options: [
				{
					label: 'Whole site is slow',
					next: null,
					result: {
						type: 'warning',
						title: 'General Slow Performance',
						description: 'This could be network or server-related.',
						solutions: [
							'Check your internet speed',
							'Try a different network (WiFi vs mobile data)',
							'Clear browser cache',
							'If persistent, submit a ticket'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				},
				{
					label: 'Only certain pages are slow',
					next: null,
					result: {
						type: 'warning',
						title: 'Page-Specific Slowness',
						description: 'Some pages may have heavy content.',
						solutions: [
							'Note which pages are slow',
							'Check if pages have many images/videos',
							'Report specific slow pages so we can optimize'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				}
			]
		},
		'other-issue': {
			id: 'other-issue',
			question: 'Please describe your issue in a support ticket.',
			description: 'We\'ll help you figure out the problem.',
			options: [
				{
					label: 'Submit a support ticket',
					icon: Send,
					next: null,
					result: {
						type: 'warning',
						title: 'Describe Your Issue',
						description: 'Please provide as much detail as possible.',
						solutions: [
							'Describe what you expected to happen',
							'Describe what actually happened',
							'Include screenshots if possible',
							'Note your browser and device'
						],
						nextAction: { label: 'SUBMIT TICKET', href: '/app/tickets/new' }
					}
				}
			]
		}
	};

	// State
	let currentStepId = $state('start');
	let history = $state<string[]>([]);
	let currentResult = $state<Result | null>(null);

	const currentStep = $derived(steps[currentStepId]);
	const progress = $derived(
		currentResult ? 100 : Math.min(((history.length + 1) / 5) * 100, 95)
	);

	function selectOption(option: Option) {
		if (option.result) {
			currentResult = option.result;
		} else if (option.next) {
			history = [...history, currentStepId];
			currentStepId = option.next;
		}
	}

	function goBack() {
		if (currentResult) {
			currentResult = null;
		} else if (history.length > 0) {
			currentStepId = history[history.length - 1];
			history = history.slice(0, -1);
		}
	}

	function restart() {
		currentStepId = 'start';
		history = [];
		currentResult = null;
	}
</script>

<svelte:head>
	<title>Troubleshooter | MostlyWhat Systems</title>
</svelte:head>

<!-- Troubleshooter Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex items-center justify-between">
			<div>
				<a 
					href={localizeHref('/app/help')} 
					class="font-mono inline-flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground hover:text-primary"
				>
					<ArrowLeft class="h-3 w-3" />
					BACK TO HELP CENTER
				</a>
				<h1 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">
					GUIDED TROUBLESHOOTER
				</h1>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Answer a few questions and we'll help identify your issue.
				</p>
			</div>
			<div class="hidden md:block">
				<div class="flex items-center gap-6 text-center">
					<div>
						<p class="font-display text-xl font-bold text-primary">5 MIN</p>
						<p class="font-mono text-[10px] tracking-widest text-muted-foreground">AVG TIME</p>
					</div>
					<div class="h-8 w-px bg-border"></div>
					<div>
						<p class="font-display text-xl font-bold text-primary">85%</p>
						<p class="font-mono text-[10px] tracking-widest text-muted-foreground">SELF-SOLVED</p>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Progress Bar -->
		<div class="mt-6 flex items-center gap-4">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROGRESS</span>
			<div class="h-1 flex-1 bg-border">
				<div
					class="h-full bg-primary transition-all duration-300"
					style="width: {progress}%"
				></div>
			</div>
			<span class="font-mono text-[10px] tracking-widest text-primary">{Math.round(progress)}%</span>
		</div>
	</section>

	<!-- Main Content -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12">
			<!-- Sidebar -->
			<div class="col-span-12 border-b border-border bg-card lg:col-span-3 lg:border-b-0 lg:border-r">
				<div class="lg:sticky lg:top-20">
					<!-- Navigation -->
					<div class="px-6 py-6 md:px-12 lg:px-8">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STEPS</span>
						<div class="mt-4 space-y-2">
							{#each ['start', ...history] as stepId, i (i)}
								{@const isActive = !currentResult && i === history.length}
								<div class="flex items-center gap-3">
									<div
										class="flex h-6 w-6 flex-shrink-0 items-center justify-center border {isActive
											? 'border-primary bg-primary/10'
											: 'border-border bg-background'}"
									>
										<span
											class="font-mono text-[10px] {isActive
												? 'text-primary'
												: 'text-muted-foreground'}">{i + 1}</span
										>
									</div>
									<span
										class="font-ui text-xs tracking-wider truncate {isActive
											? 'text-foreground'
											: 'text-muted-foreground'}"
									>
										{steps[stepId].question.split('?')[0].slice(0, 20)}...
									</span>
								</div>
							{/each}
							{#if currentResult}
								<div class="flex items-center gap-3">
									<div
										class="flex h-6 w-6 flex-shrink-0 items-center justify-center border border-primary bg-primary/10"
									>
										<CheckCircle class="h-3 w-3 text-primary" />
									</div>
									<span class="font-ui text-xs tracking-wider text-foreground">Result</span>
								</div>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="border-t border-border px-6 py-4 md:px-12 lg:px-8">
						<div class="flex gap-2">
							{#if history.length > 0 || currentResult}
								<Button
									variant="outline"
									size="sm"
									onclick={goBack}
									class="font-ui flex-1 tracking-wider"
								>
									<ArrowLeft class="mr-2 h-3 w-3" />
									BACK
								</Button>
							{/if}
							<Button
								variant="ghost"
								size="sm"
								onclick={restart}
								class="font-ui flex-1 tracking-wider"
							>
								<RotateCcw class="mr-2 h-3 w-3" />
								RESTART
							</Button>
						</div>
					</div>

					<!-- Tips -->
					<div class="hidden border-t border-border px-6 py-6 md:px-12 lg:block lg:px-8">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TIPS</span>
						<ul class="font-body mt-3 space-y-2 text-[11px] text-muted-foreground">
							<li>• Be as specific as possible</li>
							<li>• Note any error messages</li>
							<li>• Try basic fixes first</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Question/Result Area -->
			<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-9 lg:px-16 lg:py-12">
				{#if currentResult}
					<!-- Result Display -->
					<div class="mx-auto max-w-xl">
						<div
							class="border p-6 md:p-8 {currentResult.type === 'success'
								? 'border-primary/20 bg-primary/5'
								: currentResult.type === 'error'
									? 'border-destructive/20 bg-destructive/5'
									: 'border-orange-500/20 bg-orange-500/5'}"
						>
							<div class="flex items-start gap-4">
								{#if currentResult.type === 'success'}
									<CheckCircle class="h-8 w-8 flex-shrink-0 text-primary" />
								{:else if currentResult.type === 'error'}
									<XCircle class="h-8 w-8 flex-shrink-0 text-destructive" />
								{:else}
									<AlertTriangle class="h-8 w-8 flex-shrink-0 text-orange-500" />
								{/if}
								<div>
									<h2 class="font-display text-lg font-bold uppercase md:text-xl">{currentResult.title}</h2>
									<p class="font-body mt-2 text-sm text-muted-foreground">
										{currentResult.description}
									</p>
								</div>
							</div>

							<div class="mt-6 border-t border-border pt-6">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
									>RECOMMENDED SOLUTIONS</span
								>
								<ul class="mt-4 space-y-3">
									{#each currentResult.solutions as solution, i (i)}
										<li class="flex items-start gap-3">
											<div
												class="flex h-5 w-5 flex-shrink-0 items-center justify-center border border-border bg-card"
											>
												<span class="font-mono text-[10px] text-muted-foreground">{i + 1}</span>
											</div>
											<span class="font-body text-sm">{solution}</span>
										</li>
									{/each}
								</ul>
							</div>

							{#if currentResult.nextAction}
								<div class="mt-8 flex flex-wrap gap-3">
									<Button
										href={localizeHref(currentResult.nextAction.href)}
										class="font-ui tracking-wider"
									>
										{currentResult.nextAction.label}
										<ArrowRight class="ml-2 h-4 w-4" />
									</Button>
									<Button variant="outline" onclick={restart} class="font-ui tracking-wider">
										TRY AGAIN
									</Button>
								</div>
							{:else}
								<div class="mt-8">
									<Button variant="outline" onclick={restart} class="font-ui tracking-wider">
										<RotateCcw class="mr-2 h-4 w-4" />
										START OVER
									</Button>
								</div>
							{/if}
						</div>

						<!-- Still Need Help -->
						<div class="mt-6 border border-border p-4 md:p-6">
							<div class="flex items-center gap-3">
								<Send class="h-5 w-5 text-primary" />
								<div>
									<p class="font-ui text-sm font-semibold tracking-wider">STILL NEED HELP?</p>
									<p class="font-body mt-1 text-xs text-muted-foreground">
										Submit a ticket and our team will assist you personally.
									</p>
								</div>
							</div>
							<a
								href={localizeHref('/app/tickets/new')}
								class="font-mono mt-4 inline-flex items-center gap-2 text-[10px] tracking-wider text-primary hover:underline"
							>
								SUBMIT TICKET
								<ArrowRight class="h-3 w-3" />
							</a>
						</div>
					</div>
				{:else}
					<!-- Question Display -->
					<div class="mx-auto max-w-xl">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
							STEP {history.length + 1}
						</span>
						<h2 class="font-display mt-4 text-xl font-bold uppercase md:text-2xl">
							{currentStep.question}
						</h2>
						{#if currentStep.description}
							<p class="font-body mt-3 text-sm text-muted-foreground">
								{currentStep.description}
							</p>
						{/if}

						<div class="mt-6 space-y-3">
							{#each currentStep.options as option, i (i)}
								<button
									onclick={() => selectOption(option)}
									class="group flex w-full items-center gap-4 border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
								>
									<div
										class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary group-hover:bg-primary/10"
									>
										{#if option.icon}
											{@const IconComponent = option.icon}
											<IconComponent class="h-5 w-5 text-muted-foreground group-hover:text-primary" />
										{:else}
											<span
												class="font-mono text-sm text-muted-foreground group-hover:text-primary"
											>
												{String.fromCharCode(65 + i)}
											</span>
										{/if}
									</div>
									<span class="font-ui flex-1 text-sm tracking-wider">{option.label}</span>
									<ArrowRight
										class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
									/>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Quick Links -->
	<section class="bg-background">
		<div class="px-6 py-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK LINKS</span>
		</div>
		<div class="grid grid-cols-2 gap-px border-t border-border bg-border md:grid-cols-3">
			<a
				href={localizeHref('/app/help')}
				class="flex items-center gap-3 bg-background px-6 py-4 transition-colors hover:bg-card"
			>
				<ArrowRight class="h-4 w-4 text-muted-foreground" />
				<span class="font-ui text-xs tracking-wider">HELP CENTER</span>
			</a>
			<a
				href={localizeHref('/app/tickets')}
				class="flex items-center gap-3 bg-background px-6 py-4 transition-colors hover:bg-card"
			>
				<ArrowRight class="h-4 w-4 text-muted-foreground" />
				<span class="font-ui text-xs tracking-wider">MY TICKETS</span>
			</a>
			<a
				href={localizeHref('/status')}
				class="flex items-center gap-3 bg-background px-6 py-4 transition-colors hover:bg-card"
			>
				<ArrowRight class="h-4 w-4 text-muted-foreground" />
				<span class="font-ui text-xs tracking-wider">SYSTEM STATUS</span>
			</a>
		</div>
	</section>
</div>
