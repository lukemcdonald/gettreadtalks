# Comment Policy

## Principle

Code should be self-documenting. If you need a comment to explain WHAT the code does, consider refactoring to make it clearer.

## Unacceptable Comments

- Comments that repeat what code does
- Commented-out code (delete it)
- Obvious comments ("increment counter")
- Comments instead of good naming

## JSDoc Style (Minimal)

TypeScript provides type information, so JSDoc should add context, not repeat types.

**Function descriptions:** Keep brief (1-2 lines) when they add clarity:

```typescript
// ✅ Good - adds context
/**
 * Get published talks with optional filtering.
 * Defaults to 50 items per page, sorted by most recent.
 */
export async function getTalks(args?: GetTalksProps) {

// ❌ Bad - just repeating the function name
/**
 * Gets talks.
 */
export async function getTalks(args?: GetTalksProps) {
```

**@param/@returns:** Remove unless adding real context beyond types:

```typescript
// ❌ Bad - redundant with TypeScript
/**
 * @param search - Search string (optional)
 * @param cursor - Pagination cursor
 * @returns Array of talks
 */

// ✅ Good - only when adding non-obvious info
/**
 * @param excludeId - Exclude this ID from uniqueness check (for updates)
 */
```

**When to use @param:**
- Documenting default values not visible in signature
- Explaining constraints or side effects
- Complex parameters needing business context
