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

function filterTopicOption(itemValue: TopicOption, query: string) {
  return itemValue.label.toLowerCase().includes(query.toLowerCase());
}

function getSelectedTopicIds(selected: TopicOption[] | null) {
  if (!selected) {
    return [];
  }

  return selected.map((option) => option.value);
}

function getSelectedTopicOptions(
  options: TopicOption[],
  value: TopicId[] | undefined
) {
  const selectedIds = value ?? [];

  return options.filter((option) => selectedIds.includes(option.value));
}

function getTopicOptionLabel(itemValue: TopicOption) {
  return itemValue.label;
}

function TopicChips({
  fieldName,
  invalid,
  value,
}: {
  fieldName: string;
  invalid: boolean;
  value: TopicOption[];
}) {
  const placeholder = value.length > 0 ? undefined : 'Search topics...';

  return (
    <>
      {value.map((item) => (
        <ComboboxChip aria-label={item.label} key={item.value}>
          {item.label}
        </ComboboxChip>
      ))}
      <ComboboxChipsInput
        aria-invalid={invalid}
        id={fieldName}
        placeholder={placeholder}
        size="lg"
      />
    </>
  );
}

function TopicCombobox({
  fieldName,
  invalid,
  onTopicIdsChange,
  options,
  value,
}: {
  fieldName: string;
  invalid: boolean;
  onTopicIdsChange: (value: TopicId[]) => void;
  options: TopicOption[];
  value: TopicId[] | undefined;
}) {
  const selectedOptions = getSelectedTopicOptions(options, value);

  return (
    <Combobox
      filter={filterTopicOption}
      itemToStringLabel={getTopicOptionLabel}
      items={options}
      multiple
      onValueChange={(selected: TopicOption[] | null) => {
        onTopicIdsChange(getSelectedTopicIds(selected));
      }}
      value={selectedOptions}
    >
      <ComboboxChips>
        <ComboboxValue>
          {(selected: TopicOption[]) => (
            <TopicChips
              fieldName={fieldName}
              invalid={invalid}
              value={selected}
            />
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
  );
}

function TopicFieldInput({
  description,
  errorMessage,
  fieldName,
  invalid,
  label,
  onTopicIdsChange,
  options,
  required,
  value,
}: {
  description?: string;
  errorMessage?: string;
  fieldName: string;
  invalid: boolean;
  label: string;
  onTopicIdsChange: (value: TopicId[]) => void;
  options: TopicOption[];
  required?: boolean;
  value: TopicId[] | undefined;
}) {
  return (
    <Field invalid={invalid} name={fieldName}>
      <FieldLabel htmlFor={fieldName} required={required}>
        {label}
      </FieldLabel>
      {!!description && <FieldDescription>{description}</FieldDescription>}

      <TopicCombobox
        fieldName={fieldName}
        invalid={invalid}
        onTopicIdsChange={onTopicIdsChange}
        options={options}
        value={value}
      />

      {!!errorMessage && <FieldError match>{errorMessage}</FieldError>}
    </Field>
  );
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
