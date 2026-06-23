# Plan: Comment Reading Mode — Collapse + Navigate

Status: Step 1 done (level field). Steps 2-4 remain.

## Step 2: Collapse parents on focus

`comment.svelte` — new prop: `activeId: number | null`

**Logic:**
- If this comment is an ancestor of `activeId` → **collapsed**: show avatar pill only (h-5 w-5 circle + thin thread line), no text, no actions
- If this comment IS `activeId` → **highlighted**: full content + blue left border accent
- Otherwise → normal

**Need helper:** `hasDescendant(id: number): boolean` — walks `comment.replies` recursively.

**Thread line click:** clicking the colored thread line on any comment sets `activeId` to that comment's id. `post_detail` provides `onFocus(id)` callback.

## Step 3: Level indicator bar + next/prev

In `post_detail.svelte`:

**State:** `activeId: number | null`

**Level bar** (shown when `activeId` is set, below the active comment):
- Level dots: `[●][·][·]` — filled = current level, hollow = above/below
- `<` prev sibling — scroll to previous comment at same level
- `>` next sibling — scroll to next comment at same level

**Sibling nav logic:**
- Flatten all comments (including nested replies) into array
- Filter by `level === activeLevel`
- Find current index → prev = index-1, next = index+1
- Scroll to target via `document.getElementById('c-' + id)`

Each comment gets `id="c-{comment.id}"` attribute.

**Callbacks:**
- `onFocus(id)` — passed to all `<CommentCmp>` via prop
- `onBlur()` — clears `activeId`

## Step 4: Thread line click

`comment.svelte`:
- Thread line `<div>` gets `onclick` handler
- Calls `onFocus(comment.id)` → sets `activeId` in post_detail
- Backdrop/click elsewhere → `onBlur()`

## Files

| File | Change |
|------|--------|
| `lib/cmp/feed/comment.svelte` | `activeId`, `onFocus`, `onBlur` props. Collapsed mode. `id="c-{id}"` on wrapper. |
| `routes/post_detail.svelte` | `activeId` state, flatten comments, next/prev sibling logic, level indicator bar UI. |

## Verification

1. `pnpm check` — 0 errors
2. Click thread line on level-2 reply → it highlights, all ancestors collapse to pills
3. Level bar shows `[●][·]` with `< >` arrows
4. Click `>` → scrolls to next sibling at same level
5. Click collapsed parent → it expands (takes focus)
