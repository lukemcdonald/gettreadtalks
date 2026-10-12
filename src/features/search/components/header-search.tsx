'use client';

import type { ButtonProps } from '@/components/ui';
import type { SearchOverlayProps } from '@/features/search/types';
import type { ReactNode, Ref } from 'react';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  SearchIcon,
} from 'lucide-react';
import { useRef } from 'react';

import {
  AutocompleteInput,
  Button,
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandFooter,
  CommandPanel,
  DialogTitle,
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  Kbd,
  KbdGroup,
  Spinner,
} from '@/components/ui';
import { SearchCommandResults } from '@/features/search/components/search-command-results';
import { useHeaderSearch } from '@/features/search/hooks/use-header-search';
import { cn } from '@/utils';

function HeaderSearchDesktopTrigger({
  className,
  hotkey,
  ...delegated
}: ButtonProps & { hotkey: string }) {
  return (
    <Button
      aria-keyshortcuts="Control+K Meta+K"
      aria-label="Search"
      className={className}
      data-testid="search-cta"
      size="lg"
      variant="outline"
      {...delegated}
    >
      <SearchIcon aria-hidden="true" />
      <span className="text-muted-foreground text-xs">{hotkey}</span>
    </Button>
  );
}

function HeaderSearchMobileTrigger({ className, ...delegated }: ButtonProps) {
  return (
    <Button
      aria-keyshortcuts="Control+K Meta+K"
      aria-label="Search"
      className={className}
      data-testid="search-cta"
      size="icon-lg"
      variant="ghost"
      {...delegated}
    >
      <SearchIcon className="size-6" />
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

function SearchCommandField({
  autoFocus = false,
  className,
  inputClassName,
  isLoading,
  ref,
}: {
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  isLoading: boolean;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <div className={cn('relative', className)}>
      <AutocompleteInput
        aria-label="Search talks, speakers, topics, and clips"
        autoFocus={autoFocus}
        className={cn(
          'has-focus-visible:ring-0',
          inputClassName,
          isLoading && '*:data-[slot=autocomplete-input]:pe-9'
        )}
        placeholder="Search talks, speakers, topics, and clips"
        ref={ref}
        size="lg"
        startAddon={<SearchIcon />}
      />
      {isLoading ? (
        <Spinner className="text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2" />
      ) : null}
    </div>
  );
}

function DesktopSearchDialog({
  groups,
  isLoading,
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
          <SearchCommandField
            autoFocus
            className="px-2.5 py-1.5"
            inputClassName="border-transparent! bg-transparent! shadow-none before:hidden"
            isLoading={isLoading}
          />
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
  isLoading,
  onOpenChange,
  onSelect,
  onValueChange,
  open,
  status,
  value,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpenChangeComplete(isOpen: boolean) {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <Drawer
      defaultSnapPoint={0.9}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      open={open}
      position="bottom"
      snapPoints={[0.9]}
    >
      <DrawerPopup showBar variant="default">
        <SearchCommand
          groups={groups}
          onInputValueChange={onValueChange}
          value={value}
        >
          <DrawerHeader>
            <DrawerTitle className="sr-only">Search</DrawerTitle>
            <SearchCommandField
              inputClassName="has-focus-visible:border-input"
              isLoading={isLoading}
              ref={inputRef}
            />
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col">
            <DrawerPanel>
              <SearchCommandResults
                groups={groups}
                onSelect={onSelect}
                status={status}
              />
            </DrawerPanel>
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
      {search.isMobile ? (
        <HeaderSearchMobileTrigger onClick={search.handleOpenSearch} />
      ) : (
        <HeaderSearchDesktopTrigger
          hotkey={search.hotkey}
          onClick={search.handleOpenSearch}
        />
      )}
      {search.isMobile ? (
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
