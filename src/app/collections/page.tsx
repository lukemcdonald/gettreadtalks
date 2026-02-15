import { CollectionsContent } from '@/app/collections/_components/collections-content';
import { CollectionsSidebar } from '@/app/collections/_components/collections-sidebar';
import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getCollections } from '@/features/collections/queries/get-collections';

export interface CollectionsPageSearchParams {
  sort?: string;
  speakerSlug?: string;
}

interface CollectionsPageProps {
  searchParams: Promise<CollectionsPageSearchParams>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const { sort, speakerSlug } = await searchParams;

  const { collections, speakers } = await getCollections({ sort, speakerSlug });

  const hasActiveFilters = Boolean(speakerSlug);

  return (
    <SidebarLayout
      content={<CollectionsContent collections={collections} hasActiveFilters={hasActiveFilters} />}
      header={
        <PageHeader
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          title="Collections"
          variant="lg"
        />
      }
      sidebar={<CollectionsSidebar speakers={speakers} />}
      sidebarSticky
    />
  );
}
