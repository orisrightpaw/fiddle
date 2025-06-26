<script lang="ts">
	import '../app.css';
	let { children, data } = $props();

	import { user } from '$lib/client/stores.svelte';

	user.state = data.state;
	user.data = data.data;
</script>

<svelte:head>
	<title>Fiddle</title>
	<link rel="stylesheet" href="/css/styles/dark.css" />
	<link rel="preload" href="/css/styles/dark.css" as="style" />
	<link rel="stylesheet" href="/css/remixicon.css" />
	<link rel="preload" href="/css/remixicon.css" as="style" />
</svelte:head>

{@render children()}
