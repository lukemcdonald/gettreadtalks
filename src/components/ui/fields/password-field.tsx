'use client';

import type { ComponentProps } from 'react';
import type {
  Control,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

import { Input } from '../primitives/input';
import { FormField } from './form-field';

type PasswordFieldProps<T extends FieldValues> = ComponentProps<
  typeof Input
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
      {(field) => <Input type="password" {...field} {...delegated} />}
    </FormField>
  );
}
