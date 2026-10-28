'use client';

import type { SearchHit } from '@/features/search/types';

import { Link } from '@/components/ui/link';
import { SearchResultItem } from '@/features/search/components/search-result-item';
import { groupSearchHits } from '@/features/search/utils';
import { track } from '@/services/analytics';

function SearchHitLink({
  hit,
  position,
  query,
}: {
  hit: SearchHit;
  position: number;
  query: string;
}) {
  return (
    <Link
      className="block rounded-md py-3 outline-none hover:underline"
      data-testid="search-result"
      href={hit.href}
      onClick={() => {
        track('search_result_selected', {
          path: '/search',
          position,
          query,
          result_type: hit.type,
          source: 'page',
        });
      }}
      prefetch="intent"
    >
      <SearchResultItem
        scripture={hit.scripture}
        subtitle={hit.subtitle}
        title={hit.title}
      />
    </Link>
  );
}

function SearchResultGroup({
  group,
  hits,
  query,
}: {
  group: ReturnType<typeof groupSearchHits>[number];
  hits: SearchHit[];
  query: string;
}) {
  return (
    <section>
      <h2 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
        {group.label}
      </h2>
      <ul className="divide-input divide-y">
        {group.hits.map((hit) => (
          <li key={hit.id}>
            <SearchHitLink
              hit={hit}
              position={
                hits.findIndex((candidate) => candidate.id === hit.id) + 1
              }
              query={query}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SearchResultGroups({
  hits,
  query,
}: {
  hits: SearchHit[];
  query: string;
}) {
  const groups = groupSearchHits(hits);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <SearchResultGroup
          group={group}
          hits={hits}
          key={group.type}
          query={query}
        />
      ))}
    </div>
  );
}
