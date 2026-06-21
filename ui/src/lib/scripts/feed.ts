import { writable } from 'svelte/store';
import { mock_comment_batch } from './feed_mock';
export { Comments } from './comments';

// ── types (mirrors Go types/social) ──

export interface Votes {
	vote: number;  // 0=none, 1=upvote, 2=downvote
	rates: number; // 0-5 merits
}

export interface Badge {
	id: string;
	label: string;
	icon: string; // emoji
	color: string; // tailwind bg class
}

export interface Post {
	id: number;
	usr: number;
	merits: number;
	emotes: number;
	post_texts: number;
	attached: number[];
	tags: string[];
	edit_count: number;
	format: number;
	sponsored: boolean;
	type: 0 | 1; // 0=post, 1=comment
	// display fields
	username: string;
	handle: string;
	verified: boolean;
	badges: Badge[];
	content: string; // markdown
}

export interface Pool {
	opt: string;
	merits: number;
	options: number[];
	vote_count: number;
	votes: Record<number, string>;
	question: string;
}

export interface RiddleItem {
	id: number;
	usr: number;
	question: string;
	personal: string;
	duration_bdays_str: string;
	required_participations: number;
}


export interface FeedItem {
	votes: Votes;
	direct: boolean;
	edit_count: number;
	kind: 'post' | 'pool' | 'riddle';
	crt_at: string;
	up_at: string;
	visibility: number; // 0=public, 1=private, 2=network, 3=circle
	cc: boolean;        // can comment?
	data: Post | Pool | RiddleItem;
	most_relevant?: TComment; // first/most relevant comment preview
}

export type Wall = FeedItem[];

// ── store ──

export const wallstore = writable<Wall>([]);

let _fetch: (() => Promise<Wall>) | null = null;

export function setFetcher(fn: () => Promise<Wall>) {
	_fetch = fn;
}

export async function requestWall(): Promise<Wall> {
	if (!_fetch) {
		// lazy-load mock — delete this import when API is ready
		const { mock_request } = await import('./feed_mock');
		_fetch = mock_request;
	}
	const batch = await _fetch();
	if (batch.length > 0) {
		wallstore.update(s => [...s, ...batch]);
	}
	return batch;
}


export const selected = writable(false) // if a post is selected

export async function loadComment(feedId: number, offset: number): Promise<TComment[]> {
	if (offset >= 8) return [];

	const count = 3 + Math.floor(Math.random() * 6); // 3-8 per batch
	const comments = mock_comment_batch(count);
	for (const c of comments) c.feed_id = feedId;
	return comments;
}


export async function loadReply(id: number, offset: string) {

}



