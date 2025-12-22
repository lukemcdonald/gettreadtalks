'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRequired,
  Input,
} from '@/components/ui';

type NumberFieldProps<T extends FieldValues> = {
  control: Control<T>;
  description?: string;
  label: string;
  max?: number;
  min?: number;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
  step?: number;
};

/**
 * Reusable number input field component that wraps Controller + Field + Input with type="number".
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <NumberField
 *   control={form.control}
 *   label="Collection Order"
 *   name="collectionOrder"
 *   min={0}
 * />
 * ```
 */
export function NumberField<T extends FieldValues>({
  control,
  description,
  label,
  max,
  min,
  name,
  placeholder,
  required,
  step,
}: NumberFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, value, ...inputProps } = field;
        return (
          <Field
            dirty={fieldState.isDirty}
            invalid={fieldState.invalid}
            name={field.name}
            touched={fieldState.isTouched}
          >
            <FieldLabel>
              {label}
              <FieldRequired required={required} />
            </FieldLabel>
            <FieldDescription>{description}</FieldDescription>
            <Input
              aria-invalid={fieldState.invalid}
              max={max}
              min={min}
              onChange={(e) => onChange(e.target.valueAsNumber || undefined)}
              placeholder={placeholder}
              required={required}
              step={step}
              type="number"
              value={value ?? ''}
              {...inputProps}
            />
            <FieldError error={fieldState.error} />
          </Field>
        );
      }}
    />
  );
}
