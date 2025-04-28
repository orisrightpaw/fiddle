<script lang="ts">
	const { data } = $props();

	let liked = $state(false);

	function onclick() {
		liked = !liked;
	}
</script>

<button
	class="flex gap-1.5 px-2 py-1 rounded-md {liked
		? 'bg-rose-500 hover:bg-rose-400'
		: 'bg-zinc-900 hover:bg-zinc-700'} cursor-pointer"
	{onclick}
>
	{#if liked}
		<i class="ri-heart-fill"></i>
	{:else}
		<i class="ri-heart-line"></i>
	{/if}
	<span class="h-full">2.6K</span>
</button>
