<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/client/stores.svelte.js';

	const { data } = $props();

	import Status from '$lib/components/Status.svelte';

	onMount(() => {
		if (!user.authenticated) goto('/');
	});
</script>

<div class="bg-zinc-800 p-3.5 rounded-lg grid gap-2 shadow mb-2">
	<div class="grid">
		<input
			class="bg-zinc-900/65 rounded-t-lg p-2 resize-none"
			type="text"
			name="contentwarning"
			id="contentwarning"
			placeholder="Content Warning (Optional)"
		/>
		<textarea
			class="h-32 bg-zinc-900 rounded-b-lg p-2 resize-none"
			name="compose"
			id="compose"
			placeholder="Start typing here..."
		></textarea>
	</div>
	<div class="flex place-content-between">
		<div class="text-xl flex gap-2">
			<button
				class="h-full aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Add Media"
				aria-label="Add Media"
			>
				<i class="ri-image-line"></i>
			</button>
			<button
				class="h-full aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Add Poll"
				aria-label="Add Poll"
			>
				<i class="ri-bar-chart-horizontal-line"></i>
			</button>
			<button
				class="h-full aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Add Emoji"
				aria-label="Add Emoji"
			>
				<i class="ri-emoji-sticker-line"></i>
			</button>
		</div>
		<div class="flex gap-2">
			<div class="flex">
				<button
					class="h-full text-xl aspect-square rounded-l-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
					title="Followers Only"
					aria-label="Followers Only"
				>
					<i class="ri-group-line"></i>
				</button>
				<button
					class="h-full text-xl aspect-square bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
					title="Local Timeline"
					aria-label="Local Timeline"
				>
					<i class="ri-home-2-line"></i>
				</button>
				<button
					class="h-full text-xl aspect-square rounded-r-md bg-accent cursor-pointer"
					title="Global Timeline"
					aria-label="Global Timeline"
				>
					<i class="ri-earth-line"></i>
				</button>
			</div>
			<button class="text-center py-1.5 bg-accent rounded-lg font-bold w-24 cursor-pointer">
				Post
			</button>
		</div>
	</div>
</div>

<div class="grid gap-2">
	{#each data.statuses as post}
		<Status id={post.id} author={post.author} image={post.image} content={post.content}></Status>
	{/each}
</div>
