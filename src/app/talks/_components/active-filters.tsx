'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { X as RemoveIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui';

type ActiveFiltersProps = {
  speakers: Pick<Speaker, '_id' | 'firstName' | 'lastName'>[];
  topics: Pick<Topic, '_id' | 'title'>[];
};

export function ActiveFilters({ speakers, topics }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const featured = searchParams.get('featured') === 'true';
  const search = searchParams.get('search');
  const speakerId = searchParams.get('speaker');
  const topicId = searchParams.get('topic');
  const status = searchParams.get('status');

  const hasFilters = featured || search || speakerId || topicId || status;

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('cursor');

    const query = params.toString();
    router.push(query ? `/talks?${query}` : '/talks');
  };

  const clearAllFilters = () => {
    router.push('/talks');
  };

  if (!hasFilters) {
    return null;
  }

  const speaker = speakers.find((s) => s._id === speakerId);
  const topic = topics.find((t) => t._id === topicId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Active filters:</span>

      {!!search && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-sm transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('search')}
          type="button"
        >
          Search: {search}
          <RemoveIcon className="size-3" />
        </button>
      )}

      {!!featured && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-sm transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('featured')}
          type="button"
        >
          Featured
          <RemoveIcon className="size-3" />
        </button>
      )}

      {!!speaker && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-sm transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('speaker')}
          type="button"
        >
          {speaker.firstName} {speaker.lastName}
          <RemoveIcon className="size-3" />
        </button>
      )}

      {!!topic && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-sm transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('topic')}
          type="button"
        >
          {topic.title}
          <RemoveIcon className="size-3" />
        </button>
      )}

      {!!status && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-sm transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('status')}
          type="button"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
          <RemoveIcon className="size-3" />
        </button>
      )}

      <Button onClick={clearAllFilters} size="sm" variant="ghost">
        Clear all
      </Button>
    </div>
  );
}
