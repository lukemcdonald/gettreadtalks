'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useTransition } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TalksFiltersProps {
  isAuthenticated: boolean;
  onLoadingChange?: (loading: boolean) => void;
  speakers: Array<{ _id: Id<'speakers'>; firstName: string; lastName: string }>;
  topics: Array<{ _id: Id<'topics'>; title: string }>;
}

export function TalksFilters({
  isAuthenticated,
  onLoadingChange,
  speakers,
  topics,
}: TalksFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const featured = searchParams.get('featured') === 'true';
  const speakerId = searchParams.get('speaker') || '';
  const topicId = searchParams.get('topic') || '';
  const status = searchParams.get('status') || '';

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

  const speakerItems = [
    { label: 'All Speakers', value: '' },
    ...speakers.map((speaker) => ({
      label: `${speaker.firstName} ${speaker.lastName}`,
      value: speaker._id,
    })),
  ];

  const topicItems = [
    { label: 'All Topics', value: '' },
    ...topics.map((topic) => ({
      label: topic.title,
      value: topic._id,
    })),
  ];

  const statusItems = [
    { label: 'All Statuses', value: '' },
    { label: 'Published', value: 'published' },
    { label: 'Backlog', value: 'backlog' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-4">
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

        <div className="flex items-center gap-2">
          <Label htmlFor="speaker">Speaker:</Label>
          <Select
            defaultValue={speakerId}
            disabled={isPending}
            items={speakerItems}
            onValueChange={(value) => updateFilter('speaker', value as string)}
            value={speakerId}
          >
            <SelectTrigger className="w-48" id="speaker">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {speakerItems.map((item) => (
                <SelectItem key={item.value || 'all'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="topic">Topic:</Label>
          <Select
            defaultValue={topicId}
            disabled={isPending}
            items={topicItems}
            onValueChange={(value) => updateFilter('topic', value as string)}
            value={topicId}
          >
            <SelectTrigger className="w-48" id="topic">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {topicItems.map((item) => (
                <SelectItem key={item.value || 'all'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <Label htmlFor="status">Status:</Label>
            <Select
              defaultValue={status}
              disabled={isPending}
              items={statusItems}
              onValueChange={(value) => updateFilter('status', value as string)}
              value={status}
            >
              <SelectTrigger className="w-48" id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {statusItems.map((item) => (
                  <SelectItem key={item.value || 'all'} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>
        )}
      </div>

      {/* Fixed height loading indicator to prevent layout shift */}
      <div className="mt-2 h-5">
        {isPending && <span className="text-sm text-muted-foreground">Updating...</span>}
      </div>
    </div>
  );
}
