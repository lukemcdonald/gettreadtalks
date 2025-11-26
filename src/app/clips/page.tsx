import { Suspense } from 'react';

import { Container } from '@/components/container';
import { Layout } from '@/components/layout';
import { SearchInput } from '@/components/search-input';
import { Section } from '@/components/section';
import { SelectFilter } from '@/components/select-filter';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';
import { getAllClips } from '@/features/clips';
import { getAllSpeakers, sortSpeakersByName } from '@/features/speakers';
import { getTopicsWithCounts } from '@/features/topics';
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
    <Section py="xl">
      <Container>
        <Layout>
          <Layout.Sidebar>
            <header className="space-y-2">
              <h2 className="font-semibold text-2xl">Clips</h2>
              <p className="text-muted-foreground text-sm">
                Be encouraged by these short Christ centered clips.
              </p>
            </header>
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
          </Layout.Sidebar>
          <Layout.Content>
            <Suspense fallback={<ClipsListSkeleton />}>
              <ClipsList clips={clips} />
            </Suspense>
          </Layout.Content>
        </Layout>
      </Container>
    </Section>
  );
}
