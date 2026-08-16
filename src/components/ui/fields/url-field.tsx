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

type UrlFieldProps<T extends FieldValues> = Omit<
  ComponentProps<typeof Input>,
  'type'
> & {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  required?: boolean;
  rules?: RegisterOptions<T, FieldPath<T>>;
};

export function UrlField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  required,
  rules,
  ...delegated
}: UrlFieldProps<T>) {
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
        <Input
          size="lg"
          {...delegated}
          {...field}
          aria-invalid={fieldState.invalid}
          id={field.name}
          required={required}
          type="url"
        />
      )}
    </FormField>
  );
}
