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

`Section` (`src/components/ui/section.tsx`) and `Container` (`src/components/ui/container.tsx`) wrap pages. Browse uses `SidebarLayout` (`src/components/layouts/sidebar-layout.tsx`): twelve columns, sidebar three, content nine. Account and manage use `AreaLayout` (`src/components/layouts/area-layout.tsx`). Page bodies use `PageContainer` (`src/components/page-container.tsx`). Browse filter Suspense fallbacks must match `BrowseFilters`: compact search plus icon on mobile, stacked fields on desktop (`SidebarFiltersSkeleton`). Loading skeletons match the page's stable layout (grid/columns, hero shape, the main content area) so the page does not jump when it loads. Omit only optional blocks whose absence would shift content or show something that might not exist (About, summaries, optional cards). Always-renders applies to sections, not to dropping the layout skeleton.

The document has one site `header`, one `main` (`#main`, skip target), and one `footer`. Public content pages (talk, speaker, topic, collection, clip, about, beliefs, /ai) are an `article`. Listings and groupings are a `section`.

Every public page has one `h1` (`PageHeader` or `HeroTitle`). Real section titles are `h2` (`SectionHeading`, `FeaturedGrid`, search groups). Card titles (`MediaCardTitle`) and featured captions are one level below their container: `h3` under a section `h2`, `h2` on flat listings. Nested groups under an `h2` may use `h3`. Do not skip levels. Metadata labels (`MetadataGroup`) and footer column titles are not headings.

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
- **Talk card subtitle** — speaker name always, scripture after a decorative middot (`TalkCardSubtitle` in `src/features/talks/components/talk-card-subtitle.tsx`). Scripture truncates; the speaker name does not. Used on talk cards, search talk results, and favorite talks. On a speaker-page featured video, scripture only. Clip cards show the speaker only.
- **Clip detail** — same hero as the talk page (`ArchiveBackLink`, `HeroTitle` size sm, `VideoFrame`). Related talk and speaker use `FeaturedGrid` with card titles as `h3`. About is `MetadataGroup`; omit the metadata column when there is no description.
- **Manage tables** — `Table variant="card"` via `src/components/manage-table/`. Title plus a muted second line. Outline status badge with a dot on desktop; status dot only on mobile. Row click opens the edit `FormSheet`. Trailing menu: View, Archive, Delete. Hover details on desktop. No Updated column. Every list uses a URL `search` param (`SearchInput`) and cursor pagination (`Pagination`). Talks and clips also filter by status.
- **Edit talk drawer** — `EditTalkSheet` uses Content | Study tabs. Content is the talk form, then Summary (compact draft/published status on the label row, taller textarea, Generate as a small outline button under it; disabled with a muted "Needs a transcript" hint when there is no transcript), then a labeled Transcript field (status None / Saved / Failed plus retry text, then small outline/ghost Get or View/edit plus Re-fetch). If the media has no transcript source, Transcript shows only a muted note. Save Changes is the only primary button in the drawer. When status is published, Content includes a Publish date (`DateField`, native `type="date"`). Future dates are rejected. Study is `EditTalkStudyPanel` and loads only when that tab is selected: Generate study as a small outline button (same transcript guard as Generate summary), editable main points and key passages (add, remove, reorder), and a read-only preview rendered with `TalkStudyContent`. `/talks/edit/<id>` and `/talks/edit/<id>/study` select the tab. Do not stack a second study sheet.
- **Date fields** — `DateField` in `src/components/ui/fields/date-field.tsx` wraps stock `Input type="date"`. Do not add a calendar popover.
- **Detail back link** — `ArchiveBackLink` in `src/components/archive-back-link.tsx` above the title. Keep JSON-LD breadcrumbs (`src/lib/json-ld.ts`). Do not render COSS `Breadcrumb`.
- **Speaker role** — its own muted line under the name (`src/app/speakers/[speakerSlug]/_components/speaker-hero-details.tsx`, `src/features/speakers/components/speaker-card.tsx`). Never inline with the name.
- **Search** — desktop `CommandDialog` in `src/features/search/components/header-search/desktop-search-dialog.tsx`. Mobile bottom `Drawer` in `src/features/search/components/header-search/mobile-search-drawer.tsx`. Result copy is `SearchResultItem`: semibold title, `MediaCardSubtitle` for speaker and similar details.
- **Transcript** — admin Content tab uses a large stock `Dialog` (`src/features/talks/components/talk-transcript-dialog.tsx`) with a plain textarea that fills the dialog body. The field stays inside the dialog padding. Long text scrolls inside the textarea. The footer stays on screen. Load text only when the dialog opens.
- **Section heading** — `SectionHeading` in `src/components/section-heading.tsx`. Solid `bg-input` rule between heading and meta.
- **Metadata labels** — `MetadataGroup` in `src/components/metadata-group.tsx`. Uppercase muted labels for About, Topics, Scripture, Actions. Not headings.
- **Talk study** — `TalkStudyContent` in `src/features/talks/components/talk-study-content.tsx`. On the talk page, Main points then Key passages sit in the main column above Collection when the study is published and those fields exist. Section titles match `FeaturedGrid` (`h2`, uppercase); item titles are `h3`. References are plain-text strings. The Study tab preview uses the same component, stacked.
- **Transactional email** — `convex/emails/`. Shared chrome in `components/layout.tsx`; colors and type in `components/styles.ts` as hex (email clients do not honor CSS variables or oklch). Wordmark is the hosted PNG at `{site.url}/logo.png`, TREAD in the same red as the primary button. The button is left-aligned with the body. Reset and verify put a muted "Button not working? Paste this link:" line after the button (`word-break: break-all` on the URL only). Welcome has no fallback URL. Keep copy short: one action, expiry, ignore-if-not-you, support. Do not wrap templates in React Email `Tailwind` — Tailwind v4 emits oklch.

## Do's and Don'ts

**Do**

- Use theme utilities and semantic tokens from `src/assets/theme.css`.
- Reuse the shared component instead of copying its classes.
- Keep COSS UI close to stock (`variant="outline"` / `ghost` / `default`).
- Respect dark mode and `prefers-reduced-motion`.
- Wrap video in `VideoFrame`. Use `FeaturedVideoCard` for featured listings.
- Use `ManageTable` / `ManageRow` for manage lists and `ArchiveBackLink` above detail titles.

**Don't**

- Don't paste hex, `oklch`, or arbitrary property values into components. Email templates are the exception: they use hex in `convex/emails/components/styles.ts`.
- Don't wrap email templates in React Email `Tailwind`.
- Don't add a one-off utility when a shared component exists.
- Don't restyle `VideoFrame` per route or inset the featured caption.
- Don't add visible breadcrumbs, an Updated column, or a mobile status badge on manage rows.
- Don't put theme or account controls in the mobile header chrome.
- Don't import `Sheet` in feature or page code, or edit files under `src/components/ui/primitives/`.
- Don't show env var names, stack traces, or raw `error.message` in the UI.
