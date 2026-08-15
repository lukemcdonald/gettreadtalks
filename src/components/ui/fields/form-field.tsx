'use client';

import type { ReactNode } from 'react';
import type {
  Control,
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { Field, FieldDescription, FieldError } from '../primitives/field';
import { FieldLabel } from './field-label';

interface FormFieldProps<T extends FieldValues> {
  children: (
    field: ControllerRenderProps<T, FieldPath<T>>,
    fieldState: ControllerFieldState
  ) => ReactNode;
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  required?: boolean;
  rules?: ControllerProps<T, FieldPath<T>>['rules'];
}

export function FormField<T extends FieldValues>({
  children,
  control,
  description,
  label,
  name,
  required,
  rules,
}: FormFieldProps<T>) {
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
          {children(field, fieldState)}
          {!!description && <FieldDescription>{description}</FieldDescription>}
          {!!fieldState.error && (
            <FieldError match>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
      rules={rules}
    />
  );
}
