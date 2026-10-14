# Agent Instructions

Greenfield project — no users, no back-compat concerns. Make it right.

## Workflow

- Package manager: **pnpm**
- Before marking a task complete: `pnpm style` and `pnpm typecheck`
- After meaningful TypeScript or JavaScript changes: `pnpm run audit:code`
- Before opening a PR: `pnpm check`, `pnpm typecheck`, `pnpm test`, and `pnpm exec fallow audit --base origin/main`
- Never push to `main`
- Never run `pnpm dev` unless instructed
- Never run `pnpm release` or `convex deploy` unless instructed — production Convex deploys from the Vercel production build
- When testing local URLs, always use `https`

Use the Fallow skill for deeper audit and debug workflows.

## Testing

Test behavior, not implementation. Add a test only if it would catch a real regression. Unit tests use Vitest (`pnpm test`). Never read source, match code strings, snapshot markup, mock Convex or Next internals, or test the framework.

## Conventions

- No emojis in code, commits, descriptions, or PR titles
- Conventional commits for PR titles and commit messages (the PR title is the squash-merge commit)
- JSDoc only when it adds context beyond the name (1–2 lines). Skip `@param`/`@returns` unless the constraint is non-obvious. No commented-out code or obvious comments.

## Linear

Always use the **gettreadtalks.com** project (`441dc110-d73c-46cb-b395-1c762d7e2958`) when searching, creating, or updating Linear issues for this codebase.

## Corrections

Never show env var names, stack traces, raw internal `error.message`, or config details in user-facing UI. Report those with `reportUnexpectedError` and show a plain message. Keep the details in development/console.

Do not put vendor clients in `lib/` — those belong in `services/`. Never edit `src/components/ui/primitives/` (vendor); wrap in `src/components/ui/`.

Pages and layouts stay synchronous. Put `params`, `searchParams`, cookies, headers, and auth in small async children behind `<Suspense>`. Auth via `AdminGate` / `UserGate` — do not await `requireCurrentUser` / `requireAdminUser` in a layout. No per-route `loading.tsx` on listings. Mutations use `updateTag()` (`refresh()` only when that is not enough). Import `Link` from `@/components/ui/link`, not `next/link`.

Convex filenames cannot be kebab-case (deploy fails). Use camelCase for multi-word files.

React Compiler is on: do not add `React.memo`, `useMemo`, or `useCallback`. Use `ref` as a prop, not `forwardRef`.

When using `FieldError` with React Hook Form, pass `match` or the message will not render. `FieldError` must sit under `<Field>`; outside a field, wrap with `<Field className="contents">`.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.

<!-- convex-ai-end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
