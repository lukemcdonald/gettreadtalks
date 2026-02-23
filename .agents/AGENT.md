# Agent Instructions

This project is greenfield with no users. Do not worry about back compat or changing schema if needed. We want to make things right.

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in this file to help prevent future agents from having the same issue.

## Alphabetization

Alphabetize when possible: imports, object keys, destructured props, component prop lists. Exception: group related items together if alphabetical order hurts readability.

## Commits

Run `pnpm style` and `pnpm typecheck` before considering a task complete.

## Comments

Code should be self-documenting. No comments that repeat what code does.

**JSDoc:** Brief descriptions (1-2 lines) only when adding context beyond the function name. Skip `@param`/`@returns` unless documenting non-obvious constraints, defaults, or side effects.

**Never:** commented-out code, obvious comments, redundant type documentation.

## Rules and Patterns

- [Architecture](rules/architecture.md) — Folder and component composition
- [Convex](rules/convex.md) — File naming, query/mutation conventions, caching, error handling
- [React](rules/react.md) — Memoization, ref, types, prop delegation
- [UI](rules/ui.md) — FieldError with RHF, context requirements
