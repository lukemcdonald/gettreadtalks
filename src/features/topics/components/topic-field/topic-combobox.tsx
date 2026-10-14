import type { TopicOption } from './types';
import type { TopicId } from '@/features/topics/types';

import {
  Combobox,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
} from '@/components/ui';

import { TopicChips } from './topic-chips';
import {
  filterTopicOption,
  getSelectedTopicIds,
  getSelectedTopicOptions,
  getTopicOptionLabel,
} from './utils';

export function TopicCombobox({
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
