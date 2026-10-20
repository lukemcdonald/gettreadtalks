---
name: TREAD Talks
description: Quiet zinc editorial on COSS UI. Brand red primary, Inter only, framed video. Prefer stock components over custom styling.
---

# TREAD Talks

Tokens and values live in `src/assets/theme.css` (`@theme`, `:root`, `.dark`). This file is the look, the shared components, and the rules. Read the CSS when you need a number.

## Keeping this file current

- Add or update this file when a pattern is shared or settled, when a shared component is added, moved, or renamed, or when a rule is corrected in review.
- Don't add token values, one-off page styling, or anything the code already makes obvious.
- Remove a rule once its component is gone. Keep it short: point to files instead of copying classes.

## Overview

A sermon archive's reading room on [COSS UI](https://coss.com/ui) `base-nova`: plain zinc paper, white index cards, red ink used only for the brand and the next action, and the preacher's video framed and lifted as the one object with depth. Stock COSS first, so nothing competes with the talk.

- **Depth:** Paper and cards are flat. Only a video or hero frame is lifted.
- **Color:** There is one red, in the same place in light and dark. Everything else is zinc.
- **Type:** One voice, Inter. Hierarchy comes from size and weight, never from a second face.
- **Imagery:** The preachers are the imagery: their photo or their video. No illustration. Initials when there's no photo.
- **Motion:** Hover feedback only, mostly color fades. Nothing enters on scroll.

## Colors

Use theme utilities (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`, `text-destructive`). Do not paste hex or `oklch` into components.

- **primary** — brand red. Actions, play control, emphasis. Pair with `primary-foreground`.
- **background / foreground** — page ink and paper.
- **card / popover** — raised surfaces and overlays.
- **muted / muted-foreground** — secondary copy, captions, speaker role, table subtitles.
- **secondary / accent** — quiet fills and hover.
- **border / input / ring** — hairlines, fields, focus.
- **dividers** — decorative rules use `border-input` / `bg-input` / `divide-input` so they match field outlines. Solid, never dashed. `SectionHeading` is the shared heading rule.
- **destructive / info / success / warning** — status and alerts, each with a matching `*-foreground`.

Dark mode is class-based (`next-themes`, `.dark` on `html`). Token names stay; values swap. Toggle with `ModeSwitcher` in `src/components/site-header/mode-switcher.tsx`.

## Typography

One family: `Inter` via `next/font/google` as `--font-sans`. `--font-heading` is the same face. No second display font.

Titles use `HeroTitle` in `src/components/hero/hero-title.tsx` or `PageHeader` in `src/components/page-header.tsx`. Body inherits `text-foreground`. Meta, role, and captions use `text-muted-foreground`. The detail-page eyebrow is `ArchiveBackLink` — uppercase, wide tracking, not a breadcrumb trail.

## Layout

`Section` (`src/components/ui/section.tsx`) and `Container` (`src/components/ui/container.tsx`) wrap pages. Browse uses `SidebarLayout` (`src/components/layouts/sidebar-layout.tsx`): twelve columns, sidebar three, content nine. Account and manage use `AreaLayout` (`src/components/layouts/area-layout.tsx`). Page bodies use `PageContainer` (`src/components/page-container.tsx`). Browse filter Suspense fallbacks must match `BrowseFilters`: compact search plus icon on mobile, stacked fields on desktop (`SidebarFiltersSkeleton`).

Overlays: `Dialog` for centered blocking UI (confirm, alert, desktop search). `Drawer` for nav, mobile search, mobile filters, and `FormSheet` (`src/components/ui/form-sheet.tsx`) — right on large screens, bottom on small. Do not import `Sheet` in feature or page code.

The header is `src/components/site-header/site-header.tsx`. Desktop shows branding, nav, search, theme, and account. Mobile is search plus menu only; account and theme live in `src/components/site-header/navigation/mobile-nav.tsx`.

## Elevation & Depth

Page ground is `background`. Raised surfaces are `card`. Do not invent a third elevation language.

Every video sits in `VideoFrame` (`src/components/media-embed/video-frame.tsx`):

```
relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl
```

Cards and card-variant tables use the stock COSS shadow. Featured listings wrap the frame in `FeaturedVideoCard` (`src/components/featured-video-card.tsx`): a `bg-card` caption raised over the video’s lower edge, edge to edge. Do not restyle the frame per route.

## Shapes

Surfaces (cards, video, dialogs) are `rounded-2xl`. Buttons are `rounded-lg`. Pills, status dots, and avatars are `rounded-full`. Read `--radius*` from `src/assets/theme.css` when you need the math.

## Components

Import COSS from `@/components/ui` (`src/components/ui`). Never edit `src/components/ui/primitives/`. `pnpm update:ui` pulls `@coss/ui`.

- **Video** — `VideoFrame` / `MediaEmbed` in `src/components/media-embed/`. Featured listings use `FeaturedVideoCard`.
- **Talk card subtitle** — speaker name always, scripture after a decorative middot (`TalkCardSubtitle` in `src/features/talks/components/talk-card-subtitle.tsx`). Scripture truncates; the speaker name does not. On a speaker-page featured video, scripture only.
- **Manage tables** — `Table variant="card"` via `src/components/manage-table/`. Title plus a muted second line. Outline status badge with a dot on desktop; status dot only on mobile. Row click opens the edit `FormSheet`. Trailing menu: View, Archive, Delete. Hover details on desktop. No Updated column.
- **Detail back link** — `ArchiveBackLink` in `src/components/archive-back-link.tsx` above the title. Keep JSON-LD breadcrumbs (`src/lib/json-ld.ts`). Do not render COSS `Breadcrumb`.
- **Speaker role** — its own muted line under the name (`src/app/speakers/[speakerSlug]/_components/speaker-hero-details.tsx`, `src/features/speakers/components/speaker-card.tsx`). Never inline with the name.
- **Search** — desktop `CommandDialog` in `src/features/search/components/header-search/desktop-search-dialog.tsx`. Mobile bottom `Drawer` in `src/features/search/components/header-search/mobile-search-drawer.tsx`.
- **Section heading** — `SectionHeading` in `src/components/section-heading.tsx`. Solid `bg-input` rule between heading and meta.

## Do's and Don'ts

**Do**

- Use theme utilities and semantic tokens from `src/assets/theme.css`.
- Reuse the shared component instead of copying its classes.
- Keep COSS UI close to stock (`variant="outline"` / `ghost` / `default`).
- Respect dark mode and `prefers-reduced-motion`.
- Wrap video in `VideoFrame`. Use `FeaturedVideoCard` for featured listings.
- Use `ManageTable` / `ManageRow` for manage lists and `ArchiveBackLink` above detail titles.

**Don't**

- Don't paste hex, `oklch`, or arbitrary `[prop:var()]` values into components.
- Don't add a one-off utility when a shared component exists.
- Don't restyle `VideoFrame` per route or inset the featured caption.
- Don't add visible breadcrumbs, an Updated column, or a mobile status badge on manage rows.
- Don't put theme or account controls in the mobile header chrome.
- Don't import `Sheet` in feature or page code, or edit files under `src/components/ui/primitives/`.
- Don't show env var names, stack traces, or raw `error.message` in the UI.
