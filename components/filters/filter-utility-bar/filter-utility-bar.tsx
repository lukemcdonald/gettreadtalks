'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { LoaderCircleIcon, X as RemoveIcon } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Group, GroupItem, GroupSeparator } from '@/components/ui/group';
import { cn } from '@/lib/utils';

import { FilterSelect } from './filter-select';
import { SearchInput } from './search-input';

type FilterOption = {
  label: string;
  value: string;
};

type FilterUtilityBarProps = {
  className?: string;
  isAuthenticated: boolean;
  onLoadingChange?: (loading: boolean) => void;
  speakers: Array<{ _id: Id<'speakers'>; firstName: string; lastName: string }>;
  topics: Array<{ _id: Id<'topics'>; title: string }>;
};

export function FilterUtilityBar({
  className,
  isAuthenticated,
  onLoadingChange,
  speakers,
  topics,
}: FilterUtilityBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingFilter, setPendingFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(
    () => searchParams.get('search') ?? '',
  );
  const [optimisticSpeaker, setOptimisticSpeaker] = useState<string | null>(
    null,
  );
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
  }, [optimisticSpeaker, speakerId]);

  useEffect(() => {
    if (optimisticTopic && optimisticTopic === topicId) {
      setOptimisticTopic(null);
    }
  }, [optimisticTopic, topicId]);

  useEffect(() => {
    if (optimisticStatus && optimisticStatus === status) {
      setOptimisticStatus(null);
    }
  }, [optimisticStatus, status]);

  const updateFilter = (key: string, value: string | boolean | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === '' || value === 'all' || value === null) {
      params.delete(key);
      // Clear optimistic state when clearing filter
      if (key === 'speaker') {
        setOptimisticSpeaker(null);
      } else if (key === 'topic') {
        setOptimisticTopic(null);
      } else if (key === 'status') {
        setOptimisticStatus(null);
      }
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
  };

  const speakerOptions: FilterOption[] = [
    { label: 'All Speakers', value: 'all' },
    ...speakers.map((speaker) => ({
      label: `${speaker.firstName} ${speaker.lastName}`,
      value: speaker._id,
    })),
  ];

  const topicOptions: FilterOption[] = [
    { label: 'All Topics', value: 'all' },
    ...topics.map((topic) => ({
      label: topic.title,
      value: topic._id,
    })),
  ];

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
  const selectedTopic = displayTopicId
    ? topics.find((t) => t._id === displayTopicId)
    : null;
  const selectedStatus = statusOptions.find((s) => s.value === displayStatus);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

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

  return (
    <div className={cn('flex w-full items-center gap-0', className)}>
      <Group aria-label="Filter controls" className="w-full">
        {/* Speaker Filter */}
        {speakerOptions.length > 1 && (
          <>
            <FilterSelect
              isPending={isPending}
              onClear={() => updateFilter('speaker', null)}
              onValueChange={(value) => {
                const newValue = value === 'all' ? null : value;
                if (newValue) {
                  setOptimisticSpeaker(newValue);
                }
                updateFilter('speaker', newValue);
              }}
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
              onValueChange={(value) => {
                const newValue = value === 'all' ? null : value;
                if (newValue) {
                  setOptimisticTopic(newValue);
                }
                updateFilter('topic', newValue);
              }}
              options={topicOptions}
              pendingFilter={pendingFilter === 'topic' ? 'topic' : null}
              selectedLabel={selectedTopic ? selectedTopic.title : 'All Topics'}
              value={displayTopicId}
            />
            <GroupSeparator />
          </>
        )}

        {/* Status Filter (only if authenticated) */}
        {isAuthenticated && (
          <>
            <FilterSelect
              isPending={isPending}
              onClear={() => updateFilter('status', null)}
              onValueChange={(value) => {
                const newValue = value === 'all' ? null : value;
                if (newValue) {
                  setOptimisticStatus(newValue);
                }
                updateFilter('status', newValue);
              }}
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
              className="gap-2 min-w-0 w-fit"
              data-pressed={featured ? true : undefined}
              onClick={() => updateFilter('featured', featured ? null : true)}
              variant="outline"
            />
          }
        >
          {isPending && pendingFilter === 'featured' ? (
            <span className="flex size-6 shrink-0 items-center justify-center">
              <LoaderCircleIcon className="size-4 animate-spin" />
            </span>
          ) : featured ? (
            <button
              className="flex size-6 shrink-0 items-center justify-center rounded-md hover:bg-muted transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                updateFilter('featured', null);
              }}
              type="button"
            >
              <RemoveIcon className="size-4" />
            </button>
          ) : null}
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
