/**
 * Analytics Chart Components
 * 
 * Reusable chart components for the analytics dashboard using shadcn-svelte chart system
 */

<script lang="ts">
	import * as Chart from '$lib/components/ui/chart';
	// @ts-ignore - layerchart internal dependency
	import { BarChart, PieChart } from 'layerchart';

	interface ChartDataset {
		label: string;
		data: number[];
		backgroundColor?: string | string[];
		borderColor?: string;
		fill?: boolean;
	}

	interface ChartData {
		labels: string[];
		datasets: ChartDataset[];
	}

	interface Props {
		type: 'line' | 'bar' | 'doughnut' | 'pie';
		data: ChartData;
		options?: {
			responsive?: boolean;
			maintainAspectRatio?: boolean;
			plugins?: any;
			scales?: any;
		};
		height?: number;
		class?: string;
	}

	let { type = 'line', data, options, height = 300, class: className }: Props = $props();

	// Transform Chart.js format to layerchart format for bar charts
	const transformedData = $derived(() => {
		if (!data || !data.labels || !data.datasets) return [];

		return data.labels.map((label, index) => {
			const point: any = { label };

			data.datasets.forEach((dataset) => {
				const key = dataset.label.toLowerCase().replace(/\s+/g, '_');
				point[key] = dataset.data[index] || 0;
			});

			return point;
		});
	});

	// Generate chart config from datasets
	const chartConfig = $derived(() => {
		if (!data || !data.datasets) return {};

		const config: Chart.ChartConfig = {};

		data.datasets.forEach((dataset, index) => {
			const key = dataset.label.toLowerCase().replace(/\s+/g, '_');
			const backgroundColor = Array.isArray(dataset.backgroundColor)
				? dataset.backgroundColor[0]
				: dataset.backgroundColor;
			const color = dataset.borderColor || backgroundColor || `hsl(var(--chart-${(index % 5) + 1}))`;

			config[key] = {
				label: dataset.label,
				color: typeof color === 'string' ? color : `hsl(var(--chart-${(index % 5) + 1}))`
			};
		});

		return config;
	});

	// Get series configuration for bar charts
	const series = $derived.by(() => {
		if (!data || !data.datasets) return [];

		return data.datasets.map((dataset, index) => {
			const key = dataset.label.toLowerCase().replace(/\s+/g, '_');
			const configKey = chartConfig()[key];

			return {
				key,
				label: dataset.label,
				color: configKey?.color || `hsl(var(--chart-${(index % 5) + 1}))`
			};
		});
	});

	// For pie/doughnut charts - transform to simple format
	const pieData = $derived(() => {
		if (!data || !data.datasets || data.datasets.length === 0) return [];

		const dataset = data.datasets[0];
		return data.labels.map((label, index) => {
			const backgroundColor = Array.isArray(dataset.backgroundColor)
				? dataset.backgroundColor[index]
				: dataset.backgroundColor;

			return {
				name: label,
				value: dataset.data[index] || 0
			};
		});
	});

	// Pie chart config
	const pieConfig = $derived(() => {
		if (!data || !data.datasets || data.datasets.length === 0) return {};

		const config: Chart.ChartConfig = {};
		const dataset = data.datasets[0];

		data.labels.forEach((label, index) => {
			const key = label.toLowerCase().replace(/\s+/g, '_');
			const backgroundColor = Array.isArray(dataset.backgroundColor)
				? dataset.backgroundColor[index]
				: dataset.backgroundColor;

			config[key] = {
				label,
				color: typeof backgroundColor === 'string' ? backgroundColor : `hsl(var(--chart-${(index % 5) + 1}))`
			};
		});

		return config;
	});
</script>

<Chart.Container
	config={type === 'pie' || type === 'doughnut' ? pieConfig() : chartConfig()}
	class={className}
	style="height: {height}px"
>
	{#if type === 'bar'}
		<BarChart data={transformedData()} x="label" {series} legend>
			{#snippet tooltip()}
				<Chart.Tooltip />
			{/snippet}
		</BarChart>
	{:else if type === 'line'}
		<!-- Line charts using BarChart with line mode for now -->
		<BarChart data={transformedData()} x="label" {series} legend>
			{#snippet tooltip()}
				<Chart.Tooltip />
			{/snippet}
		</BarChart>
	{:else if type === 'pie' || type === 'doughnut'}
		<PieChart data={pieData()} value={(d: any) => d.value} innerRadius={type === 'doughnut' ? 0.5 : 0} legend>
			{#snippet tooltip()}
				<Chart.Tooltip />
			{/snippet}
		</PieChart>
	{/if}
</Chart.Container>
