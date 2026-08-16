'use client';

import type { ComponentProps } from 'react';
import type {
  Control,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import { FormField } from './form-field';
import { PasswordInput } from './password-input';

type PasswordFieldProps<T extends FieldValues> = Omit<
  ComponentProps<typeof PasswordInput>,
  'type'
> & {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  required?: boolean;
  rules?: ControllerProps<T>['rules'];
};

export function PasswordField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  required,
  rules,
  ...delegated
}: PasswordFieldProps<T>) {
  return (
    <FormField
      control={control}
      description={description}
      label={label}
      name={name}
      required={required}
      rules={rules}
    >
      {(field, fieldState) => (
        <PasswordInput
          {...delegated}
          {...field}
          aria-invalid={fieldState.invalid}
          id={field.name}
          required={required}
        />
      )}
    </FormField>
  );
}
