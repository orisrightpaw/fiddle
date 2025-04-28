<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	interface FeedSelectorProps {
		href: string;
		icon: string;
		children: Snippet;
	}

	const { href, icon, children }: FeedSelectorProps = $props();
</script>

<a {href} class={page.url.pathname + page.url.hash === href ? 'text-accent' : ''}>
	<i
		class={page.url.pathname + page.url.hash === href ? `${icon}-fill text-accent` : `${icon}-line`}
	></i>
	{@render children()}
</a>
