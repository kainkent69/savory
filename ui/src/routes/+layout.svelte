<script lang="ts">
	import './layout.css';
	import '$lib/logger'; // wires relog() / setlog() to window
	import Sidebar from '$lib/cmp/sidebar.svelte';
	import RightPanel from '$lib/cmp/right_panel.svelte';
	import MobileNav from '$lib/cmp/nav/mobile.svelte';
	import { search, message, home, bell, user, chevron_left, coin, bag } from '$lib/assets/icons/index';
	import { seedWall } from '$lib/scripts/feed_mock';

	seedWall(); // populate wall with stub data (delete feed_mock.ts when API ready)

	let { children } = $props();

	let collapsed = $state(false);
	let showRight = $state(true);

	// Home at center index 2: [  ] [  ] (home) [  ] [  ]
	const mobileNav = [
		{ label: 'Explore', icon: search },
		{ label: 'Earn', icon: coin },
		{ label: 'Home', icon: home },
		{ label: 'Store', icon: bag },
		{ label: 'Profile', icon: user },
	];
</script>

<svelte:head><link rel="icon" /></svelte:head>

<!-- Desktop: 3-column [sidebar | feed | panel] -->
<div class="mx-auto hidden h-screen md:flex max-w-[1260px] bg-white dark:bg-black">
	<!-- [1] Left: [menu | others] — collapsible -->
	<div class="shrink-0 border-r border-gray-200 dark:border-gray-800">
		<Sidebar {collapsed} ontoggle={() => collapsed = !collapsed} />
	</div>

	<!-- [2] Center: main feed — flexible -->
	<main class="flex-1 min-w-0 overflow-y-auto scroll-smooth border-r border-gray-200 dark:border-gray-800">
		{@render children()}
	</main>

	<!-- [3] Right — collapsible, close button inside RightPanel -->
	{#if showRight}
		<div class="w-[350px] shrink-0 overflow-y-auto overflow-x-hidden">
			<RightPanel onclose={() => showRight = false} />
		</div>
	{:else}
		<button
			onclick={() => showRight = true}
			class="flex h-10 w-10 shrink-0 items-center justify-center self-start mt-3 ml-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition"
			title="Show panel"
		>
			<span class="icon h-4 w-4">{@html chevron_left}</span>
		</button>
	{/if}
</div>

<!-- Mobile: feed full-width + bottom nav -->
<div class="flex h-screen flex-col md:hidden bg-white dark:bg-black">
	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>

	<MobileNav items={mobileNav} />
</div>
