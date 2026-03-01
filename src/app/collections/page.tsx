import type { Metadata } from 'next';

import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollections } from '@/features/collections/queries/get-collections';

export const metadata: Metadata = {
  description:
    'Explore curated talk series — each collection covers one topic or book of the Bible.',
  title: 'Collections',
};

export interface CollectionsPageSearchParams {
  sort?: string;
  speaker?: string;
}

interface CollectionsPageProps {
  searchParams: Promise<CollectionsPageSearchParams>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const { sort, speaker: speakerSlug } = await searchParams;

  const { collections, speakers } = await getCollections({ sort, speakerSlug });

  const hasActiveFilters = !!speakerSlug;

  return (
    <SidebarLayout
      content={<CollectionsContent collections={collections} hasActiveFilters={hasActiveFilters} />}
      header={
        <PageHeader
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          size="lg"
          title="Collections"
        />
      }
      sidebar={<CollectionsSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
