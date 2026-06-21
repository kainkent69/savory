<script lang="ts">
	import { type FeedItem, type Post, loadComment } from '$lib/scripts/feed';
	import { post as postQuery } from '../state';
	import PostActions from '$lib/cmp/feed/post_actions.svelte';
	import CommentCmp from '$lib/cmp/feed/comment.svelte';
	import { Comments } from '$lib/scripts/comments';

	interface Props {
		feedItem: FeedItem;
	}

	let { feedItem }: Props = $props();

	let p = $derived({ badges: [], verified: false, ...feedItem.data } as Post);

	let rootGroup = new Comments();
	rootGroup.level = 0;
	let comments = $state<TComment[]>([]);
	let offset = $state(0);
	let exhausted = $state(false);
	let loading = $state(false);
	let newComment = $state('');

	function submitComment() {
		const text = newComment.trim();
		if (!text) return;
		const c: TComment = {
			id: Date.now(),
			poster: 'You',
			comment: text,
			img: '',
			feed_id: (feedItem.data as Post).id,
			engagements: { views: 0, engagements: 0, up: 0, down: 0, pins: 0, star: 0, emote: 0 },
			index: 0,
			avatar: "Y",
			level: 0,
			replies: [],
			group: rootGroup,
			crt_at: Date.now(),
			up_at: Date.now(),
		};
		rootGroup.add([c]);
		comments = [c, ...rootGroup.comments];
		newComment = '';
	}

	let scrollEl = $state<HTMLDivElement>();
	let sentinel = $state<HTMLDivElement>();

	function close() {
		postQuery.set(null);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	async function loadMore() {
		if (loading || exhausted) return;
		loading = true;
		const batch = await loadComment((feedItem.data as Post).id, offset);
		if (batch.length === 0) {
			exhausted = true;
		} else {
			rootGroup.add(batch);
			comments = [...rootGroup.comments];
			offset++;
		}
		loading = false;
	}

	// initial load
	$effect(() => {
		loadMore();
	});

	// IntersectionObserver
	$effect(() => {
		const el = sentinel;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) loadMore(); },
			{ root: scrollEl, rootMargin: '200px' },
		);
		obs.observe(el);
		return () => obs.disconnect();
	});

	function ago(iso: string): string {
		const diff = Date.now() - new Date(iso).getTime();
		const m = Math.floor(diff / 60000);
		if (m < 60) return `${m}m`;
		const h = Math.floor(m / 60);
		if (h < 24) return `${h}h`;
		return `${Math.floor(h / 24)}d`;
	}
</script>

<svelte:window onkeydown={onkeydown} />

<!-- backdrop -->
<button
	class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm cursor-default"
	onclick={close}
	aria-label="Close post detail"
></button>

<!-- content panel -->
<div class="fixed inset-0 z-50 pointer-events-none flex justify-center">
	<div
		class="pointer-events-auto w-full max-w-2xl h-full overflow-y-auto bg-white dark:bg-black shadow-2xl"
		bind:this={scrollEl}
		role="dialog"
		aria-label="Post detail"
	>
		<!-- close button -->
		<div class="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
			<h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Post</h2>
			<button
				onclick={close}
				class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
				aria-label="Close"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- post content (full, no truncation) -->
		<div class="p-4">
			<!-- avatar + user row -->
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-bold text-white">
					{p.username[0]}
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-1.5">
						<span class="text-sm font-bold text-gray-900 dark:text-gray-100">{p.username}</span>
						{#if p.verified}
							<span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
								<svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
								</svg>
							</span>
						{/if}
					</div>
					<div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
						<span>{p.handle}</span>
						<span>·</span>
						<span>{ago(feedItem.crt_at)}</span>
					</div>
				</div>
			</div>

			<!-- content -->
			<div class="mt-3 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words text-sm leading-normal">
				{p.content}
			</div>

			<!-- tags -->
			{#if p.tags.length > 0}
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each p.tags as tag}
						<span class="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
							{tag}
						</span>
					{/each}
				</div>
			{/if}

			<!-- actions -->
			<PostActions post={p} votes={feedItem.votes} commentCount={comments.length} mostRelevant={feedItem.most_relevant} />
		</div>

		<!-- divider -->
		<div class="border-t border-gray-100 dark:border-gray-800"></div>

		<!-- comments section -->
		<div class="p-4">
			<h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
				Comments
			</h3>

			<!-- write comment -->
			<div class="mb-3">
				<textarea
					bind:value={newComment}
					rows={2}
					placeholder="Write a comment..."
					class="w-full resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition"
				></textarea>
				{#if newComment.trim()}
					<div class="mt-1.5 flex items-center gap-2">
						<button
							onclick={submitComment}
							class="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-medium text-white hover:bg-blue-700 transition"
						>
							Comment
						</button>
					</div>
				{/if}
			</div>

			{#if comments.length > 0}
				<div class="space-y-2">
					{#each comments as c (c.id)}
						<CommentCmp comment={c} />
					{/each}
				</div>
			{/if}

			<!-- sentinel for infinite scroll -->
			<div bind:this={sentinel} class="h-1"></div>

			<!-- loading -->
			{#if loading}
				<div class="flex items-center justify-center py-4 gap-2">
					<span class="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0ms]"></span>
					<span class="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:150ms]"></span>
					<span class="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:300ms]"></span>
				</div>
			{:else if exhausted && comments.length > 0}
				<p class="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
					— no more comments —
				</p>
			{:else if exhausted && comments.length === 0}
				<p class="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
					No comments yet.
				</p>
			{/if}
		</div>
	</div>
</div>
