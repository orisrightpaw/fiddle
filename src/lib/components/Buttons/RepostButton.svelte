<script lang="ts">
	const { data } = $props();

	let reposted = $state(false);

	function onclick() {
		reposted = !reposted;
	}
</script>

<button
	class="flex gap-1.5 px-2 py-1 rounded-md {reposted
		? 'bg-indigo-500 hover:bg-indigo-400'
		: 'bg-zinc-900 hover:bg-zinc-700'} cursor-pointer"
	{onclick}
>
	<i class="ri-repeat-2-line"></i>
	<span class="h-full">100</span>
</button>
