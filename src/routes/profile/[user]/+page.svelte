<script>
	let { data } = $props();

	import Field from '$lib/components/Layout/Field.svelte';
	import ActorImageObject from '$lib/components/Layout/ActorImageObject.svelte';
</script>

<div class="grid gap-2">
	<div class="bg-zinc-800 rounded-lg grid gap-3 relative">
		<img class="rounded-lg" src="/img/demo/banners/fortnite.jpg" alt="" />
		<div class="z-10 w-fit absolute top-3 left-3 rounded-lg bg-zinc-900/90 p-3">
			<ActorImageObject actor={data.actor}></ActorImageObject>
		</div>
		<div class="px-3 pb-3 grid">
			{#if data.actor.summary}
				<p class="whitespace-pre-wrap my-4 text-white">{data.actor.summary}</p>
			{/if}
			<div class="grid gap-2">
				<div class="flex flex-wrap gap-2">
					<Field name="Posts">0</Field>
					<Field name="Following">0</Field>
					<Field name="Followers">0</Field>
					<Field name="Registered">{new Date(0).toDateString()}</Field>
				</div>
				<!-- <div class="flex flex-wrap gap-2">
					{#each Array(0) as _}
						<Field name="Website">
							<a class="text-accent underline" href="https://epicgames.com">
								https://epicgames.com
							</a>
						</Field>
					{/each}
				</div> -->
			</div>
		</div>
	</div>
</div>
