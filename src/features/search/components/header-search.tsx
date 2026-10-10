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
import { cn } from '@/utils';

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
  const isPending = value.trim() !== debouncedQuery;
  const status = getDropdownStatus({
    hasQuery,
    hasResults: hasSearchHits(results),
    isLoading: isLoading || isPending,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(value.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  useEffect(() => {
    if (!open || hasQuery) {
      return;
    }

    const openedAt = Date.now();

    function onPageScroll() {
      if (Date.now() - openedAt < SEARCH_DEBOUNCE_MS) {
        return;
      }

      setActiveIndex(-1);
      setOpen(false);
    }

    window.addEventListener('scroll', onPageScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onPageScroll);
    };
  }, [hasQuery, open]);

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
      <PopoverContent
        align="end"
        className="w-96 max-w-full p-0 [&_[data-slot=popover-viewport]]:p-0 [&_[data-slot=popover-viewport]]:[--viewport-inline-padding:0px]"
      >
        <form
          className={cn(
            'flex items-center gap-2 px-2 py-1.5',
            hasQuery && 'border-border/50 border-b'
          )}
          onSubmit={(event) => {
            event.preventDefault();
            goToResults();
          }}
        >
          <SearchIcon
            aria-hidden
            className="text-muted-foreground size-4 shrink-0 opacity-80"
          />
          <Input
            aria-activedescendant={
              activeHit ? `search-hit-${activeHit.id}` : undefined
            }
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-label="Search talks, speakers, topics, and clips"
            autoFocus
            className="has-focus-visible:ring-ring/24 min-w-0 flex-1 rounded-lg has-focus-visible:ring-[3px] **:data-[slot=input]:px-0"
            onChange={(event) => {
              setActiveIndex(-1);
              setValue(event.target.value);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search talks, speakers, topics, and clips"
            size="lg"
            type="search"
            unstyled
            value={value}
          />
        </form>
        {status === 'idle' ? null : (
          <div className="max-h-80 overflow-y-auto py-1">
            {status === 'loading' ? (
              <p className="text-muted-foreground px-2 py-1.5 text-sm">
                Searching...
              </p>
            ) : null}
            {status === 'empty' ? (
              <p className="text-muted-foreground px-2 py-1.5 text-sm">
                No results for &ldquo;{debouncedQuery}&rdquo;.
              </p>
            ) : null}
            {status === 'results' ? (
              <SearchResultGroups
                activeId={activeHit?.id}
                hits={hits}
                listboxId={listboxId}
                onNavigate={close}
                variant="dropdown"
              />
            ) : null}
          </div>
        )}
        {hasQuery ? (
          <div className="border-border/50 border-t">
            <Link
              className="hover:bg-accent block px-2 py-1.5 text-sm font-medium"
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
