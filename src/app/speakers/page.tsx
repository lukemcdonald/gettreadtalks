import { Suspense } from 'react';

import { PageLayout } from '@/components/page-layout';
import { SearchInput } from '@/components/search-input';
import { SelectFilter } from '@/components/select-filter';
import { SidebarContent } from '@/components/sidebar-content';
import { SortSelect } from '@/components/sort-select';
import { getAllSpeakers } from '@/features/speakers';
import { SpeakersList } from './_components/speakers-list';

function SpeakersListSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 3 }).map((_, groupIdx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader items are static and never reordered
        <div className="space-y-4" key={groupIdx}>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* biome-ignore lint/nursery/noShadow: Different scopes, no actual shadowing */}
            {Array.from({ length: 4 }).map((_, itemIdx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader items are static and never reordered
              <div className="h-32 animate-pulse rounded-lg bg-muted" key={itemIdx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function SpeakersPage() {
  const speakers = await getAllSpeakers();

  // Get unique roles for filter: (r): r is string => !!r)
  const roles = Array.from(
    new Set(speakers.map((s) => s.role).filter((r): r is string => !!r)),
  ).sort();

  return (
    <PageLayout>
      <PageLayout.Sidebar sticky>
        <header className="space-y-2">
          <h2 className="font-semibold text-2xl">All Speakers</h2>
          <p className="text-muted-foreground text-sm">
            Listen to faithful ambassadors of Christ and be blessed.
          </p>
        </header>
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
      </PageLayout.Sidebar>
      <PageLayout.Content>
        <Suspense fallback={<SpeakersListSkeleton />}>
          <SpeakersList speakers={speakers} />
        </Suspense>
      </PageLayout.Content>
    </PageLayout>
  );
}
