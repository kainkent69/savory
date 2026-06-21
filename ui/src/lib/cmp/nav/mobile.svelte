<script lang="ts">
	interface NavItem {
		label: string;
		icon: string; // raw SVG string
	}

	let { items }: { items: NavItem[] } = $props();

	let activeIdx = $state(2); // default: Home at center

	function select(idx: number) {
		activeIdx = idx;
	}

	function extractPath(raw: string): string {
		const m = raw.match(/d="([^"]+)"/);
		return m ? m[1] : '';
	}
</script>

<nav class="sticky bottom-0 z-20 flex items-end justify-around border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-md pb-safe">
	{#each items as item, i}
		{@const isActive = activeIdx === i}
		{@const isCenter = i === 2}

		{#if isCenter}
			<!-- ★ HOME — biggest, overflows above nav, white bg -->
			<button
				onclick={() => select(i)}
				class="group relative -mt-5 flex flex-col items-center gap-0.5"
			>
				<!-- white circle overflows above nav bar -->
				<span class="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white dark:border-black bg-blue-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 transition-all duration-300 ease-out {isActive ? 'scale-100 shadow-blue-500/40' : 'scale-[0.85] shadow-gray-300/20 dark:shadow-gray-800/30'}">
					<svg class="h-7 w-7 text-white transition-transform duration-300 ease-out {isActive ? 'scale-110' : 'scale-100'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d={extractPath(items[2].icon)}/>
					</svg>
				</span>
				<!-- label -->
				<span class="text-[11px] font-bold text-blue-600 dark:text-blue-400 transition-all duration-200 {isActive ? 'opacity-100' : 'opacity-60'}">
					{item.label}
				</span>
			</button>
		{:else}
			<!-- side items -->
			<button
				onclick={() => select(i)}
				class="relative flex flex-col items-center gap-0.5 py-2 transition-all duration-200 ease-out {isActive ? 'text-gray-900 dark:text-gray-100 scale-105' : 'text-gray-400 dark:text-gray-500 scale-100 hover:text-gray-600 dark:hover:text-gray-300'}"
			>
				<!-- top indicator bar -->
				<span class="absolute -top-px left-1/2 -translate-x-1/2 h-1 w-8 rounded-b-full bg-gray-900 dark:bg-gray-100 transition-all duration-300 ease-out {isActive ? 'opacity-100 w-8' : 'opacity-0 w-0'}"></span>

				<!-- icon -->
				<svg class="h-6 w-6 transition-transform duration-200 {isActive ? 'scale-110' : 'scale-100'}" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" stroke-width={isActive ? '0' : '2'} stroke-linecap="round" stroke-linejoin="round">
					<path d={extractPath(item.icon)}/>
				</svg>

				<!-- label -->
				<span class="text-[10px] font-medium transition-all duration-200 {isActive ? 'font-bold opacity-100' : 'opacity-80'}">
					{item.label}
				</span>
			</button>
		{/if}
	{/each}
</nav>
