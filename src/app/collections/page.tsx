import { Suspense } from 'react';

import { ArchiveLayout } from '@/components/layouts/archive-layout';
import { ArchiveSidebar } from '@/components/layouts/archive-sidebar';
import { SidebarContent } from '@/components/layouts/sidebar-content';
import { SearchInput } from '@/components/search-input';
import { SelectFilter } from '@/components/select-filter';
import { SortSelect } from '@/components/sort-select';
import { getAllCollectionsWithStats } from '@/features/collections';
import { getAllSpeakers, sortSpeakersByName } from '@/features/speakers';
import { CollectionsList } from './_components/collections-list';

export default async function CollectionsPage() {
  const [result, _speakers] = await Promise.all([getAllCollectionsWithStats(), getAllSpeakers()]);

  // Get unique speakers who have collections
  const allSpeakers = result.page.flatMap((item) => item.speakers);
  const speakersWithCollections = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const sortedSpeakersWithCollections = sortSpeakersByName(speakersWithCollections);

  return (
    <ArchiveLayout
      sidebar={
        <ArchiveSidebar
          description="Each series includes talks given by one or more speakers on the same topic or book of the Bible."
          title="Collections"
        >
          <SidebarContent>
            <div className="space-y-2">
              <SearchInput paramName="search" placeholder="Search collections..." />
              <SelectFilter
                options={sortedSpeakersWithCollections.map((speaker) => ({
                  label: `${speaker.firstName} ${speaker.lastName}`,
                  value: speaker.slug,
                }))}
                paramName="speaker"
                placeholder="All Speakers"
              />
              <SortSelect
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
      <Suspense>
        <CollectionsList collections={result.page} />
      </Suspense>
    </ArchiveLayout>
  );
}
