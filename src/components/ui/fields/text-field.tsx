'use client';

import type { ComponentProps } from 'react';
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

import { Input } from '../primitives/input';
import { FormField } from './form-field';

type TextFieldProps<T extends FieldValues> = ComponentProps<typeof Input> & {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  required?: boolean;
  rules?: RegisterOptions<T, FieldPath<T>>;
};

export function TextField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  required,
  rules,
  ...delegated
}: TextFieldProps<T>) {
  return (
    <FormField
      control={control}
      description={description}
      label={label}
      name={name}
      required={required}
      rules={rules}
    >
      {(field) => <Input {...field} {...delegated} />}
    </FormField>
  );
}
