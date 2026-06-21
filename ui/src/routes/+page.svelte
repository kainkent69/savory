<script lang="ts">
	import Feed from '$lib/cmp/feed/feed.svelte';
	import PostDetail from './post_detail.svelte';
	import { post as postQuery } from '../state';
	import { wallstore, type FeedItem } from '$lib/scripts/feed';
	import { onDestroy } from 'svelte';

	let searchOpen = $state(false);
	let searchQuery = $state('');

	let selectedItem = $state<FeedItem | null>(null);
	let wallItems = $state<FeedItem[]>([]);

	const unsubWall = wallstore.subscribe(v => { wallItems = v; });
	onDestroy(() => unsubWall());

	// keep selectedItem in sync with $postQuery
	let selectedId = $state<string | null>(null);
	const unsubPost = postQuery.subscribe(v => { selectedId = v; });
	onDestroy(() => unsubPost());

	$effect(() => {
		if (selectedId) {
			selectedItem = wallItems.find(
				item => String((item.data as any).id) === selectedId
			) ?? null;
		} else {
			selectedItem = null;
		}
	});
</script>

<!-- Mobile header: logo | messages | notifications -->
<div class="md:hidden sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur">
	<div class="flex items-center gap-2 px-3 py-2">
		<!-- Logo -->
		<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">S</div>

		<!-- spacer -->
		<div class="flex-1"></div>

		<!-- Search -->
		<button onclick={() => searchOpen = true} class="flex items-center justify-center h-9 w-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
		</button>

		<!-- Messages -->
		<button class="flex items-center justify-center h-9 w-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
		</button>

		<!-- Notifications -->
		<button class="relative flex items-center justify-center h-9 w-9 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
			<span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-1 ring-white dark:ring-black"></span>
		</button>
	</div>
</div>

<!-- Mobile search overlay -->
{#if searchOpen}
	<div class="md:hidden fixed top-12 inset-x-0 bottom-0 z-50 bg-white dark:bg-black flex flex-col animate-in fade-in duration-150">
		<div class="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-800">
			<button onclick={() => { searchOpen = false; searchQuery = ''; }} class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
			</button>
			<div class="flex-1 relative">
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
				<input type="text" bind:value={searchQuery} placeholder="Search" class="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 h-9 pl-9 pr-9 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition" autofocus/>
				{#if searchQuery}
					<button onclick={() => searchQuery = ''} class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
					</button>
				{/if}
			</div>
		</div>
		<div class="flex-1 overflow-y-auto px-4">
			{#if searchQuery}
				<p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-8">Searching: <span class="font-medium text-gray-900 dark:text-gray-100">{searchQuery}</span></p>
			{:else}
				<div class="space-y-4">
					<p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recent</p>
					<div class="flex flex-wrap gap-2">
						{#each ['#BeWholesome', 'Savory app', 'Tech news', 'Jane Cooper'] as recent}
							<button onclick={() => searchQuery = recent} class="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">{recent}</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Desktop header -->
<div class="hidden md:block sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur">
	<h1 class="px-4 py-3 text-xl font-bold text-gray-900 dark:text-gray-100">Home</h1>
</div>


<Feed />

{#if selectedItem}
	<PostDetail feedItem={selectedItem} />
{/if}

<!-- mobile spacer -->
<div class="md:hidden h-14" aria-hidden="true"></div>
