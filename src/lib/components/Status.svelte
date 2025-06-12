<script lang="ts">
	interface StatusProps {
		id: string;
		actor: Actor;
		content: string;
		image?: {
			src: string;
			hidden: boolean;
		};
	}

	let { data }: { data: StatusProps } = $props();

	// import ImageContainer from '$lib/components/ImageContainer.svelte';
	import LikeButton from '$lib/components/Buttons/LikeButton.svelte';
	import RepostButton from '$lib/components/Buttons/RepostButton.svelte';
	import ActorImageObject from '$lib/components/Layout/ActorImageObject.svelte';
	import type { Actor } from '$lib/types';
</script>

<div id="status" class="bg-zinc-800 p-3.5 rounded-lg grid gap-3 shadow">
	<ActorImageObject actor={data.actor}></ActorImageObject>
	<div class="grid gap-3">
		<p id="status-content">
			{@html data.content}
		</p>
	</div>
	<div class="flex place-content-between">
		<div class="flex gap-2 w-fit">
			<a
				href="/status/{data.id}#reply"
				class="flex gap-1.5 px-2 py-1 rounded bg-zinc-900 hover:rounded-md hover:bg-zinc-700"
			>
				<i class="ri-chat-1-line"></i>
				<span class="h-full">0</span>
			</a>
			<RepostButton data={{}}></RepostButton>
			<LikeButton data={{}}></LikeButton>
		</div>
		<div>
			<button
				class="flex gap-1.5 px-2 py-1 rounded bg-zinc-900 hover:rounded-md hover:bg-zinc-700 cursor-pointer"
				aria-label="More"
			>
				<i class="ri-more-2-line"></i>
			</button>
		</div>
	</div>
</div>
