<script lang="ts">
	interface Props {
		size?: 'sm' | 'md';
	}

	let { size = 'md' }: Props = $props();
</script>

<span class="inline-flex items-center rounded-full {size === 'sm' ? '' : 'ring-1 ring-gray-200 dark:ring-gray-600'} bg-gray-100 dark:bg-gray-800 overflow-hidden">
	<button class="inline-flex items-center gap-1 {size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'} font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors cursor-pointer" title="Follow">
		<svg class={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
		Follow
	</button>
	<span class="h-4 w-px bg-gray-300 dark:bg-gray-600"></span>
	<button class="inline-flex items-center gap-1 {size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'} font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer" title="Network (must be accepted)">
		<svg class={size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
		Network
	</button>
</span>
