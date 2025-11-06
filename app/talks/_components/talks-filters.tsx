'use client';

import type { Doc, Id } from '@/convex/_generated/dataModel';

import { useRouter, useSearchParams } from 'next/navigation';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TalksFiltersProps {
  isAuthenticated: boolean;
  speakers: Array<{ _id: Id<'speakers'>; firstName: string; lastName: string }>;
  topics: Array<{ _id: Id<'topics'>; name: string }>;
}

export function TalksFilters({ isAuthenticated, speakers, topics }: TalksFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

    router.push(`/talks${params.toString() ? `?${params.toString()}` : ''}`);
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
      label: topic.name,
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
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={featured}
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
          items={speakerItems}
          onValueChange={(value) => updateFilter('speaker', value as string)}
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
          items={topicItems}
          onValueChange={(value) => updateFilter('topic', value as string)}
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
            items={statusItems}
            onValueChange={(value) => updateFilter('status', value as string)}
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
  );
}
