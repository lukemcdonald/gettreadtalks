# Agent Instructions

Greenfield project — no users, no back-compat concerns. Make it right.

## Workflow

- Package manager: **pnpm**
- Before marking any task complete: run `pnpm style` and `pnpm typecheck`
- Never run `pnpm dev` unless instructed
- When testing local URLs, always use `https`

## Conventions

- No emojis anywhere: code, commits, descriptions, PR titles
- Alphabetize: imports, object keys, destructured props, component prop lists
  - Exception: group related items together if alphabetical order hurts readability

## Code Comments

JSDoc only when adding context beyond the function name (1–2 lines max). Skip `@param`/`@returns` unless documenting non-obvious constraints, defaults, or side effects. Never: commented-out code, obvious comments, redundant type docs.

## Linear

Always use the **gettreadtalks.com** project (`441dc110-d73c-46cb-b395-1c762d7e2958`) when searching, creating, or updating Linear issues for this codebase.

## Rules

- [Architecture](rules/architecture.md) — Feature structure, component organization, layout data fetching
- [Convex](rules/convex.md) — File naming, query/mutation conventions, caching, error handling
- [React](rules/react.md) — Memoization, ref pattern, types, prop delegation
- [UI](rules/ui.md) — FieldError with RHF, context requirements
