<script lang="ts">
	import { type FeedItem, type Post } from '$lib/scripts/feed';
	import FollowPill from './follow_pill.svelte';
	import PostActions from './post_actions.svelte';
	import { post as postQuery } from '$lib/../state';

	interface Props {
		item: FeedItem;
	}

	let { item }: Props = $props();

	let post = $derived({ badges: [], verified: false, ...item.data } as Post);
	let timeAgo = $derived(ago(item.crt_at));
	let showBadges = $state(false);
	let expanded = $state(false);
	let truncated = $derived(smartTruncate(post.content, 200));
	let showMoreBtn = $derived(truncated !== post.content);

	function smartTruncate(text: string, max: number): string {
		if (text.length <= max) return text;
		const cut = text.lastIndexOf(" ", max);
		const at = cut > max - 40 ? cut : max;
		const remaining = text.length - at;
		if (remaining < 15) return text;
		return text.slice(0, at);
	}
	let showTags = $state(false);
	let showProfile = $state(false);

	let textSize = $derived(
		post.content.length < 80 ? 'text-lg leading-snug' :
		post.content.length < 150 ? 'text-base leading-snug' :
		'text-sm leading-normal'
	);


	function ago(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const m = Math.floor(diff / 60000);
		if (m < 60) return `${m}m`;
		const h = Math.floor(m / 60);
		if (h < 24) return `${h}h`;
		return `${Math.floor(h / 24)}d`;
	}

</script>

<article
	class="flex gap-3 py-5 px-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
>
	<!-- avatar -->
	<div class="shrink-0 cursor-pointer" onclick={() => postQuery.set(String(post.id))}>
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-bold text-white">
			{post.username[0]}
		</div>
	</div>

	<!-- body -->
	<div class="flex-1 min-w-0">
	<div class="cursor-pointer" onclick={() => postQuery.set(String(post.id))}>
		<!-- user row: name [+ verified] + badges + sponsored -->
		<div class="flex items-center gap-1.5 flex-wrap">
			<!-- name with profile popover -->
			<span class="relative" onmouseenter={() => showProfile = true} onmouseleave={() => showProfile = false}>
				<span class="text-sm font-bold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{post.username}</span>
				{#if showProfile}
					<div class="absolute z-50 top-full left-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-4">
						<div class="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"></div>
						<div class="flex items-center gap-3">
							<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-lg font-bold text-white">{post.username[0]}</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-1">
									<span class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{post.username}</span>
									{#if post.verified}<span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white"><svg class="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></span>{/if}
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">{post.handle}</span>
							</div>
						</div>
						<p class="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">Building things and sharing thoughts. Joined Savory early.</p>
						<div class="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							<span><strong class="text-gray-900 dark:text-gray-100">1.2K</strong> followers</span>
							<span><strong class="text-gray-900 dark:text-gray-100">348</strong> following</span>
						</div>
					<div class="mt-3">
						<FollowPill size="sm" />
					</div>
					</div>
				{/if}
			</span>

			{#if post.verified}
				<span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
					<svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
					</svg>
				</span>
			{/if}

			<!-- badges stack -->
			{#if post.badges.length > 0}
				<button onclick={(e) => { e.stopPropagation(); showBadges = !showBadges; }} class="relative flex items-center gap-0 cursor-pointer">
					{#each post.badges.slice(0, 3) as badge, j}
						<span
							class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none ring-1 ring-white dark:ring-black {badge.color}"
							style="margin-left: {j > 0 ? '-4px' : '0'}; z-index: {3 - j}"
						>
							{badge.icon}
						</span>
					{/each}
					{#if post.badges.length > 3}
						<span
							class="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-[8px] font-bold text-gray-600 dark:text-gray-300 ring-1 ring-white dark:ring-black"
							style="margin-left: -4px; z-index: 0"
						>
							+{post.badges.length - 3}
						</span>
					{/if}

					<!-- popover -->
					{#if showBadges}
						<div class="absolute top-full left-0 mt-1.5 z-40 rounded-lg border border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg p-1 min-w-[150px]">
							{#each post.badges as badge}
								<div class="flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-[9px]">
									<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] {badge.color}">{badge.icon}</span>
									<span class="font-medium text-gray-700 dark:text-gray-300">{badge.label}</span>
								</div>
							{/each}
						</div>
					{/if}
				</button>
			{/if}

			<!-- popover backdrop -->
			{#if showBadges}
				<button class="fixed inset-0 z-30 cursor-default" onclick={(e) => { e.stopPropagation(); showBadges = false; }}></button>
			{/if}

			{#if post.sponsored}
				<span class="ml-auto text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide">Sponsored</span>
			{/if}
		</div>

		<!-- meta row: handle · time -->
		<div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
			<span>{post.handle}</span>
			<span>·</span>
			<span>{timeAgo}</span>
		</div>

		<!-- content -->
		<div class="mt-1.5 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words {textSize}">
			{expanded ? post.content : truncated + (showMoreBtn ? "..." : "")}
		</div>
		{#if showMoreBtn}
			<button onclick={(e) => { e.stopPropagation(); expanded = !expanded; }} class="mt-0.5 text-xs text-blue-600 dark:text-blue-400 hover:underline">
				{expanded ? 'Show less' : 'Show more'}
			</button>
		{/if}

		<!-- tags -->
		{#if post.tags.length > 0}
			<div
				class="mt-2.5 transition-all duration-300 ease-out cursor-pointer max-w-full"
				onclick={() => showTags = !showTags}
			>
				<div class="flex items-center {showTags ? 'flex-wrap gap-1.5' : 'flex-nowrap gap-0 overflow-hidden'}">
					{#each showTags ? post.tags : post.tags.slice(0, 5) as tag, j}
						<span
							class="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 ring-1 ring-white dark:ring-black transition-all duration-300 ease-out cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 shrink-0 {showTags ? '' : 'max-w-[90px] truncate'}"
							style="margin-left: {!showTags && j > 0 ? '-8px' : '0'}; z-index: {showTags ? 'auto' : 10 - j}"
						>
							{tag}
						</span>
					{/each}
					{#if !showTags && post.tags.length > 5}
						<span
							class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 ring-1 ring-white dark:ring-black shrink-0 transition-all duration-300 ease-out"
							style="margin-left: -8px; z-index: 0"
						>
							+{post.tags.length - 5} more
						</span>
					{/if}
				</div>
			</div>
		{/if}

		</div>

		<PostActions post={post} votes={item.votes} commentCount={342} mostRelevant={item.most_relevant} />
	</div>
</article>
