# Savory Design Theme

## Color Palette

### Light Mode

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Page background | `#fff` | `bg-white` | Layout shell, feed, search overlay |
| Card background | `#f9fafb` | `bg-gray-50` | Trends, who-to-follow, collapsed tag pills |
| Card hover | `#f3f4f6` | `hover:bg-gray-100` | Nav items, trend rows, user pill |
| Post hover | `#f9fafb` | `hover:bg-gray-50` | Post card hover state |
| Primary text | `#111827` | `text-gray-900` | Headings, nav active, user name |
| Secondary text | `#374151` | `text-gray-700` | Badge labels, post body (some) |
| Tertiary text | `#4b5563` | `text-gray-600` | Post body, nav inactive |
| Muted text | `#6b7280` | `text-gray-500` | Views, metrics, handles, follow/network |
| Subtle text | `#9ca3af` | `text-gray-400` | Sponsored label, placeholder, search |
| Border primary | `#e5e7eb` | `border-gray-200` | Layout dividers, post cards, search |
| Border subtle | `#f3f4f6` | `divide-gray-100` | Post list dividers |
| Accent (blue) | `#2563eb` | `bg-blue-600` / `text-blue-600` | Logo badge, Post btn, follow side, tag pills, links |
| Accent hover | `#1d4ed8` | `hover:bg-blue-700` | Post button hover |
| Accent light | `#eff6ff` | `bg-blue-50` | Tag pill bg |
| Tag hover | `#dbeafe` | `hover:bg-blue-100` | Tag pill hover |
| Focus ring | `#dbeafe` | `ring-blue-100` | Search input focus |
| Avatar bg | `#d1d5db` | `bg-gray-300` | User avatars (placeholder) |
| Follow btn bg | `#111827` | `bg-gray-900` | Follow button (desktop) |
| Follow btn hover | `#374151` | `hover:bg-gray-700` | Follow button hover |
| Sticky header bg | `rgba(255,255,255,0.8)` | `bg-white/80` | Feed header, mobile header |
| Verified badge | `#3b82f6` | `bg-blue-500` | Verified checkmark circle |
| Network btn | `#f3f4f6` | `bg-gray-100` | Network side of split pill |
| Backdrop blur | — | `backdrop-blur-md` | Mobile nav, search overlay, popovers |

### Dark Mode

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Page background | `#000` | `dark:bg-black` | Layout shell, feed, search overlay |
| Card background | `#111827` | `dark:bg-gray-900` | Trends, who-to-follow, collapsed tag pills |
| Card hover | `#1f2937` | `dark:hover:bg-gray-800` | Nav items, trend rows, user pill |
| Post hover | `#111827` | `dark:hover:bg-gray-900` | Post card hover state |
| Primary text | `#f3f4f6` | `dark:text-gray-100` | Headings, nav active, user name |
| Secondary text | `#d1d5db` | `dark:text-gray-300` | Badge labels, follow/network |
| Tertiary text | `#9ca3af` | `dark:text-gray-400` | Post body, nav inactive, handles |
| Muted text | `#6b7280` | `dark:text-gray-500` | Views, metrics, sponsored |
| Border primary | `#1f2937` | `dark:border-gray-800` | Layout dividers, post cards |
| Border subtle | `#1f2937` | `dark:divide-gray-800` | Post list dividers |
| Search border | `#374151` | `dark:border-gray-700` | Search input border |
| Tag pill bg | `rgba(30,64,175,0.3)` | `dark:bg-blue-900/30` | Tag pill background |
| Focus ring | `#1e3a5f` | `dark:ring-blue-900` | Search input focus |
| Avatar bg | `#374151` | `dark:bg-gray-700` | User avatars (placeholder) |
| Follow btn bg | `#f3f4f6` | `dark:bg-gray-100` | Follow button (inverted) |
| Follow btn text | `#111827` | `dark:text-gray-900` | Follow button text (inverted) |
| Follow btn hover | `#d1d5db` | `dark:hover:bg-gray-300` | Follow button hover |
| Sticky header bg | `rgba(0,0,0,0.8)` | `dark:bg-black/80` | Feed header, mobile header |

### Accent Colors (shared light/dark)

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Blue accent | `#2563eb` | `bg-blue-600` | Logo, Post button, mobile Home btn |
| Blue accent hover | `#1d4ed8` | `hover:bg-blue-700` | Post button |
| Blue focus border | `#60a5fa` | `focus:border-blue-400` | Search input |
| Blue focus dark | `#3b82f6` | `dark:focus:border-blue-500` | Search input dark |
| Blue accent light | `#3b82f6` | `bg-blue-500` | Verified checkmark, notification dot |

### Badge Colors (11 achievement types)

| Badge | Icon | Tailwind |
|-------|------|----------|
| Top Contributor | `⭐` | `bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300` |
| 30-Day Streak | `🔥` | `bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300` |
| Premium | `💎` | `bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300` |
| Moderator | `🛡️` | `bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300` |
| Influencer | `🎯` | `bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300` |
| Champion | `🏆` | `bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300` |
| Scholar | `📚` | `bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300` |
| Pioneer | `🌱` | `bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300` |
| Veteran | `⏳` | `bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300` |
| Mentor | `🧠` | `bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300` |
| Creative | `🎨` | `bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300` |

## Typography

| Token | Size | Weight | Tailwind | Usage |
|-------|------|--------|----------|-------|
| Page heading | 20px | 700 | `text-xl font-bold` | Desktop "Home" header |
| Post body (short <80c) | 18px | 400 | `text-lg leading-snug` | Short posts |
| Post body (med 80-150c) | 16px | 400 | `text-base leading-snug` | Medium posts |
| Post body (long 150+c) | 14px | 400 | `text-sm leading-normal` | Long posts |
| Nav label | 16px | 500 | `text-base font-medium` | Sidebar nav items |
| Post button | 16px | 700 | `text-base font-bold` | Post CTA |
| User name | 14px | 700 | `text-sm font-bold` | Post user display name |
| Handle / time | 14px | 400 | `text-sm` | @handle, timestamp |
| Tag pill | 11px | 500 | `text-[11px] font-medium` | Hashtag pills |
| Badge popover | 9px | 500 | `text-[9px] font-medium` | Badge list items |
| Follow pill | 11px | 500 | `text-[11px] font-medium` | Follow/Network buttons |
| Follow pill (sm) | 10px | 500 | `text-[10px] font-medium` | Profile popover buttons |
| Meta text | 12px | 400 | `text-xs` | Views, metrics, handles |
| Action buttons | 12px | 400 | `text-xs` | Comment, repost, like, pin, share |
| Trend tag | 14px | 500 | `text-sm font-medium` | Trend hashtag |
| Trend count | 12px | 400 | `text-xs` | Trend post count |
| Section heading | 18px | 700 | `text-lg font-bold` | "Trends for you", "Who to follow" |
| Mobile nav label | 10px | 500 | `text-[10px] font-medium` | Bottom nav labels |
| Mobile nav home | 11px | 700 | `text-[11px] font-bold` | Home center label |
| Sponsored | 10px | 500 | `text-[10px] font-medium` | Sponsored badge |
| Show more/less | 12px | 400 | `text-xs` | Content expand toggle |
| +N overflow | 9px | 700 | `text-[9px] font-bold` | Badge/tag overflow counter |
| Profile bio | 12px | 400 | `text-xs` | Popover bio text |

Font family: system default stack (Tailwind default — `Inter`, `system-ui`, `sans-serif`). Code: `font-mono`.

## Spacing

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Layout sidebar (full) | 275px | `w-[275px]` | Expanded left nav |
| Layout sidebar (compact) | 72px | `w-[72px]` | Collapsed left nav |
| Layout right panel | 350px | `w-[350px]` | Right panel width |
| Layout max width | 1260px | `max-w-[1260px]` | App container |
| Post padding | 16px | `p-4` | Post card equal padding |
| Card/section padding | 16px | `p-4` | Trends, who-to-follow cards |
| Nav item padding (full) | 12px 12px | `px-3 py-3` | Sidebar nav links |
| Nav item padding (compact) | — | `h-12 w-12 p-0` | Icon-only nav |
| Post button padding | 12px | `py-3` | Full-width Post button |
| Follow pill padding | 10px 4px | `px-2.5 py-1` | Follow/Network pill |
| Follow pill padding (sm) | 8px 4px | `px-2 py-0.5` | Profile popover buttons |
| Tag pill padding | 10px 4px | `px-2.5 py-1` | Hashtag pills |
| Badge popover item | 6px 4px | `px-1.5 py-1` | Badge list rows |
| Mobile header padding | 12px 8px | `px-3 py-2` | Mobile top bar |
| Gap (standard) | 12px | `gap-3` | Post layout, nav items |
| Gap (tight) | 8px | `gap-2` | Who-to-follow, mobile header |
| Gap (user row) | 6px | `gap-1.5` | User name, verified, badges |
| Gap (loose) | 16px | `gap-4` | Panel sections |
| Margin top (body) | 6px | `mt-1.5` | Post body from meta |
| Margin top (tags) | 10px | `mt-2.5` | Tags from body |
| Margin top (actions) | 10px | `mt-2.5` | Actions from tags |
| Tag overlap (collapsed) | -8px | custom | Stacked tag pills |
| Badge overlap | -4px | custom | Stacked badge icons |
| Profile popover width | 256px | `w-64` | Hover card |
| Popover arrow | 12px | `h-3 w-3` | Rotated square |
| Search overlay top | 48px | `top-12` | Below mobile header |

## Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Full round | `9999px` | `rounded-full` | Buttons, nav, search, pills, avatars, Home btn |
| Card | `12px` | `rounded-xl` | Post cards, trend cards, panels, popovers |
| Popover | `8px` | `rounded-lg` | Badge popover, tag hover card |
| Row hover | `6px` | `rounded-md` | Badge popover rows |

## Component Sizing

| Component | Height | Width | Notes |
|-----------|--------|-------|-------|
| Avatar (post) | 40px | 40px | `h-10 w-10` |
| Avatar (compact) | 40px | 40px | `h-10 w-10` |
| Avatar (popover) | 48px | 48px | `h-12 w-12` |
| Avatar (who-to-follow) | 36px | 36px | `h-9 w-9` |
| Verified checkmark | 18px | 18px | `h-[18px] w-[18px]` |
| Badge icon (stack) | 16px | 16px | `h-4 w-4` |
| Badge icon (popover) | 20px | 20px | `h-5 w-5` |
| Tag pill (max) | — | 110px | `max-w-[110px]` |
| Action icon | 16px | 16px | `h-4 w-4` |
| Follow/Network icon | 12px | 12px | `h-3 w-3` |
| Search input | 36px | — | `h-9` |
| Search icon | 16px | 16px | `h-4 w-4` |
| Mobile nav Home btn | 56px | 56px | `h-14 w-14` |
| Mobile nav side icon | 24px | 24px | `h-6 w-6` |
| Notification dot | 8px | 8px | `h-2 w-2` |
| Post button (compact) | 48px | 48px | `h-12 w-12` |

## Dark Mode Strategy

- **Method**: `prefers-color-scheme` media query (TailwindCSS v4 default `dark:` variant)
- **Color scheme**: `color-scheme: light dark` on `<html>` for native form controls
- **Pattern**: every color token has `dark:` counterpart
- **Inversions**: Follow button inverts (`bg-gray-900` → `dark:bg-gray-100`), Home btn stays blue
- **Backdrop**: `backdrop-blur-md` on sticky headers, mobile nav, popovers
- **Future**: class-based toggle (`.dark` class) requires Tailwind v4 dark mode config override

## Dynamic Text Sizing

Post body font size adapts to content length:
- `< 80 chars`: `text-lg leading-snug` — prominent, big
- `80–150 chars`: `text-base leading-snug` — medium
- `> 150 chars`: `text-sm leading-normal` — standard dense

## Content Truncation

- **Method**: smart word-boundary truncation at 200 chars
- Won't cut mid-word (uses `lastIndexOf(' ', max)`)
- Won't truncate if remaining < 15 chars
- "Show more"/"Show less" toggle replaces truncated text with full content
- Button only visible when content is actually truncated

## Breakpoints (Responsive)

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Single column: sticky header + feed + bottom nav |
| Tablet/Desktop | ≥ 768px | 3-column: sidebar + feed + right panel |

### Mobile-specific
- Sticky header: `[Logo] [...spacer...] [🔍] [💬] [🔔·]`
- Search: floating overlay (`top-12`, doesn't cover header), back arrow to dismiss
- Bottom nav: TikTok-style `[Explore] [Earn] (🏠Home) [Store] [Profile]`
- Home button: 56px blue circle, overflows above nav bar, white ring border

## Component Summary

| Component | File | Light bg | Dark bg | Border |
|-----------|------|----------|---------|--------|
| Layout shell | `+layout.svelte` | `bg-white` | `dark:bg-black` | `border-gray-200` / `dark:border-gray-800` |
| Post card | `post_card.svelte` | transparent | transparent | `border-gray-100` / `dark:border-gray-800` |
| Sidebar | `sidebar.svelte` | transparent | transparent | — |
| Search bar | `search_bar.svelte` | `bg-gray-50` | `dark:bg-gray-900` | `border-gray-200` / `dark:border-gray-700` |
| Right panel cards | `right_panel.svelte` | `bg-gray-50` | `dark:bg-gray-900` | — |
| Follow pill | `follow_pill.svelte` | `bg-gray-100` | `dark:bg-gray-800` | `ring-gray-200` / `dark:ring-gray-600` |
| Tag pills | inline | `bg-blue-50` | `dark:bg-blue-900/30` | `ring-white` / `dark:ring-black` |
| Badge icons | inline | per-badge color | per-badge color | `ring-white` / `dark:ring-black` |
| Profile popover | inline | `bg-white` | `dark:bg-gray-800` | `border-gray-200` / `dark:border-gray-700` |
| Mobile nav | `mobile.svelte` | `bg-white/95` | `dark:bg-black/95` | `border-gray-200` / `dark:border-gray-800` |
| Search overlay | `+page.svelte` | `bg-white` | `dark:bg-black` | `border-gray-200` / `dark:border-gray-800` |

## SVG Icon System

All icons stored in `$lib/assets/icons/` as `.svg` files, imported via `?raw` for inline `{@html}` rendering. Global CSS rule `.icon svg { @apply h-full w-full block; }` ensures SVGs fill their sized container.

### Nav icons: `home`, `search`, `bell`, `message`, `user`, `coin`, `bag`
### Action icons: `plus`, `chevron_left`, `close`, `comment`, `repost`, `heart`, `pin`, `share`

## Animation & Transition Tokens

| Element | Duration | Easing | Effect |
|---------|----------|--------|--------|
| Sidebar collapse | 200ms | `ease-out` | Width, padding, item reposition |
| Nav item select | 200ms | `ease-out` | `-translate-y-0.5`, `shadow-sm`, bg change |
| Tag expand/collapse | 300ms | `ease-out` | Pills unstack/spread, `max-w` clamp |
| Badge popover | 150ms | — | Fade in, slide from top |
| Mobile Home ripple | — | — | `animate-ping` on tap |
| Profile popover | — | — | Instant show/hide on hover |
| Search overlay | 150ms | — | Fade in, slide from top |
| Content show/hide | — | — | Instant text swap (no animation) |
| Follow/Network hover | — | — | `transition-colors` |
| Tag pill hover | — | — | `transition-colors`, bg darkens |
| Action buttons | — | — | `transition-colors`, blue on hover |
