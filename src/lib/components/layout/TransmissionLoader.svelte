<script lang="ts">
	import { onMount } from 'svelte';
	
	interface Props {
		visible: boolean;
	}
	
	let { visible }: Props = $props();
	
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}/_';
	const targetText = 'LOADING TRANSMISSION';
	
	let displayText = $state(generateScrambled());
	let timestamp = $state(getTimestamp());
	let frameCount = $state(0);
	let signalStrength = $state(87);
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let timestampId: ReturnType<typeof setInterval> | null = null;
	
	function generateScrambled(): string {
		return targetText.split('').map(char => 
			char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
		).join('');
	}

	function getTimestamp(): string {
		const now = new Date();
		return now.toISOString().replace('T', ' ').slice(0, -5);
	}
	
	function startGlitch() {
		if (intervalId) clearInterval(intervalId);
		if (timestampId) clearInterval(timestampId);
		
		intervalId = setInterval(() => {
			displayText = targetText.split('').map((char) => {
				if (char === ' ') return ' ';
				return Math.random() > 0.3 ? char : chars[Math.floor(Math.random() * chars.length)];
			}).join('');
			frameCount++;
			signalStrength = 80 + Math.floor(Math.random() * 20);
		}, 50);

		timestampId = setInterval(() => {
			timestamp = getTimestamp();
		}, 1000);
	}
	
	function stopGlitch() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		if (timestampId) {
			clearInterval(timestampId);
			timestampId = null;
		}
	}
	
	$effect(() => {
		if (visible) {
			startGlitch();
		} else {
			stopGlitch();
		}
	});
	
	onMount(() => {
		return () => {
			stopGlitch();
		};
	});
</script>

{#if visible}
	<div class="transmission-loader">
		<!-- Scanlines overlay -->
		<div class="scanlines"></div>
		
		<!-- Top-left HUD info -->
		<div class="hud-corner hud-top-left">
			<div class="hud-line">
				<span class="hud-label">SYS://</span>
				<span class="hud-value">MOSTLYWHAT.SYSTEMS</span>
			</div>
			<div class="hud-line">
				<span class="hud-label">UTC:</span>
				<span class="hud-value">{timestamp}</span>
			</div>
			<div class="hud-line">
				<span class="hud-label">FRAME:</span>
				<span class="hud-value">{String(frameCount).padStart(6, '0')}</span>
			</div>
		</div>

		<!-- Top-right HUD info -->
		<div class="hud-corner hud-top-right">
			<div class="hud-line">
				<span class="hud-label">SIGNAL:</span>
				<span class="hud-value">{signalStrength}%</span>
			</div>
			<div class="hud-line">
				<span class="hud-label">MODE:</span>
				<span class="hud-value blink">STANDBY</span>
			</div>
			<div class="hud-line">
				<span class="hud-label">CH:</span>
				<span class="hud-value">07-ALPHA</span>
			</div>
		</div>
		
		<!-- Center reticle -->
		<div class="reticle">
			<div class="reticle-h"></div>
			<div class="reticle-v"></div>
			<div class="reticle-center"></div>
		</div>

		<!-- Main text -->
		<div class="loader-content">
			<span class="loader-bracket">[</span>
			<span class="loader-text">{displayText}</span>
			<span class="loader-bracket">]</span>
		</div>

		<!-- Bottom status bar -->
		<div class="hud-bottom">
			<span class="status-dot"></span>
			<span class="hud-mono">AWAITING_RESPONSE</span>
			<span class="hud-separator">|</span>
			<span class="hud-mono">BUFFER: OK</span>
			<span class="hud-separator">|</span>
			<span class="hud-mono">LATENCY: --ms</span>
		</div>
		
		<!-- Corner decorations -->
		<div class="corner corner-tl"></div>
		<div class="corner corner-tr"></div>
		<div class="corner corner-bl"></div>
		<div class="corner corner-br"></div>
	</div>
{/if}

<style>
	.transmission-loader {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			to bottom,
			rgba(0, 8, 20, 0.97),
			rgba(0, 8, 20, 0.95)
		);
		z-index: 50;
		animation: fadeIn 0.15s ease-out;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	.scanlines {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(0, 0, 0, 0.1) 2px,
			rgba(0, 0, 0, 0.1) 4px
		);
		pointer-events: none;
	}

	/* HUD Corners */
	.hud-corner {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.05em;
	}

	.hud-top-left {
		top: 2rem;
		left: 2rem;
		align-items: flex-start;
	}

	.hud-top-right {
		top: 2rem;
		right: 2rem;
		align-items: flex-end;
		text-align: right;
	}

	.hud-line {
		display: flex;
		gap: 0.5rem;
	}

	.hud-top-right .hud-line {
		justify-content: flex-end;
	}

	.hud-label {
		color: var(--muted-foreground);
		opacity: 0.6;
	}

	.hud-value {
		color: var(--foreground);
		opacity: 0.9;
	}

	.blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%, 50% { opacity: 0.9; }
		51%, 100% { opacity: 0.3; }
	}

	/* Center Reticle */
	.reticle {
		position: absolute;
		width: 120px;
		height: 120px;
		opacity: 0.15;
	}

	.reticle-h {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--foreground);
		transform: translateY(-50%);
	}

	.reticle-v {
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--foreground);
		transform: translateX(-50%);
	}

	.reticle-center {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		border: 1px solid var(--foreground);
		transform: translate(-50%, -50%);
	}
	
	.loader-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		z-index: 1;
	}

	.loader-bracket {
		font-family: var(--font-mono);
		font-size: clamp(1rem, 3vw, 1.5rem);
		color: var(--primary);
		opacity: 0.7;
	}
	
	.loader-text {
		font-family: var(--font-mono);
		font-size: clamp(0.7rem, 2vw, 0.9rem);
		letter-spacing: 0.25em;
		color: var(--foreground);
		animation: textFlicker 0.1s ease-in-out infinite alternate;
	}
	
	@keyframes textFlicker {
		0% { opacity: 0.85; }
		100% { opacity: 1; }
	}

	/* Bottom status */
	.hud-bottom {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		color: var(--muted-foreground);
		opacity: 0.7;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		background: var(--primary);
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 1; }
	}

	.hud-mono {
		text-transform: uppercase;
	}

	.hud-separator {
		opacity: 0.3;
	}
	
	/* Corner decorations */
	.corner {
		position: absolute;
		width: 24px;
		height: 24px;
		border-color: var(--foreground);
		opacity: 0.2;
	}
	
	.corner-tl {
		top: 1.5rem;
		left: 1.5rem;
		border-top: 1px solid;
		border-left: 1px solid;
	}
	
	.corner-tr {
		top: 1.5rem;
		right: 1.5rem;
		border-top: 1px solid;
		border-right: 1px solid;
	}
	
	.corner-bl {
		bottom: 1.5rem;
		left: 1.5rem;
		border-bottom: 1px solid;
		border-left: 1px solid;
	}
	
	.corner-br {
		bottom: 1.5rem;
		right: 1.5rem;
		border-bottom: 1px solid;
		border-right: 1px solid;
	}
</style>
