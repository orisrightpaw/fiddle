<script lang="ts">
	import type { Snippet } from 'svelte';

	interface LinkButtonProps {
		href: string;
		style: 'Primary' | 'Normal';
		children: Snippet;
	}

	const { href, style, children }: LinkButtonProps = $props();
</script>

{#if style === 'Primary'}
	<a class="text-center py-1.5 w-full bg-accent rounded-lg font-bold" {href}
		>{@render children()}
	</a>
{:else if style === 'Normal'}
	<a class="text-center py-1.5 w-full bg-zinc-600 rounded-lg font-bold" {href}
		>{@render children()}</a
	>
{/if}
