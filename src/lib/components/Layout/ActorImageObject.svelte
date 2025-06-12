<script lang="ts">
	import type { Actor } from '$lib/types';

	let {
		actor
	}: {
		actor: Actor;
	} = $props();
</script>

<a href="/profile/{actor.preferredUsername}@{actor.domain}" class="flex h-12 gap-2 group w-fit">
	<img
		class="rounded-full aspect-square"
		src={actor.icon}
		alt="{actor.preferredUsername}@{actor.domain}'s profile icon"
		title="{actor.preferredUsername}@{actor.domain}'s profile icon"
	/>
	<div class="grid">
		<p
			class="font-bold my-auto leading-5 group-hover:underline text-white overflow-ellipsis line-clamp-1"
		>
			{actor?.name || actor.preferredUsername}
		</p>
		<p class=" text-accent leading-5 overflow-ellipsis line-clamp-1">
			{actor.preferredUsername}<span class="text-white/50">@{actor.domain}</span>
		</p>
	</div>
</a>
