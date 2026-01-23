'use client';

import type { Topic } from '@/features/topics/types';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  Label,
  Select,
  SelectPopup as SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { cn } from '@/utils';

interface TopicSelectorProps {
  className?: string;
  currentSlug: string;
  label?: string;
  items: Pick<Topic, '_id' | 'slug' | 'title'>[];
}

export function TopicSelector({ className, currentSlug, label, topics }: TopicSelectorProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const sortedTopics = [...topics].sort((a, b) => a.title.localeCompare(b.title));

  const handleChange = (value: string | null) => {
    if (value) {
      startTransition(() => {
        router.push(`/topics/${value}`);
      });
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {!!label && <Label htmlFor="topic-selector">{label}</Label>}
      <Select
        defaultValue={currentSlug}
        items={sortedTopics.map((topic) => ({
          label: topic.title,
          value: topic.slug,
        }))}
        onValueChange={handleChange}
      >
        <SelectTrigger id="topic-selector">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortedTopics.map((topic) => (
            <SelectItem key={topic._id} value={topic.slug}>
              {topic.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
