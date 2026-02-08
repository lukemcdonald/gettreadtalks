'use client';

import type { Topic } from '@/features/topics/types';

import { useTransition } from 'react';
import { ChevronsUpDown, SearchIcon, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Badge,
  Button,
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
  Group,
  GroupSeparator,
} from '@/components/ui';

interface InlineTopicFilterProps {
  topics: Pick<Topic, 'slug' | 'title'>[];
}

type FilterOption = Pick<Topic, 'slug' | 'title'>;

/**
 * Inline topic filter embedded in description text.
 * Compact Group-based design showing first topic + badge for remaining count.
 */
export function InlineTopicFilter({ topics }: InlineTopicFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchParamValue = searchParams.get('topics');
  const selectedSlugs = searchParamValue?.split(',').filter(Boolean) || [];

  const selectedTopics = topics.filter((t) => selectedSlugs.includes(t.slug));

  const handleChange = (newValue: FilterOption[] | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue && newValue.length > 0) {
      params.set('topics', newValue.map((opt) => opt.slug).join(','));
    } else {
      params.delete('topics');
    }

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('topics');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const renderTriggerContent = () => {
    if (selectedTopics.length === 0) return 'all topics';
    const firstTopic = selectedTopics[0];
    const remainingCount = selectedTopics.length - 1;

    return (
      <div className="flex items-center gap-2">
        <span className="truncate">{firstTopic?.title}</span>
        {remainingCount > 0 && (
          <Badge className="tabular-nums" variant="secondary">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <span className="inline-flex align-middle">
      <Group>
        <Combobox
          autoHighlight
          disabled={isPending}
          items={topics}
          multiple
          onValueChange={handleChange}
          value={selectedTopics}
        >
          <ComboboxTrigger
            render={
              <Button
                className={selectedTopics.length === 0 ? 'justify-between' : undefined}
                size="sm"
                variant="outline"
              />
            }
          >
            {renderTriggerContent()}
            {selectedTopics.length === 0 && <ChevronsUpDown className="-me-1!" />}
          </ComboboxTrigger>
          <ComboboxPopup aria-label="Select topics">
            <div className="border-b p-2">
              <ComboboxInput
                className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
                placeholder="Search topics..."
                showTrigger={false}
                startAddon={<SearchIcon />}
              />
            </div>
            <ComboboxEmpty>No topics found.</ComboboxEmpty>
            <ComboboxList>
              {(topic: FilterOption) => (
                <ComboboxItem key={topic.slug} value={topic}>
                  {topic.title}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxPopup>
        </Combobox>
        {selectedTopics.length > 0 && (
          <>
            <GroupSeparator />
            <Button
              aria-label="Clear topic filter"
              disabled={isPending}
              onClick={handleClear}
              size="icon-sm"
              variant="outline"
            >
              <X />
            </Button>
          </>
        )}
      </Group>
    </span>
  );
}
