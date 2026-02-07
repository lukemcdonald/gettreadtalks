'use client';

import type { Topic } from '@/features/topics/types';

import { ComboboxMultiFilter } from '@/components/ui/combobox-multi-filter';

interface TopicsControlsProps {
  topics: Pick<Topic, 'slug' | 'title'>[];
}

export function TopicsControls({ topics }: TopicsControlsProps) {
  return (
    <div className="w-80">
      <ComboboxMultiFilter
        name="topics"
        options={topics.map((topic) => ({
          label: topic.title,
          value: topic.slug,
        }))}
        placeholder="Filter topics"
      />
    </div>
  );
}
