import type { TopicOption } from './types';

import { ComboboxChip, ComboboxChipsInput } from '@/components/ui';

export function TopicChips({
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
