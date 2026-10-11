'use client';

import type { ButtonProps } from '@/components/ui';
import type { SearchOverlayProps } from '@/features/search/types';
import type { CSSProperties, ReactNode } from 'react';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  SearchIcon,
} from 'lucide-react';

import {
  Button,
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandFooter,
  CommandInput,
  CommandPanel,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerPopup,
  DrawerTitle,
  Kbd,
  KbdGroup,
} from '@/components/ui';
import { SearchCommandResults } from '@/features/search/components/search-command-results';
import { useHeaderSearch } from '@/features/search/hooks/use-header-search';
import { useVisualViewport } from '@/features/search/hooks/use-visual-viewport';
import { cn } from '@/utils';

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

function HeaderSearchFooter() {
  return (
    <CommandFooter>
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

function SearchCommand({
  children,
  groups,
  onInputValueChange,
  value,
}: {
  children: ReactNode;
  groups: SearchOverlayProps['groups'];
  onInputValueChange: (value: string) => void;
  value: string;
}) {
  return (
    <Command
      items={groups}
      mode="none"
      onValueChange={(nextValue, eventDetails) => {
        if (eventDetails.reason === 'item-press') {
          return;
        }

        onInputValueChange(nextValue);
      }}
      value={value}
    >
      {children}
    </Command>
  );
}

function SearchCommandField() {
  return (
    <CommandInput
      aria-label="Search talks, speakers, topics, and clips"
      placeholder="Search talks, speakers, topics, and clips"
    />
  );
}

function DesktopSearchDialog({
  groups,
  onOpenChange,
  onSelect,
  onValueChange,
  open,
  status,
  value,
}: SearchOverlayProps) {
  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <CommandDialogPopup>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <SearchCommand
          groups={groups}
          onInputValueChange={onValueChange}
          value={value}
        >
          <SearchCommandField />
          <CommandPanel>
            <SearchCommandResults
              groups={groups}
              onSelect={onSelect}
              status={status}
            />
          </CommandPanel>
          <HeaderSearchFooter />
        </SearchCommand>
      </CommandDialogPopup>
    </CommandDialog>
  );
}

function MobileSearchDrawer({
  groups,
  onOpenChange,
  onSelect,
  onValueChange,
  open,
  status,
  value,
}: SearchOverlayProps) {
  const viewport = useVisualViewport(open);
  const overlayStyle = {
    height: viewport.height ? `${viewport.height}px` : '100dvh',
    top: viewport.offsetTop ? `${viewport.offsetTop}px` : undefined,
  } as CSSProperties;

  return (
    <Drawer onOpenChange={onOpenChange} open={open} position="bottom">
      <DrawerPopup
        className="fixed inset-x-0 top-0 flex min-h-0 flex-col overflow-hidden overscroll-none rounded-none border-0 pb-(--safe-area-inset-bottom,0px)"
        style={overlayStyle}
        variant="straight"
      >
        <DrawerTitle className="sr-only">Search</DrawerTitle>
        <SearchCommand
          groups={groups}
          onInputValueChange={onValueChange}
          value={value}
        >
          <div className="flex items-center gap-1 pe-2 pt-(--safe-area-inset-top,0px)">
            <div className="min-w-0 flex-1">
              <SearchCommandField />
            </div>
            <DrawerClose render={<Button size="sm" variant="ghost" />}>
              Cancel
            </DrawerClose>
          </div>
          <div className="min-h-0 flex-1 touch-auto overflow-hidden">
            <SearchCommandResults
              groups={groups}
              onSelect={onSelect}
              status={status}
            />
          </div>
        </SearchCommand>
      </DrawerPopup>
    </Drawer>
  );
}

export function HeaderSearch() {
  const search = useHeaderSearch();

  return (
    <>
      <HeaderSearchTrigger
        hotkey={search.hotkey}
        onClick={search.handleOpenSearch}
      />
      {search.isMobile ? (
        <MobileSearchDrawer
          groups={search.groups}
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
