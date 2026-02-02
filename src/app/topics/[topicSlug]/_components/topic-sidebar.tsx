import type { Topic } from '@/features/topics/types';

import Link from 'next/link';

import { SidebarContent } from '@/components/sidebar-content';
import { SearchInput } from '@/components/ui/search-input';
import { pluralize } from '@/utils/pluralize';

interface TopicSidebarProps {
  hasActiveFilters: boolean;
  topic: Topic;
  totalTalks: number;
}

export function TopicSidebar({ hasActiveFilters, topic, totalTalks }: TopicSidebarProps) {
  return (
    <>
      <SidebarContent title="Search Talks">
        <SearchInput label="Search" paramName="search" placeholder="Search talks..." />
        {hasActiveFilters && (
          <Link className="text-primary text-sm hover:underline" href={`/topics/${topic.slug}`}>
            Clear filters
          </Link>
        )}
      </SidebarContent>

      <SidebarContent title={topic.title}>
        <p className="text-muted-foreground text-sm">
          Elevate your spiritual heartbeat with {totalTalks === 1 ? 'this' : `these ${totalTalks}`}{' '}
          Christ centered {pluralize(totalTalks, 'talk', 'talks')}.
        </p>
        <Link className="text-primary text-sm hover:underline" href="/topics">
          View all topics →
        </Link>
      </SidebarContent>
    </>
  );
}
