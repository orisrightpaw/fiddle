<script>
	import { user } from '$lib/client/stores.svelte';
</script>

<div class="bg-zinc-800/50 rounded-lg">
	<div class="bg-zinc-800 rounded-lg p-2">
		<a href="/profile/{user.data?.username}" class="flex h-12 gap-2 group w-fit">
			<img
				class="rounded-full aspect-square"
				src="/img/demo/users/tim.jpg"
				alt="@fortnite's profile icon"
			/>
			<div class="grid">
				<p
					class="font-bold my-auto leading-5 group-hover:underline text-white overflow-ellipsis line-clamp-1"
				>
					{user.data?.name}
				</p>
				<p class="text-white/50 leading-5 overflow-ellipsis line-clamp-1">@{user.data?.username}</p>
			</div>
		</a>
	</div>
	<div class="p-2 flex place-content-between text-lg">
		<div>
			<button
				class="w-9 aspect-square rounded-md bg-zinc-900 hover:bg-zinc-700 cursor-pointer"
				title="Sweeney buton"
				aria-label="Sweeney buton"
			>
				<img class="h-6 mx-auto" src="/img/demo/users/tim.jpg" alt="" />
			</button>
		</div>
		<div>
			<a
				href="/api/v1/logout"
				class="w-9 aspect-square rounded-md flex place-items-center bg-zinc-900 hover:bg-red-500/50 cursor-pointer"
				title="Logout"
				aria-label="Logout"
			>
				<i class="ri-logout-box-line mx-auto text-lg"></i>
			</a>
		</div>
	</div>
</div>
