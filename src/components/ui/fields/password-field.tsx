'use client';

import type { Control, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui';
import { PasswordInput } from './password-input';

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  placeholder?: string;
  required?: boolean;
  rules?: ControllerProps<T>['rules'];
}

export function PasswordField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  placeholder,
  required,
  rules,
}: PasswordFieldProps<T>) {
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
          <FieldLabel required={required}>{label}</FieldLabel>
          {!!description && <FieldDescription>{description}</FieldDescription>}
          <PasswordInput
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            required={required}
            {...field}
          />
          {!!fieldState.error && <FieldError match>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
      rules={rules}
    />
  );
}
