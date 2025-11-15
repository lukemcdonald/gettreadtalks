import { Suspense } from 'react';

import { SearchInput, SelectFilter, SortSelect } from '@/components/filters';
import { ArchiveLayout, ArchiveSidebar, SidebarContent } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllCollectionsWithStats } from '@/lib/features/collections';
import { getAllSpeakers } from '@/lib/features/speakers';
import { CollectionsList } from './_components/collections-list';

function CollectionsListSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export default async function CollectionsPage() {
  const [result, speakers] = await Promise.all([
    getAllCollectionsWithStats(),
    getAllSpeakers(),
  ]);

  // Get unique speakers who have collections
  const speakersWithCollections = Array.from(
    new Map(
      result.page
        .flatMap((item) => item.speakers)
        .map((speaker) => [speaker.slug, speaker]),
    ).values(),
  ).sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));

  const totalCollections = result.page.length;
  const totalTalks = result.page.reduce((sum, item) => sum + item.talkCount, 0);

  return (
    <ArchiveLayout
      header={
        <PageHeader
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          title="Series"
        />
      }
      sidebar={
        <ArchiveSidebar
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          meta={[
            { label: 'Series', value: totalCollections },
            { label: 'Total Talks', value: totalTalks },
          ]}
          title="Series"
        >
          <SidebarContent title="Filters">
            <div className="space-y-4">
              <SearchInput
                label="Search"
                paramName="search"
                placeholder="Search collections..."
              />
              <SelectFilter
                label="Speaker"
                options={speakersWithCollections.map((speaker) => ({
                  label: `${speaker.firstName} ${speaker.lastName}`,
                  value: speaker.slug,
                }))}
                paramName="speaker"
                placeholder="All Speakers"
              />
              <SortSelect
                label="Sort by"
                options={[
                  { label: 'Most Talks', value: 'most-talks' },
                  { label: 'Least Talks', value: 'least-talks' },
                  { label: 'Alphabetical', value: 'alphabetical' },
                ]}
              />
            </div>
          </SidebarContent>
        </ArchiveSidebar>
      }
    >
      <Suspense fallback={<CollectionsListSkeleton />}>
        <CollectionsList collections={result.page} speakers={speakersWithCollections} />
      </Suspense>
    </ArchiveLayout>
  );
}
