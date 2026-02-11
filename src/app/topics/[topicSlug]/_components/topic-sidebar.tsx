import type { Topic } from '@/features/topics/types';

import Link from 'next/link';

import { SidebarContent } from '@/components/sidebar-content';
import { SearchInput } from '@/components/ui/search-input';

interface TopicSidebarProps {
  hasActiveFilters: boolean;
  topic: Topic;
}

export function TopicSidebar({ hasActiveFilters, topic }: TopicSidebarProps) {
  return (
    <SidebarContent className="space-y-4">
      <SearchInput label="Search" paramName="search" placeholder="Search talks..." />
      {hasActiveFilters && (
        <Link className="text-primary text-sm hover:underline" href={`/topics/${topic.slug}`}>
          Clear filters
        </Link>
      )}
    </SidebarContent>
  );
}
