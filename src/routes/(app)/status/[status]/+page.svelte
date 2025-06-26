<script lang="ts">
	import Status from '$lib/components/Status.svelte';

	const { data } = $props();
</script>

<!-- 
<div class="grid gap-2">
	{#if data.post}
		<Status
			id={data.post?.id}
			author={data.post?.author}
			image={data.post?.image}
			content={data.post?.content}
		></Status>
	{/if}
</div> -->
