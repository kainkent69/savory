# Changelog

## 2026-06-19

### Added
- **Feed component system** (`lib/cmp/feed/`): modular feed with `feed.svelte`, `post_card.svelte`, `follow_pill.svelte`
- **Dynamic text sizing**: post body font adapts to content length (lg/base/sm)
- **Smart content truncation**: word-boundary cut at 200 chars, "Show more"/"Show less" toggle
- **Profile popover**: hover username → card with avatar, bio, badges, follower counts, Follow/Network pill
- **Achievement badges**: 11 badge types (⭐🔥💎🛡️🎯🏆📚🌱⏳🧠🎨), stacked display, popover list
- **Verified checkmark**: blue circle ✓ next to username, separate from badges
- **Hashtag pills**: stacked inline, expand on click, single-line clamp with `+N more` overflow
- **Follow | Network split pill**: two-section button, Follow (blue) + Network (gray, must be accepted)
- **Mobile bottom nav**: TikTok-style, centered Home button with blue pill overflow
- **Mobile header**: Logo + Messages + Notifications with dot
- **Mobile search overlay**: full-screen floating page, `top-12` below header, back arrow, recent searches
- **Collapsible left sidebar**: 275px full / 72px compact toggle with chevron
- **Collapsible right panel**: close × / reopen button
- **Infinite scroll**: IntersectionObserver sentinel, 400px root margin
- **Reload button**: at feed end, re-seeds mock data + smooth scrolls to `#beginning`
- **Logger utility** (`lib/logger.ts`): devtools `setlog()` / `relog()`, group-based filtering
- **Feed store** (`lib/store/feed.ts`): types, wall writable, `requestWall()`
- **Mock data** (`lib/store/feed_mock.ts`): 15 avatar profiles, 24 post templates, `mock_request()` with 1/10 empty chance
- **SVG icon system**: 13 icons in `lib/assets/icons/`, `?raw` imports, `.icon` CSS rule

### Changed
- `lib/components/` → `lib/cmp/` (global components)
- Route-level components (`post_card`) moved alongside `+page.svelte`
- All files renamed to `snake_case`
- Post card: equal `p-4` padding, proportional content spacing
- Right panel: `w-[350px]` fixed, `overflow-x-hidden`, compact Who-to-follow
- Sidebar nav: interactive `$state` selection, lift animation on active
- Search bar: inline SVGs, proper vertical centering, clear × button
- All posts: plain text only (markdown removed for now)
- Pools removed from feed (text posts only)

### Design System
- Full dark mode via `prefers-color-scheme`: every component has `dark:` variants
- 11 badge colors with light/dark variants
- Dynamic text sizing: `text-lg` (<80c) / `text-base` (80-150c) / `text-sm` (150+c)
- Responsive breakpoints: mobile <768px, desktop ≥768px
- Backdrop blur on headers, nav, popovers
- Animation tokens: 150-300ms, ease-out, translate, scale, fade

### Technical
- Svelte 5 runes mode throughout (`$state`, `$derived`, `$props`, `$effect`)
- TailwindCSS v4 with `@tailwindcss/vite` plugin
- `marked@18.0.5` for markdown parsing (post body, later removed for plain text)
- `testify@v1.11.1` for Go tests
- Vitest dual-project config (client/browser + server/node)
- CLAUDE.md, theme.md, plan.md documentation
