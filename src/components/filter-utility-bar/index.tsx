'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { LoaderCircleIcon, X as RemoveIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Group, GroupItem, GroupSeparator } from '@/components/ui/group';
import { cn } from '@/utils';
import { FilterSelect } from './filter-select';
import { SearchInput } from './search-input';

type FilterOption = {
  label: string;
  value: string;
};

type FilterUtilityBarProps = {
  className?: string;
  isAdmin: boolean;
  onLoadingChange?: (loading: boolean) => void;
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName'>[];
  topics: Pick<Topic, '_id' | 'title'>[];
};

function clearOptimisticState(
  key: string,
  setOptimisticSpeaker: (value: string | null) => void,
  setOptimisticTopic: (value: string | null) => void,
  setOptimisticStatus: (value: string | null) => void,
) {
  if (key === 'speaker') {
    setOptimisticSpeaker(null);
  } else if (key === 'topic') {
    setOptimisticTopic(null);
  } else if (key === 'status') {
    setOptimisticStatus(null);
  }
}

function buildFilterOptions<T>(
  items: T[],
  allLabel: string,
  getLabel: (item: T) => string,
  getValue: (item: T) => string,
): FilterOption[] {
  return [
    { label: allLabel, value: 'all' },
    ...items.map((item) => ({
      label: getLabel(item),
      value: getValue(item),
    })),
  ];
}

function renderFeaturedFilterIcon(
  isPending: boolean,
  pendingFilter: string | null,
  featured: boolean,
  onClear: () => void,
) {
  if (isPending && pendingFilter === 'featured') {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center">
        <LoaderCircleIcon className="size-4 animate-spin" />
      </span>
    );
  }

  if (featured) {
    return (
      <button
        className="flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        type="button"
      >
        <RemoveIcon className="size-4" />
      </button>
    );
  }

  return null;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Complex filter component with multiple handlers, already refactored with extracted helpers
export function FilterUtilityBar({
  className,
  isAdmin,
  onLoadingChange,
  speakers,
  topics,
}: FilterUtilityBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingFilter, setPendingFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(() => searchParams.get('search') ?? '');
  const [optimisticSpeaker, setOptimisticSpeaker] = useState<string | null>(null);
  const [optimisticTopic, setOptimisticTopic] = useState<string | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);

  const featured = searchParams.get('featured') === 'true';
  const speakerId = searchParams.get('speaker');
  const topicId = searchParams.get('topic');
  const status = searchParams.get('status');

  // Sync optimistic values with URL params
  useEffect(() => {
    if (optimisticSpeaker && optimisticSpeaker === speakerId) {
      setOptimisticSpeaker(null);
    }
    if (optimisticTopic && optimisticTopic === topicId) {
      setOptimisticTopic(null);
    }
    if (optimisticStatus && optimisticStatus === status) {
      setOptimisticStatus(null);
    }
  }, [optimisticSpeaker, speakerId, optimisticTopic, topicId, optimisticStatus, status]);

  const updateFilter = useCallback(
    (key: string, value: string | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value || value === '' || value === 'all' || value === null) {
        params.delete(key);
        clearOptimisticState(key, setOptimisticSpeaker, setOptimisticTopic, setOptimisticStatus);
      } else {
        params.set(key, String(value));
      }

      params.delete('cursor');

      setPendingFilter(key);
      startTransition(() => {
        onLoadingChange?.(true);
        const query = params.toString();
        router.push(query ? `/talks?${query}` : '/talks');
        setPendingFilter(null);
      });
    },
    [searchParams, router, onLoadingChange],
  );

  const speakerOptions = buildFilterOptions(
    speakers,
    'All Speakers',
    (s) => `${s.firstName} ${s.lastName}`,
    (s) => s._id,
  );

  const topicOptions = buildFilterOptions(
    topics,
    'All Topics',
    (t) => t.title,
    (t) => t._id,
  );

  const statusOptions: FilterOption[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Backlog', value: 'backlog' },
    { label: 'Archived', value: 'archived' },
  ];

  const displaySpeakerId = optimisticSpeaker ?? speakerId;
  const displayTopicId = optimisticTopic ?? topicId;
  const displayStatus = optimisticStatus ?? status;

  const selectedSpeaker = displaySpeakerId
    ? speakers.find((s) => s._id === displaySpeakerId)
    : null;
  const selectedTopic = displayTopicId ? topics.find((t) => t._id === displayTopicId) : null;
  const selectedStatus = statusOptions.find((s) => s.value === displayStatus);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    updateSearchFilter(value);
  };

  const updateSearchFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }

    params.delete('cursor');

    setPendingFilter('search');
    startTransition(() => {
      onLoadingChange?.(true);
      const query = params.toString();
      router.push(query ? `/talks?${query}` : '/talks');
      setPendingFilter(null);
    });
  };

  const handleSpeakerChange = (value: string) => {
    const newValue = value === 'all' ? null : value;
    if (newValue) {
      setOptimisticSpeaker(newValue);
    }
    updateFilter('speaker', newValue);
  };

  const handleTopicChange = (value: string) => {
    const newValue = value === 'all' ? null : value;
    if (newValue) {
      setOptimisticTopic(newValue);
    }
    updateFilter('topic', newValue);
  };

  const handleStatusChange = (value: string) => {
    const newValue = value === 'all' ? null : value;
    if (newValue) {
      setOptimisticStatus(newValue);
    }
    updateFilter('status', newValue);
  };

  return (
    <div className={cn('flex w-full items-center gap-0', className)}>
      <Group aria-label="Filter controls" className="w-full">
        {/* Speaker Filter */}
        {speakerOptions.length > 1 && (
          <>
            <FilterSelect
              isPending={isPending}
              onClear={() => updateFilter('speaker', null)}
              onValueChange={handleSpeakerChange}
              options={speakerOptions}
              pendingFilter={pendingFilter === 'speaker' ? 'speaker' : null}
              selectedLabel={
                selectedSpeaker
                  ? `${selectedSpeaker.firstName} ${selectedSpeaker.lastName}`
                  : 'All Speakers'
              }
              value={displaySpeakerId}
            />
            <GroupSeparator />
          </>
        )}

        {/* Topic Filter */}
        {topicOptions.length > 1 && (
          <>
            <FilterSelect
              isPending={isPending}
              onClear={() => updateFilter('topic', null)}
              onValueChange={handleTopicChange}
              options={topicOptions}
              pendingFilter={pendingFilter === 'topic' ? 'topic' : null}
              selectedLabel={selectedTopic ? selectedTopic.title : 'All Topics'}
              value={displayTopicId}
            />
            <GroupSeparator />
          </>
        )}

        {/* Status Filter (only if authenticated) */}
        {isAdmin && (
          <>
            <FilterSelect
              isPending={isPending}
              onClear={() => updateFilter('status', null)}
              onValueChange={handleStatusChange}
              options={statusOptions}
              pendingFilter={pendingFilter === 'status' ? 'status' : null}
              selectedLabel={selectedStatus ? selectedStatus.label : 'All Statuses'}
              value={displayStatus}
            />
            <GroupSeparator />
          </>
        )}

        {/* Featured Filter */}
        <GroupItem
          render={
            <Button
              className="w-fit min-w-0 gap-2"
              data-pressed={featured ? true : undefined}
              onClick={() => updateFilter('featured', featured ? null : true)}
              variant="outline"
            />
          }
        >
          {renderFeaturedFilterIcon(isPending, pendingFilter, featured, () =>
            updateFilter('featured', null),
          )}
          <span>Featured</span>
        </GroupItem>

        <GroupSeparator />

        {/* Search Input */}
        <SearchInput
          isPending={isPending}
          onValueChange={handleSearchChange}
          pendingFilter={pendingFilter === 'search' ? 'search' : null}
          value={searchValue}
        />
      </Group>
    </div>
  );
}
