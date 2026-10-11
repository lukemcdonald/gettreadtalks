import type { SearchHit } from '@/features/search/types';

import { Link } from '@/components/ui/link';
import { groupSearchHits } from '@/features/search/utils';
import { cn } from '@/utils';

interface SearchResultGroupsProps {
  activeId?: string;
  hits: SearchHit[];
  listboxId?: string;
  onNavigate?: () => void;
  variant?: 'dropdown' | 'page';
}

// fallow-ignore-next-line complexity
function SearchHitLink({
  activeId,
  hit,
  isDropdown,
  onNavigate,
}: {
  activeId?: string;
  hit: SearchHit;
  isDropdown: boolean;
  onNavigate?: () => void;
}) {
  const isActive = hit.id === activeId;

  return (
    <Link
      aria-selected={isDropdown ? isActive : undefined}
      className={cn(
        'block rounded-md outline-none',
        isDropdown
          ? 'hover:bg-accent focus-visible:bg-accent px-2 py-1'
          : 'py-3 hover:underline',
        isDropdown && isActive && 'bg-accent'
      )}
      href={hit.href}
      id={isDropdown ? `search-hit-${hit.id}` : undefined}
      onClick={onNavigate}
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

// fallow-ignore-next-line complexity
function SearchResultGroup({
  activeId,
  group,
  isDropdown,
  onNavigate,
}: {
  activeId?: string;
  group: ReturnType<typeof groupSearchHits>[number];
  isDropdown: boolean;
  onNavigate?: () => void;
}) {
  return (
    <section
      aria-label={isDropdown ? group.label : undefined}
      role={isDropdown ? 'group' : undefined}
    >
      <h2
        className={cn(
          'text-muted-foreground font-medium tracking-wide uppercase',
          isDropdown ? 'px-2 py-1 text-xs' : 'mb-3 text-sm'
        )}
      >
        {group.label}
      </h2>
      <ul className={cn(!isDropdown && 'divide-border divide-y')}>
        {group.hits.map((hit) => (
          <li key={hit.id}>
            <SearchHitLink
              activeId={activeId}
              hit={hit}
              isDropdown={isDropdown}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

// fallow-ignore-next-line complexity
export function SearchResultGroups({
  activeId,
  hits,
  listboxId,
  onNavigate,
  variant = 'page',
}: SearchResultGroupsProps) {
  const groups = groupSearchHits(hits);
  const isDropdown = variant === 'dropdown';

  if (groups.length === 0) {
    return null;
  }

  return (
    <div
      aria-label={isDropdown ? 'Search results' : undefined}
      className={cn(isDropdown ? 'space-y-1.5' : 'space-y-8')}
      id={listboxId}
      role={isDropdown ? 'listbox' : undefined}
    >
      {groups.map((group) => (
        <SearchResultGroup
          activeId={activeId}
          group={group}
          isDropdown={isDropdown}
          key={group.type}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
