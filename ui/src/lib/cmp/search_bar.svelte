<script lang="ts">
	interface SearchProps {
		placeholder?: string;
	}

	let { placeholder = 'Search' }: SearchProps = $props();
	let query = $state('');
</script>

<div class="relative w-full">
	<svg class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
	</svg>

	<input
		type="text"
		bind:value={query}
		placeholder={placeholder}
		class="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-10 pl-10 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition"
	/>

	{#if query}
		<button
			onclick={() => query = ''}
			class="absolute right-2 top-2 flex items-center justify-center h-6 w-6 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
		>
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
			</svg>
		</button>
	{/if}
</div>
