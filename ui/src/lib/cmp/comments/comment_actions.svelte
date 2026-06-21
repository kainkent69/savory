<script lang="ts">
	import Popover from '$lib/cmp/popover.svelte';
	import chevron_left from '$lib/assets/chevron_left.svg?raw';
	import chevron_right from '$lib/assets/chevron_right.svg?raw';
	import chevron_up from '$lib/assets/chevron_up.svg?raw';
	import chevron_down from '$lib/assets/chevron_down.svg?raw';
	import comment_icon from '$lib/assets/comment.svg?raw';

	interface Props {
		comment: TComment;
		engagements: { up: number; down: number };
		hasPrev: boolean;
		hasNext: boolean;
		replying: boolean;
		currentEmote: string | null;
		showEmotes: boolean;
		ontoggle_emotes: () => void;
		onselect_emote: (emote: string) => void;
		ontoggle_reply: () => void;
		ongoprev: () => void;
		ongonext: () => void;
	}

	let {
		comment,
		engagements,
		hasPrev,
		hasNext,
		replying,
		currentEmote,
		showEmotes,
		ontoggle_emotes,
		onselect_emote,
		ontoggle_reply,
		ongoprev,
		ongonext
	}: Props = $props();

	const miniEmotes = ['👍', '❤️', '😂', '🔥'];

	function fmt(n: number): string {
		if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
		if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
		return String(n);
	}
</script>

<div class="mt-2 flex items-center justify-between">
	<!-- left cluster -->
	<div class="flex items-center gap-0.5">
		<!-- upvote with emotes -->
		<div class="group relative">
			<button
				onclick={ontoggle_emotes}
				class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
					{currentEmote
						? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'
						: 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'}"
				aria-label={currentEmote ? currentEmote : 'Upvote'}
			>
				{#if currentEmote}
					<span class="text-sm leading-none">{currentEmote}</span>
				{:else}
					<span class="icon h-4 w-4">{@html chevron_up}</span>
				{/if}
				{#if engagements.up > 0}
					<span>{fmt(engagements.up)}</span>
				{/if}
			</button>

			<Popover position="bottom" show={showEmotes}>
				<div class="flex items-center gap-0.5 px-1.5 py-1.5">
					{#each miniEmotes as em}
						<button
							onclick={() => onselect_emote(em)}
							class="flex items-center justify-center h-7 w-7 rounded-lg text-sm leading-none transition hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-95"
							aria-label={em}
						>
							{em}
						</button>
					{/each}
				</div>
			</Popover>
		</div>

		<!-- downvote -->
		<button
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
			aria-label="Downvote"
		>
			<span class="icon h-4 w-4">{@html chevron_down}</span>
			{#if engagements.down > 0}
				<span>{fmt(engagements.down)}</span>
			{/if}
		</button>

		<!-- reply -->
		<button
			onclick={ontoggle_reply}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				{replying
					? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'}"
			aria-label="Reply"
		>
			<span class="icon h-4 w-4">{@html comment_icon}</span>
			Reply
		</button>

		<!-- prev / next (only for replies) -->
		{#if comment.level > 0}
			<button
				onclick={ongoprev}
				disabled={!hasPrev}
				class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition disabled:opacity-20 disabled:pointer-events-none"
				aria-label="Previous comment"
			>
				<span class="icon h-4 w-4">{@html chevron_left}</span>
			</button>
			<button
				onclick={ongonext}
				disabled={!hasNext}
				class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition disabled:opacity-20 disabled:pointer-events-none"
				aria-label="Next comment"
			>
				<span class="icon h-4 w-4">{@html chevron_right}</span>
			</button>
		{/if}
	</div>

	<!-- right: engagement summary -->
	<span class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 tabular-nums">
		<span>{fmt(engagements.up)}↑</span>
		<span>{fmt(engagements.down)}↓</span>
	</span>
</div>
