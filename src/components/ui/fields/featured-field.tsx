'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { CheckboxField } from './checkbox-field';

type FeaturedFieldProps<T extends FieldValues> = {
  control: Control<T>;
  description?: string;
  label?: string;
  name: FieldPath<T>;
};

/**
 * Reusable featured field component for marking entities as featured.
 * Uses CheckboxField with a standard "Featured" label.
 *
 * @example
 * ```tsx
 * <FeaturedField
 *   control={form.control}
 *   name="featured"
 * />
 * ```
 */
export function FeaturedField<T extends FieldValues>({
  control,
  description,
  label = 'Featured',
  name,
}: FeaturedFieldProps<T>) {
  return <CheckboxField control={control} description={description} label={label} name={name} />;
}
