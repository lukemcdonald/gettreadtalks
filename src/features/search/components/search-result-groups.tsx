import type { SearchHit } from '@/features/search/types';

import { Link } from '@/components/ui/link';
import { groupSearchHits } from '@/features/search/utils';
import { cn } from '@/utils';

interface SearchResultGroupsProps {
  activeId?: string;
  hits: SearchHit[];
  listboxId?: string;
  variant?: 'dropdown' | 'page';
}

// fallow-ignore-next-line complexity
function SearchHitLink({
  activeId,
  hit,
  isDropdown,
}: {
  activeId?: string;
  hit: SearchHit;
  isDropdown: boolean;
}) {
  const isActive = hit.id === activeId;

  return (
    <Link
      aria-selected={isDropdown ? isActive : undefined}
      className={cn(
        'block rounded-md outline-none',
        isDropdown
          ? 'hover:bg-accent focus-visible:bg-accent px-2 py-1.5'
          : 'py-3 hover:underline',
        isDropdown && isActive && 'bg-accent'
      )}
      href={hit.href}
      id={isDropdown ? `search-hit-${hit.id}` : undefined}
      role={isDropdown ? 'option' : undefined}
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

export function SearchResultGroups({
  activeId,
  hits,
  listboxId,
  variant = 'page',
}: SearchResultGroupsProps) {
  const groups = groupSearchHits(hits);
  const isDropdown = variant === 'dropdown';

  if (groups.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(isDropdown ? 'space-y-3' : 'space-y-8')}
      id={listboxId}
      role={isDropdown ? 'listbox' : undefined}
    >
      {groups.map((group) => (
        <section key={group.type}>
          <h2
            className={cn(
              'text-muted-foreground font-medium tracking-wide uppercase',
              isDropdown ? 'px-2 text-xs' : 'mb-3 text-sm'
            )}
          >
            {group.label}
          </h2>
          <ul className={cn(isDropdown ? 'mt-1' : 'divide-border divide-y')}>
            {group.hits.map((hit) => (
              <li key={hit.id}>
                <SearchHitLink
                  activeId={activeId}
                  hit={hit}
                  isDropdown={isDropdown}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
