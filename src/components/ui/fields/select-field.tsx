'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  description?: string;
  items: SelectOption[];
  label: string;
  name: FieldPath<T>;
  onChange?: (value: string) => void;
  required?: boolean;
};

/**
 * Generic reusable select field component that wraps Controller + Field + Select.
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <SelectField
 *   control={form.control}
 *   items={[
 *     { label: 'Option 1', value: 'option1' },
 *     { label: 'Option 2', value: 'option2' },
 *   ]}
 *   label="Select Option"
 *   name="option"
 *   required
 * />
 * ```
 */
export function SelectField<T extends FieldValues>({
  control,
  description,
  items,
  label,
  name,
  onChange,
  required,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          dirty={fieldState.isDirty}
          invalid={fieldState.invalid}
          name={field.name}
          touched={fieldState.isTouched}
        >
          <FieldLabel htmlFor={field.name} required={required}>
            {label}
          </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
          <Select
            items={items}
            name={field.name}
            onValueChange={(value) => {
              if (typeof value === 'string') {
                field.onChange(value);
                onChange?.(value);
              }
            }}
            required={required}
            value={typeof field.value === 'string' ? field.value : ''}
          >
            <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          {fieldState.error?.message && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}
    />
  );
}
