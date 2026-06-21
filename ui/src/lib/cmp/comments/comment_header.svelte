<script lang="ts">
	interface Props {
		comment: TComment;
		timeAgo: string;
		levelDots: number;
	}

	let { comment, timeAgo, levelDots }: Props = $props();

	const avatarColors = [
		'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
		'bg-violet-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-orange-500'
	]
	function hashColor(name: string): string {
		let h = 0
		for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
		return avatarColors[Math.abs(h) % avatarColors.length]
	}
	let avatarColor = $derived(hashColor(comment.poster))
</script>

<div class="flex items-center gap-2 relative">
	{#if comment.level > 0}
			<div class="absolute -left-3 top-1/2 -mt-px h-[1.5px] w-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
		{/if}
		<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full {avatarColor} text-[11px] font-bold text-white">
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
