<script lang="ts">
	import { page } from '$app/state';
	import { siteConfig } from '$lib/config/site';

	const title = $derived(
		page.data?.title ? `${page.data.title} - ${siteConfig.name}` : siteConfig.name,
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta content={siteConfig.description} name="description" />
	<meta content={siteConfig.keywords} name="keywords" />
	<meta content="mostlywhat" name="author" />
	<meta content="summary_large_image" name="twitter:card" />
	<meta content={siteConfig.url} name="twitter:site" />
	<meta content={title} name="twitter:title" />
	<meta content={siteConfig.description} name="twitter:description" />
	<meta content={siteConfig.ogImage} name="twitter:image" />
	<meta content={siteConfig.name} name="twitter:image:alt" />
	<meta content="mostlywhat" name="twitter:creator" />
	<meta content={title} property="og:title" />
	<meta content="article" property="og:type" />
	<meta content={siteConfig.url + page.url.pathname} property="og:url" />
	<meta content={siteConfig.ogImage} property="og:image" />
	<meta content={siteConfig.name} property="og:image:alt" />
	<meta content="1200" property="og:image:width" />
	<meta content="630" property="og:image:height" />
	<meta content={siteConfig.description} property="og:description" />
	<meta content={siteConfig.name} property="og:site_name" />
	<meta content="EN_US" property="og:locale" />
	<link href="/favicon-16x16.png" rel="shortcut icon" />
	<link href="/apple-touch-icon.png" rel="apple-touch-icon" />
</svelte:head>