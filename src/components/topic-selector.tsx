'use client';

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

type Topic = {
  _id: string;
  slug: string;
  title: string;
};

type TopicSelectorProps = {
  className?: string;
  currentSlug: string;
  label?: string;
  topics: Topic[];
};

export function TopicSelector({ className, currentSlug, label, topics }: TopicSelectorProps) {
  const router = useRouter();
  const [_isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(() => {
      router.push(`/topics/${value}`);
    });
  };

  const sortedTopics = [...topics].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor="topic-selector">{label}</Label>}
      <Select defaultValue={currentSlug} onValueChange={handleChange}>
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
