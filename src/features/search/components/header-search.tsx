'use client';

import type { ButtonProps } from '@/components/ui';
import type {
  CommandSearchGroup,
  CommandSearchItem,
  HeaderSearchStatus,
} from '@/features/search/types';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  SearchIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

import {
  Button,
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  DialogTitle,
  Kbd,
  KbdGroup,
} from '@/components/ui';
import { useSearchSite } from '@/features/search/hooks/use-search-site';
import {
  getHeaderSearchQueryAfterClose,
  getHeaderSearchStatus,
  getSearchHotkeyLabel,
  isSearchHotkey,
  OPEN_HEADER_SEARCH_EVENT,
  SEARCH_DEBOUNCE_MS,
  SEARCH_DROPDOWN_LIMIT,
  toCommandGroups,
  toSearchHits,
  VIEW_ALL_SEARCH_GROUP,
} from '@/features/search/utils';
import { cn } from '@/utils';

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
      className={cn('md:h-9 md:w-auto md:justify-start md:px-2.5', className)}
      data-testid="search-cta"
      size="icon-lg"
      variant="ghost"
      {...delegated}
    >
      <SearchIcon className="size-6 md:size-4" />
      <span className="hidden md:inline">Search</span>
      <Kbd className="ms-auto hidden md:inline-flex">{hotkey}</Kbd>
    </Button>
  );
}

function HeaderSearchItem({
  item,
  onSelect,
}: {
  item: CommandSearchItem;
  onSelect: (item: CommandSearchItem) => void;
}) {
  return (
    <CommandItem
      onClick={() => {
        onSelect(item);
      }}
      value={item.value}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span>{item.label}</span>
        {!!item.subtitle && (
          <span className="text-muted-foreground text-sm">{item.subtitle}</span>
        )}
      </span>
    </CommandItem>
  );
}

function HeaderSearchStatusMessage({ status }: { status: HeaderSearchStatus }) {
  if (status === 'loading') {
    return (
      <p className="text-muted-foreground px-2 py-6 text-center text-sm">
        Searching...
      </p>
    );
  }

  if (status === 'empty') {
    return (
      <p className="text-muted-foreground px-2 py-6 text-center text-sm">
        No results
      </p>
    );
  }

  return null;
}

function HeaderSearchGroup({
  group,
  onSelect,
}: {
  group: CommandSearchGroup;
  onSelect: (item: CommandSearchItem) => void;
}) {
  return (
    <>
      <CommandGroup items={group.items}>
        {group.value === VIEW_ALL_SEARCH_GROUP ? null : (
          <CommandGroupLabel>{group.value}</CommandGroupLabel>
        )}
        <CommandCollection>
          {(item: CommandSearchItem) => (
            <HeaderSearchItem
              item={item}
              key={item.value}
              onSelect={onSelect}
            />
          )}
        </CommandCollection>
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}

function HeaderSearchResults({
  groups,
  onSelect,
  status,
}: {
  groups: CommandSearchGroup[];
  onSelect: (item: CommandSearchItem) => void;
  status: HeaderSearchStatus;
}) {
  if (status === 'idle') {
    return null;
  }

  return (
    <CommandPanel>
      <HeaderSearchStatusMessage status={status} />
      {groups.length > 0 ? (
        <CommandList>
          {(group: CommandSearchGroup) => (
            <HeaderSearchGroup
              group={group}
              key={group.value}
              onSelect={onSelect}
            />
          )}
        </CommandList>
      ) : null}
    </CommandPanel>
  );
}

function HeaderSearchFooter() {
  return (
    <CommandFooter className="hidden md:flex">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <KbdGroup>
            <Kbd>
              <ArrowUpIcon />
            </Kbd>
            <Kbd>
              <ArrowDownIcon />
            </Kbd>
          </KbdGroup>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-2">
          <Kbd>
            <CornerDownLeftIcon />
          </Kbd>
          <span>Open</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Kbd>Esc</Kbd>
        <span>Close</span>
      </div>
    </CommandFooter>
  );
}

export function HeaderSearch() {
  const hotkey = useSyncExternalStore(
    subscribeSearchHotkey,
    getClientSearchHotkeyLabel,
    getServerSearchHotkeyLabel
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { isLoading, results } = useSearchSite(
    debouncedQuery,
    SEARCH_DROPDOWN_LIMIT
  );
  const hits = toSearchHits(results);
  const hasQuery = value.trim().length > 0;
  const isPending = value.trim() !== debouncedQuery;
  const status = getHeaderSearchStatus({
    hasQuery,
    hasResults: hits.length > 0,
    isLoading: isLoading || isPending,
  });
  const groups = toCommandGroups(
    status === 'results' ? hits : [],
    hasQuery ? value : ''
  );

  useEffect(() => {
    function onOpenHeaderSearch() {
      setOpen(true);
    }

    function onWindowKeyDown(event: globalThis.KeyboardEvent) {
      if (!isSearchHotkey(event)) {
        return;
      }

      event.preventDefault();
      setOpen((isOpen) => !isOpen);
    }

    window.addEventListener('keydown', onWindowKeyDown);
    window.addEventListener(OPEN_HEADER_SEARCH_EVENT, onOpenHeaderSearch);

    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
      window.removeEventListener(OPEN_HEADER_SEARCH_EVENT, onOpenHeaderSearch);
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

  function close(didNavigate = false) {
    setOpen(false);
    setValue((query) => getHeaderSearchQueryAfterClose(query, didNavigate));

    if (didNavigate) {
      setDebouncedQuery('');
    }
  }

  function onSelect(item: CommandSearchItem) {
    router.push(item.href);
    close(true);
  }

  return (
    <CommandDialog
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setOpen(true);
          return;
        }

        close();
      }}
      open={open}
    >
      <CommandDialogTrigger render={<HeaderSearchTrigger hotkey={hotkey} />} />
      <CommandDialogPopup>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command
          items={groups}
          mode="none"
          onValueChange={(nextValue, eventDetails) => {
            if (eventDetails.reason === 'item-press') {
              return;
            }

            setValue(nextValue);
          }}
          value={value}
        >
          <CommandInput
            aria-label="Search talks, speakers, topics, and clips"
            placeholder="Search talks, speakers, topics, and clips"
          />
          <HeaderSearchResults
            groups={groups}
            onSelect={onSelect}
            status={status}
          />
          <HeaderSearchFooter />
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
