import type { SearchPageParams } from '@/app/search/_components/search-page-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { SearchPageResults } from '@/app/search/_components/search-page-results';
import { CenteredLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/ui';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'shell';

export const metadata: Metadata = {
  description: 'Search published talks, speakers, topics, and clips.',
  title: 'Search',
};

interface SearchPageProps {
  searchParams: Promise<SearchPageParams>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <CenteredLayout
      content={
        <>
          <Suspense fallback={null}>
            <SearchInput
              label="Search"
              placeholder="Search talks, speakers, topics, and clips"
            />
          </Suspense>
          <Suspense fallback={null}>
            <SearchPageResults searchParams={searchParams} />
          </Suspense>
        </>
      }
      header={
        <PageHeader
          description="Search published talks, speakers, topics, and clips."
          size="lg"
          title="Search"
        />
      }
      maxWidth="wide"
    />
  );
}
