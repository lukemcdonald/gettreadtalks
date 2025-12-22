'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRequired,
} from '@/components/ui/field';
import {
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberField as NumberFieldPrimitive,
} from '@/components/ui/primitives/number-field';

type NumberFieldProps<T extends FieldValues> = {
  control: Control<T>;
  description?: string;
  label: string;
  max?: number;
  min?: number;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
  showButtons?: boolean;
  step?: number;
};

/**
 * Reusable number input field component that wraps Controller + Field + Base UI NumberField.
 * Handles validation errors automatically via React Hook Form.
 *
 * @example
 * ```tsx
 * <NumberField
 *   control={form.control}
 *   label="Collection Order"
 *   name="collectionOrder"
 *   min={0}
 *   showButtons
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
  showButtons = false,
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
            <NumberFieldPrimitive
              aria-invalid={fieldState.invalid}
              max={max}
              min={min}
              onValueChange={(newValue) => {
                onChange(newValue ?? undefined);
              }}
              required={required}
              step={step}
              value={value ?? null}
            >
              {showButtons ? (
                <NumberFieldGroup>
                  <NumberFieldDecrement />
                  <NumberFieldInput placeholder={placeholder} {...inputProps} />
                  <NumberFieldIncrement />
                </NumberFieldGroup>
              ) : (
                <NumberFieldInput placeholder={placeholder} {...inputProps} />
              )}
            </NumberFieldPrimitive>
            <FieldError error={fieldState.error} />
          </Field>
        );
      }}
    />
  );
}
