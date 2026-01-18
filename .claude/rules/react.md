# React

## No Manual Memoization

React 19's compiler auto-optimizes. **Do not use:**

- `React.memo()`
- `useMemo()`
- `useCallback()`

Write normal functions and components. Only consider memoization for genuinely expensive operations (1000+ items, crypto), and prefer moving those server-side.

## Forward Ref

Use `ref` as a prop, not `React.forwardRef`.

## Types

Explicitly import types from React instead of importing off global React.

```ts
✅ import type { ReactNode } from 'react';
type ExampleProps = { children: ReactNode };

❌ import * from 'react'
type ExampleProps = { children: React.ReactNode };
```
