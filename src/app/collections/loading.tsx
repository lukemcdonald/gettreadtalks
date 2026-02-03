import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { CollectionsListSkeleton } from '@/features/collections/components/collections-list-skeleton';

export default function CollectionsLoading() {
  return (
    <SidebarLayout
      content={<CollectionsListSkeleton />}
      header={
        <PageHeader
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          title="Collections"
          variant="lg"
        />
      }
      sidebar={<SidebarFiltersSkeleton />}
      sidebarSticky
    />
  );
}
