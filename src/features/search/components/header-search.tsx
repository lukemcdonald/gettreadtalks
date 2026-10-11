'use client';

import type { ButtonProps } from '@/components/ui';
import type { KeyboardEvent } from 'react';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';

import {
  Button,
  Input,
  Kbd,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { Link } from '@/components/ui/link';
import { SearchResultGroups } from '@/features/search/components/search-result-groups';
import { useSearchSite } from '@/features/search/hooks/use-search-site';
import {
  getNextActiveIndex,
  getSearchHotkeyLabel,
  getSearchInputAction,
  getSearchPageHref,
  hasSearchHits,
  isSearchHotkey,
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

function getClientSearchHotkeyLabel() {
  return getSearchHotkeyLabel(navigator.userAgent);
}

function getServerSearchHotkeyLabel() {
  return '⌘K';
}

function subscribeSearchHotkey() {
  return () => {};
}

function HeaderSearchTrigger({
  className,
  hotkey,
  ...delegated
}: ButtonProps & { hotkey: string }) {
  return (
    <Button
      aria-keyshortcuts="Control+K Meta+K"
      aria-label="Search"
      className={cn(
        'md:border-input md:bg-popover md:hover:bg-accent/50 md:h-9 md:w-56 md:justify-start md:px-2.5 md:shadow-xs/5',
        className
      )}
      data-testid="search-cta"
      size="icon-lg"
      variant="ghost"
      {...delegated}
    >
      <SearchIcon className="size-6 md:size-4" />
      <span className="text-muted-foreground hidden md:inline">Search…</span>
      <Kbd className="ms-auto hidden md:inline-flex">{hotkey}</Kbd>
    </Button>
  );
}

// fallow-ignore-next-line complexity
export function HeaderSearch() {
  const hotkey = useSyncExternalStore(
    subscribeSearchHotkey,
    getClientSearchHotkeyLabel,
    getServerSearchHotkeyLabel
  );
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
    function onWindowKeyDown(event: globalThis.KeyboardEvent) {
      if (!isSearchHotkey(event)) {
        return;
      }

      event.preventDefault();
      setOpen(true);
    }

    window.addEventListener('keydown', onWindowKeyDown);

    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  }, []);

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
      <PopoverTrigger render={<HeaderSearchTrigger hotkey={hotkey} />} />
      <PopoverContent
        align="end"
        className="w-96 max-w-full p-0 md:w-64 [&_[data-slot=popover-viewport]]:p-0 [&_[data-slot=popover-viewport]]:[--viewport-inline-padding:0px]"
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
            className="min-w-0 flex-1 **:data-[slot=input]:px-0"
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
