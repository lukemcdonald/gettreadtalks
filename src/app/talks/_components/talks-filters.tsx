'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SearchInput, SelectFilter } from '@/components/filters';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type TalksFiltersProps = {
  className?: string;
  isAuthenticated: boolean;
  onLoadingChange?: (loading: boolean) => void;
  speakers: Array<{ _id: Id<'speakers'>; firstName: string; lastName: string }>;
  topics: Array<{ _id: Id<'topics'>; title: string }>;
};

export function TalksFilters({
  className,
  isAuthenticated,
  onLoadingChange,
  speakers,
  topics,
}: TalksFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const featured = searchParams.get('featured') === 'true';

  const updateFilter = (key: string, value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === '' || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    params.delete('cursor');

    startTransition(() => {
      onLoadingChange?.(true);
      const query = params.toString();
      router.push(query ? `/talks?${query}` : '/talks');
    });
  };

  const speakerOptions = speakers.map((speaker) => ({
    label: `${speaker.firstName} ${speaker.lastName}`,
    value: speaker._id,
  }));

  const topicOptions = topics.map((topic) => ({
    label: topic.title,
    value: topic._id,
  }));

  const statusOptions = [
    { label: 'Published', value: 'published' },
    { label: 'Backlog', value: 'backlog' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <SearchInput label="Search" paramName="search" placeholder="Search talks..." />

      {speakerOptions.length > 0 && (
        <SelectFilter
          label="Speaker"
          options={speakerOptions}
          paramName="speaker"
          placeholder="All Speakers"
        />
      )}

      {topicOptions.length > 0 && (
        <SelectFilter
          label="Topic"
          options={topicOptions}
          paramName="topic"
          placeholder="All Topics"
        />
      )}

      {isAuthenticated && (
        <SelectFilter
          label="Status"
          options={statusOptions}
          paramName="status"
          placeholder="All Statuses"
        />
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          checked={featured}
          disabled={isPending}
          id="featured"
          onCheckedChange={(checked) => updateFilter('featured', checked === true)}
        />
        <Label className="cursor-pointer" htmlFor="featured">
          Featured
        </Label>
      </div>

      {/* Fixed height loading indicator to prevent layout shift */}
      <div className="h-5">
        {isPending && <span className="text-muted-foreground text-sm">Updating...</span>}
      </div>
    </div>
  );
}
