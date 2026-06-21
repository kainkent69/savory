<script lang="ts">
	interface Props {
		/** popover opens above or below the trigger */
		position?: 'top' | 'bottom';
		/** force-show via JS (long-press). when false, relies on group-hover */
		show?: boolean;
		/** children snippet — the popover body */
		children: any;
	}

	let { position = 'bottom', show = false, children }: Props = $props();
</script>

<div
	class="absolute z-40 {position === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5'} left-0
		rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg
		{show ? 'block' : 'hidden group-hover:block'}"
>
	<!-- arrow pointer -->
	<div
		class="absolute {position === 'bottom' ? '-top-1.5' : '-bottom-1.5'} left-4 h-3 w-3 rotate-45
			border-l border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
	></div>
	{@render children()}
</div>
