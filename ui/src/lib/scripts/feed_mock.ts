import { wallstore, type Wall, type Post, type FeedItem, type Votes, type Badge } from './feed';
import { Comments } from './comments';
import { logger } from '$lib/logger';

const log = logger('store:feed');

// ── pools ──

const badgePool: Badge[] = [
	{ id: 'top_contrib', label: 'Top Contributor', icon: '⭐', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' },
	{ id: 'streak', label: '30-Day Streak', icon: '🔥', color: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' },
	{ id: 'premium', label: 'Premium', icon: '💎', color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' },
	{ id: 'moderator', label: 'Moderator', icon: '🛡️', color: 'bg-green-100  dark:bg-green-900  text-green-700  dark:text-green-300' },
	{ id: 'influencer', label: 'Influencer', icon: '🎯', color: 'bg-pink-100   dark:bg-pink-900   text-pink-700   dark:text-pink-300' },
	{ id: 'champion', label: 'Champion', icon: '🏆', color: 'bg-amber-100  dark:bg-amber-900  text-amber-700  dark:text-amber-300' },
	{ id: 'scholar', label: 'Scholar', icon: '📚', color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' },
	{ id: 'pioneer', label: 'Pioneer', icon: '🌱', color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' },
	{ id: 'veteran', label: 'Veteran', icon: '⏳', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
	{ id: 'mentor', label: 'Mentor', icon: '🧠', color: 'bg-cyan-100  dark:bg-cyan-900  text-cyan-700  dark:text-cyan-300' },
	{ id: 'artist', label: 'Creative', icon: '🎨', color: 'bg-rose-100  dark:bg-rose-900  text-rose-700  dark:text-rose-300' },
];

const avatars = [
	{ username: 'Be wholesome', handle: '@bewholesome' },
	{ username: 'Savory App', handle: '@savoryapp' },
	{ username: 'Tech Weekly', handle: '@techweekly' },
	{ username: 'Jane Cooper', handle: '@janecooper' },
	{ username: 'Crypto Daily', handle: '@cryptodaily' },
	{ username: 'Wade Warren', handle: '@wadewarren' },
	{ username: 'Esther Howard', handle: '@estherhoward' },
	{ username: 'Devon Lane', handle: '@devonlane' },
	{ username: 'Leslie Alexander', handle: '@lesliealex' },
	{ username: 'Dianne Russell', handle: '@diannerussell' },
	{ username: 'Guy Hawkins', handle: '@guyhawkins' },
	{ username: 'Arlene McCoy', handle: '@arlenemccoy' },
	{ username: 'Ralph Edwards', handle: '@ralphedwards' },
	{ username: 'Bessie Cooper', handle: '@bessiecooper' },
	{ username: 'Theresa Webb', handle: '@theresawebb' },
];

const topics = [
	'#BeWholesome', '#SavoryLaunch', '#TechNews', '#OpenSource',
	'#SocialGood', '#DevLife', '#Design', '#StartupLife',
	'#Crypto', '#AI', '#WebDev', '#MobileDev',
];

// ── content paragraphs ──

const postParagraphs: string[] = [
	// short (1 line)
	`Just shipped a new feature and the feeling is unmatched. Ship fast, iterate faster.`,
	`Honestly, the best investment you can make is in your own skills. Learn, build, repeat.`,
	`Hot take: most meetings could be emails. Most emails could be a two line message.`,
	`I have been coding for over ten years and I still search for basic syntax.`,
	`Dark mode is not just about aesthetics. It saves battery and reduces eye strain.`,
	`Daily check-in streak now at fourteen days. The gamification on Savory keeps me coming back.`,
	`Not financial advice but understanding blockchain is as important as understanding HTTP.`,
	`AI will not replace developers. Developers who use AI will replace those who do not.`,
	`Working remotely from a cabin this week. Internet is surprisingly good.`,
	`Quick CSS tip: use \`color-scheme\` on your \`html\` element for automatic dark mode.`,
	`The merge is complete. ETH is now fully proof of stake. This changes a lot for devs.`,
	`DeFi summer might be making a comeback. TVL across chains is up forty percent this month.`,
	`Morning routine: coffee, thirty minute run, twenty minutes reading, deep work until noon.`,
	`Just finished reading Deep Work by Cal Newport. Focus is the new intelligence.`,
	`Protect your deep work time. Guard your focus. Create space for what matters.`,
	`The only way to do great work is to love what you do. Simple as that.`,
	`Earned 200 coins today just by engaging with the community. The Savory economy is real.`,
	`Just created my first poll on Savory and it got over a thousand votes in two hours.`,
	`TypeScript pattern matching in the type system is a complete game changer.`,
	`Rust vs Go vs Zig. Which one are you betting on for systems programming this year?`,
	`Learned you can use RelativeTimeFormat API for human readable dates. No more moment.js.`,
	`Building in public. Current stats: 1247 users, $320 revenue, 2.1% churn. Slow and steady.`,
];

const commentParagraphs: string[] = [
	// single lines
	'Great post! Totally agree with this.',
	'This is exactly what I was thinking. Well said.',
	'Thanks for sharing this! Very insightful.',
	'I never thought about it this way. Eye opening.',
	'Keep up the great work! Loving the content.',
	'Can you share more details about this? Curious.',
	'This changed my perspective. Thank you!',
	'Been following your posts. Always quality.',
	'Bookmarked this one. Will reference later.',
	'Short but powerful. Respect.',
	'Could not have said it better myself. Cheers!',
	'This deserves more attention. Sharing it.',
	// multi-line (2-3 paragraphs)
	`Honestly this hits home. I have been saying the same thing for years and people just do not listen.

Keep pushing. The world needs more voices like yours.`,
	`Great write up. One thing I would add: consistency beats intensity every single time.

Small steps daily compound into massive results over time. Do not sleep on that.`,
	`I respectfully disagree on one point. The timeline you mentioned feels rushed. Real change takes longer than people think.

That said, the core message is solid and I appreciate you putting this out there.`,
	`Sharing this with my team right now. We were literally discussing this exact topic in our standup this morning.

Sometimes the universe aligns in the best ways. Thank you.`,
];

// ── helpers ──

let idCounter = 100;

function pick<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function rndInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rndVotes(): Votes {
	const v = Math.random();
	return {
		vote: v > 0.8 ? 1 : v > 0.7 ? 2 : 0, // mostly neutral (70%)
		rates: v > 0.8 && v < 0.95 ? Math.floor(Math.random() * 5) + 1 : 0, // only rated if upvoted
	};
}

function rndBadges(): Badge[] {
	const r = Math.random();
	const count = r > 0.8 ? 4 : r > 0.5 ? 3 : r > 0.2 ? 2 : 1;
	const shuffled = [...badgePool].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

function rndVerified(): boolean {
	return Math.random() > 0.5;
}

function rndTags(): string[] {
	const count = rndInt(1, 5);
	const shuffled = [...topics].sort(() => Math.random() - 0.5);
	return [...shuffled.slice(0, count), '#personal'];
}

function rndContent(): string {
	const count = Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1;
	const lines: string[] = [];
	for (let i = 0; i < count; i++) {
		lines.push(pick(postParagraphs));
	}
	return lines.join('\n\n');
}

function rndCommentText(): string {
	// often multi-line for realism
	const count = Math.random() > 0.6 ? rndInt(2, 3) : 1;
	const lines: string[] = [];
	for (let i = 0; i < count; i++) {
		lines.push(pick(commentParagraphs));
	}
	return lines.join('\n\n');
}

function rndPastISO(maxHoursAgo = 72): string {
	const h = 3600000;
	const now = Date.now();
	const hrs = rndInt(1, maxHoursAgo);
	return new Date(now - h * hrs).toISOString();
}

// ── generators ──

export function generateComment(feedId?: number): TComment {
	const user = pick(avatars);
	return {
		id: ++idCounter,
		poster: user.username,
		avatar: user.username[0],
		comment: rndCommentText(),
		img: '',
		feed_id: feedId ?? 0,
		level: 0,
		index: 0,
		group: new Comments(),
		replies: [],
		engagements: { views: 0, engagements: 0, up: 0, down: 0, pins: 0, star: 0, emote: 0 },
		crt_at: Date.now(),
		up_at: Date.now(),
	};
}

export function generatePost(): FeedItem {
	const user = pick(avatars);
	const id = ++idCounter;
	const iso = rndPastISO();

	return {
		votes: rndVotes(),
		direct: Math.random() > 0.3,
		edit_count: Math.random() > 0.8 ? 1 : 0,
		kind: 'post',
		crt_at: iso,
		up_at: iso,
		visibility: 0,
		data: {
			id, usr: id,
			merits: rndInt(5, 5000),
			emotes: rndInt(0, 20),
			post_texts: 1,
			attached: [],
			tags: rndTags(),
			edit_count: 0,
			format: 0,
			sponsored: Math.random() > 0.85,
			type: 0,
			username: user.username,
			handle: user.handle,
			verified: rndVerified(),
			badges: rndBadges(),
			content: rndContent(),
		} as Post,
		cc: true,
		most_relevant: generateComment(id),
	};
}

function rndMentionText(): string {
	// replies sometimes include @mentions
	const mentioned = pick(avatars);
	const prefix = Math.random() > 0.4 ? `@${mentioned.handle.replace('@', '')} ` : '';
	return prefix + rndCommentText();
}

function generateReplies(feedId: number, parentId: number, depth: number): TComment[] {
	if (depth >= 3) return [];
	const count = Math.random() > 0.3 ? rndInt(1, 4) : 0;
	const replies: TComment[] = [];
	for (let i = 0; i < count; i++) {
		const id = parentId * 10 + i + 1;
		const user = pick(avatars);
		replies.push({
			id,
			poster: user.username,
			avatar: user.username[0],
			comment: rndMentionText(),
			img: '',
			feed_id: feedId,
			level: depth,
			index: i,
			replies: generateReplies(feedId, id, depth + 1),
			engagements: { views: 0, engagements: 0, up: 0, down: 0, pins: 0, star: 0, emote: 0 },
			crt_at: Date.now(),
			up_at: Date.now(),
		});
	}
	return replies;
}

/** Mock a single comment (top-level or reply), recursively generates nested replies. */
export function mock_comments(group: Comments, replyto = ''): TComment {
	const is_reply = group.reply
	const user = pick(avatars);
	let text = rndCommentText();
	if (is_reply && replyto && Math.random() > 0.4) {
		text = `@${replyto} ` + text;
	}

	const comment: TComment = {
		id: ++idCounter,
		poster: user.username,
		avatar: user.username[0],
		comment: text,
		img: '',
		feed_id: 0,
		level: group.level,
		index: 0,           // set by group.add()
		group: undefined!,   // set by group.add()
		replies: [],
		engagements: { views: 0, engagements: 0, up: rndInt(0, 20), down: rndInt(0, 5), pins: 0, star: rndInt(0, 3), emote: rndInt(0, 10) },
		crt_at: Date.now(),
		up_at: Date.now(),
	};

	// create child reply group
	const childGroup = new Comments();
	childGroup.reply = true;
	childGroup.level = group.level + 1;
	childGroup.parent = comment;

	const replyCount = group.level < 3 && Math.random() > 0.4 ? rndInt(1, 3) : 0;
	const replies: TComment[] = [];
	for (let i = 0; i < replyCount; i++) {
		replies.push(mock_comments(childGroup, comment.poster));
	}
	childGroup.add(replies);
	comment.replies = replies;

	return comment;
}

/** Generate a batch of top-level comments. */
export function mock_comment_batch(count: number): TComment[] {
	const root = new Comments();
	root.level = 0;
	const batch: TComment[] = [];
	for (let i = 0; i < count; i++) {
		batch.push(mock_comments(root, ''));
	}
	root.add(batch);
	return batch;
}

// ── public API ──

/** Seed wall with N random posts (default 10). */
export function seedWall(count = 10): Wall {
	const posts: FeedItem[] = [];
	for (let i = 0; i < count; i++) {
		posts.push(generatePost());
	}
	wallstore.set(posts);
	log.info('wall seeded', posts.length, 'items');
	return posts;
}

/** Mock paginated request — 1/10 chance empty, otherwise 1–3 random posts. */
export async function mock_request(): Promise<Wall> {
	if (Math.random() < 0.1) {
		log.debug('mock_request: empty page');
		return [];
	}

	await new Promise(r => setTimeout(r, 200 + Math.random() * 600));

	const count = rndInt(1, 3);
	const batch: FeedItem[] = [];
	for (let i = 0; i < count; i++) {
		batch.push(generatePost());
	}
	log.debug('mock_request:', batch.length, 'new posts');
	return batch;
}
