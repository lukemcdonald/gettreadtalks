'use client';

import type { ComponentProps } from 'react';
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

import { Textarea } from '../primitives/textarea';
import { FormField } from './form-field';

type TextareaFieldProps<T extends FieldValues> = ComponentProps<
  typeof Textarea
> & {
  control: Control<T>;
  description?: string;
  label: string;
  name: FieldPath<T>;
  required?: boolean;
  rules?: RegisterOptions<T, FieldPath<T>>;
};

export function TextareaField<T extends FieldValues>({
  control,
  description,
  label,
  name,
  required,
  rules,
  ...delegated
}: TextareaFieldProps<T>) {
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
        <Textarea
          size="lg"
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
