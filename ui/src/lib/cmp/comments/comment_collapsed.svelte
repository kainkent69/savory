<script lang="ts">
	interface Props {
		comment: TComment;
		levelDots: number;
		onexpand: () => void;
	}

	let { comment, levelDots, onexpand }: Props = $props();
</script>

<button
	data-collapsed-toggler
	onclick={onexpand}
	class="w-full text-left flex items-center gap-1.5 rounded-lg py-1.5 px-1 text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
>
	<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-[10px] font-bold text-white">
		{comment.avatar}
	</div>
	<span class="font-medium text-gray-700 dark:text-gray-300">{comment.poster}</span>
	<span class="text-gray-400 dark:text-gray-500">·</span>
	<span class="truncate max-w-[200px]">
		{comment.comment.slice(0, 60)}{comment.comment.length > 60 ? '...' : ''}
	</span>
	<span class="flex items-center gap-0.5 ml-auto">
		{#each Array(levelDots) as _, i}
			<span class="h-1 w-1 rounded-full {i < comment.level ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-400 dark:bg-blue-500'}"></span>
		{/each}
	</span>
</button>
