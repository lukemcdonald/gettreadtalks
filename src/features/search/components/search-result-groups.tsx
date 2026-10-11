import type { SearchHit } from '@/features/search/types';

import { Link } from '@/components/ui/link';
import { groupSearchHits } from '@/features/search/utils';

function SearchHitLink({ hit }: { hit: SearchHit }) {
  return (
    <Link
      className="block rounded-md py-3 outline-none hover:underline"
      href={hit.href}
    >
      <span className="text-foreground block font-medium">{hit.title}</span>
      {!!hit.subtitle && (
        <span className="text-muted-foreground block text-sm">
          {hit.subtitle}
        </span>
      )}
    </Link>
  );
}

function SearchResultGroup({
  group,
}: {
  group: ReturnType<typeof groupSearchHits>[number];
}) {
  return (
    <section>
      <h2 className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
        {group.label}
      </h2>
      <ul className="divide-border divide-y">
        {group.hits.map((hit) => (
          <li key={hit.id}>
            <SearchHitLink hit={hit} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SearchResultGroups({ hits }: { hits: SearchHit[] }) {
  const groups = groupSearchHits(hits);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <SearchResultGroup group={group} key={group.type} />
      ))}
    </div>
  );
}
