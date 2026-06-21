<script lang="ts">
	import SearchBar from './search_bar.svelte';

	interface Props {
		onclose?: () => void;
	}

	let { onclose }: Props = $props();

	const trends = [
		{ tag: '#BeWholesome', posts: '12.4K posts' },
		{ tag: '#SavoryLaunch', posts: '3.2K posts' },
		{ tag: '#SocialGood', posts: '8.1K posts' },
		{ tag: '#TechNews', posts: '45K posts' },
		{ tag: '#OpenSource', posts: '22K posts' },
	];

	const suggestions = [
		{ name: 'Jane Cooper', handle: '@janecooper' },
		{ name: 'Wade Warren', handle: '@wadewarren' },
		{ name: 'Esther Howard', handle: '@estherhoward' },
	];
</script>

<aside class="flex h-full flex-col gap-4 p-4">
	<!-- header: close button + search -->
	<div class="flex items-center gap-3">
		<SearchBar placeholder="Search" />
		{#if onclose}
			<button
				onclick={onclose}
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition"
				title="Hide panel"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
				</svg>
			</button>
		{/if}
	</div>

	<!-- Trends -->
	<div class="rounded-xl bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
		<h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Trends for you</h2>
		<div class="mt-3 flex flex-col gap-3">
			{#each trends as trend}
				<div class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1 -mx-1 transition">
					<p class="text-sm font-medium text-gray-900 dark:text-gray-100">{trend.tag}</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">{trend.posts}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Who to follow -->
	<div class="rounded-xl bg-gray-50 dark:bg-gray-900 p-4">
		<h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Who to follow</h2>
		<div class="mt-3 flex flex-col gap-3">
			{#each suggestions as person}
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-bold text-white">
						{person.name[0]}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{person.name}</p>
						<p class="text-xs text-gray-500 dark:text-gray-400 truncate">{person.handle}</p>
					</div>
					<button class="rounded-full bg-gray-900 dark:bg-gray-100 dark:text-gray-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-gray-700 dark:hover:bg-gray-300 transition shrink-0">
						Follow
					</button>
				</div>
			{/each}
		</div>
	</div>
</aside>
