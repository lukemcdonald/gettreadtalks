import { SidebarLayout } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { SidebarFiltersSkeleton } from '@/components/skeletons';
import { SpeakersListSkeleton } from '@/features/speakers/components/speakers-list-skeleton';

export default function SpeakersLoading() {
  return (
    <SidebarLayout
      content={<SpeakersListSkeleton />}
      header={
        <PageHeader
          description="Listen to faithful ambassadors of Christ and be blessed."
          size="lg"
          title="Speakers"
        />
      }
      sidebar={<SidebarFiltersSkeleton />}
      sidebarSticky
    />
  );
}
