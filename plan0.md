# Comments Class — implement `TComments` from `feed.d.ts`

## Context

`types/feed.d.ts` defines `TComments` (group/collection class) and `TComment` (comment with `group` ref). Currently no implementation exists — mock data creates plain objects, navigation is prop-based. Need to implement the `Comments` class and wire it through all affected files.

## Architecture (from `feed.d.ts`)

```
TComments {
    count, loaded, reply, parent,
    comments: TComments[]    // child reply groups
    add(comments: TComment[])
    hasNext(index): bool
    next(index): string       // returns "c-{level}:{index}"
}

TComment {
    ...fields,
    group: TComments
    hasNext(): bool           // → group.hasNext(this.index)
    next(): string            // → group.next(this.index)
}
```

DOM id format: `c-{level}:{index}` (hyphen before level, colon before index).

## Key design decisions

1. **`count` is static** — total comment count from post metadata. Not how-many-loaded.
2. **`loaded`** — how many currently fetched into memory.
3. **`hasNext(index)`** — checks `index + 1 < count` (total, not just loaded). Returns true even if next sibling isn't fetched yet.
4. **`next(index)`** — if `index + 1 >= loaded`, triggers `loadMore()` callback first, then returns DOM id. Callback injected from component/store level.
5. **Loading stub** — load-on-next-click is async. Implement the callback pattern, but stub the actual fetch if complex.

## Plan

### 1. New file: `ui/src/lib/scripts/comments.ts`

Export `Comments` class implementing `TComments`:

```ts
export class Comments {
    count: number = 0       // TOTAL comments (static, from post metadata)
    loaded: number = 0      // how many fetched so far
    level: number = 0
    reply: boolean = false
    parent: Comments | null = null
    parentIndex: number = 0 // index of parent comment in parent group
    comments: Comments[] = [] // child reply groups (one per comment)

    // injected — called when next() needs to load unloaded comments
    loadMore: (() => Promise<void>) | null = null

    get siblings(): number {
        if (!this.parent) return this.count   // root
        return this.parent.count              // parent's level count
    }

    add(items: Comment[]): void {
        for (const c of items) {
            c.index = this.loaded
            c.level = this.level
            c.group = this
            // each comment gets a child group for its replies
            const child = new Comments()
            child.reply = true
            child.level = this.level + 1
            child.parent = this
            child.parentIndex = c.index
            this.comments.push(child)
            this.loaded++
        }
        this.count = Math.max(this.count, this.loaded)
    }

    hasNext(index: number): boolean {
        return index + 1 < this.count  // checks TOTAL, not just loaded
    }

    async next(index: number): Promise<string> {
        if (!this.hasNext(index)) throw new Error('no next')
        // if next sibling not loaded, load more first
        if (index + 1 >= this.loaded && this.loadMore) {
            await this.loadMore()
        }
        // target: parent's next sibling at parent's level
        if (this.level === 0) return `c-0:${index + 1}`
        return `c-${this.parent!.level}:${this.parent!.parentIndex + 1}`
    }
}
```

The tricky part: `next()` for replies needs to find the parent group's index. Two approaches:
1. **Store index on each Comments** — simpler, add `index: number` field
2. **Search parent.comments** — `parent.comments.indexOf(this)`

Use approach 1: add `index: number` to Comments. Set during `add()`.

### 2. Export `Comment` interface from `feed.ts`

```ts
export interface Comment {
    id: number
    poster: string
    avatar: string
    comment: string
    img: string
    feed_id: number
    level: number
    index: number
    group: Comments
    replies: Comment[]
    engagements?: { up: number; down: number; star: number; emote: number }
    crt_at?: number
    up_at?: number
}
```

`hasNext()` / `next()` on Comment — stub methods that delegate to group:

```ts
// On the Comment interface, or as helper functions:
function commentHasNext(c: Comment): boolean { return c.group.hasNext(c.index) }
function commentNext(c: Comment): string { return c.group.next(c.index) }
```

Actually, since Comment is an interface (not a class), add these as standalone functions exported from `comments.ts`.

### 3. Update `feed_mock.ts`

`mock_comments()` creates a root `Comments` group, uses `group.add()` to populate:

```ts
export function mock_comment_batch(count: number): Comment[] {
    const root = new Comments()
    root.level = 0
    const batch: Comment[] = []
    for (let i = 0; i < count; i++) {
        batch.push(mock_comments(root, '', 0))
    }
    root.add(batch)
    return batch
}
```

`mock_comments()` receives the parent group, creates comment, adds replies to child group:

```ts
function mock_comments(parentGroup: Comments, replyto: string, level: number): Comment {
    const comment: Comment = {
        id: ++idCounter,
        poster: user.username,
        avatar: user.username[0],
        comment: text,
        img: '',
        feed_id: 0,
        level,
        index: 0,          // set by group.add()
        group: null!,       // set by group.add()
        replies: [],
    }
    // replies: create child group, add reply comments
    const childGroup = new Comments()
    childGroup.reply = true
    childGroup.level = level + 1
    childGroup.parent = parentGroup
    const replies: Comment[] = []
    for (let i = 0; i < replyCount; i++) {
        replies.push(mock_comments(childGroup, comment.poster, level + 1))
    }
    childGroup.add(replies)
    comment.replies = replies
    return comment
}
```

### 4. Update `comment.svelte`

Props: `{ comment: Comment }`. Navigation through `comment.group`:

```ts
let { comment }: Props = $props()

let hasPrev = $derived(comment.level > 0)
let hasNext = $derived(comment.group.hasNext(comment.index))

function goPrev() {
    const pg = comment.group.parent!
    const id = `c-${pg.level}:${comment.group.parentIndex}`
    scrollTo(id)
    document.getElementById(id)
        ?.querySelector<HTMLButtonElement>('button[data-collapsed-toggler]')?.click()
}

async function goNext() {
    try {
        const id = await comment.group.next(comment.index)
        requestAnimationFrame(() => scrollTo(id))
    } catch { /* no next */ }
}
```

DOM wrapper: `<div id="c-{comment.level}:{comment.index}" ...>`

Top-level (level 0): no prev/next shown.
Replies (level > 0): prev + next buttons shown, next is async (may trigger load).

### 5. Update `post_detail.svelte`

```ts
let rootGroup = new Comments()
rootGroup.level = 0

// loadMore:
const batch = await loadComment(...)
rootGroup.add(batch)
comments = [...comments, ...batch]

// submitComment:
const c: Comment = { id: Date.now(), ... }
rootGroup.add([c])
comments = [c, ...comments]
```

Pass to component: `<CommentCmp comment={c} />` — no extra props.

### 6. DOM id change

Wrapper id changes from `c-{comment.id}` to `c-{comment.level}:{comment.index}`:
```
<div id="c-{comment.level}:{comment.index}" ...>
```

## Implementation order

1. Create `scripts/comments.ts` — Comments class (full implementation)
2. Update `scripts/feed.ts` — export Comment interface, import Comments
3. Update `scripts/feed_mock.ts` — use Comments.add(), fix mock creation
4. Update `comment.svelte` — new props, DOM id, nav through group
5. Update `post_detail.svelte` — create root group, pass to components
6. Type-check + verify

## Files modified

1. `ui/src/lib/scripts/comments.ts` — **new file** — Comments class
2. `ui/src/lib/scripts/feed.ts` — export Comment interface
3. `ui/src/lib/scripts/feed_mock.ts` — use Comments class
4. `ui/src/lib/cmp/feed/comment.svelte` — group-based nav
5. `ui/src/routes/post_detail.svelte` — root Comments group

## Verification

1. `cd ui && pnpm check` — zero new errors
2. `pnpm dev` — comments render, prev/next buttons work, uncollapse works
3. Manual: click next on a reply → jumps to parent's next sibling
