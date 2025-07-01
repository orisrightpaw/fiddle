<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-zinc-800 rounded-lg p-3.5">
	{@render children()}
</div>
