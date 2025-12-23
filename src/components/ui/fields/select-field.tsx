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
  label: string;
  name: FieldPath<T>;
  onChange?: (value: string) => void;
  options: SelectOption[];
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
 *   options={[
 *     { label: 'Select an option', value: '' },
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
  label,
  name,
  onChange,
  options,
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
          {Boolean(description) && <FieldDescription>{description}</FieldDescription>}
          <Select
            items={options}
            name={field.name}
            onValueChange={(value) => {
              const normalizedValue = value ?? '';
              field.onChange(normalizedValue);
              if (onChange) {
                onChange(normalizedValue);
              }
            }}
            required={required}
            value={field.value ?? ''}
          >
            <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          {Boolean(fieldState.error) && <FieldError>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
    />
  );
}
