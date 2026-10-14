'use client';

import type { TopicId, TopicListItem } from '@/features/topics/types';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import { TopicFieldInput } from './topic-field-input';

interface TopicFieldProps<T extends FieldValues> {
  control: Control<T>;
  description?: string;
  label?: string;
  name: FieldPath<T>;
  required?: boolean;
  topics: TopicListItem[];
}

export function TopicField<T extends FieldValues>({
  control,
  description,
  label = 'Topics',
  name,
  required,
  topics,
}: TopicFieldProps<T>) {
  const options = topics
    .map((topic) => ({
      label: topic.title,
      value: topic._id,
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleTopicIdsChange = (value: TopicId[]) => {
          field.onChange(value);
        };

        return (
          <TopicFieldInput
            description={description}
            errorMessage={fieldState.error?.message}
            fieldName={field.name}
            invalid={fieldState.invalid}
            label={label}
            onTopicIdsChange={handleTopicIdsChange}
            options={options}
            required={required}
            value={field.value}
          />
        );
      }}
    />
  );
}
