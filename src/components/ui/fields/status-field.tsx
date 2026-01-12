'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { StatusType } from '@/lib/types';

import { SelectField } from './select-field';

type StatusFieldProps<T extends FieldValues> = {
  control: Control<T>;
  description?: string;
  label?: string;
  name: FieldPath<T>;
  onChange?: (value: StatusType) => void;
  required?: boolean;
};

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Approved', value: 'approved' },
  { label: 'Archived', value: 'archived' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Published', value: 'published' },
];

/**
 * Reusable status field component for selecting entity status.
 * Uses SelectField with predefined status options.
 *
 * @example
 * ```tsx
 * <StatusField
 *   control={form.control}
 *   label="Status"
 *   name="status"
 *   defaultValue="backlog"
 * />
 * ```
 */
export function StatusField<T extends FieldValues>({
  control,
  description,
  label = 'Status',
  name,
  onChange,
  required,
}: StatusFieldProps<T>) {
  return (
    <SelectField
      control={control}
      description={description}
      label={label}
      name={name}
      onChange={(value) => {
        onChange?.(value as StatusType);
      }}
      options={STATUS_OPTIONS}
      required={required}
    />
  );
}
