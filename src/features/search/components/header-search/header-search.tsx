'use client';

import { Suspense } from 'react';

import { useHeaderSearch } from '@/features/search/hooks/use-header-search';
import { useIsMobile } from '@/hooks/use-media-query';

import { DesktopSearchDialog } from './desktop-search-dialog';
import {
  HeaderSearchDesktopTrigger,
  HeaderSearchMobileTrigger,
  SearchHotkeyLabel,
} from './header-search-triggers';
import { MobileSearchDrawer } from './mobile-search-drawer';

export function HeaderSearchFallback() {
  return (
    <>
      <span className="md:hidden">
        <HeaderSearchMobileTrigger
          aria-hidden
          className="pointer-events-none"
          data-testid={undefined}
          disabled
        />
      </span>
      <span className="hidden md:inline-flex">
        <HeaderSearchDesktopTrigger
          aria-hidden
          className="pointer-events-none m-1.5"
          data-testid={undefined}
          disabled
          hotkey={<span className="text-muted-foreground text-xs">⌘K</span>}
        />
      </span>
    </>
  );
}

export function HeaderSearch() {
  const isMobile = useIsMobile();
  const search = useHeaderSearch();

  function openSearch() {
    search.handleOpenChange(true);
  }

  return (
    <>
      {isMobile ? (
        <HeaderSearchMobileTrigger onClick={openSearch} />
      ) : (
        <HeaderSearchDesktopTrigger
          className="m-1.5"
          hotkey={
            <Suspense
              fallback={
                <span className="text-muted-foreground text-xs">⌘K</span>
              }
            >
              <SearchHotkeyLabel />
            </Suspense>
          }
          onClick={openSearch}
        />
      )}
      {isMobile ? (
        <MobileSearchDrawer
          groups={search.groups}
          isLoading={search.isLoading}
          onOpenChange={search.handleOpenChange}
          onSelect={search.handleSelect}
          onValueChange={search.handleValueChange}
          open={search.open}
          status={search.status}
          value={search.value}
        />
      ) : (
        <DesktopSearchDialog
          groups={search.groups}
          isLoading={search.isLoading}
          onOpenChange={search.handleOpenChange}
          onSelect={search.handleSelect}
          onValueChange={search.handleValueChange}
          open={search.open}
          status={search.status}
          value={search.value}
        />
      )}
    </>
  );
}
