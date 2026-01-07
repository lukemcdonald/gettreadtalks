'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Topic } from '@/features/topics/types';

import { useRouter, useSearchParams } from 'next/navigation';

import { CheckboxFilter } from '@/components/checkbox-filter';
import { SearchInput } from '@/components/search-input';
import { SelectFilter } from '@/components/select-filter';
import { SidebarContent } from '@/components/sidebar-content';
import { getSpeakerName } from '@/features/speakers';

type TopicWithCount = {
  count: number;
  topic: Topic;
};

type TalksSidebarProps = {
  speakers: Speaker[];
  topics: TopicWithCount[];
};

export function TalksSidebar({ speakers, topics }: TalksSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const featured = searchParams.get('featured') === 'true';

  const handleFeaturedChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set('featured', 'true');
    } else {
      params.delete('featured');
    }
    // Reset cursor when filter changes
    params.delete('cursor');
    router.push(`?${params.toString()}`);
  };

  return (
    <SidebarContent className="space-y-4">
      <SearchInput label="Search" paramName="search" placeholder="Search talks..." />
      <CheckboxFilter
        checked={featured}
        label="Featured Only"
        name="featured"
        onCheckedChange={handleFeaturedChange}
      />
      <SelectFilter
        label="Speaker"
        name="speaker"
        options={speakers.map((speaker) => ({
          label: getSpeakerName(speaker),
          value: speaker.slug,
        }))}
        placeholder="All Speakers"
      />
      <SelectFilter
        label="Topic"
        name="topic"
        options={topics.map(({ topic }) => ({
          label: topic.title,
          value: topic.slug,
        }))}
        placeholder="All Topics"
      />
    </SidebarContent>
  );
}
