'use client';

import type { Topic } from '@/features/topics/types';

import { useState } from 'react';

import { SidebarContent } from '@/components/sidebar-content';
import { MobileFilterSheet } from '@/components/ui/mobile-filter-sheet';
import { cn } from '@/utils';

interface TopicWithCount {
  talkCount: number;
  topic: Pick<Topic, 'slug' | 'title'>;
}

interface TopicsSidebarProps {
  topics: TopicWithCount[];
}

export function TopicsSidebar({ topics }: TopicsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredTopics = searchQuery
    ? topics.filter((item) => item.topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics;

  const handleTopicClick = (slug: string) => {
    setSheetOpen(false);
    // Delay scroll until sheet close animation completes
    setTimeout(() => {
      const element = document.getElementById(`topic-${slug}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const topicList = (
    <div className="space-y-1">
      <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        Topics ({filteredTopics.length})
      </div>
      <div className="max-h-[calc(100vh-300px)] space-y-0.5 overflow-y-auto">
        {filteredTopics.map((item) => (
          <button
            className={cn(
              'flex w-full items-baseline justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
            )}
            key={item.topic.slug}
            onClick={() => handleTopicClick(item.topic.slug)}
            type="button"
          >
            <span className="flex-1 truncate">{item.topic.title}</span>
            <span className="shrink-0 text-muted-foreground text-xs">{item.talkCount}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <SidebarContent className="space-y-4">
      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor="topic-search">
          Search Topics
        </label>
        <input
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          id="topic-search"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter topics..."
          type="text"
          value={searchQuery}
        />
      </div>

      {/* Mobile: sheet with topic list */}
      <div className="md:hidden">
        <MobileFilterSheet
          label="Browse Topics"
          onOpenChange={setSheetOpen}
          open={sheetOpen}
          showCount={false}
          title="Topics"
        >
          {topicList}
        </MobileFilterSheet>
      </div>

      {/* Desktop: inline topic list */}
      <div className="hidden md:block">{topicList}</div>
    </SidebarContent>
  );
}
