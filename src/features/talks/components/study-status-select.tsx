'use client';

import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

const STUDY_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

export function StudyStatusSelect<T extends FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: FieldPath<T>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          items={STUDY_STATUS_OPTIONS}
          name={field.name}
          onValueChange={(nextValue) => {
            field.onChange(nextValue ?? 'draft');
          }}
          value={field.value}
        >
          <SelectTrigger
            aria-label="Status"
            className="w-auto min-w-24"
            id={field.name}
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {STUDY_STATUS_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      )}
    />
  );
}
