<script lang="ts">
	interface StatusProps {
		id: string;
		author: {
			name: string;
			handle: string;
			icon: string;
		};
		image?: {
			src: string;
			hidden: boolean;
		};
		content: string;
	}

	let { id, author, image, content }: StatusProps = $props();

	import ImageContainer from '$lib/components/ImageContainer.svelte';
	import LikeButton from '$lib/components/Buttons/LikeButton.svelte';
	import RepostButton from '$lib/components/Buttons/RepostButton.svelte';
</script>

<div id="status" class="bg-zinc-800 p-3.5 rounded-lg grid gap-3 shadow">
	<a href="/profile/{author.handle}" class="flex h-12 gap-2 group w-fit">
		<img
			class="rounded-full aspect-square"
			src={author.icon}
			alt="@{author.handle}'s profile icon"
		/>
		<div class="grid">
			<p class="font-bold my-auto leading-5 group-hover:underline text-white">{author.name}</p>
			<p class="text-white/50 leading-5">@{author.handle}</p>
		</div>
	</a>
	<div class="grid gap-3">
		<p id="status-content">
			{content}
		</p>
		{#if image}
			<ImageContainer src={image.src} hidden={image.hidden}></ImageContainer>
		{/if}
	</div>
	<div class="flex place-content-between">
		<div class="flex gap-2 w-fit">
			<a
				href="/status/{id}#reply"
				class="flex gap-1.5 px-2 py-1 rounded bg-zinc-900 hover:rounded-md hover:bg-zinc-700"
			>
				<i class="ri-chat-1-line"></i>
				<span class="h-full">16</span>
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
