<script lang="ts">
	import { wallstore, requestWall, type FeedItem } from '$lib/scripts/feed';
	import { seedWall } from '$lib/scripts/feed_mock';
	import PostCard from './post_card.svelte';
	import { logger } from '$lib/logger';

	const log = logger('cmp:feed');

	let items = $state<FeedItem[]>([]);
	let loading = $state(false);
	let exhausted = $state(false); // true when mock returns empty (1/10)

	wallstore.subscribe(v => {
		items = v;
	});

	async function loadMore() {
		if (loading || exhausted) return;
		loading = true;
		log.debug('loading more...');
		const batch = await requestWall();
		if (batch.length === 0) {
			exhausted = true;
			log.debug('no more items');
		}
		loading = false;
	}

	// IntersectionObserver on sentinel
	let sentinel = $state<HTMLDivElement>();
	$effect(() => {
		const el = sentinel;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) loadMore();
			},
			{ rootMargin: '400px' }, // trigger 400px before visible
		);
		obs.observe(el);
		return () => obs.disconnect();
	});
</script>

	<div id="beginning" class="h-0 scroll-mt-14"></div>
<div class="divide-y divide-gray-100 dark:divide-gray-800">
	{#each items as item (item.kind + '_' + (item.data as any).id)}
		{#if item.kind === 'post'}
			<PostCard item={item} />
		{:else if item.kind === 'pool'}
			<div class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
				📊 Pool: {(item.data as any).question ?? '?'} — {(item.data as any).vote_count} votes
			</div>
		{:else if item.kind === 'riddle'}
			<div class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
				❓ Riddle: {(item.data as any).question ?? '?'}
			</div>
		{/if}
	{/each}

	<!-- sentinel for infinite scroll -->
	<div bind:this={sentinel} class="h-1"></div>

	<!-- loading indicator -->
	{#if loading}
		<div class="flex items-center justify-center py-4 gap-2 text-sm text-gray-500 dark:text-gray-400">
			<span class="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0ms]"></span>
			<span class="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:150ms]"></span>
			<span class="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:300ms]"></span>
		</div>
	{:else if exhausted}
		<div class="py-6 text-center text-xs text-gray-400 dark:text-gray-500">
			— end of feed — <button onclick={() => { seedWall(); exhausted = false; location.hash = 'beginning'; }} class="text-blue-600 dark:text-blue-400 hover:underline">reload ↑</button> —
		</div>
	{/if}
</div>
