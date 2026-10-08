import type { CollectionsSearchParams } from '@/app/collections/_components/collections-results';
import type { Metadata } from 'next';

import { Suspense } from 'react';

import { CollectionsResults } from '@/app/collections/_components/collections-results';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { CollectionsListSkeleton } from '@/features/collections/components/collections-list-skeleton';
import { getCollections } from '@/features/collections/queries/get-collections';

// fallow-ignore-next-line unused-export
export const ensureStatic = 'prefetch';

export const metadata: Metadata = {
  description:
    'Explore curated talk series — each collection covers one topic or book of the Bible.',
  title: 'Collections',
};

interface CollectionsPageProps {
  searchParams: Promise<CollectionsSearchParams>;
}

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const { speakers } = await getCollections();

  return (
    <SidebarLayout
      content={
        <Suspense fallback={<CollectionsListSkeleton />}>
          <CollectionsResults searchParams={searchParams} />
        </Suspense>
      }
      header={
        <PageHeader
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          size="lg"
          title="Collections"
        />
      }
      sidebar={
        <Suspense fallback={<SidebarFiltersSkeleton />}>
          <CollectionsSidebar speakers={speakers} />
        </Suspense>
      }
      sidebarSticky
    />
  );
}
