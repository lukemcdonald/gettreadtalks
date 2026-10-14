import type { TopicOption } from './types';
import type { TopicId } from '@/features/topics/types';

export function filterTopicOption(itemValue: TopicOption, query: string) {
  return itemValue.label.toLowerCase().includes(query.toLowerCase());
}

export function getSelectedTopicIds(selected: TopicOption[] | null) {
  if (!selected) {
    return [];
  }

  return selected.map((option) => option.value);
}

export function getSelectedTopicOptions(
  options: TopicOption[],
  value: TopicId[] | undefined
) {
  const selectedIds = value ?? [];

  return options.filter((option) => selectedIds.includes(option.value));
}

export function getTopicOptionLabel(itemValue: TopicOption) {
  return itemValue.label;
}
