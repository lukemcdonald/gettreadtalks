'use client';

import { useSearchParams } from 'next/navigation';

import { SidebarContent } from '@/components/sidebar-content';
import { Link } from '@/components/ui/link';
import { SearchInput } from '@/components/ui/search-input';

interface TopicSidebarProps {
  topicSlug: string;
}

export function TopicSidebar({ topicSlug }: TopicSidebarProps) {
  const searchParams = useSearchParams();
  const hasActiveFilters = !!searchParams.get('search');

  return (
    <SidebarContent className="space-y-4">
      <SearchInput
        label="Search"
        paramName="search"
        placeholder="Search talks..."
      />
      {hasActiveFilters && (
        <Link
          className="text-primary text-sm hover:underline"
          href={`/topics/${topicSlug}`}
        >
          Clear filters
        </Link>
      )}
    </SidebarContent>
  );
}
