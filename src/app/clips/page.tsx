import { Suspense } from 'react';

import { ArchiveLayout } from '@/components/layouts/archive-layout';
import { ArchiveSidebar } from '@/components/layouts/archive-sidebar';
import { SidebarContent } from '@/components/layouts/sidebar-content';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { SelectFilter } from '@/components/select-filter';
import { SortSelect } from '@/components/sort-select';
import { getAllClips } from '@/lib/features/clips';
import { getAllSpeakers, sortSpeakersByName } from '@/lib/features/speakers';
import { getTopicsWithCounts } from '@/lib/features/topics';
import { ClipsList } from './_components/clips-list';

function ClipsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader items are static and never reordered
        <div className="h-48 animate-pulse rounded-lg bg-muted" key={i} />
      ))}
    </div>
  );
}

export default async function ClipsPage() {
  const [clips, _speakers, topics] = await Promise.all([
    getAllClips(),
    getAllSpeakers(),
    getTopicsWithCounts(),
  ]);

  // Get unique speakers who have clips
  const allSpeakers = clips.map((clip) => clip.speaker).filter((speaker) => speaker !== null);
  const speakersWithClips = Array.from(
    new Map(allSpeakers.map((speaker) => [speaker.slug, speaker])).values(),
  );
  const sortedSpeakersWithClips = sortSpeakersByName(speakersWithClips);

  return (
    <ArchiveLayout
      header={
        <PageHeader
          description="Be encouraged by these short Christ centered clips."
          title="Clips"
        />
      }
      sidebar={
        <ArchiveSidebar
          description="Be encouraged by these short Christ centered clips."
          title="Clips"
        >
          <SidebarContent title="Filters">
            <div className="space-y-4">
              <SearchInput label="Search" paramName="search" placeholder="Search clips..." />
              <SelectFilter
                label="Speaker"
                options={sortedSpeakersWithClips.map((speaker) => ({
                  label: `${speaker.firstName} ${speaker.lastName}`,
                  value: speaker.slug,
                }))}
                paramName="speaker"
                placeholder="All Speakers"
              />
              <SelectFilter
                label="Topic"
                options={topics.map((item) => ({
                  label: item.topic.title,
                  value: item.topic.slug,
                }))}
                paramName="topic"
                placeholder="All Topics"
              />
              <SortSelect
                label="Sort by"
                options={[
                  { label: 'Recently Added', value: 'recent' },
                  { label: 'Oldest First', value: 'oldest' },
                  { label: 'Alphabetical', value: 'alphabetical' },
                ]}
              />
            </div>
          </SidebarContent>
        </ArchiveSidebar>
      }
    >
      <Suspense fallback={<ClipsListSkeleton />}>
        <ClipsList clips={clips} />
      </Suspense>
    </ArchiveLayout>
  );
}
