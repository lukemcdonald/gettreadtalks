import { Suspense } from 'react';

import { SearchInput, SelectFilter, SortSelect } from '@/components/filters';
import { ArchiveLayout, ArchiveSidebar, SidebarContent } from '@/components/layouts';
import { PageHeader } from '@/components/page-header';
import { getAllSpeakers } from '@/lib/features/speakers';
import { SpeakersList } from './_components/speakers-list';

function SpeakersListSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function SpeakersPage() {
  const speakers = await getAllSpeakers();

  // Get unique roles for filter
  const roles = Array.from(
    new Set(speakers.map((s) => s.role).filter((r): r is string => !!r)),
  ).sort();

  const totalSpeakers = speakers.length;
  const featuredSpeakers = speakers.filter((s) => s.featured).length;

  return (
    <ArchiveLayout
      header={
        <PageHeader
          description="Listen to faithful ambassadors of Christ and be blessed."
          title="All Speakers"
        />
      }
      sidebar={
        <ArchiveSidebar
          description="Listen to faithful ambassadors of Christ and be blessed."
          meta={[
            { label: 'Speakers', value: totalSpeakers },
            { label: 'Featured', value: featuredSpeakers },
          ]}
          title="All Speakers"
        >
          <SidebarContent title="Filters">
            <div className="space-y-4">
              <SearchInput label="Search" paramName="search" placeholder="Search speakers..." />
              <SelectFilter
                label="Role"
                options={roles.map((role) => ({ label: role, value: role }))}
                paramName="role"
                placeholder="All Roles"
              />
              <SortSelect
                label="Sort by"
                options={[
                  { label: 'Alphabetical', value: 'alphabetical' },
                  { label: 'Featured First', value: 'featured' },
                ]}
              />
            </div>
          </SidebarContent>
        </ArchiveSidebar>
      }
    >
      <Suspense fallback={<SpeakersListSkeleton />}>
        <SpeakersList speakers={speakers} />
      </Suspense>
    </ArchiveLayout>
  );
}
