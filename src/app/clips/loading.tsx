import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { ClipsListSkeleton } from '@/features/clips/components/clips-list-skeleton';

export default function ClipsLoading() {
  return (
    <SidebarLayout
      content={<ClipsListSkeleton />}
      header={
        <PageHeader
          description="Be encouraged by these short Christ centered clips."
          size="lg"
          title="Clips"
        />
      }
      sidebar={<SidebarFiltersSkeleton />}
      sidebarSticky
    />
  );
}
