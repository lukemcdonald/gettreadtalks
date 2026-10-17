# TREAD Talks

Quiet zinc editorial on [COSS UI](https://coss.com/ui) `base-nova`. Inter is the only face. Rose is the only brand chroma. Video is framed, never free-floating. Prefer stock COSS components and variants over custom styling.

Source of truth: `src/assets/theme.css`. Primitives live in `src/components/ui/primitives/` — never edit them. Import from `@/components/ui`. Icons: `lucide-react`.

## Palette

Neutrals alias Tailwind zinc (`--color-neutral-*` → `--color-zinc-*`). Semantic tokens, not raw hex.

| Token | Light (`:root`) | Dark (`.dark`) |
| --- | --- | --- |
| `--background` | `--color-neutral-100` | `color-mix(in srgb, --color-neutral-950 98%, white)` |
| `--foreground` | `--color-neutral-800` | `--color-neutral-100` |
| `--card` / `--popover` | `--color-white` | card `97%` mix, popover `96%` mix on background |
| `--primary` | `oklch(50.5% 0.213 27.518)` | `oklch(57.7% 0.245 27.325)` |
| `--primary-foreground` | `--color-neutral-50` | `--color-neutral-100` |
| `--secondary` / `--muted` / `--accent` | `--alpha(black / 4%)` | `--alpha(white / 4%)` |
| `--muted-foreground` | `neutral-600` 90% + black | `neutral-400` 90% + white |
| `--border` | `--alpha(black / 8%)` | `--alpha(white / 6%)` |
| `--input` | `--alpha(black / 10%)` | `--alpha(white / 8%)` |
| `--ring` | `--color-neutral-400` | `--color-neutral-500` |
| `--destructive` | `--color-red-500` | `red-500` 90% + white |
| `--info` | `--color-blue-500` | `--color-blue-500` |
| `--success` | `--color-emerald-500` | `--color-emerald-500` |
| `--warning` | `--color-amber-500` | `--color-amber-500` |

Foreground pairs for destructive / info / success / warning: `*-700` in light, `*-400` in dark.

`--chart-1`…`--chart-5` and `--sidebar*` are defined in `theme.css`. They are not a product chrome pattern.

Dark mode is class-based: `next-themes` `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`. Toggle with `ModeSwitcher`.

## Typography

One family. `Inter` from `next/font/google` as `--font-sans`. `--font-heading: var(--font-sans)`. No second display face.

| Role | Classes | Notes |
| --- | --- | --- |
| Page / hero title | `HeroTitle`: `font-semibold tracking-tight` | `sm` `text-2xl sm:text-3xl lg:text-4xl`; `md` `text-3xl sm:text-4xl lg:text-5xl`; `lg` `text-4xl sm:text-5xl lg:text-6xl xl:text-7xl` |
| Page header | `PageHeader` `font-base tracking-tight text-balance` | `sm` `text-2xl`; `md` `text-3xl sm:text-4xl`; `lg` `text-4xl sm:text-5xl lg:text-6xl` |
| Card title | `font-heading font-semibold text-lg leading-none` | COSS `CardTitle` |
| Media card title | `text-base font-semibold text-balance line-clamp-2` |  |
| Dialog / drawer title | `font-heading font-semibold text-xl leading-none` |  |
| Body | inherited `text-foreground` |  |
| Muted / meta | `text-muted-foreground` | Role, subtitle, captions, descriptions |
| Eyebrow | `text-xs font-semibold tracking-wide uppercase` | `ArchiveBackLink`, featured-grid aside |
| Prose measure | `--max-width-prose: 70ch` | `max-w-prose` |

## Spacing

Tailwind default 4px scale. No custom spacing tokens.

| Surface | Classes |
| --- | --- |
| Root content | `py-6 sm:py-8 md:py-10 lg:py-12` |
| `Section` | `gap-6 px-4 sm:px-6` plus `spacing`: `xs` `py-2`; `sm` `py-3`; `md` `py-4`; `lg` `py-4 sm:py-6`; `xl` `py-4 sm:py-6 md:py-12`; `2xl` `py-4 sm:py-6 md:py-12 lg:py-16`; `3xl` `xl:20 py-4 sm:py-6 md:py-12 lg:py-16` |
| `Container` | same `spacing` scale; width `container` → `--max-width-container: var(--breakpoint-xl)` |
| Stacks | `space-y-6`, `gap-6`, `lg:gap-8` |
| `GridList` | `normal` `gap-2 @sm:gap-3 @md:gap-4`; `relaxed` `gap-2 @sm:gap-4 @md:gap-6` |
| Card padding | `p-4` (`MediaCard`, featured caption) |

## Radius

`--radius: 0.625rem`. Theme scale:

| Token          | Value                                     |
| -------------- | ----------------------------------------- |
| `--radius-sm`  | `calc(var(--radius) - 4px)` → `0.375rem`  |
| `--radius-md`  | `calc(var(--radius) - 2px)` → `0.5rem`    |
| `--radius-lg`  | `var(--radius)` → `0.625rem`              |
| `--radius-xl`  | `calc(var(--radius) + 4px)` → `0.875rem`  |
| `--radius-2xl` | `calc(var(--radius) + 8px)` → `1.125rem`  |
| `--radius-3xl` | `calc(var(--radius) + 12px)` → `1.375rem` |
| `--radius-4xl` | `calc(var(--radius) + 16px)` → `1.625rem` |

`rounded-2xl` is the default surface (cards, video, dialogs). Buttons use `rounded-lg`. Header search desktop trigger is `rounded-full`. Status dots are `rounded-full`. Avatars use `rounded="full"`.

## Shadows and elevation

No custom `--shadow-*` tokens. Use Tailwind shadows as the primitives already do.

| Surface | Classes |
| --- | --- |
| Video / featured shell | `shadow-2xl` |
| COSS `Card`, table `variant="card"` body, featured caption | `shadow-xs/5` plus a 1px edge highlight (`before:shadow-[0_1px_--theme(--color-black/4%)]`; dark `0_-1px` white/6%) |
| Featured play control | `shadow-lg` |
| Home hero photo | `shadow-xl` |
| Dialog / command | `shadow-lg/5` |
| Default button | `shadow-xs` + `shadow-primary/24` |
| `card-interactive` hover | `shadow-md/3` + `ring-card` |

Page ground is `--background` (zinc-100 / near-950). Raised surfaces are `--card` (white / lifted dark). Do not invent a third elevation language.

## Motion

| Token / class | Value |
| --- | --- |
| `--animate-skeleton` | `skeleton 2s -1s infinite linear` |
| `--animate-caret-blink` | `1s ease-out infinite` |
| Toast success | `0.32s cubic-bezier(0.5, 1, 0.89, 1)` scale pulse |
| Toast error | `0.28s cubic-bezier(0.5, 1, 0.89, 1)` horizontal shake |
| Dialog / command | `duration-200 ease-in-out`; enter/exit `scale-98` + opacity |
| `card-interactive` | `transition duration-300` |
| Featured card | `transition-colors`; play `transition-opacity group-hover:opacity-90` |

`prefers-reduced-motion: reduce` sets toast animations to `none`. Theme switch does not animate (`disableTransitionOnChange`). No bounce or decorative loops.

## Layout

| Rule | Value |
| --- | --- |
| Page container | `container` at `--breakpoint-xl` |
| Browse | `SidebarLayout`: `md:grid-cols-12`, sidebar `md:col-span-3`, content `md:col-span-9` |
| Account / manage | `AreaLayout`: `max-w-5xl`, underline `Tabs`, sidebar `w-52` from `lg` |
| Page body | `PageContainer` `max-w-4xl` (default) or `max-w-2xl` (`narrow`) |
| Featured grid | `lg:grid-cols-[280px_1fr]`, cards `@container` via `GridList` |
| Header | `sticky top-0 z-50`, `Section spacing="sm"` |
| Tailwind `md:` | `768px` (theme does not override breakpoints) |
| `useIsMobile()` | `max-md` against JS `md: 800` → `(max-width: 799px)` |

Overlays (do not invent a fourth):

- `Dialog` — centered blocking UI (confirm, alert, desktop search)
- `Drawer` — the app overlay (nav, mobile search, mobile filters, `FormSheet`). Right on `lg`, bottom on small screens; stacking is supported
- `Sheet` — COSS primitive only. Do not import in feature or page code

## Component rules

**COSS first.** Use stock `Button` / `Badge` / `Table` / `Card` / `Empty` / `Tabs` / `Command` variants. Do not restyle primitives. `pnpm update:ui` pulls `@coss/ui`.

**VideoFrame** (`src/components/media-embed/video-frame.tsx`) — every video surface:

```
relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl
```

`MediaEmbed` wraps YouTube / Vimeo / file video in it. Do not give a page its own radius or shadow.

**FeaturedVideoCard** — layered featured video. Shell `bg-muted/72 flex flex-col overflow-hidden rounded-2xl shadow-2xl`. Inner `VideoFrame` is `rounded-none shadow-none`. White (`bg-card`) caption sits edge-to-edge and is raised over the video’s lower edge: `-mt-3 rounded-t-xl rounded-b-2xl border-t p-4 shadow-xs/5`. Play control: `bg-primary h-12 w-16 rounded-2xl shadow-lg`.

**Manage tables** — `Table variant="card"` via `ManageTable`. Title plus a muted second line (`text-muted-foreground truncate text-sm`). Desktop: `Badge variant="outline"` with a `size-1.5 rounded-full` status dot (`bg-emerald-500` published, `bg-amber-500` draft, `bg-muted-foreground/64` archived). Mobile: the same dot beside the title, no badge column (`hidden md:table-cell`). Row click (title `after:absolute after:inset-0`) opens the edit `FormSheet` drawer. Trailing `⋯` (`EllipsisIcon`) menu: View, Archive / Unarchive, Delete (destructive, separated). Desktop title hover: `HoverCard` details. No Updated column.

**ArchiveBackLink** — text eyebrow above the title, not a breadcrumb trail:

```
text-muted-foreground text-xs font-semibold tracking-wide uppercase
```

plus `ChevronLeftIcon size-3`. Keep `buildBreadcrumbJsonLd` / `JsonLd`. Do not render COSS `Breadcrumb`.

**Speaker role** — its own muted line under the name: `text-muted-foreground text-sm` on the hero; `CardDescription` / `subtitle` on `SpeakerCard`. Never inline with the name.

**Header** — desktop: branding, primary nav, search, `ModeSwitcher`, account. Mobile (`md:hidden` menu, search always): search + menu only. Account, theme, and nav live inside the bottom `Drawer`.

**Search** — desktop: `CommandDialog` (`⌘K`). Mobile: `Drawer` `position="bottom"` at `[--drawer-height:90dvh]`. Do not use a dialog on small screens.

## Do / Don't

**Do**

- Wrap video in `VideoFrame`. Use `FeaturedVideoCard` for featured listings.
- Use `Table variant="card"` and `ManageRow` for manage lists.
- Put `ArchiveBackLink` above the `HeroTitle`; keep JSON-LD breadcrumbs only.
- Put speaker role on a muted line under the name.
- Keep the mobile header to search + menu; put account controls in the menu drawer.
- Open search as `CommandDialog` on desktop and the 90dvh `Drawer` on mobile.
- Import COSS from `@/components/ui`. Prefer `variant="outline"` / `ghost` / `default` over new classes.

**Don't**

- Don't invent colors, fonts, radii, or a second typeface.
- Don't restyle `VideoFrame` per route, or inset the featured caption away from the video edges.
- Don't add visible breadcrumbs, an Updated column, or a status badge on mobile manage rows.
- Don't put theme / account controls in the mobile header chrome.
- Don't import `Sheet` in feature or page code, or edit files under `src/components/ui/primitives/`.
- Don't show env var names, stack traces, or raw `error.message` in the UI.
