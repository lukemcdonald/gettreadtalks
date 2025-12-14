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

1. Create an extension in `../extensions/`
2. Import and compose the primitive
3. Export it from `../index.ts` to replace the primitive
4. Feature code will automatically use your extension

## Example

Instead of editing `field.tsx`:

```tsx
// ❌ DON'T edit primitives/field.tsx

// ✅ DO create extensions/field-error.tsx
import { FieldError as BaseFieldError } from "@base-ui/react/field";
// ... your customization

// ✅ DO export from ui/index.ts
export { FieldError } from "./extensions/field-error";
```

## Updating Components

When updating via `components.json`:

1. Components are synced here automatically
2. Internal relative imports may need manual updates
3. Extensions should continue working if API is compatible

