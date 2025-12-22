# Reusable Form Field Components

This document describes the reusable form field components available in `src/components/ui/field/` that simplify form implementation and ensure consistency across the application.

## Overview

All reusable field components wrap React Hook Form's `Controller` component and integrate with our Base UI primitives (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`). They handle:

- Form state management via React Hook Form
- Automatic error display
- Required field indicators
- Consistent styling and behavior
- Type safety with TypeScript generics

## Available Components

### TextField

Single-line text input field.

```tsx
import { TextField } from '@/components/ui';

<TextField
  control={form.control}
  label="Title"
  name="title"
  placeholder="Enter title"
  required
/>
```

**Props:**
- `control` - React Hook Form control object
- `name` - Field name (must match form schema)
- `label` - Field label text
- `placeholder` - Placeholder text (optional)
- `required` - Show required asterisk (optional)
- `description` - Help text displayed below label (optional)
- All standard HTML input props (e.g., `type`, `disabled`, `autoFocus`)

### TextareaField

Multi-line text input field.

```tsx
import { TextareaField } from '@/components/ui';

<TextareaField
  control={form.control}
  description="Provide a detailed description"
  label="Description"
  name="description"
  placeholder="Enter description"
  rows={4}
/>
```

**Props:**
- Same as `TextField` plus:
- `rows` - Number of visible rows (optional, default: 3)

### UrlField

URL input field with URL validation.

```tsx
import { UrlField } from '@/components/ui';

<UrlField
  control={form.control}
  label="Media URL"
  name="mediaUrl"
  placeholder="https://example.com/video"
  required
/>
```

**Props:**
- Same as `TextField`
- Automatically uses `type="url"` for browser validation

### NumberField

Numeric input field.

```tsx
import { NumberField } from '@/components/ui';

<NumberField
  control={form.control}
  label="Order"
  name="collectionOrder"
  placeholder="0"
/>
```

**Props:**
- Same as `TextField`
- Automatically uses `type="number"` with proper number handling

### CheckboxField

Checkbox input field.

```tsx
import { CheckboxField } from '@/components/ui';

<CheckboxField
  control={form.control}
  description="Check to enable this feature"
  label="Enable Feature"
  name="enabled"
/>
```

**Props:**
- `control` - React Hook Form control object
- `name` - Field name
- `label` - Checkbox label text
- `description` - Help text (optional)
- Note: `required` prop is not used for checkboxes

### FeaturedField

Pre-configured checkbox for "featured" flag.

```tsx
import { FeaturedField } from '@/components/ui';

<FeaturedField control={form.control} name="featured" />
```

**Props:**
- `control` - React Hook Form control object
- `name` - Field name (typically "featured")
- Automatically uses "Featured" as label

### SelectField

Generic select dropdown field.

```tsx
import { SelectField } from '@/components/ui';

<SelectField
  control={form.control}
  label="Category"
  name="categoryId"
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ]}
  placeholder="Select category"
  required
/>
```

**Props:**
- `control` - React Hook Form control object
- `name` - Field name
- `label` - Field label
- `options` - Array of `{ label: string, value: string }` objects
- `placeholder` - Placeholder text for empty selection (optional)
- `required` - Show required asterisk (optional)
- `description` - Help text (optional)

### StatusField

Pre-configured select field for status selection (approved, archived, backlog, published).

```tsx
import { StatusField } from '@/components/ui';

<StatusField
  control={form.control}
  label="Status"
  name="status"
  required
/>
```

**Props:**
- `control` - React Hook Form control object
- `name` - Field name (typically "status")
- `label` - Field label (optional, defaults to "Status")
- `required` - Show required asterisk (optional)
- `description` - Help text (optional)
- Automatically includes status options: approved, archived, backlog, published

## Usage Pattern

### Basic Form Example

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  FeaturedField,
  Form,
  StatusField,
  TextField,
  TextareaField,
  UrlField,
} from '@/components/ui';
import { createItemAction } from '@/features/items/actions';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
  mediaUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.enum(['approved', 'archived', 'backlog', 'published']),
  featured: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function ItemForm() {
  const form = useForm<FormData>({
    defaultValues: {
      featured: false,
      status: 'backlog',
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const result = await createItemAction(data);
    if (result.success) {
      // Handle success
    } else {
      // Handle errors (setServerErrors utility handles this)
    }
  });

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <TextField
        control={form.control}
        label="Title"
        name="title"
        required
      />

      <TextareaField
        control={form.control}
        label="Description"
        name="description"
      />

      <UrlField
        control={form.control}
        label="Media URL"
        name="mediaUrl"
      />

      <StatusField
        control={form.control}
        name="status"
        required
      />

      <FeaturedField control={form.control} name="featured" />

      <Button type="submit">Create Item</Button>
    </Form>
  );
}
```

## Component Architecture

All field components follow this pattern:

1. **Wrap Controller** - Use React Hook Form's `Controller` for form state
2. **Use Field Primitive** - Wrap with `Field` component for consistent styling
3. **Display Label** - Use `FieldLabel` with `FieldRequired` for required indicator
4. **Show Description** - Use `FieldDescription` for help text
5. **Render Input** - Use appropriate Base UI input component (Input, Textarea, Select, Checkbox)
6. **Display Errors** - Use `FieldError` to show validation errors

## Benefits

### Consistency
- All forms use the same components
- Consistent error display
- Consistent styling and behavior

### Simplicity
- No need to manually wrap `Controller` for each field
- Automatic error handling
- Less boilerplate code

### Type Safety
- TypeScript generics ensure type safety
- Form data types are inferred from schema
- Compile-time checks for field names

### Maintainability
- Single source of truth for field behavior
- Easy to update all forms by updating components
- Clear separation of concerns

## Custom Field Components

For domain-specific fields (e.g., `SpeakerField`, `CollectionSelectField`), create feature-specific components that follow the same pattern:

```tsx
// src/app/talks/new/_components/speaker-field.tsx
export function SpeakerField<T extends FieldValues>({
  control,
  name,
  speakers,
  ...props
}: SpeakerFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field invalid={fieldState.invalid} name={name}>
          {/* Custom implementation */}
        </Field>
      )}
    />
  );
}
```

## Migration Guide

### Before (Manual Controller)

```tsx
<Controller
  control={form.control}
  name="title"
  render={({ field, fieldState }) => (
    <Field invalid={fieldState.invalid} name="title">
      <FieldLabel htmlFor="title">Title</FieldLabel>
      <Input
        {...field}
        aria-invalid={fieldState.invalid ? 'true' : undefined}
        id="title"
      />
      <FieldError error={fieldState.error} />
    </Field>
  )}
/>
```

### After (Reusable Component)

```tsx
<TextField
  control={form.control}
  label="Title"
  name="title"
  required
/>
```

## References

- [React Hook Form - Controller](https://react-hook-form.com/docs/usecontroller)
- [Base UI Components](../architecture-component.mdc)
- [Form Data Flow](./data-flow.md)
- [Server Actions](./server-actions.md)
