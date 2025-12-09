/**
 * Analytics Chart Components
 * 
 * Reusable chart components for the analytics dashboard
 */

<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChartConfiguration } from 'chart.js';

	interface Props {
		type: 'line' | 'bar' | 'doughnut' | 'pie';
		data: any;
		options?: any;
		height?: number;
	}

	let { type, data, options = {}, height = 300 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: any;

	async function initChart() {
		// Import Chart.js dynamically
		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		const config: ChartConfiguration = {
			type,
			data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				...options
			}
		};

		chart = new Chart(canvas, config);
	}

	onMount(() => {
		initChart();

		return () => {
			if (chart) {
				chart.destroy();
			}
		};
	});

	$effect(() => {
		// Update chart when data changes
		if (chart) {
			chart.data = data;
			chart.update();
		}
	});
</script>

<div class="chart-container" style="height: {height}px;">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
	}
</style>
