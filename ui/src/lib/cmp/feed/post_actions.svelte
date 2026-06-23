<script lang="ts">
	import { comment, repost, pin } from '$lib/assets/icons/index';
	import { type Post, type Votes } from '$lib/scripts/feed';
	import { onDestroy } from 'svelte';
	import Emote from '$lib/cmp/feed/emote.svelte';
	import { post as postQuery } from '$lib/../state';

	interface Props {
		post: Post;
		votes: Votes;
		commentCount?: number;
		mostRelevant?: TComment;
	}

	let { post, votes, commentCount = 0, mostRelevant }: Props = $props();

	let opened = $state(false);
	const unsub = postQuery.subscribe(v => { opened = v === String(post.id); });
	onDestroy(() => unsub());

	// ── interactive state ──

	let currentVote = $state(votes.vote);   // 0=none, 1=up, 2=down
	let currentRates = $state(0);
	let collectedEmotes = $state<string[]>([]);
	let pinned = $state(false);

	// ── vote handlers ──

	function setVote(v: 0 | 1 | 2) {
		currentVote = currentVote === v ? 0 : v;
	}

	function togglePin() {
		pinned = !pinned;
	}

	// ── derived ──

	let engagements = $derived(post.merits + post.emotes + commentCount);

	function fmt(n: number): string {
		if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
		if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
		return String(n);
	}

	const emoteMap: Record<string, string> = {
		eagle: '\u{1F985}',
		dragon: '\u{1F409}',
		unicorn: '\u{1F984}',
		crown: '\u{1F451}',
		phoenix: '\u{1F525}',
		supernova: '\u{1F31F}',
	};
</script>

<!-- action row -->
<div class="mt-2.5 -ml-1 flex items-center justify-between max-w-lg max-md:flex-col max-md:items-start max-md:gap-2">
	<!-- left cluster: upvote | downvote | emote | comments | repost | pin -->
	<div class="flex items-center gap-0.5">
		<!-- upvote -->
		<button
			onclick={() => setVote(1)}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				{currentVote === 1
					? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'}"
			aria-label="Upvote"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
			</svg>
			<span>{fmt(post.merits + (currentVote === 1 ? 1 : 0))}</span>
		</button>

		<!-- downvote -->
		<button
			onclick={() => setVote(2)}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition select-none
				{currentVote === 2
					? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}"
			aria-label="Downvote"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
			<span>{fmt(currentVote === 2 ? 1 : 0)}</span>
		</button>

		<!-- emote (star + custom emotes) -->
		<Emote bind:currentRates bind:collectedEmotes />

		<!-- comments -->
		<button
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
			aria-label="Comments"
		>
			<span class="icon h-4 w-4">{@html comment}</span>
			{#if commentCount > 0}
				<span>{fmt(commentCount)}</span>
			{/if}
		</button>

		<!-- repost -->
		<button
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition"
			aria-label="Repost"
		>
			<span class="icon h-4 w-4">{@html repost}</span>
		</button>

		<!-- pin -->
		<button
			onclick={togglePin}
			class="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition
				{pinned
					? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30'
					: 'text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'}"
			aria-label="Pin"
		>
			<span class="icon h-4 w-4">{@html pin}</span>
		</button>
	</div>

	<!-- right summary: emotes + merits + views -->
	<span class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 tabular-nums max-md:order-first max-md:w-full">
		{#if collectedEmotes.length > 0}
			{#each collectedEmotes.slice(0, 3) as key}
				{@const emoji = emoteMap[key]}
				{#if emoji}
					<span class="text-base leading-none">{emoji}</span>
				{/if}
			{/each}
		{/if}
		<span class="flex items-center gap-0.5 font-medium text-amber-500 dark:text-amber-400">
			<span>{fmt(post.merits)}</span>
			{#if currentRates > 0}
				<span class="text-amber-400 dark:text-amber-400/70">(+{currentRates})</span>
			{/if}
			<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		</span>
		<span>·</span>
		<span>{fmt(engagements)} views</span>
	</span>
</div>

<!-- comment preview (hidden when post is opened) -->
{#if mostRelevant && !opened}
	<div class="mt-2.5 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 px-3 py-2">
		<p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
			<span class="font-medium text-gray-500 dark:text-gray-500">{mostRelevant.poster}</span>
			<span class="text-gray-300 dark:text-gray-600 mx-1">·</span>
			{mostRelevant.comment}
		</p>
	</div>
{:else if commentCount > 0 && !opened}
	<div class="mt-2.5 rounded-lg bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 px-3 py-2">
		<p class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 italic">
			View {commentCount} comment{commentCount === 1 ? '' : 's'}
		</p>
	</div>
{/if}
