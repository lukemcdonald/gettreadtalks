'use client';

import type {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import {
  NumberFieldGroup,
  NumberFieldInput,
  NumberField as NumberFieldPrimitive,
} from '../primitives/number-field';
import { FormField } from './form-field';

interface NumberFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label: string;
  max?: number;
  min?: number;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
  step?: number;
}

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
    <FormField
      control={control}
      description={description}
      label={label}
      name={name}
      required={required}
    >
      {(field, fieldState) => (
        <NumberFieldControl
          field={field}
          invalid={fieldState.invalid}
          max={max}
          min={min}
          placeholder={placeholder}
          required={required}
          step={step}
        />
      )}
    </FormField>
  );
}

function toOptionalNumber(value: number | null) {
  if (value === null) {
    return;
  }

  return value;
}

function NumberFieldControl<T extends FieldValues>({
  field,
  invalid,
  max,
  min,
  placeholder,
  required,
  step,
}: {
  field: ControllerRenderProps<T, FieldPath<T>>;
  invalid: boolean;
  max?: number;
  min?: number;
  placeholder?: string;
  required?: boolean;
  step?: number;
}) {
  const { onChange, value, ...inputProps } = field;

  return (
    <NumberFieldPrimitive
      aria-invalid={invalid}
      id={field.name}
      max={max}
      min={min}
      onValueChange={(newValue) => {
        onChange(toOptionalNumber(newValue));
      }}
      required={required}
      size="lg"
      step={step}
      value={typeof value === 'number' ? value : null}
    >
      <NumberFieldGroup>
        <NumberFieldInput
          className="text-start"
          placeholder={placeholder}
          {...inputProps}
        />
      </NumberFieldGroup>
    </NumberFieldPrimitive>
  );
}
