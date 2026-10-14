import type { TopicOption } from './types';
import type { TopicId } from '@/features/topics/types';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui';

import { TopicCombobox } from './topic-combobox';

export function TopicFieldInput({
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
