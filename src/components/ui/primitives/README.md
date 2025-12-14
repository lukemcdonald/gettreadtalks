# UI Primitives

These components are synced from Coss UI and should **never be edited directly**.

## Purpose

This directory contains vendor components from Coss UI (similar to Shadcn). These are the base building blocks that provide core functionality.

## Rules

1. **Never edit files in this directory directly**

   - Changes will be overwritten when syncing from Coss UI
   - If you need to customize, create an extension instead

2. **Never import from this directory in feature code**

   - Always use the barrel: `import { X } from '@/components/ui'`
   - This ensures you get extensions when available

3. **Internal imports use relative paths**
   - Primitives import each other using relative paths (e.g., `./button`)
   - This ensures they always get the actual primitive, not extensions

## To Customize

If you need to customize a primitive:

1. Create a component directory in `../{component}/` (e.g., `../field/`)
2. Create `index.ts` that re-exports from the primitive and adds overrides
3. Create custom component files in that directory
4. Update `../index.ts` to export from the component directory instead of primitive
5. Feature code will automatically use your customizations

## Example

Instead of editing `field.tsx`:

```tsx
// ❌ DON'T edit primitives/field.tsx

// ✅ DO create field/index.ts
export * from "../primitives/field";
export { FieldError } from "./field-error";

// ✅ DO create field/field-error.tsx
import { FieldError as BaseFieldError } from "../primitives/field";
// ... your customization

// ✅ DO update ui/index.ts
export * from "./field"; // Uses custom wrapper
```

## Updating Components

When updating via `components.json`:

1. Components are synced here automatically
2. Internal relative imports may need manual updates
3. Extensions should continue working if API is compatible
