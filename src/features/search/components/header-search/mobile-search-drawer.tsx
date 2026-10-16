'use client';

import type { SearchOverlayProps } from '@/features/search/types';

import { useRef } from 'react';

import {
  CommandPanel,
  Drawer,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from '@/components/ui';

import { SearchCommand, SearchCommandField } from './search-command';
import { SearchCommandResults } from './search-command-results';

export function MobileSearchDrawer({
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
      onOpenChange={onOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      open={open}
      position="bottom"
    >
      <DrawerPopup
        className="[--drawer-height:90dvh]"
        showBar
        variant="default"
      >
        <SearchCommand
          groups={groups}
          onInputValueChange={onValueChange}
          value={value}
        >
          <DrawerTitle className="sr-only">Search</DrawerTitle>
          <SearchCommandField isLoading={isLoading} ref={inputRef} />
          <DrawerPanel className="min-h-0 flex-1 p-0" scrollable={false}>
            <CommandPanel className="h-full min-h-0">
              <SearchCommandResults
                groups={groups}
                onSelect={onSelect}
                status={status}
              />
            </CommandPanel>
          </DrawerPanel>
        </SearchCommand>
      </DrawerPopup>
    </Drawer>
  );
}
