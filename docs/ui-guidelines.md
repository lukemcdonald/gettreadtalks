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

### 2. Custom Component Groups (`src/components/ui/{component}/`)

**Custom wrappers that enhance primitives** - Component directories that re-export primitives and add customizations.

- Location: `src/components/ui/{component}/` (e.g., `field/`, `form/`)
- Structure:
  - `index.ts` - Re-exports primitives, overrides/adds custom components
  - `{component}-{name}.tsx` - Custom component implementations
- Examples:
  - `field/field-error.tsx` - Enhanced FieldError with error array support
  - `form/form-error.tsx` - Form-level error display component
- **Rule**: Custom component groups can import primitives directly for composition

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

### ✅ Correct: Custom Component Groups Importing Primitives

```tsx
// Custom component groups can import primitives directly
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

### Example: Creating a Custom Component Group

```tsx
// src/components/ui/my-component/my-component.tsx
"use client";

import { BaseComponent } from "../primitives/base-component";
import { cn } from "@/utils";

export function MyComponent({ className, ...props }) {
  return <BaseComponent className={cn("custom-styles", className)} {...props} />;
}
```

Then create the wrapper barrel (`src/components/ui/my-component/index.ts`):

```ts
// Re-export everything from primitive
export * from "../primitives/base-component";
// Override with custom version
export { MyComponent as BaseComponent } from "./my-component";
```

The main barrel (`src/components/ui/index.ts`) will use it automatically:

```ts
export * from "./my-component"; // Uses custom wrapper
export * from "./primitives/other-component"; // Uses primitive directly
```

## Barrel Export (`src/components/ui/index.ts`)

The barrel file (`index.ts`) is the **single source of truth** for UI component imports:

- Re-exports from component directories (e.g., `./field`, `./form`) for customized components
- Re-exports from primitives (e.g., `./primitives/button`) for unchanged components
- Feature code imports from here: `import { X } from '@/components/ui'`

This ensures:

- Custom component groups automatically replace primitives in feature code
- No need to know whether a component is a primitive or customized
- Easy to swap implementations without changing feature code
- Clear structure: if a component directory exists, it's customized

## Maintenance Notes

### Updating Coss UI Components

When updating components via `components.json`:

1. Components are synced to `src/components/ui/primitives/`
2. **Internal imports within primitives** may need updating:
   - Primitives use relative paths (e.g., `./button`, `./input`)
   - These will need to be updated if component structure changes
3. **Extensions** should continue to work if API is compatible
4. **Feature code** requires no changes (uses barrel)

### Adding New Custom Component Groups

1. Create directory `src/components/ui/{component}/`
2. Create `index.ts` that re-exports from `../primitives/{component}` and adds overrides
3. Create custom component files (e.g., `{component}-{name}.tsx`)
4. Update `src/components/ui/index.ts` to use the custom directory instead of primitive

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

### Using Custom Components

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
