<script>
	let { data } = $props();

	import Field from '$lib/components/Layout/Field.svelte';
	import Status from '$lib/components/Status.svelte';
</script>

<div class="grid gap-2">
	<div class="bg-zinc-800 rounded-lg grid gap-3">
		<div class="relative h-[256px]">
			<img class="rounded-lg absolute top-0" src="/img/demo/banners/fortnite.jpg" alt="" />
			<div class="z-10 absolute top-43 left-3 rounded-lg bg-zinc-900/90 p-3">
				<div class="flex h-12 gap-2 w-fit">
					<img
						class="rounded-full aspect-square"
						src="/img/demo/users/tim.jpg"
						alt="@{data.actor.handle}'s profile icon"
					/>
					<div class="grid">
						<p class="font-bold my-auto leading-5 text-white overflow-ellipsis line-clamp-1">
							{data.actor.name}
						</p>
						<p class="text-white/50 leading-5 overflow-ellipsis line-clamp-1">
							@{data.actor.handle}
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="px-3 pb-3 grid">
			{#if data.actor.summary}
				<p class="whitespace-pre-wrap my-4">{data.actor.summary}</p>
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

	{#each Array(0) as _}
		<Status
			id={'whatever'}
			author={{ handle: 'fortnite', icon: '/img/demo/users/tim.jpg', name: 'Tim Sweeney' }}
			content="Buy my games"
		></Status>
	{/each}
</div>
