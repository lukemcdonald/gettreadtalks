import { Suspense } from 'react';

import { FilterBar, SearchInput, SelectFilter, SortSelect } from '@/components/filters';
import { ListPageLayout, SectionContainer } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllClips } from '@/lib/features/clips';
import { getAllSpeakers } from '@/lib/features/speakers';
import { getTopicsWithCounts } from '@/lib/features/topics';
import { ClipsList } from './_components/clips-list';

function ClipsListSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export default async function ClipsPage() {
  const [clips, speakers, topics] = await Promise.all([
    getAllClips(),
    getAllSpeakers(),
    getTopicsWithCounts(),
  ]);

  // Get unique speakers who have clips
  const speakersWithClips = Array.from(
    new Map(
      clips
        .filter((clip) => clip.speaker)
        .map((clip) => [clip.speaker!.slug, clip.speaker!]),
    ).values(),
  ).sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));

  return (
    <ListPageLayout>
      <SectionContainer>
        <PageHeader
          description="Be encouraged by these short Christ centered clips."
          title="Clips"
        />

        <div className="space-y-6">
          <FilterBar>
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
          </FilterBar>

          <Suspense fallback={<ClipsListSkeleton />}>
            <ClipsList clips={clips} />
          </Suspense>
        </div>
      </SectionContainer>
    </ListPageLayout>
  );
}
