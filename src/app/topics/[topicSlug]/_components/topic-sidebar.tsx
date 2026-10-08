'use client';

import type { Topic } from '@/features/topics/types';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { SidebarContent } from '@/components/sidebar-content';
import { SearchInput } from '@/components/ui/search-input';

interface TopicSidebarProps {
  topic: Topic;
}

export function TopicSidebar({ topic }: TopicSidebarProps) {
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
          href={`/topics/${topic.slug}`}
        >
          Clear filters
        </Link>
      )}
    </SidebarContent>
  );
}
