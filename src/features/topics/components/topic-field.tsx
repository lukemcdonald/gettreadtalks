'use client';

import type { TopicId, TopicListItem } from '@/features/topics/types';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { Controller } from 'react-hook-form';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui';

interface TopicOption {
  label: string;
  value: TopicId;
}

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
        const selectedIds = (field.value ?? []) as TopicId[];
        const selectedOptions = selectedIds
          .map((id) => options.find((option) => option.value === id))
          .filter((option): option is TopicOption => option !== undefined);

        return (
          <Field invalid={fieldState.invalid} name={field.name}>
            <FieldLabel htmlFor={field.name} required={required}>
              {label}
            </FieldLabel>
            {!!description && (
              <FieldDescription>{description}</FieldDescription>
            )}

            <Combobox
              filter={(itemValue: TopicOption, query: string) =>
                itemValue.label.toLowerCase().includes(query.toLowerCase())
              }
              itemToStringLabel={(itemValue: TopicOption) => itemValue.label}
              items={options}
              multiple
              onValueChange={(selected: TopicOption[] | null) => {
                field.onChange(selected?.map((option) => option.value) ?? []);
              }}
              value={selectedOptions}
            >
              <ComboboxChips>
                <ComboboxValue>
                  {(value: TopicOption[]) => (
                    <>
                      {value.map((item) => (
                        <ComboboxChip aria-label={item.label} key={item.value}>
                          {item.label}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        aria-invalid={fieldState.invalid}
                        id={field.name}
                        placeholder={
                          value.length > 0 ? undefined : 'Search topics...'
                        }
                        size="lg"
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>

              <ComboboxPopup>
                <ComboboxEmpty>No topics found.</ComboboxEmpty>
                <ComboboxList>
                  {(option: TopicOption) => (
                    <ComboboxItem key={option.value} value={option}>
                      {option.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxPopup>
            </Combobox>

            {!!fieldState.error?.message && (
              <FieldError match>{fieldState.error.message}</FieldError>
            )}
          </Field>
        );
      }}
    />
  );
}
