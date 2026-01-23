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

export function TopicSelector({ className, currentSlug, items, label }: TopicSelectorProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const sortedTopics = [...items].sort((a, b) => a.title.localeCompare(b.title));
  const selectItems = sortedTopics.map((topic) => ({
    label: topic.title,
    value: topic.slug,
  }));

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
      <Select defaultValue={currentSlug} items={selectItems} onValueChange={handleChange}>
        <SelectTrigger id="topic-selector">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {selectItems.map((topic) => (
            <SelectItem key={topic.value} value={topic.value}>
              {topic.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
