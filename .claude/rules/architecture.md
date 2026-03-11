
# Architecture

## Feature-Based Organization

Code is organized by **domain/feature**, not technical layer.

**Directory Structure:**

- `convex/` - Database schema + backend functions
- `convex/model/` - Entity-specific helpers organized by domain
- `src/app/` - Next.js App Router pages
- `src/components/` - Shared UI components
- `src/constants/` - Shared constants
- `src/features/` - Business domains (talks, users, clips, speakers, topics, collections)
- `src/lib/` - Cross-cutting concerns (forms, entities)
- `src/services/` - Infrastructure (auth, email, errors)
- `src/utils/` - Generic utilities

**Path Alias:** `@/*` maps to `src/*`

## Feature Structure

```sh
src/features/{domain}/
├─ actions/    # Server actions (writes)
├─ components/ # Feature-specific components
├─ hooks/      # Client hooks (mutations/forms only)
├─ queries/    # Server queries (reads)
├─ schemas/    # Zod validations
├─ types.ts    # All types
└─ utils.ts    # Shared utils
```

## Component Organization

1. **Shared** — `src/components/` — Used across features
2. **Feature** — `src/features/{domain}/components/` — Feature-specific
3. **Route** — `src/app/{route}/_components/` — Route-specific

**UI Primitives:** Files in `src/components/ui/primitives/` are vendor components — never edit directly. Create wrappers in `src/components/ui/`.

**UI imports** — always import from `@/components/ui`, never from primitive paths directly:

```typescript
// ✅ Always use the barrel
import { Button, Card, TextField } from '@/components/ui';

// ❌ Never import primitives directly in feature/page code
import { Button } from '@/components/ui/primitives/button';
```

**Naming:** kebab-case for all folders

## Layout Data Fetching

Never fetch data in `layout.tsx` on the server. Doing so forces all children into dynamic rendering, breaking static rendering for the entire subtree.

```tsx
// ❌ Never — makes all children dynamic
export default async function Layout({ children }) {
  const data = await fetchSomeData();
  return <Sidebar data={data}>{children}</Sidebar>;
}

// ✅ Fetch inside the component, not the layout
export default function Layout({ children }) {
  return <Sidebar>{children}</Sidebar>; // Sidebar fetches its own data internally
}
```

**Exception:** Auth guards (`requireCurrentUser`, `requireAdminUser`) are acceptable in layouts — they redirect rather than pass data to children, and protected routes are inherently dynamic.
