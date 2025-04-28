<div class="bg-zinc-800 rounded-lg p-2 flex gap-2">
	<i class="ri-heart-fill text-rose-500 text-2xl leading-7 my-auto"></i>
	<div class="grid gap-1.5">
		<div class="flex -space-x-2">
			{#each Array(12) as _}
				<img
					class="h-7 aspect-square rounded-full outline-3 outline-zinc-800"
					src="/img/demo/users/tim.jpg"
					alt=""
				/>
			{/each}
		</div>

		<p>
			<a href="/profile/fortnite" class="font-bold hover:underline text-accent">Tim Sweeney</a> and
			11 others liked your
			<a href="/status/475673647634" class="font-bold hover:underline text-accent">status</a>.
		</p>
	</div>
</div>
