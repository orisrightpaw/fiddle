<script lang="ts">
	const { name, children } = $props();
</script>

<dl class="bg-zinc-900 rounded-lg py-2 px-2.5 flex-grow">
	<dt class="font-bold text-white">{name}</dt>
	<dd>{@render children()}</dd>
</dl>
