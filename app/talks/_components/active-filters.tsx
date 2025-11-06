'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface ActiveFiltersProps {
  speakers: Array<{ _id: Id<'speakers'>; firstName: string; lastName: string }>;
  topics: Array<{ _id: Id<'topics'>; title: string }>;
}

export function ActiveFilters({ speakers, topics }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const featured = searchParams.get('featured') === 'true';
  const speakerId = searchParams.get('speaker');
  const topicId = searchParams.get('topic');
  const status = searchParams.get('status');

  const hasFilters = featured || speakerId || topicId || status;

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('cursor'); // Reset pagination when filter changes
    router.push(`/talks${params.toString() ? `?${params.toString()}` : ''}`);
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
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {featured && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('featured')}
          type="button"
        >
          Featured
          <X className="size-3" />
        </button>
      )}

      {speaker && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('speaker')}
          type="button"
        >
          {speaker.firstName} {speaker.lastName}
          <X className="size-3" />
        </button>
      )}

      {topic && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('topic')}
          type="button"
        >
          {topic.title}
          <X className="size-3" />
        </button>
      )}

      {status && (
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          onClick={() => removeFilter('status')}
          type="button"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
          <X className="size-3" />
        </button>
      )}

      <Button onClick={clearAllFilters} size="sm" variant="ghost">
        Clear all
      </Button>
    </div>
  );
}
