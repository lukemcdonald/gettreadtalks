# UI Component Guidelines

This document outlines the architecture and usage patterns for UI components in this project.

## Three-Tier System

Our UI component system is organized into three tiers:

### 1. Primitives (`src/components/ui/primitives/`)

**Vendor components from Coss UI** - These are synced from upstream and should **never be edited directly**.

- Source: Coss UI (similar to Shadcn)
- Location: `src/components/ui/primitives/*.tsx`
- Purpose: Base components that provide core functionality
- Maintenance: Updated via `components.json` when syncing from Coss UI
- **Rule**: Never import directly from `@/components/ui/primitives/*` in feature code

### 2. Extensions (`src/components/ui/extensions/`)

**Custom wrappers that enhance primitives** - These are our customizations that add functionality or styling.

- Location: `src/components/ui/extensions/*.tsx`
- Purpose: Enhanced versions of primitives with additional features
- Examples:
  - `field-error.tsx` - Enhanced FieldError with error array support and deduplication
  - `form-errors.tsx` - Form-level error display component
- **Rule**: Extensions can import primitives directly for composition

### 3. Feature Components (`src/components/*.tsx`)

**App-specific compositions** - These combine primitives/extensions into reusable feature components.

- Location: `src/components/*.tsx` (outside `ui/` folder)
- Purpose: Business logic components that compose UI primitives
- Examples: `MediaCard`, `LoginForm`, `SpeakerCard`
- **Rule**: Always import from `@/components/ui` (barrel), never from primitives directly

## Import Guidelines

### ✅ Correct: Use the Barrel Export

```tsx
// Feature code - always use the barrel
import { Button, Card, FieldError, FormError } from "@/components/ui";
```

### ❌ Incorrect: Direct Primitive Imports

```tsx
// DON'T do this in feature code
import { Button } from "@/components/ui/primitives/button";
import { FieldError } from "@/components/ui/primitives/field";
```

### ✅ Correct: Extensions Importing Primitives

```tsx
// Extensions can import primitives directly
import { FieldError as BaseFieldError } from "@base-ui/react/field";
// or
import { FieldError } from "../primitives/field";
```

## When to Create Extensions

Create an extension when you need to:

1. **Add richer props/functionality**

   - Example: `FieldError` extension supports error arrays and deduplication
   - Example: Custom validation logic or formatting

2. **Custom styling that utilities can't handle**

   - When Tailwind utilities aren't sufficient
   - When you need complex component-level styling

3. **Compose multiple primitives into reusable patterns**
   - When you have a common pattern used across the app
   - When you want to encapsulate complex interactions

### Example: Creating an Extension

```tsx
// src/components/ui/extensions/my-extension.tsx
"use client";

import { BaseComponent } from "../primitives/base-component";
import { cn } from "@/utils";

export function MyExtension({ className, ...props }) {
  return <BaseComponent className={cn("custom-styles", className)} {...props} />;
}
```

Then export it from the barrel (`src/components/ui/index.ts`):

```ts
// Replace the primitive export
export { MyExtension as BaseComponent } from "./extensions/my-extension";
```

## Barrel Export (`src/components/ui/index.ts`)

The barrel file (`index.ts`) is the **single source of truth** for UI component imports:

- Re-exports all primitives (for components used as-is)
- Re-exports extensions (replacing primitives where custom versions exist)
- Feature code imports from here: `import { X } from '@/components/ui'`

This ensures:

- Extensions automatically replace primitives in feature code
- No need to know whether a component is a primitive or extension
- Easy to swap implementations without changing feature code

## Maintenance Notes

### Updating Coss UI Components

When updating components via `components.json`:

1. Components are synced to `src/components/ui/primitives/`
2. **Internal imports within primitives** may need updating:
   - Primitives use relative paths (e.g., `./button`, `./input`)
   - These will need to be updated if component structure changes
3. **Extensions** should continue to work if API is compatible
4. **Feature code** requires no changes (uses barrel)

### Adding New Extensions

1. Create file in `src/components/ui/extensions/`
2. Import and compose the primitive
3. Add export to `src/components/ui/index.ts`
4. If replacing a primitive, remove the primitive export and add the extension export

## Examples

### Using Primitives

```tsx
import { Button, Card, Input } from "@/components/ui";

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  );
}
```

### Using Extensions

```tsx
import { FieldError, FormError } from "@/components/ui";

function MyForm() {
  return (
    <Form>
      <FieldError errors={[error1, error2]} />
      <FormError error={formError} />
    </Form>
  );
}
```

### Creating Feature Components

```tsx
import { Card, CardTitle, CardDescription } from "@/components/ui";

export function MyCard({ title, description }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}
```

## Lint Rules

To prevent accidental direct imports from primitives:

- **Documentation**: This guide serves as the primary guardrail
- **Code Review**: Reviewers should flag direct primitive imports
- **Future**: Consider adding ESLint rule `no-restricted-imports` to enforce this

## Questions?

If you're unsure whether to:

- Create an extension vs. use a utility class
- Modify a primitive vs. create an extension
- Import from barrel vs. direct path

Refer to this guide or ask the team for guidance.

