import { Suspense } from 'react';

import { SearchInput, SelectFilter, SortSelect } from '@/components/filters';
import { ArchiveLayout, ArchiveSidebar, SidebarContent } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllClips } from '@/lib/features/clips';
import { getAllSpeakers } from '@/lib/features/speakers';
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
  const speakersWithClips = Array.from(
    new Map(
      clips
        .filter((clip) => clip.speaker)
        .map((clip) => {
          const speaker = clip.speaker;
          return speaker ? [speaker.slug, speaker] : null;
        })
        .filter(
          (item): item is [string, NonNullable<(typeof clips)[0]['speaker']>] => item !== null,
        ),
    ).values(),
  ).sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));

  const totalClips = clips.length;

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
          meta={[{ label: 'Clips', value: totalClips }]}
          title="Clips"
        >
          <SidebarContent title="Filters">
            <div className="space-y-4">
              <SearchInput label="Search" paramName="search" placeholder="Search clips..." />
              <SelectFilter
                label="Speaker"
                options={speakersWithClips.map((speaker) => ({
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
