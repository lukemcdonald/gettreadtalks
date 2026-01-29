import type { Topic } from '@/features/topics/types';

import Link from 'next/link';

import { SidebarContent } from '@/components/sidebar-content';
import { TopicSelector } from '@/features/topics/components/topic-selector';

interface TopicSidebarProps {
  currentSlug: string;
  topics: Topic[];
  totalTalks: number;
}

export function TopicSidebar({ currentSlug, topics, totalTalks }: TopicSidebarProps) {
  return (
    <>
      <SidebarContent title="Browse Topics">
        <TopicSelector
          currentSlug={currentSlug}
          items={topics.map((item) => ({
            _id: item._id,
            slug: item.slug,
            title: item.title,
          }))}
        />
        <Link className="text-primary text-sm hover:underline" href="/topics">
          View all topics →
        </Link>
      </SidebarContent>

      <SidebarContent title="About">
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Talks:</span>{' '}
            <span className="text-muted-foreground">{totalTalks}</span>
          </div>
        </div>
      </SidebarContent>
    </>
  );
}
