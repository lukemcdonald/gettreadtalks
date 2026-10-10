'use client';

import type { KeyboardEvent } from 'react';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import { SearchResultGroups } from '@/features/search/components/search-result-groups';
import { useSearchSite } from '@/features/search/hooks/use-search-site';
import {
  getNextActiveIndex,
  getSearchInputAction,
  getSearchPageHref,
  hasSearchHits,
  SEARCH_DEBOUNCE_MS,
  SEARCH_DROPDOWN_LIMIT,
  toSearchHits,
} from '@/features/search/utils';

function getDropdownStatus({
  hasQuery,
  hasResults,
  isLoading,
}: {
  hasQuery: boolean;
  hasResults: boolean;
  isLoading: boolean;
}) {
  if (!hasQuery) {
    return 'idle';
  }

  if (isLoading) {
    return 'loading';
  }

  if (hasResults) {
    return 'results';
  }

  return 'empty';
}

// fallow-ignore-next-line complexity
export function HeaderSearch() {
  const listboxId = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const { isLoading, results } = useSearchSite(
    debouncedQuery,
    SEARCH_DROPDOWN_LIMIT
  );
  const hits = toSearchHits(results);
  const activeHit = hits[activeIndex];
  const hasQuery = value.trim().length > 0;
  const status = getDropdownStatus({
    hasQuery,
    hasResults: hasSearchHits(results),
    isLoading,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(value);
      setActiveIndex(-1);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function goToResults() {
    const query = value.trim();

    if (!query) {
      return;
    }

    router.push(getSearchPageHref(query));
    close();
  }

  // fallow-ignore-next-line complexity
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const action = getSearchInputAction(event.key, Boolean(activeHit));

    if (!action) {
      return;
    }

    event.preventDefault();

    if (action === 'next' || action === 'previous') {
      setActiveIndex((index) =>
        getNextActiveIndex(index, action === 'next' ? 1 : -1, hits.length)
      );
      return;
    }

    if (action === 'select' && activeHit) {
      router.push(activeHit.href);
      close();
      return;
    }

    if (action === 'close') {
      close();
    }
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            aria-label="Search"
            data-testid="search-cta"
            size="icon-lg"
            variant="ghost"
          >
            <SearchIcon className="size-6" />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-96 p-0">
        <form
          className="border-border border-b p-3"
          onSubmit={(event) => {
            event.preventDefault();
            goToResults();
          }}
        >
          <Input
            aria-activedescendant={
              activeHit ? `search-hit-${activeHit.id}` : undefined
            }
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-label="Search talks, speakers, topics, and clips"
            autoFocus
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search talks, speakers, topics, and clips"
            size="lg"
            type="search"
            value={value}
          />
        </form>
        <div className="max-h-80 overflow-y-auto p-3">
          {status === 'idle' ? (
            <p className="text-muted-foreground px-2 text-sm">
              Search talks, speakers, topics, and clips.
            </p>
          ) : null}
          {status === 'loading' ? (
            <p className="text-muted-foreground px-2 text-sm">Searching...</p>
          ) : null}
          {status === 'empty' ? (
            <p className="text-muted-foreground px-2 text-sm">
              No results for &ldquo;{debouncedQuery}&rdquo;.
            </p>
          ) : null}
          {status === 'results' ? (
            <SearchResultGroups
              activeId={activeHit?.id}
              hits={hits}
              listboxId={listboxId}
              variant="dropdown"
            />
          ) : null}
        </div>
        {hasQuery ? (
          <div className="border-border border-t p-3">
            <Link
              className="text-sm font-medium hover:underline"
              href={getSearchPageHref(value.trim())}
              onClick={close}
            >
              View all results
            </Link>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
