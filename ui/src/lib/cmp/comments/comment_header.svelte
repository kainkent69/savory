<script lang="ts">
	interface Props {
		comment: TComment;
		timeAgo: string;
		levelDots: number;
	}

	let { comment, timeAgo, levelDots }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-[11px] font-bold text-white">
		{comment.avatar}
	</div>
	<span class="text-[11px] font-bold text-gray-900 dark:text-gray-100">{comment.poster}</span>
	<span class="text-[10px] text-gray-400 dark:text-gray-500">{timeAgo}</span>

	{#if comment.level > 0}
		<span class="text-[9px] text-gray-400 dark:text-gray-500 font-mono">#{comment.index + 1}</span>
		<span class="flex items-center gap-0.5 ml-auto" title="Level {comment.level + 1}">
			{#each Array(levelDots) as _, i}
				<span class="h-1 w-1 rounded-full {i < comment.level ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-400 dark:bg-blue-500'}"></span>
			{/each}
		</span>
	{/if}
</div>
