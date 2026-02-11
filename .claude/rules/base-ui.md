# Base UI

## FieldError with React Hook Form

Always pass `match` prop to `FieldError` when using React Hook Form validation.

Without `match`, Base UI's `FieldError` only renders when native HTML5 `ValidityState` fails (e.g., empty `required` field). RHF validation errors won't show even though the red border appears via `aria-invalid`.

**`match={true}`** tells Base UI that an external library controls visibility — the component renders whenever it's mounted, so conditional rendering via `{!!fieldState.error && ...}` works as expected.

```tsx
// ✅ Correct — error message renders when fieldState.error is set
{!!fieldState.error && <FieldError match>{fieldState.error?.message}</FieldError>}

// ❌ Wrong — error message never renders (native ValidityState is valid)
{!!fieldState.error && <FieldError>{fieldState.error?.message}</FieldError>}
```

This applies to all field components: `TextField`, `PasswordField`, `TextareaField`, `SelectField`, `CheckboxField`, `UrlField`, `NumberField`.

## FieldError Outside Field.Root

`FieldError` (Base UI's `FieldPrimitive.Error`) requires a `<Field.Root>` ancestor. It calls `useFieldRootContext(false)` which throws "FieldRootContext is missing" if no context is present.

When `FieldError` must be used outside a natural `<Field.Root>` (e.g., in `FormError`), wrap it in a `<Field className="contents">`. The `contents` class removes the wrapper div from layout while still providing the React context:

```tsx
// ✅ Correct — Field provides context, contents removes it from layout
<Field className="contents" invalid>
  <FieldError match>{message}</FieldError>
</Field>

// ❌ Wrong — throws "FieldRootContext is missing"
<FieldError>{message}</FieldError>
```
